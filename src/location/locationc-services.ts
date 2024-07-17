import { locations, TILocation, TSLocation } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all locations
export const getAllLocations = async (): Promise<TSLocation[]> => {
  return await db.query.locations.findMany();
};

// Retrieve a location by ID
export const getLocationById = async (id: number): Promise<TSLocation | undefined> => {
  const location = await db.query.locations.findFirst({ where: eq(locations.location_id, id) });
  return location || undefined;
};

// Check if a location exists
export const locationExists = async (id: number): Promise<boolean> => {
  const location = await getLocationById(id);
  return location !== undefined;
};

// Create a new location
export const createLocation = async (data: TILocation): Promise<TILocation> => {
  const [location] = await db.insert(locations).values(data).returning();
  return location;
};

// Update a location's information
export const updateLocation = async (id: number, data: TILocation): Promise<TILocation> => {
  const [location] = await db.update(locations).set(data).where(eq(locations.location_id, id)).returning();
  return location;
};

// Delete a location by ID
export const deleteLocation = async (id: number): Promise<string> => {
  await db.delete(locations).where(eq(locations.location_id, id));
  return "Location deleted successfully";
};

// Search for a location by ID
export const searchLocation = async (id: number): Promise<TSLocation | undefined> => {
  return await db.query.locations.findFirst({ where: eq(locations.location_id, id) });
};
