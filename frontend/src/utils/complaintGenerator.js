import { ISSUE_TYPES, DEPARTMENTS, ISSUE_TO_DEPARTMENT, getSeverityLevel, SEVERITY_LEVELS } from './constants'

export function generateComplaint(report, language = 'en') {
  const ref = report.id || 'RPT-XXXX'
  const typeLabel = ISSUE_TYPES[report.issueType]?.label || report.issueType
  const deptKey = ISSUE_TO_DEPARTMENT[report.issueType] || 'municipal'
  const dept = DEPARTMENTS[deptKey]
  const severity = SEVERITY_LEVELS[report.severityLevel || getSeverityLevel(report.severityScore)]
  const date = new Date(report.createdAt || Date.now()).toLocaleDateString('en-IN')

  if (language === 'hi') return generateHindi(report, ref, typeLabel, dept, severity, date)

  const subject = `Complaint: ${typeLabel} at ${report.address || 'Reported Location'}`
  const body = `Reference No: ${ref}
Date: ${date}

To,
The Commissioner,
${dept.name}
New Delhi

Subject: ${subject}

Respected Sir/Madam,

I am writing to bring to your urgent attention a civic issue that requires immediate action.

Issue Type: ${typeLabel}
Location: ${report.address || 'As marked on map'}
GPS Coordinates: ${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}
Severity: ${severity.label} (${report.severityScore}/100)

Description:
${report.description}

${report.severityScore >= 70 ? 'This issue poses a serious safety hazard and requires immediate attention. ' : ''}${report.severityScore >= 50 ? 'The affected area sees significant foot and vehicle traffic. ' : ''}Delay in addressing this matter may lead to further deterioration and potential harm to citizens.

I request you to kindly take necessary action at the earliest and update the status of this complaint.

Thanking you,
Concerned Citizen
Complaint ID: ${ref}`

  return { subject, body, reference: ref, language: 'en' }
}

function generateHindi(report, ref, typeLabel, dept, severity, date) {
  const subject = `शिकायत: ${typeLabel} — ${report.address || 'रिपोर्ट किया गया स्थान'}`
  const body = `संदर्भ संख्या: ${ref}
दिनांक: ${date}

सेवा में,
आयुक्त,
${dept.name}
नई दिल्ली

विषय: ${subject}

माननीय महोदय/महोदया,

मैं आपका ध्यान एक नागरिक समस्या की ओर आकर्षित करना चाहता/चाहती हूँ जिसके लिए तत्काल कार्रवाई आवश्यक है।

समस्या का प्रकार: ${typeLabel}
स्थान: ${report.address || 'मानचित्र पर चिह्नित'}
गंभीरता: ${severity.label} (${report.severityScore}/100)

विवरण:
${report.description}

कृपया इस मामले में शीघ्र आवश्यक कार्रवाई करें।

धन्यवाद,
चिंतित नागरिक
शिकायत आईडी: ${ref}`

  return { subject, body, reference: ref, language: 'hi' }
}
