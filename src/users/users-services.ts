import { users, TSUser, TIUser } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// Retrieve all users
export const getAllUsers = async () => {
  return await db.query.users.findMany();
};

// Retrieve a user by ID
export const getUserById = async (id: number): Promise<TSUser | undefined> => {
  const user = await db.query.users.findFirst({ where: eq(users.user_id, id) });
  return user || undefined;
};

// CHECK IG IT EXISTS
export const userExists = async (id: number): Promise<boolean> => {
  const user = await getUserById(id);
  return user !== undefined; //true
};

// Create a new user
export const createUser = async (data: TIUser): Promise<TIUser > => {
  const [ user ] = await db.insert(users).values(data).returning();
  return user || undefined;
};

// Update a user's information
export const updateUser = async (id: number, data: TIUser): Promise<TIUser | undefined > => {
  const [ user ]  = await db.update(users).set(data).where(eq(users.user_id, id)).returning();
  return user;
};

// Delete a user by ID
export const deleteUser = async (id: number): Promise<string> => {
  await db.delete(users).where(eq(users.user_id, id));
  return `User with ID ${id} deleted`;
};

// Search for a user by ID
export const searchUser = async (id: number): Promise<TSUser | undefined> => {
  return await db.query.users.findFirst({ where: eq(users.user_id, id) });
};

// get user bookings

