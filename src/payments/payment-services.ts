import { payments, TIPayment, TSPayment } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all payments
export const getAllPayments = async (): Promise<TSPayment[]> => {
  return await db.query.payments.findMany();
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
  return "Payment status updated successfully";
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



