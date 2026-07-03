import { ISSUE_TYPES, getSeverityLevel } from './constants'

const KEYWORDS = {
  pothole: ['pothole', 'pit', 'hole in road', 'road hole', 'crater', 'sinkhole', 'road sinking'],
  garbage_dump: ['garbage', 'trash', 'waste', 'dump', 'rubbish', 'litter', 'bin overflow', 'not collected'],
  water_leak: ['water leak', 'pipe burst', 'water pipe', 'flooding', 'water seepage', 'leaking', 'pipeline', 'water wasting'],
  broken_signal: ['signal', 'traffic light', 'traffic signal', 'blinking', 'not working signal', 'crossing'],
  street_light: ['street light', 'lamp', 'light not working', 'dark area', 'light broken', 'no light'],
  sewage: ['sewage', 'sewer', 'drain', 'gutter', 'foul smell', 'sewage overflow', 'drainage'],
  road_damage: ['road damage', 'crack', 'broken road', 'road surface', 'construction damage', 'flooded road'],
  illegal_parking: ['parking', 'parked', 'blocking', 'double park', 'no parking zone'],
  fallen_tree: ['tree', 'fallen tree', 'branch', 'uprooted', 'storm damage tree'],
  encroachment: ['encroachment', 'illegal construction', 'footpath blocked', 'vendor', 'stray dog', 'stray'],
  open_manhole: ['manhole', 'open manhole', 'cover missing', 'manhole cover', 'manholes'],
  noise: ['noise', 'loud', 'construction noise', 'honking', 'loudspeaker', 'night noise'],
}

const SEVERITY_BOOSTERS = [
  { words: ['dangerous', 'emergency', 'urgent', 'life threatening', 'death', 'accident', 'collapse', 'child', 'children', 'school'], boost: 25 },
  { words: ['major', 'large', 'flood', 'overflow', 'block', 'hospital', 'elderly', 'unsafe'], boost: 15 },
  { words: ['growing', 'worse', 'increasing', 'multiple', 'several', 'week', 'weeks', 'days'], boost: 10 },
  { words: ['small', 'minor', 'little', 'slight'], boost: -10 },
]

export function analyzeIssue(text) {
  if (!text || text.trim().length === 0) return null

  const lower = text.toLowerCase()

  let bestType = null
  let bestScore = 0
  for (const [type, words] of Object.entries(KEYWORDS)) {
    let matchCount = 0
    for (const word of words) {
      if (lower.includes(word)) matchCount++
    }
    if (matchCount > bestScore) {
      bestScore = matchCount
      bestType = type
    }
  }

  if (!bestType) bestType = 'road_damage'

  let severity = ISSUE_TYPES[bestType].baseSeverity
  const reasons = []

  for (const { words, boost } of SEVERITY_BOOSTERS) {
    for (const word of words) {
      if (lower.includes(word)) {
        severity += boost
        if (boost > 0) reasons.push(word)
        break
      }
    }
  }

  severity = Math.max(5, Math.min(100, severity))
  const level = getSeverityLevel(severity)

  const reasoning = buildReasoning(bestType, severity, reasons, text)

  return {
    issueType: bestType,
    severity: { score: severity, level, reasons },
    reasoning,
    suggestedTitle: `${ISSUE_TYPES[bestType].label} reported`,
  }
}

function buildReasoning(type, score, reasons, text) {
  const typeLabel = ISSUE_TYPES[type].label
  let reasoning = `**Issue Classification:** ${typeLabel}\n\n`
  reasoning += `The report has been classified as "${typeLabel}" based on keyword analysis of the description. `

  if (score >= 76) {
    reasoning += `\n\n**Severity: Critical (${score}/100)**\nThis issue requires immediate attention. `
  } else if (score >= 51) {
    reasoning += `\n\n**Severity: High (${score}/100)**\nThis is a significant issue that should be addressed promptly. `
  } else if (score >= 26) {
    reasoning += `\n\n**Severity: Medium (${score}/100)**\nThis issue has moderate impact on daily life. `
  } else {
    reasoning += `\n\n**Severity: Low (${score}/100)**\nThis is a low-priority issue but still needs attention. `
  }

  if (reasons.length > 0) {
    reasoning += `Contributing factors: ${reasons.join(', ')}. `
  }

  reasoning += `\n\n**Recommendation:** ${score >= 70 ? 'Immediate action recommended.' : score >= 40 ? 'Schedule repair within the week.' : 'Add to routine maintenance queue.'}`

  return reasoning
}
