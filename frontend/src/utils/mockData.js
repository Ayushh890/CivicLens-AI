import { ISSUE_TYPES, ISSUE_TO_DEPARTMENT, DEPARTMENTS, WARDS, getSeverityLevel } from './constants'

let idCounter = 1
function uid() { return `RPT-${String(idCounter++).padStart(4, '0')}` }

const now = Date.now()
const hour = 3600000
const day = 86400000

const SEED = [
  { title: 'Large pothole on Ring Road', desc: 'A large pothole approximately 1.2 meters wide near the intersection. Heavy traffic area, very dangerous for two-wheelers.', type: 'pothole', lat: 28.6280, lng: 77.2190, ward: 0, severity: 68, status: 'in_progress', ago: 5 * day },
  { title: 'Garbage pile near market', desc: 'Garbage has been piling up for 3 days near the vegetable market. Strong smell, attracting stray animals.', type: 'garbage_dump', lat: 28.6510, lng: 77.2310, ward: 2, severity: 42, status: 'assigned', ago: 3 * day },
  { title: 'Water pipe burst on MG Road', desc: 'Major water pipe burst causing flooding on the road. Water wasting for hours. Urgent repair needed.', type: 'water_leak', lat: 28.6320, lng: 77.2185, ward: 0, severity: 82, status: 'submitted', ago: 6 * hour },
  { title: 'Traffic signal not working', desc: 'Traffic signal at the main crossing has been blinking yellow for 2 days. Causing traffic jams during peak hours.', type: 'broken_signal', lat: 28.6350, lng: 77.2250, ward: 0, severity: 71, status: 'verified', ago: 2 * day },
  { title: 'Street light broken', desc: 'Street light near the park entrance has been off for a week. Area becomes very dark at night, safety concern.', type: 'street_light', lat: 28.5950, lng: 77.2100, ward: 3, severity: 38, status: 'resolved', ago: 10 * day },
  { title: 'Sewer overflowing', desc: 'Sewage water overflowing onto the main road. Extremely unhygienic, children walk through this to reach school.', type: 'sewage', lat: 28.6330, lng: 77.2195, ward: 0, severity: 88, status: 'submitted', ago: 4 * hour },
  { title: 'Road surface cracked', desc: 'Multiple cracks on the road surface after recent construction work. Getting worse with each rainfall.', type: 'road_damage', lat: 28.6290, lng: 77.2200, ward: 0, severity: 45, status: 'assigned', ago: 7 * day },
  { title: 'Illegal parking blocking lane', desc: 'Cars parked illegally on both sides of the street, blocking emergency vehicle access.', type: 'illegal_parking', lat: 28.6460, lng: 77.2080, ward: 1, severity: 33, status: 'submitted', ago: 1 * day },
  { title: 'Fallen tree after storm', desc: 'Large tree fell during last night storm, blocking half the road. Branches tangled with power lines.', type: 'fallen_tree', lat: 28.5800, lng: 77.1950, ward: 4, severity: 72, status: 'in_progress', ago: 12 * hour },
  { title: 'Open manhole on footpath', desc: 'Manhole cover missing on the main footpath. Extremely dangerous, especially at night. A child almost fell in yesterday.', type: 'open_manhole', lat: 28.6100, lng: 77.2300, ward: 6, severity: 92, status: 'verified', ago: 8 * hour },
  // Water leak cluster (for prediction engine)
  { title: 'Water leaking from underground pipe', desc: 'Continuous water seepage on the road. Small puddle forming, getting bigger every day.', type: 'water_leak', lat: 28.6325, lng: 77.2180, ward: 0, severity: 58, status: 'submitted', ago: 15 * day },
  { title: 'Water leak near metro station', desc: 'Water leaking from underground near the metro station entrance. Wet and slippery pavement.', type: 'water_leak', lat: 28.6335, lng: 77.2175, ward: 0, severity: 62, status: 'assigned', ago: 12 * day },
  { title: 'Another pipe leak spotted', desc: 'Third water leak on this street this month. Clearly a pipeline issue. Water bill impact on residents.', type: 'water_leak', lat: 28.6315, lng: 77.2192, ward: 0, severity: 65, status: 'submitted', ago: 8 * day },
  // Pothole cluster
  { title: 'New pothole forming', desc: 'Road is sinking at this spot. Small pothole now but growing rapidly after each rain.', type: 'pothole', lat: 28.6460, lng: 77.2090, ward: 1, severity: 35, status: 'submitted', ago: 4 * day },
  { title: 'Deep pothole near school', desc: 'Very deep pothole right outside the school gate. Children at risk. Needs immediate attention.', type: 'pothole', lat: 28.6470, lng: 77.2085, ward: 1, severity: 78, status: 'verified', ago: 6 * day },
  { title: 'Multiple potholes on main road', desc: 'At least 5 potholes within 200 meters stretch. Road recently repaired but patches already breaking.', type: 'pothole', lat: 28.6455, lng: 77.2095, ward: 1, severity: 55, status: 'assigned', ago: 9 * day },
  // More varied reports
  { title: 'Garbage not collected', desc: 'Municipal garbage truck has not come for 4 days. Bins overflowing on the entire street.', type: 'garbage_dump', lat: 28.5850, lng: 77.2350, ward: 8, severity: 48, status: 'in_progress', ago: 2 * day },
  { title: 'Broken street light cluster', desc: 'Three consecutive street lights not working. Entire stretch is dark, unsafe for pedestrians.', type: 'street_light', lat: 28.7010, lng: 77.1020, ward: 5, severity: 52, status: 'submitted', ago: 3 * day },
  { title: 'Encroachment on public footpath', desc: 'Vendors have permanently occupied the footpath. Pedestrians forced to walk on the road.', type: 'encroachment', lat: 28.6520, lng: 77.2330, ward: 2, severity: 28, status: 'submitted', ago: 14 * day },
  { title: 'Noise from construction at night', desc: 'Construction site operating heavy machinery after 10 PM. Violating noise regulations. Affecting sleep of nearby residents.', type: 'noise', lat: 28.5690, lng: 77.2110, ward: 8, severity: 22, status: 'submitted', ago: 1 * day },
  { title: 'Sewage leak in residential area', desc: 'Sewage pipe cracked, foul-smelling water on the street. Health hazard for residents, especially children and elderly.', type: 'sewage', lat: 28.6340, lng: 77.2190, ward: 0, severity: 78, status: 'verified', ago: 2 * day },
  { title: 'Signal timing too short', desc: 'Green signal for pedestrians lasts only 8 seconds. Elderly people cannot cross in time. Near hospital.', type: 'broken_signal', lat: 28.6150, lng: 77.2250, ward: 6, severity: 55, status: 'submitted', ago: 5 * day },
  { title: 'Road flooded after rain', desc: 'Poor drainage causing knee-deep water on road after every rain. Vehicles stalling, accidents happening.', type: 'road_damage', lat: 28.5900, lng: 77.0500, ward: 4, severity: 63, status: 'assigned', ago: 1 * day },
  { title: 'Stray dogs menace near park', desc: 'Pack of aggressive stray dogs near the community park. Children scared to play. Two bite incidents this week.', type: 'encroachment', lat: 28.6200, lng: 77.2150, ward: 3, severity: 58, status: 'submitted', ago: 3 * day },
  { title: 'Manhole cover displaced', desc: 'Manhole cover has shifted, leaving a gap. Bike wheel can get stuck. Located on a busy two-lane road.', type: 'open_manhole', lat: 28.6400, lng: 77.2100, ward: 1, severity: 80, status: 'in_progress', ago: 1 * day },
]

const CITIZENS = [
  { id: 'CIT-001', name: 'Rahul Sharma' },
  { id: 'CIT-002', name: 'Priya Patel' },
  { id: 'CIT-003', name: 'Amit Kumar' },
  { id: 'CIT-004', name: 'Sneha Gupta' },
  { id: 'CIT-005', name: 'Vikram Singh' },
  { id: 'CIT-006', name: 'Anita Desai' },
  { id: 'CIT-007', name: 'Rohan Mehta' },
  { id: 'CIT-008', name: 'Kavita Joshi' },
]

export function generateMockReports() {
  return SEED.map((s, i) => {
    const citizen = CITIZENS[i % CITIZENS.length]
    const dept = ISSUE_TO_DEPARTMENT[s.type]
    const created = new Date(now - s.ago)
    const statusHistory = [{ status: 'submitted', timestamp: created.toISOString(), note: 'Report submitted' }]

    if (['verified', 'assigned', 'in_progress', 'resolved'].includes(s.status))
      statusHistory.push({ status: 'verified', timestamp: new Date(created.getTime() + 4 * hour).toISOString(), note: 'Verified by admin' })
    if (['assigned', 'in_progress', 'resolved'].includes(s.status))
      statusHistory.push({ status: 'assigned', timestamp: new Date(created.getTime() + 12 * hour).toISOString(), note: `Assigned to ${DEPARTMENTS[dept].name}` })
    if (['in_progress', 'resolved'].includes(s.status))
      statusHistory.push({ status: 'in_progress', timestamp: new Date(created.getTime() + day).toISOString(), note: 'Work started' })
    if (s.status === 'resolved')
      statusHistory.push({ status: 'resolved', timestamp: new Date(created.getTime() + 3 * day).toISOString(), note: 'Issue resolved' })

    return {
      id: uid(),
      title: s.title,
      description: s.desc,
      issueType: s.type,
      severityScore: s.severity,
      severityLevel: getSeverityLevel(s.severity),
      reasoning: `Classified as ${ISSUE_TYPES[s.type].label} based on description analysis. Severity score of ${s.severity}/100 assigned due to ${s.severity > 70 ? 'high safety risk and public impact' : s.severity > 40 ? 'moderate impact on daily life' : 'low immediate risk but needs attention'}.`,
      department: dept,
      status: s.status,
      latitude: s.lat,
      longitude: s.lng,
      address: `Near ${WARDS[s.ward]}, New Delhi`,
      ward: WARDS[s.ward],
      citizenId: citizen.id,
      citizenName: citizen.name,
      createdAt: created.toISOString(),
      updatedAt: new Date(now - s.ago / 2).toISOString(),
      resolvedAt: s.status === 'resolved' ? new Date(created.getTime() + 3 * day).toISOString() : null,
      estimatedResponse: DEPARTMENTS[dept].responseTime,
      statusHistory,
      photoData: null,
    }
  })
}
