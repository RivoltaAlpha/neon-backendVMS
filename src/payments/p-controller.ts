import {
    getAllPayments,
    getPaymentById,
    createPayment,
    deletePayment,
    updatePayment,
    searchPayment,
    paymentExists,
  } from "./payment-services";
  
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
  
  // Specific controllers for payment operations
  export const getAllPaymentsController = getAllController(getAllPayments);
  export const getPaymentController = getSpecificsController(getPaymentById);
  export const createPaymentController = createControllerWithDates(createPayment,['payment_date']);
  export const updatePaymentController = updateControllerWithDates(paymentExists,updatePayment,['payment_date']);
  export const deletePaymentController = deleteController(paymentExists, deletePayment);
  export const searchPaymentController = searchController(searchPayment);
  