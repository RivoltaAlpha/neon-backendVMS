import { bookings, payments, TIPayment, TSPayment, vehicles } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all payments
export const getAllPayments = async ()  => {
  const allPayments = await db.query.payments.findMany({
    where: (fields, {eq}) => eq(payments.payment_id, fields.payment_id),
    columns: {
      payment_id: true,
      amount: true,
      payment_status: true,
      payment_date: true,
      payment_method: true,
      transaction_id: true,
    },
    with: {
      booking: {
        columns: {
          booking_id: true,
        },
        with: {
          vehicle: {
            columns: {
              vehicle_id: true,
              rental_rate: true,
            },
            with: {
              vehicleSpec: {
                columns: {
                  manufacturer: true,
                  model: true,
                },
              },
            },
          },          
        }
      },
      user: {
        columns: {
          user_id: true,
          username: true,
          contact_phone: true,
          email: true,
          address: true
        }
      }
    }
  });

  return allPayments;
};

// Retrieve a payment by ID
export const getPaymentById = async (id: number): Promise<TSPayment | undefined> => {
  const payment = await db.query.payments.findFirst({ where: eq(payments.payment_id, id) });
  return payment || undefined;
};

// Check if a payment exists
export const paymentExists = async (id: number): Promise<boolean> => {
  const payment = await getPaymentById(id);
  return payment !== undefined;
};

// Create a new payment
export const createPayment = async (data: TIPayment): Promise<TIPayment> => {
  const [newPayment] = await db.insert(payments).values(data).returning();
  return newPayment;
};

// Update a payment's information
export const updatePayment = async (id: number, data: TIPayment): Promise<TIPayment> => {
  const { payment_id, ...rest } = data;
  const[ updatedPayment] = await db.update(payments).set({ payment_id, ...rest }).where(eq(payments.payment_id, id)).returning();
  return updatedPayment;
};

// update payment status 
export const updatePaymentBySessionId = async (session_id: string)=> {
  await db.update(payments).set({ payment_status: "Success"}).where(eq(payments.transaction_id, session_id));
  // await db.update(bookings).set({ booking_status: "Confirmed"}).where(eq(bookings.booking_id, booking_id));
  return "Payment status updated successfully";
}

// update bookingStatus based on payment status
export const updateBookingStatus = async (booking_id: number) => {
  await db.update(bookings).set({ booking_status: "Confirmed" }).where(eq(bookings.booking_id, booking_id));
  return "Booking status updated successfully";
}

// Delete a payment by ID
export const deletePayment = async (id: number): Promise<string> => {
  await db.delete(payments).where(eq(payments.payment_id, id));
  return "Payment deleted successfully";
};

// Search for a payment by ID
export const searchPayment = async (id: number): Promise<TSPayment | undefined> => {
  return await db.query.payments.findFirst({ where: eq(payments.payment_id, id) });
};

// payment by user id
export const getPaymentsByUserId = async (user_id: number) => {
  const payments = await db.query.payments.findMany({
     where:(fields, { eq }) => eq(fields.user_id, user_id),
     columns: {
      payment_id: true,
      amount: true,
      payment_status: true,
      payment_date: true,
      payment_method: true,
      transaction_id: true,
    },
    with: {
      booking: {
        columns: {
          booking_id: true,
          booking_status: true,
        },
        with: {
          vehicle: {
            columns: {
              vehicle_id: true,
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
                  image_url: true,
                },
              },
            },
          },          
        }
      },
      user: {
        columns: {
          user_id: true,
          username: true,
          contact_phone: true,
          email: true,
          address: true
        }
      }
    }
  });
  console.log("payments: ", payments)
  return payments;
};


// updateVehicleAvailabilityByBookingId
export const updateVehicleAvailabilityByBookingId = async (booking_id: number) => {
  await db.update(vehicles).set({ availability: false }).where(eq(bookings.booking_id, booking_id));
  return "Vehicle availability updated successfully";
}

