import { Hono } from "hono";
import { authenticateAdmin, authenticateBoth } from "../middleware/auth";

import {
  getAllBookingsController,
  getBookingController,
  createBookingController,
  deleteBookingController,
  updateBookingController,
  searchBookingController,
  getUserBookingsController,
} from "./booking-controller";

export const bookingRouter = new Hono();

bookingRouter.get("/bookings", authenticateBoth, getAllBookingsController);
bookingRouter.get("/booking/:id", authenticateBoth, getBookingController);
bookingRouter.post("/create-booking", authenticateBoth, createBookingController);
bookingRouter.delete("/delete-booking/:id", authenticateBoth, deleteBookingController);
bookingRouter.put("update-booking/:id", authenticateBoth, updateBookingController);
bookingRouter.get("/search-booking/:id", authenticateBoth, searchBookingController);
bookingRouter.get("/user-bookings/:id", authenticateBoth, getUserBookingsController);


export default bookingRouter;

