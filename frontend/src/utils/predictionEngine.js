function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const PREDICTION_RULES = {
  water_leak: {
    threshold: 3,
    title: 'Underground Pipeline Failure Likely',
    description: 'Multiple water leakage complaints detected in close proximity. This pattern suggests an aging or damaged underground pipeline that may burst soon.',
    action: 'Recommend preventive pipeline inspection before a major burst occurs.',
  },
  pothole: {
    threshold: 3,
    title: 'Road Surface Degradation Detected',
    description: 'Multiple pothole reports in a concentrated area suggest the road base is failing. Further deterioration is expected, especially after rainfall.',
    action: 'Recommend full road resurfacing rather than individual pothole repairs.',
  },
  sewage: {
    threshold: 2,
    title: 'Sewer System Overload Risk',
    description: 'Multiple sewage overflow reports suggest the drainage system is nearing capacity. Risk of major overflow increases during monsoon season.',
    action: 'Recommend drain capacity audit and preemptive cleaning.',
  },
  street_light: {
    threshold: 3,
    title: 'Electrical Infrastructure Deterioration',
    description: 'Multiple street light failures in the area suggest aging electrical infrastructure or cable damage.',
    action: 'Recommend full electrical line inspection in the affected zone.',
  },
}

export function detectPatterns(reports) {
  const predictions = []
  const thirtyDaysAgo = Date.now() - 30 * 86400000

  const recent = reports.filter(r => new Date(r.createdAt).getTime() > thirtyDaysAgo)

  for (const [type, rule] of Object.entries(PREDICTION_RULES)) {
    const typeReports = recent.filter(r => r.issueType === type)

    const clusters = []
    const visited = new Set()

    for (let i = 0; i < typeReports.length; i++) {
      if (visited.has(i)) continue
      const cluster = [typeReports[i]]
      visited.add(i)

      for (let j = i + 1; j < typeReports.length; j++) {
        if (visited.has(j)) continue
        const dist = haversineDistance(
          typeReports[i].latitude, typeReports[i].longitude,
          typeReports[j].latitude, typeReports[j].longitude
        )
        if (dist < 500) {
          cluster.push(typeReports[j])
          visited.add(j)
        }
      }

      if (cluster.length >= rule.threshold) {
        clusters.push(cluster)
      }
    }

    for (const cluster of clusters) {
      const avgLat = cluster.reduce((s, r) => s + r.latitude, 0) / cluster.length
      const avgLng = cluster.reduce((s, r) => s + r.longitude, 0) / cluster.length
      const confidence = Math.min(95, 50 + cluster.length * 10)

      predictions.push({
        type: 'prediction',
        issueType: type,
        title: rule.title,
        description: `${rule.description}\n\n${cluster.length} related reports found within 500m radius in the last 30 days.`,
        action: rule.action,
        affectedArea: { latitude: avgLat, longitude: avgLng },
        confidence,
        relatedReportIds: cluster.map(r => r.id),
        reportCount: cluster.length,
      })
    }
  }

  return predictions.sort((a, b) => b.confidence - a.confidence)
}
