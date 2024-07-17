// import { Context } from 'hono';
// import { createPaymentIntent, confirmPayment,handleWebhook } from './stripeService';
// import  db  from '../drizzle/db';
// import { bookings } from '../drizzle/schema'; 

// export async function createPaymentIntentController(c: Context) {
//   try {
//     const { amount, bookingId } = await c.req.json();
//     const paymentIntent = await createPaymentIntent(amount, bookingId);
//     return c.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error in createPaymentIntent controller:', error);
//     return c.json({ error: error.message }, 500);
//   }
// }

// export async function handleWebhookController(c: Context) {
//   try {
//     const payload = await c.req.raw.arrayBuffer();
//     const payloadString = new TextDecoder().decode(payload);
//     const signature = c.req.header('stripe-signature');

//     const result = await handleWebhook(payloadString, signature);
//     return c.json(result);
//   } catch (error) {
//     console.error('Error in handleWebhook controller:', error);
//     return c.json({ error: error.message }, 400);
//   }
// }

// export const confirmPaymentController = async (c: Context) => {
//   try {
//     const { paymentIntentId, bookingData } = await c.req.json();
//     const paymentIntent = await confirmPayment(paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       // Create booking in database
//       const newBooking = await db.insert(bookings).values({
//         ...bookingData,
//         booking_status: 'Confirmed',
//         total_amount: paymentIntent.amount / 100, // Convert back to dollars
//       }).returning();

//       return c.json({ success: true, booking: newBooking[0] });
//     } else {
//       return c.json({ success: false, message: 'Payment not succeeded' }, 400);
//     }
//   } catch (error) {
//     console.error('Error in confirmPaymentController:', error);
//     return c.json({ error: 'Failed to confirm payment' }, 500);
//   }
// };

