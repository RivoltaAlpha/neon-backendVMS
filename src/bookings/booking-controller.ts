import {
    getAllBookings,
    getBookingById,
    createBooking,
    deleteBooking,
    updateBooking,
    searchBooking,
    bookingExists,  
    getUserBookings, 
    getUsersBookings
  } from "./booking-services";

  import {
    getAllController,
    getSpecificsController,
    deleteController,
    searchController,
  } from "../generics/gen-controller";
  
import {
    updateControllerWithDates,
    createControllerWithDates
} from '../generics/timeGen';

  // Specific controllers for booking operations
  export const getAllBookingsController = getAllController(getAllBookings);
  export const getBookingController = getSpecificsController(getBookingById);
  export const createBookingController = createControllerWithDates(createBooking,['booking_date', 'return_date']);
  export const updateBookingController = updateControllerWithDates(bookingExists,updateBooking,['booking_date', 'return_date']);
  export const deleteBookingController = deleteController(bookingExists, deleteBooking);
  export const searchBookingController = searchController(searchBooking);
  // controller.ts

//get user bookings
export const getUserBookingsController = getSpecificsController(getUserBookings);
export const getUsersBookingsController = getSpecificsController(getUsersBookings);