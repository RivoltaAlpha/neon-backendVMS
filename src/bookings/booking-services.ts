import { bookings, TIBooking, TSBooking,payments,TIPayment,TSPayment,vehicles,users,locations,vehicleSpecifications} from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all bookings
export const getAllBookings = async ()  =>  {
  const bookingData = await db.query.bookings.findMany({
    where: (fields, {eq}) => eq( bookings.booking_id, fields.booking_id),
    columns: {
      booking_id: true,
      booking_date: true,
      booking_status: true,
      return_date: true,
      total_amount: true,
    },
    with: {
      vehicle: {
        columns: {
          vehicle_id: true,
          availability: true,
          rental_rate: true,
        },
        with: {
          vehicleSpec: {
            columns: {
              manufacturer: true,
              model: true,
            }
          }
        }
      },
      location: {
        columns: {
          location_id: true,
          name: true,
        }
      },
      user: {
        columns: {
          user_id: true,
          username: true,
        }
      }
    }
  });
  return bookingData;
};

// Retrieve a booking by ID
export const getBookingById = async (id: number): Promise<TSBooking | undefined> => {
  const booking = await db.query.bookings.findFirst({ where: eq(bookings.booking_id, id),
    with: {
      vehicle: {
        columns:{
          rental_rate:true,
        },
        with: {
          vehicleSpec: {
            columns: {
              manufacturer: true,
              model: true,
              year:true,
              fuel_type:true,
              engine_capacity:true,
            }
          }
        }
      },
      location: {
        columns:{
          location_id: true,
          name:true,
        }
      },
      user: {
        columns: {
          user_id: true,
          username: true,
        }
      }
    }
   });
  return booking || undefined;
};

// Check if a booking exists
export const bookingExists = async (id: number): Promise<boolean> => {
  const booking = await getBookingById(id);
  return booking !== undefined;
};

// Create a new booking
export const createBooking = async (data: TIBooking): Promise<TIBooking> => {
  const [newBooking] = await db.insert(bookings).values(data).returning();
  console.log("Booking created successfully");
  return newBooking;
};

// Update a booking's information
export const updateBooking = async (id: number, data: TIBooking): Promise<TIBooking> => {
  console.log ("Updating booking: ", id, data);
  const [updatedBooking] = await db.update(bookings).set(data).where(eq(bookings.booking_id, id)).returning();
  console.log ("Booking updated successfully");
  console.log (updatedBooking);
  return updatedBooking;
};

// Delete a booking by ID
export const deleteBooking = async (id: number): Promise<string> => {
  await db.delete(bookings).where(eq(bookings.booking_id, id));
  return "Booking deleted successfully";
};

// Search for a booking by ID
export const searchBooking = async (id: number): Promise<TSBooking | undefined> => {
  return await db.query.bookings.findFirst({ where: eq(bookings.booking_id, id) });
};


// Create a new booking with user, vehicle, and location
export async function bookVehicle(bookingData: TIBooking): Promise<TSBooking> {
  const [newBooking] = await db.insert(bookings).values(bookingData).returning();
  return newBooking;
}

// Get all bookings for a specific user
export async function getBookingsByUser(userId: number): Promise<TSBooking[]> {
  const userBookings = await db.select().from(bookings).where(eq(bookings.user_id, userId));
  return userBookings;
}
// Create a new payment
export async function createPayment(paymentData: TIPayment): Promise<TSPayment> {
  const [newPayment] = await db.insert(payments).values(paymentData).returning();
  return newPayment;
}

// get user bookings
export async function getUserBookings(userId: number): Promise<TSBooking[]> {
  const userBookings = await db.select().from(bookings).where(eq(bookings.user_id, userId));

  return userBookings;
}

export async function getUsersBookings(user_id: number) {
  return await db.query.users.findMany({
    where: (fields, { eq }) => eq(fields.user_id, user_id),
    columns: {
      user_id: true,
      username: true,
    },
    with: {
      bookings: {
        columns: {
          booking_id: true,
          booking_date: true,
          booking_status: true,
          return_date: true,
          total_amount: true,
        },
        with: {
          location: {
            columns: {
              location_id: true,
              name: true,
            },
          },
          vehicle: {
            columns: {
              vehicle_id: true,
              availability: true,
              rental_rate: true,
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
                },
              },
            },
          },
        },
      },
    },
  });
}