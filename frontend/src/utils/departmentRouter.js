import { ISSUE_TO_DEPARTMENT, DEPARTMENTS } from './constants'

export function routeToDepartment(issueType) {
  const deptKey = ISSUE_TO_DEPARTMENT[issueType] || 'municipal'
  const dept = DEPARTMENTS[deptKey]
  return {
    key: deptKey,
    name: dept.name,
    contact: dept.contact,
    estimatedResponse: dept.responseTime,
  }
}
