import {
    getAllPayments,
    getPaymentById,
    createPayment,
    deletePayment,
    updatePayment,
    searchPayment,
    paymentExists,
    updatePaymentBySessionId,
  } from "./payment-services";
  
  import {
    getAllController,
    getSpecificsController,
    deleteController,
    searchController,
  } from "../generics/gen-controller";

import {    updateControllerWithDates, createControllerWithDates } from '../generics/timeGen';
import { Context } from "hono";
  
import Stripe from "stripe";
import dotenv from "dotenv";
import { FRONTEND_URL } from "../env";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {  apiVersion: '2024-06-20', });


  // Specific controllers for payment operations
  export const getAllPaymentsController = getAllController(getAllPayments);
  export const getPaymentController = getSpecificsController(getPaymentById);
  export const createPaymentController = createControllerWithDates(createPayment,['payment_date']);
  export const updatePaymentController = updateControllerWithDates(paymentExists,updatePayment,['payment_date']);
  export const deletePaymentController = deleteController(paymentExists, deletePayment);
  export const searchPaymentController = searchController(searchPayment);
  


  export const checkoutBooking = async (c: Context) => {
    let booking;
    try {
        booking = await c.req.json();
    } catch (error) {
        return c.text("Invalid request body", 400);
    }
    try {
        if (!booking.booking_id || !booking.total_amount) {
            return c.text("Missing Booking ID or total amount", 400);
        }
 
        const conversionRate = 0.007;
        const totalAmountInUsd = booking.total_amount * conversionRate;
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Booking ID: ${booking.booking_id}`,
                },
                unit_amount: Math.round(totalAmountInUsd * 100), // Convert to cents
            },
            quantity: 1,
        }];
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${FRONTEND_URL}/user-bookings/${booking.user_id}`,
            cancel_url: `${FRONTEND_URL}/explore`,
        };
        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);
        // Save payment details to the database
        const paymentDetails = {
            booking_id: booking.booking_id,
            user_id: booking.user_id,
            amount: booking.total_amount,
            payment_date: new Date(),
            payment_method: 'card',
            transaction_id: session.id,
        };
        const createPayments = await createPayment(paymentDetails);
 
        return c.json({ id: session.id,  createPayments }, 200);
 
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
};





export const handleStripeWebhook = async (c: Context) => {
  const sig = c.req.header('stripe-signature');
  const rawBody = await c.req.text();
  if (!sig) {
      console.error('Webhook Error: No stripe-signature header value was provided.');
      return c.text('Webhook Error: No stripe-signature header value was provided.', 400);
  }
  let event: Stripe.Event;
  try {
      event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
      return c.text(`Webhook Error: ${err.message}`, 400);
  }

  // Handle the event
  switch (event.type) {
      case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          // Update payment status in the database
          try {
              const session_id = session.id;
              const updateStatus = await updatePaymentBySessionId(session_id);
              return c.json({ payment: updateStatus }, 200);
          } catch (err: any) {
              return c.text(`Database Error: ${err.message}`, 500);
          }

      // Handle other event types as needed
      default:
          return c.text(`Unhandled event type ${event.type}`, 400);
  }
};

export default handleStripeWebhook;