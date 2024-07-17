import { vehicleSpecifications, TISpecification, TSSpecification } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all specifications
export const getAllSpecifications = async () => {
  return await db.query.vehicleSpecifications.findMany();
};

// Retrieve a specification by ID
export const getSpecificationById = async (id: number): Promise<TSSpecification | undefined> => {
  const specification = await db.query.vehicleSpecifications.findFirst({ where: eq(vehicleSpecifications.vehicleSpec_id, id) });
  return specification || undefined;
};

// Check if a specification exists
export const specificationExists = async (id: number): Promise<boolean> => {
  const specification = await getSpecificationById(id);
  return specification !== undefined;
};

// Create a new specification
export const createSpecification = async (data:TISpecification): Promise<TISpecification> => {
  console.log("Raw data received:", data);
  const { features, ...rest }: any = data;
  const featuresArray = typeof features === 'string' ? features.split(',').map(feature => feature.trim()) : features;

  const [ specification ]  = await db.insert(vehicleSpecifications).values(
    { ...rest, features: featuresArray }
  ).returning();
  console.log("Data inserted successfully");
  return specification;
};

// Update a specification's information
export const updateSpecification = async (id: number, data: TISpecification): Promise<TISpecification | undefined> => {
  const { features, ...rest }: any = data;
  const featuresArray = typeof features === 'string' ? features.split(',').map(feature => feature.trim()) : features;

  const [ updateSpec ] = await db.update(vehicleSpecifications).set(
    { ...rest, features: featuresArray }).where(eq(vehicleSpecifications.vehicleSpec_id, id)).returning();
  console.log("Data updated successfully");
  return updateSpec;
};

// Delete a specification by ID
export const deleteSpecification = async (id: number): Promise<string> => {
  await db.delete(vehicleSpecifications).where(eq(vehicleSpecifications.vehicleSpec_id, id));
  return "Specification deleted successfully";
};

// Search for a specification by ID
export const searchSpecification = async (id: number): Promise<TSSpecification | undefined> => {
  return await db.query.vehicleSpecifications.findFirst({ where: eq(vehicleSpecifications.vehicleSpec_id, id) });
};
