import { fleetManagement, TIManagement, TSManagement } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all fleet records
export const getAllFleetRecords = async (): Promise<TSManagement[]> => {
  return await db.query.fleetManagement.findMany();
};

// Retrieve a fleet record by ID
export const getFleetRecordById = async (id: number): Promise<TSManagement | undefined> => {
  const fleetRecord = await db.query.fleetManagement.findFirst({ where: eq(fleetManagement.fleet_id, id) });
  return fleetRecord || undefined;
};

// Check if a fleet record exists
export const fleetRecordExists = async (id: number): Promise<boolean> => {
  const fleetRecord = await getFleetRecordById(id);
  return fleetRecord !== undefined;
};

// Create a new fleet record
export const createFleetRecord = async (data: TIManagement): Promise<TIManagement> => {
  const [record] = await db.insert(fleetManagement).values(data).returning();
  return record;
};

// Update a fleet record's information
export const updateFleetRecord = async (id: number, data: TIManagement): Promise<TIManagement> => {
  const [record] = await db.update(fleetManagement).set(data).where(eq(fleetManagement.fleet_id, id)).returning();
  return record;
};

// Delete a fleet record by ID
export const deleteFleetRecord = async (id: number): Promise<string> => {
  await db.delete(fleetManagement).where(eq(fleetManagement.fleet_id, id));
  return "Fleet record deleted successfully";
};

// Search for a fleet record by ID
export const searchFleetRecord = async (id: number): Promise<TSManagement | undefined> => {
  return await db.query.fleetManagement.findFirst({ where: eq(fleetManagement.fleet_id, id) });
};
