import {  serial, text,varchar,pgEnum, timestamp, integer, boolean,decimal, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import exp from "constants";
import { url } from "inspector";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);

// Customers table
export const users = pgTable('users', {
    user_id: serial('user_id').primaryKey(),
    first_name: varchar('first_name', { length: 100 }).notNull(),
    last_name: varchar('last_name', { length: 100 }).notNull(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    contact_phone: varchar('contact_phone', { length: 100 }).notNull(),
    address: varchar('address').notNull(),
    role: roleEnum("role").default("user").notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships table
export const userRelationships = relations(users, ({ many }) => ({
    bookings: many(bookings),
    payments: many(payments),
    support_tickets: many(customerSupportTickets),
    authentication: many(authentication),    
}));

// Vehicles table
export const vehicles = pgTable('vehicles', {
    vehicle_id: serial('vehicle_id').primaryKey(),
    vehicleSpec_id: integer('vehicleSpec_id').references(() => vehicleSpecifications.vehicleSpec_id, {onDelete: "cascade"}).notNull(),
    rental_rate: decimal("rental_rate", { precision: 10, scale: 2 }).notNull(),
    availability: boolean('availability').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships table
export const vehicleRelationships = relations(vehicles, ({ one, many }) => ({
    vehicleSpec: one(vehicleSpecifications, {
        fields: [vehicles.vehicleSpec_id],
        references: [vehicleSpecifications.vehicleSpec_id],
    }),
    bookings: many(bookings),
    fleetRecords: many(fleetManagement),
}));

// Vehicle Specifications table
export const vehicleSpecifications = pgTable('vehicle_specifications', {
    vehicleSpec_id: serial('vehicleSpec_id').primaryKey(),
    manufacturer: varchar('manufacturer').notNull(),
    model: text('model').notNull(),
    year: integer('year').notNull(),
    fuel_type: text('fuel_type').notNull(),
    engine_capacity: integer('engine_capacity').notNull(),// change to diff type
    transmission: text('transmission').notNull(),
    seating_capacity: integer('seating_capacity').notNull(),
    color: text('color').notNull(),
    features: text('features').array().notNull(),
});
// relationship


// booking status enum
export const bookingStatusEnum = pgEnum("booking_status", ["Pending", "Confirmed", "Cancelled"]);

// Bookings table
export const bookings = pgTable('bookings', {
    booking_id: serial('booking_id').primaryKey(),
    user_id: integer('user_id').references(() => users.user_id, {onDelete: "cascade"}).notNull(),
    vehicle_id: integer('vehicle_id').references(() => vehicles.vehicle_id, {onDelete: "cascade"}).notNull(),
    location_id: integer('location_id').references(() => locations.location_id, {onDelete: "cascade"}).notNull(),
    booking_date: timestamp('booking_date').notNull(),
    return_date: timestamp('return_date').notNull(),
    total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),    
    booking_status: bookingStatusEnum('booking_status').default('Pending').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});


//booking relationships
export const bookingRelationships = relations(bookings, ({ one, many }) => ({
    user: one(users, {
      fields: [bookings.user_id],
      references: [users.user_id],
    }),
    vehicle: one(vehicles, {
      fields: [bookings.vehicle_id],
      references: [vehicles.vehicle_id],
    }),
    location: one(locations, {
      fields: [bookings.location_id],
      references: [locations.location_id],
    }),
    payments: many(payments),
  }));

// payment status enum
export const paymentStatusEnum = pgEnum("payment_status", ["Pending", "Success", "Failed"]);

// Payments table
export const payments = pgTable('payments', {
    payment_id: serial('payment_id').primaryKey(),
    booking_id: integer('booking_id').references(() => bookings.booking_id, {onDelete: "cascade"}).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    payment_status: paymentStatusEnum('payment_status').default('Pending').notNull(),
    payment_date: timestamp('payment_date').notNull(),
    payment_method: varchar('payment_method', { length: 100 }).notNull(),
    transaction_id: varchar('transaction_id', { length: 100 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships table
export const paymentRelationships = relations(payments, ({ one }) => ({
    booking: one(bookings, {
        fields: [payments.booking_id],
        references: [bookings.booking_id],
    }),
}));

// Authentication table
export const authentication = pgTable('authentication', {
    auth_id: serial('auth_id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.user_id, { onDelete: "cascade" }),
    username: varchar("username").notNull().references(() => users.username, { onDelete: "cascade" }),
    password: varchar('password', { length: 100 }).notNull(),
    role: roleEnum('role').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships table with foreign keys id and username
export const authenticationRelationships = relations(authentication, ({ one }) => ({
    user: one(users, {
        fields: [authentication.user_id],
        references: [users.user_id],
    }),
    username: one(users, {
        fields: [authentication.username],
        references: [users.username],
    }),
}));

// customer support ticket status enum
export const customerSupportTicketStatusEnum = pgEnum("customer_support_ticket_status", ["Open", "In Progress", "Closed"]);

// Customer Support Tickets table
export const customerSupportTickets = pgTable('customer_support_tickets', {
    ticket_id: serial('ticket_id').primaryKey(),
    user_id: integer('user_id').references(() => users.user_id, {onDelete: "cascade"}).notNull(),
    subject: varchar('subject', { length: 100 }).notNull(),
    description: varchar('description', { length: 1000 }).notNull(),
    ticket_status: customerSupportTicketStatusEnum('customer_support_ticket_status').default('Open').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships table
export const customerSupportTicketRelationships = relations(customerSupportTickets, ({ one }) => ({
    user: one(users, {
        fields: [customerSupportTickets.user_id],
        references: [users.user_id],
    }),
}));

// Location and Branches table
export const locations = pgTable('locations', {
    location_id: serial('location_id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    address: varchar('address', { length: 100 }).notNull(),
    contact_phone: varchar('contact_phone', { length: 100 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships table
export const locationRelationships = relations(locations, ({ many }) => ({
    branches: many(bookings),       
}));

// fleet management status enum
export const fleetManagementStatusEnum = pgEnum("fleet_management_status", ["Active", "Inactive"]);

// Fleet Management table
export const fleetManagement = pgTable('fleet_management', {
    fleet_id: serial('fleet_id').primaryKey(),
    fleet_name: varchar('fleet_name', { length: 100 }).notNull(),
    vehicle_id: integer('vehicle_id').references(() => vehicles.vehicle_id, {onDelete: "cascade"}).notNull(),
    acquisition_date: timestamp('acquisition_date').notNull(),
    depreciation_rate: decimal("depreciation_rate", { precision: 10, scale: 2 }).notNull(),
    current_value: decimal("current_value", { precision: 10, scale: 2 }).notNull(),
    maintenance_cost: decimal("maintenance_cost", { precision: 10, scale: 2 }).notNull(),
    fleetManagement_status: fleetManagementStatusEnum('fleet_management_status').default('Active').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships table
// one fleet has many vehicles
export const fleetManagementRelationships = relations(fleetManagement, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [fleetManagement.vehicle_id],
        references: [vehicles.vehicle_id],
    }),
}));

// Reports table
export const reports = pgTable('reports', {
    report_id: serial('report_id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description').notNull(),
    report_type: varchar('report_type', { length: 100 }).notNull(),
    generated_by: varchar('generated_by', { length: 100 }).notNull(),
    generated_at: timestamp('generated_at').defaultNow().notNull(),
    file_path: varchar('file_path').notNull(),
});


export type TIUser = typeof users.$inferInsert;
export type TSUser = typeof users.$inferSelect;
export type TIVehicle = typeof vehicles.$inferInsert;
export type TSVehicle = typeof vehicles.$inferSelect;
export type TISpecification = typeof vehicleSpecifications.$inferInsert;
export type TSSpecification = typeof vehicleSpecifications.$inferSelect;
export type TIBooking = typeof bookings.$inferInsert;
export type TSBooking = typeof bookings.$inferSelect;
export type TIPayment = typeof payments.$inferInsert;
export type TSPayment = typeof payments.$inferSelect;
export type TIAuthentication = typeof authentication.$inferInsert;
export type TSAuthentication = typeof authentication.$inferSelect;
export type TITicket = typeof customerSupportTickets.$inferInsert;
export type TSTicket = typeof customerSupportTickets.$inferSelect;
export type TILocation = typeof locations.$inferInsert;
export type TSLocation = typeof locations.$inferSelect;
export type TIManagement = typeof fleetManagement.$inferInsert;
export type TSManagement = typeof fleetManagement.$inferSelect;
export type TReport = typeof reports.$inferInsert;
export type TSReport = typeof reports.$inferSelect;
export type TIpaymentStatusEnum  = typeof paymentStatusEnum.toString
export type TSpaymentStatusEnum  = typeof paymentStatusEnum.toString