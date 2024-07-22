import { bookings,users,vehicles,payments,reports, TReport, TSReport } from "../drizzle/schema";
import { eq,sql } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all reports
export const getAllReports = async (): Promise<TSReport[]> => {
  return await db.query.reports.findMany();
};

// Retrieve a report by ID
export const getReportById = async (id: number): Promise<TSReport | undefined> => {
  const report = await db.query.reports.findFirst({ where: eq(reports.report_id, id) });
  return report || undefined;
};

// Check if a report exists
export const reportExists = async (id: number): Promise<boolean> => {
  const report = await getReportById(id);
  return report !== undefined;
};

// Create a new report
export const createReport = async (data: TReport): Promise<string> => {
  await db.insert(reports).values(data);
  return "Report created successfully";
};

// Update a report's information
export const updateReport = async (id: number, data: TReport): Promise<TReport> => {
  const [report] = await db.update(reports).set(data).where(eq(reports.report_id, id)).returning();
  return report;  
};

// Delete a report by ID
export const deleteReport = async (id: number): Promise<string> => {
  await db.delete(reports).where(eq(reports.report_id, id));
  return "Report deleted successfully";
};

// Search for a report by ID
export const searchReport = async (id: number): Promise<TSReport | undefined> => {
  return await db.query.reports.findFirst({ where: eq(reports.report_id, id) });
};

export async function addReport(reportData: TReport): Promise<TReport> {
  const [newReport] = await db.insert(reports).values(reportData).returning();
  return newReport;
}

