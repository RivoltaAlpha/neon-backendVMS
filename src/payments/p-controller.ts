import { getAllPayments, getPaymentById, createPayment, deletePayment, updatePayment, searchPayment, paymentExists, updatePaymentBySessionId, updateBookingStatus, getPaymentsByUserId, updateVehicleAvailabilityByBookingId,} from "./payment-services";
import { getAllController, getSpecificsController, deleteController, searchController, updateController } from "../generics/gen-controller";

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
  export const getUserPaymentController = getSpecificsController(getPaymentsByUserId);
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
            success_url: `${FRONTEND_URL}/users/thankyou`,
            cancel_url: `${FRONTEND_URL}/explore`,
            metadata: {
                booking_id: booking.booking_id.toString(),
                user_id: booking.user_id.toString(),
                total_amount: booking.total_amount.toString(),
            },
        };
        console.log('sessionParams', sessionParams);

        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);

        return c.json({ id: session.id }, 200);
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
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

  switch (event.type) {
case 'checkout.session.completed':
  const session = event.data.object as Stripe.Checkout.Session;
  console.log('Checkout session completed:', session);
  try {
    const session_id = session.id;
    const booking_id = session.metadata?.booking_id;
    const user_id = session.metadata?.user_id;
    const total_amount = session.metadata?.total_amount;

    console.log('Webhook received:', { 
      event_type: event.type, 
      session_id, 
      booking_id, 
      user_id,
      total_amount,
      metadata: session.metadata 
    });

    if (!booking_id || !user_id || !total_amount) {
      console.error('Missing required metadata');
      return c.text('Missing required metadata', 400);
    }
    console.log('Creating payment record...');
    const paymentDetails = {
      booking_id: Number(booking_id),
      user_id: Number(user_id),
      amount: total_amount.toString(),
      payment_date: new Date(),
      payment_method: 'card',
      transaction_id: session_id,
    };
    const createPaymentResult = await createPayment(paymentDetails);
    console.log('Payment record created:', createPaymentResult);

    console.log('Updating booking status...');
    const updateBooking = await updateBookingStatus(Number(booking_id));
    console.log('Booking status updated:', updateBooking);

    console.log('Updating vehicle availability...');
    const updateVehicle = await updateVehicleAvailabilityByBookingId(Number(booking_id));
    console.log('Vehicle availability updated:', updateVehicle);

    return c.json({ 
      payment: createPaymentResult, 
      booking: updateBooking, 
      vehicle: updateVehicle 
    }, 200);
    
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    return c.text(`Error processing webhook: ${err.message}`, 500);
  } default:
     return c.text(`Unhandled event type ${event.type}`, 400);
  }
};


export const fetchUserPayments = async (c: Context) => {
  try {
    const user_id = parseInt(c.req.param('user_id'), 10);
    if (isNaN (user_id)) {
      return c.text('Invalid user ID', 400);
    }

    const payments = await getPaymentsByUserId(user_id);
    return c.json({ payments }, 200);
  } catch (error) {
    return c.text('Failed to fetch payments', 500);
  }
};

export default handleStripeWebhook;



















































































































//   export const checkoutBooking = async (c: Context) => {
//     let booking;
//     try {
//         booking = await c.req.json();
//     } catch (error) {
//         return c.text("Invalid request body", 400);
//     }
//     try {
//         if (!booking.booking_id || !booking.total_amount) {
//             return c.text("Missing Booking ID or total amount", 400);
//         }
 
//         const conversionRate = 0.007;
//         const totalAmountInUsd = booking.total_amount * conversionRate;
//         const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
//             price_data: {
//                 currency: 'usd',
//                 product_data: {
//                     name: `Booking ID: ${booking.booking_id}`,
//                 },
//                 unit_amount: Math.round(totalAmountInUsd * 100), // Convert to cents
//             },
//             quantity: 1,
//         }];
//         const sessionParams: Stripe.Checkout.SessionCreateParams = {
//             payment_method_types: ['card'],
//             line_items,
//             mode: 'payment',
//             success_url: `${FRONTEND_URL}/thankyou`,
//             cancel_url: `${FRONTEND_URL}/explore`,
//             metadata: {
//                 booking_id: booking.booking_id.toString(),
//                 total_amount: booking.total_amount.toString(),
//             },
//         };
//         console.log('sessionParams', sessionParams);

//         const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);
//         // Save payment details to the database
//         const paymentDetails = {
//             booking_id: booking.booking_id,
//             user_id: booking.user_id,
//             amount: booking.total_amount,
//             payment_date: new Date(),
//             payment_method: 'card',
//             transaction_id: session.id,
//         };

//         const createPayments = await createPayment(paymentDetails);

//         if (!createPayments) {
//             return c.text("Error creating payment", 500);
//         } 
//         // else {
//         //     try{
//         //         const updateBooking = await updateBookingStatus(booking.booking_id);
//         //         const updateVehicle = await updateVehicleAvailabilityByBookingId(booking.booking_id);
    
//         //         console.log({  updateBooking, updateVehicle });
//         //     } catch (error) {
//         //         console.log(error);
//         //     };
//         // }

//         return c.json({ id: session.id, createPayments }, 200);
//     } catch (error: any) {
//         return c.text(error?.message, 400);
//     }
// };


// export const handleStripeWebhook = async (c: Context) => {
//   const sig = c.req.header('stripe-signature');
//   const rawBody = await c.req.text();
//   if (!sig) {
//       console.error('Webhook Error: No stripe-signature header value was provided.');
//       return c.text('Webhook Error: No stripe-signature header value was provided.', 400);
//   }
//   let event: Stripe.Event;
//   try {
//       event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
//   } catch (err: any) {
//       return c.text(`Webhook Error: ${err.message}`, 400);
//   }

//   switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object as Stripe.Checkout.Session;
//       console.log('Checkout session completed:', session);
//       try {
//         const session_id = session.id;
//         const booking_id = session.metadata?.booking_id;

//         console.log('Webhook received:', { 
//           event_type: event.type, 
//           session_id, 
//           booking_id, 
//           metadata: session.metadata 
//         });

//         if (!booking_id) {
//           console.error('Booking ID not found in session metadata');
//           return c.text('Booking ID not found in session metadata', 400);
//         }

//         console.log('Updating payment status...');
//         const updatePaymentStatus = await updatePaymentBySessionId(session_id);
//         console.log('Payment status updated:', updatePaymentStatus);

//         console.log('Updating booking status...');
//         const updateBooking = await updateBookingStatus(Number(booking_id));
//         console.log('Booking status updated:', updateBooking);

//         console.log('Updating vehicle availability...');
//         const updateVehicle = await updateVehicleAvailabilityByBookingId(Number(booking_id));
//         console.log('Vehicle availability updated:', updateVehicle);

//         return c.json({ 
//           payment: updatePaymentStatus, 
//           booking: updateBooking, 
//           vehicle: updateVehicle 
//         }, 200);

//       } catch (err: any) {
//         console.error('Error processing webhook:', err);
//         return c.text(`Error processing webhook: ${err.message}`, 500);
//       }
//       default:
//           return c.text(`Unhandled event type ${event.type}`, 400);
//   }
// };


// export const fetchUserPayments = async (c: Context) => {
//   try {
//     const user_id = parseInt(c.req.param('user_id'), 10);
//     if (isNaN (user_id)) {
//       return c.text('Invalid user ID', 400);
//     }

//     const payments = await getPaymentsByUserId(user_id);
//     return c.json({ payments }, 200);
//   } catch (error) {
//     return c.text('Failed to fetch payments', 500);
//   }
// };

// export default handleStripeWebhook;