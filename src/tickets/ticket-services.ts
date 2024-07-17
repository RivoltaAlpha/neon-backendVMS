import { customerSupportTickets, TITicket, TSTicket } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all tickets
export const getAllTickets = async (): Promise<TSTicket[]> => {
  return await db.query.customerSupportTickets.findMany();
};

// Retrieve a ticket by ID
export const getTicketById = async (id: number): Promise<TSTicket | undefined> => {
  const ticket = await db.query.customerSupportTickets.findFirst({ where: eq(customerSupportTickets.ticket_id, id) });
  return ticket || undefined;
};

// Check if a ticket exists
export const ticketExists = async (id: number): Promise<boolean> => {
  const ticket = await getTicketById(id);
  return ticket !== undefined;
};

// Create a new ticket
export const createTicket = async (data: TITicket): Promise<TITicket> => {
  const { ticket_id, ...rest } = data;
  const [ticket] = await db.insert(customerSupportTickets).values({ ticket_id, ...rest }).returning();
  return ticket;
};

// Update a ticket's information
export const updateTicket = async (id: number, data: TITicket): Promise<TITicket | undefined> => {
  const { ticket_id, ...rest } = data;
  const [updatedTicket] = await db.update(customerSupportTickets).set({ ticket_id, ...rest }).where(eq(customerSupportTickets.ticket_id, id)).returning();
  return updatedTicket;
};

// Delete a ticket by ID
export const deleteTicket = async (id: number): Promise<string> => {
  await db.delete(customerSupportTickets).where(eq(customerSupportTickets.ticket_id, id));
  return "Ticket deleted successfully";
};

// Search for a ticket by ID
export const searchTicket = async (id: number): Promise<TSTicket | undefined> => {
  return await db.query.customerSupportTickets.findFirst({ where: eq(customerSupportTickets.ticket_id, id) });
};
