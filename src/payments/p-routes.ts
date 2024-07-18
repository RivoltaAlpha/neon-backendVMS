import { Hono } from "hono";
import {
  getAllPaymentsController,
  getPaymentController,
  createPaymentController,
  deletePaymentController,
  updatePaymentController,
  searchPaymentController,
  checkoutBooking,
  fetchUserPayments,
} from "./p-controller";

export const paymentRouter = new Hono();

paymentRouter.get("/payments", getAllPaymentsController);
paymentRouter.get("/payment/:id", getPaymentController);
paymentRouter.post("/payment", createPaymentController);
paymentRouter.delete("/delete-payment/:id", deletePaymentController);
paymentRouter.put("/update-payment/:id", updatePaymentController);
paymentRouter.get("/search-payment/:id", searchPaymentController);
paymentRouter.get("/user-payments", fetchUserPayments);
paymentRouter.post("/payment-checkout/:booking_id", checkoutBooking);

export default paymentRouter;

