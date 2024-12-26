import mongoose from "mongoose";

export interface IReportedIssue {
  email: string;
  title: string;
  description: string;
  createdAt: Date;
}

const reportedIssueSchema = new mongoose.Schema<IReportedIssue>({
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReportedIssue =
  mongoose.models.ReportedIssue ??
  mongoose.model<IReportedIssue>("ReportedIssue", reportedIssueSchema);

export default ReportedIssue;