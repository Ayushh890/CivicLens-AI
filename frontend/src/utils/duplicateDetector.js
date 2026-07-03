function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function findDuplicates(newReport, existingReports, maxDistance = 200) {
  if (!newReport.latitude || !newReport.longitude) return []

  return existingReports
    .filter(r => r.id !== newReport.id && r.status !== 'resolved')
    .map(r => {
      const distance = haversineDistance(newReport.latitude, newReport.longitude, r.latitude, r.longitude)
      const typeMatch = r.issueType === newReport.issueType ? 40 : 0
      const proximityScore = distance < maxDistance ? Math.round((1 - distance / maxDistance) * 60) : 0
      const similarity = typeMatch + proximityScore
      return { ...r, distance: Math.round(distance), similarity }
    })
    .filter(r => r.similarity > 30)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
}
