import { customerSupportTickets, TITicket, TSTicket } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all tickets
export const getAllTickets = async () => {
  const tickets = await db.query.customerSupportTickets.findMany({
    where: (fields, { eq }) => eq(fields.ticket_id, fields.ticket_id),
    columns: {
      ticket_id: true,
      subject: true,
      description: true,
      ticket_status: true,
    },
    with: {
      user: {
        columns: {
          user_id: true,
          first_name: true,
          last_name: true,
          username: true,
          contact_phone: true,
          address: true,
          email: true,
        },
      },
    },
  });

  return tickets;
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
  console.log("Raw data received:", data);
  const [updatedTicket] = await db.update(customerSupportTickets).set({ ticket_id, updated_at: new Date(), ...rest }).where(eq(customerSupportTickets.ticket_id, id)).returning();
  console.log("Ticket updated successfully", updatedTicket);
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

// get user tickets
export const getUserTickets = async (id: number): Promise<TSTicket[]> => {
  return await db.query.customerSupportTickets.findMany({ where: eq(customerSupportTickets.user_id, id) });
}