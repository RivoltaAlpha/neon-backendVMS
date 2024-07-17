import { Hono } from "hono";
import {
  getAllPaymentsController,
  getPaymentController,
  createPaymentController,
  deletePaymentController,
  updatePaymentController,
  searchPaymentController,
} from "./p-controller";

export const paymentRouter = new Hono();

paymentRouter.get("/payments", getAllPaymentsController);
paymentRouter.get("/payment/:id", getPaymentController);
paymentRouter.post("/payment", createPaymentController);
paymentRouter.delete("/delete-payment/:id", deletePaymentController);
paymentRouter.put("/update-payment/:id", updatePaymentController);
paymentRouter.get("/search-payment/:id", searchPaymentController);

export default paymentRouter;
