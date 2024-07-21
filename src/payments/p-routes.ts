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

import { authenticateAdmin, } from "../middleware/auth";


export const paymentRouter = new Hono();

paymentRouter.get("/payments", getAllPaymentsController);
paymentRouter.get("/payment/:id",  getPaymentController);
paymentRouter.post("/payment",  createPaymentController);
paymentRouter.delete("/delete-payment/:id",  deletePaymentController);
paymentRouter.put("/update-payment/:id", updatePaymentController);
paymentRouter.get("/search-payment/:id", searchPaymentController);
paymentRouter.get("/user-payments", fetchUserPayments);
paymentRouter.get("/userPayments/:id", getUserPaymentController);
paymentRouter.post("/payment-checkout/:booking_id", checkoutBooking);

export default paymentRouter;

