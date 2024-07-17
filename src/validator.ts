import { datetime } from 'drizzle-orm/mysql-core';
import { z } from 'zod';

// Users table schema
export const userSchema = z.object({
    first_name: z.string(), 
    last_name: z.string(),
    email: z.string().email(),
    contact_phone: z.string(),
    address: z.string(),
    role: z.enum(['user', 'admin']),
});

// Vehicle Specifications table schema
export const vehicleSpecificationSchema = z.object({
    manufacturer: z.string(),
    model: z.string(),
    year: z.number(),
    fuel_type: z.string(),
    engine_capacity: z.number(),
    transmission: z.string(),
    seating_capacity: z.number(),
    color: z.string(),
    features: z.string(),
});

// Vehicles table schema
export const vehicleSchema = z.object({
    vehicleSpec_id: z.number(),
    rental_rate: z.number(),
    availability: z.boolean(),
});

// Bookings table schema
export const bookingSchema = z.object({
    booking_id: z.number(),
    user_id: z.number(),
    vehicle_id: z.number(),
    location_id: z.number(),
    booking_date: z.string().datetime().optional(),
    return_date: z.string().datetime().optional(),
    total_amount: z.number(),
    booking_status: z.enum(['Pending', 'Confirmed', 'Cancelled']),
});

// Payments table schema
export const paymentSchema = z.object({
    payment_id: z.number(),
    booking_id: z.number(),
    amount: z.number(),
    payment_status: z.enum(['Pending', 'Completed', 'Failed']),
    payment_date: z.string().datetime(),
    payment_method: z.string(),
    transaction_id: z.string(),
});

// Authentication table schema
export const authenticationSchema = z.object({
    auth_id: z.number(),
    user_id: z.number(),
    password: z.string(),
});

// Customer Support Tickets table schema
export const customerSupportTicketSchema = z.object({
    ticket_id: z.number(),
    user_id: z.number(),
    subject: z.string(),
    description: z.string(),
    status: z.enum(['Open', 'In Progress', 'Closed']),
});

// Locations table schema
export const locationSchema = z.object({
    location_id: z.number(),
    name: z.string(),
    address: z.string(),
    contact_phone: z.string(),
});

// Fleet Management table schema
export const fleetManagementSchema = z.object({
    fleet_id: z.number(),
    vehicle_id: z.number(),
    acquisition_date: z.string().datetime().optional(),
    depreciation_rate: z.number(),
    current_value: z.number(),
    maintenance_cost: z.number(),
    status: z.string(),
});

export const loginUserShema = z.object({
    username: z.string(),
    password: z.string(),
});

export const registerUserShema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
    contact_phone: z.string(),
    address: z.string(),
    role: z.string().optional(),
});