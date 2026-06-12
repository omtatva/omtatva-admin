export type ApplicationStatus = "new" | "reviewed" | "shortlisted" | "rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "new",
  "reviewed",
  "shortlisted",
  "rejected",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

export interface CareerApplication {
  id: string;
  careerId: string;
  careerTitle: string;
  name: string;
  email: string;
  phone: string | null;
  coverLetter: string | null;
  resumeFilename: string;
  resumeObject?: string;
  resumeUrl?: string;
  submittedAt: string;
  status: ApplicationStatus;
}
