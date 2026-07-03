export const ISSUE_TYPES = {
  pothole: { label: 'Pothole', icon: '🕳️', baseSeverity: 40 },
  garbage_dump: { label: 'Garbage Dump', icon: '🗑️', baseSeverity: 30 },
  water_leak: { label: 'Water Leakage', icon: '💧', baseSeverity: 55 },
  broken_signal: { label: 'Broken Signal', icon: '🚦', baseSeverity: 60 },
  street_light: { label: 'Street Light', icon: '💡', baseSeverity: 35 },
  sewage: { label: 'Sewer Overflow', icon: '🚰', baseSeverity: 65 },
  road_damage: { label: 'Road Damage', icon: '🛣️', baseSeverity: 50 },
  illegal_parking: { label: 'Illegal Parking', icon: '🚗', baseSeverity: 20 },
  fallen_tree: { label: 'Fallen Tree', icon: '🌳', baseSeverity: 45 },
  encroachment: { label: 'Encroachment', icon: '🏗️', baseSeverity: 25 },
  open_manhole: { label: 'Open Manhole', icon: '⚠️', baseSeverity: 75 },
  noise: { label: 'Noise Pollution', icon: '🔊', baseSeverity: 15 },
}

export const DEPARTMENTS = {
  water: { name: 'Water Supply Department', contact: '1916', responseTime: '24-48 hours' },
  public_works: { name: 'Public Works Department', contact: '1800-111-555', responseTime: '3-5 days' },
  sanitation: { name: 'Sanitation Department', contact: '1800-111-400', responseTime: '24 hours' },
  electricity: { name: 'Electricity Board', contact: '1912', responseTime: '12-24 hours' },
  traffic: { name: 'Traffic Police', contact: '103', responseTime: '2-6 hours' },
  municipal: { name: 'Municipal Corporation', contact: '155304', responseTime: '3-7 days' },
  environment: { name: 'Environment Department', contact: '1800-111-600', responseTime: '5-7 days' },
}

export const ISSUE_TO_DEPARTMENT = {
  pothole: 'public_works',
  garbage_dump: 'sanitation',
  water_leak: 'water',
  broken_signal: 'traffic',
  street_light: 'electricity',
  sewage: 'water',
  road_damage: 'public_works',
  illegal_parking: 'traffic',
  fallen_tree: 'municipal',
  encroachment: 'municipal',
  open_manhole: 'public_works',
  noise: 'environment',
}

export const STATUSES = {
  submitted: { label: 'Submitted', color: 'blue' },
  verified: { label: 'Verified', color: 'cyan' },
  assigned: { label: 'Assigned', color: 'yellow' },
  in_progress: { label: 'In Progress', color: 'orange' },
  resolved: { label: 'Resolved', color: 'green' },
}

export const SEVERITY_LEVELS = {
  low: { range: [0, 25], color: '#4ade80', bg: 'bg-green-500', label: 'Low' },
  medium: { range: [26, 50], color: '#facc15', bg: 'bg-yellow-500', label: 'Medium' },
  high: { range: [51, 75], color: '#fb923c', bg: 'bg-orange-500', label: 'High' },
  critical: { range: [76, 100], color: '#ef4444', bg: 'bg-red-500', label: 'Critical' },
}

export const WARDS = [
  'Ward 1 - Connaught Place', 'Ward 2 - Karol Bagh', 'Ward 3 - Chandni Chowk',
  'Ward 4 - Sarojini Nagar', 'Ward 5 - Dwarka', 'Ward 6 - Rohini',
  'Ward 7 - Lajpat Nagar', 'Ward 8 - Janakpuri', 'Ward 9 - Vasant Kunj',
  'Ward 10 - Mayur Vihar',
]

export function getSeverityLevel(score) {
  if (score <= 25) return 'low'
  if (score <= 50) return 'medium'
  if (score <= 75) return 'high'
  return 'critical'
}

export function getSeverityColor(score) {
  return SEVERITY_LEVELS[getSeverityLevel(score)].color
}
