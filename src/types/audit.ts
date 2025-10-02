// Core data types for the Audit Tracking Platform

export type RiskLevel = "critical" | "high" | "medium" | "low";
export type FindingStatus = "open" | "in_progress" | "resolved" | "closed" | "overdue";
export type AuditStatus = "planned" | "in_progress" | "completed" | "cancelled";
export type UserRole = "admin" | "auditor" | "manager" | "risk_officer" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface Audit {
  id: string;
  title: string;
  description: string;
  auditType: string;
  status: AuditStatus;
  startDate: string;
  endDate: string;
  leadAuditor: User;
  department: string;
  findingsCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  completionPercentage: number;
}

export interface Finding {
  id: string;
  auditId: string;
  auditTitle: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  status: FindingStatus;
  category: string;
  owner: User;
  assignedTo?: User;
  identifiedDate: string;
  targetCloseDate: string;
  actualCloseDate?: string;
  evidence: string[];
  remediationPlan?: string;
  comments: Comment[];
  tags: string[];
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: string;
}

export interface KPIMetric {
  label: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  icon: string;
  color: string;
}

export interface Alert {
  id: string;
  type: RiskLevel;
  title: string;
  description: string;
  affectedItems: string[];
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

// API Response types (for future backend integration)
export interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
