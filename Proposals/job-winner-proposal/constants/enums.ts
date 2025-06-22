

export const PROPOSAL_STATUSES = [
  "Interviewing",
  "Accepted",
  "Rejected",
  "Process",
  "Canceled",
] as const;

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Remote",
  "Freelance"
] as const;

// Nếu muốn cho UI filter hoặc dropdown:
export const STATUS_OPTIONS = PROPOSAL_STATUSES.map(status => ({
  label: status,
  value: status
}));

export const JOB_TYPE_OPTIONS = JOB_TYPES.map(type => ({
  label: type,
  value: type
}));
