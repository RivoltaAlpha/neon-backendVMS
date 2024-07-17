import  db  from '../drizzle/db';
import { sql} from 'drizzle-orm';
import {  users } from "../drizzle/schema";
import { TSAuthentication,authentication } from '../drizzle/schema';


export const loginAuthService = async (user: TSAuthentication) => {
  const { username } = user;
  try {
    const foundUser = await db.query.authentication.findFirst({
      columns: {
        username: true,
        password: true,
        role: true, 
      },where: sql` ${authentication.username} = ${username}`,
      with: {
        user: {
          columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            username: true,
            contact_phone: true,
            address: true,
            email: true
          }
        }
      }
    });
    console.log('Found user:', foundUser);
    return foundUser;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('User login failed');
  }
};

export const authenticationService = async (user: any) => {
  try {
    console.log('Registering user:', user); // Log received user data for debugging

    // Insert user into `users` table
    const createdUser = await db.insert(users).values({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      contact_phone: user.contact_phone,
      address: user.address,
      role: user.role || 'user',
      created_at: sql`now()`,
      updated_at: sql`now()`
    }).returning();

    console.log('User created in users table:', createdUser); // Log created user data

    // Extract the created user ID
    const userId = createdUser[0].user_id;

    // Insert user into `authentication` table
    const createdAuthUser = await db.insert(authentication).values({
      user_id: userId,
      password: user.password,
      username: user.username,
      role: user.role || 'user'
    }).returning();

    console.log('User created in authentication table:', createdAuthUser); // Log created auth user data

    return createdUser[0]; // Return the created user
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('User creation failed');
  }
};