export const EXPLICIT_APPROVAL_REQUIRED = 'EXPLICIT_APPROVAL_REQUIRED';

export function hasExplicitApproval(input = {}) {
  const approval = input.approval;
  return Boolean(
    approval &&
      approval.approved === true &&
      typeof approval.approvedBy === 'string' &&
      approval.approvedBy.trim() &&
      typeof approval.reason === 'string' &&
      approval.reason.trim()
  );
}

export function requireExplicitApproval(input = {}, action = 'write') {
  if (hasExplicitApproval(input)) return input.approval;

  const error = new Error(`${action} requires explicit approval`);
  error.code = EXPLICIT_APPROVAL_REQUIRED;
  error.action = action;
  throw error;
}
