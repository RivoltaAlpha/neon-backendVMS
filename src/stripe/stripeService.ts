// import Stripe from 'stripe';
// import { env } from '../env';



// // const stripe = require('stripe')('your_secret_key_here');
// const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
//   apiVersion: '2024-06-20', // Use the latest API version
// });

// export async function createPaymentIntent(amount: number, booking_id: number) {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency: 'usd',
//       metadata: {
//         bookingId: booking_id.toString(),
//         payment_method: 'card',
//       },
//     });
    
//     return paymentIntent;
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     throw error;
//   }
// }

// export async function handleWebhook(payload: string, signature: string) {
//   try {
//     const event = stripe.webhooks.constructEvent(
//       payload,
//       signature,
//       env.STRIPE_WEBHOOK_SECRET as string
//     );

//     switch (event.type) {
//       case 'payment_intent.succeeded':
//         await handleSuccessfulPayment(event.data.object as Stripe.PaymentIntent);
//         break;
//       case 'payment_intent.payment_failed':
//         await handleFailedPayment(event.data.object as Stripe.PaymentIntent);
//         break;
//     }

//     return { received: true };
//   } catch (err) {
//     console.error('Error processing webhook:', err);
//     throw err;
//   }
// }

// async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
//   const bookingId = parseInt(paymentIntent.metadata.bookingId);
//   await updateBookingStatus(bookingId, 'success');
// }

// async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
//   const bookingId = parseInt(paymentIntent.metadata.bookingId);
//   await updateBookingStatus(bookingId, 'failed');
// }




