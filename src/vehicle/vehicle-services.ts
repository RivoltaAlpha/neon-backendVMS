import { vehicles, TIVehicle, TSVehicle } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all vehicles
export const getAllVehicles = async () => {
  const vehicle  = await db.query.vehicles.findMany({
      where: (fields , {eq}) => eq(vehicles.vehicle_id, fields.vehicle_id),
      columns: {
        vehicle_id: true,
        rental_rate: true,
        availability: true
      },
      with: {
        vehicleSpec: {
          columns: {
            manufacturer: true,
            model: true,
            year: true,
            fuel_type: true,
            engine_capacity: true,
            transmission: true,
            seating_capacity: true,
            color: true,
            features: true,
            image_url: true
          }
        }
      }
    });
  return vehicle;
};

// Retrieve a vehicle by ID
export const getVehicleById = async (id: number) => {
  const vehicle = await db.query.vehicles.findFirst({ 
    where: eq(vehicles.vehicle_id, id),
    columns: {
      vehicle_id: true,
      rental_rate: true,
      availability: true
    },
    with: {
      vehicleSpec: {
        columns: {
          manufacturer: true,
          model: true,
          year: true,
          fuel_type: true,
          engine_capacity: true,
          transmission: true,
          seating_capacity: true,
          color: true,
          features: true
        }
      }
    }
   });
  return vehicle || undefined;
};

// Check if a vehicle exists
export const vehicleExists = async (id: number) => {
  const vehicle = await getVehicleById(id);
  return vehicle !== undefined;
};

// Create a new vehicle
export const createVehicle = async (data: TIVehicle): Promise<TIVehicle> => {
  const [vehicle] = await db.insert(vehicles).values(data).returning();
  console.log( "Vehicle created successfully") 
  return vehicle;
};

// Update a vehicle's information
export const updateVehicle = async (id: number, data: TIVehicle): Promise<TIVehicle> => {
  const [vehicle] = await db.update(vehicles).set(data).where(eq(vehicles.vehicle_id, id)).returning();
  console.log( "Vehicle updated successfully")
  return vehicle;
};

// Delete a vehicle by ID
export const deleteVehicle = async (id: number): Promise<string> => {
  await db.delete(vehicles).where(eq(vehicles.vehicle_id, id));
  return "Vehicle deleted successfully";
};

// Search for a vehicle by ID
export const searchVehicle = async (id: number): Promise<TSVehicle | undefined> => {
  return await db.query.vehicles.findFirst({ where: eq(vehicles.vehicle_id, id) });
};
