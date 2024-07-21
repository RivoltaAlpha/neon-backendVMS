import { Hono } from "hono";
import {
  getAllPaymentsController,
  getPaymentController,
  createPaymentController,
  deletePaymentController,
  updatePaymentController,
  searchPaymentController,
  checkoutBooking,
  getUserPaymentController,
  fetchUserPayments,
} from "./p-controller";

import { authenticateAdmin, authenticateBoth } from "../middleware/auth";


export const paymentRouter = new Hono();

paymentRouter.get("/payments",authenticateBoth, getAllPaymentsController);
paymentRouter.get("/payment/:id", authenticateBoth, getPaymentController);
paymentRouter.post("/payment", authenticateBoth, createPaymentController);
paymentRouter.delete("/delete-payment/:id", authenticateBoth, deletePaymentController);
paymentRouter.put("/update-payment/:id",authenticateBoth, updatePaymentController);
paymentRouter.get("/search-payment/:id",authenticateBoth, searchPaymentController);
paymentRouter.get("/user-payments",authenticateBoth, fetchUserPayments);
paymentRouter.get("/userPayments/:id",authenticateBoth, getUserPaymentController);
paymentRouter.post("/payment-checkout/:booking_id", checkoutBooking);

export default paymentRouter;

