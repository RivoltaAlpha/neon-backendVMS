import {
    getAllTickets,
    getTicketById,
    createTicket,
    deleteTicket,
    updateTicket,
    searchTicket,
    ticketExists,
  } from "./ticket-services";
  
  import {
    getAllController,
    getSpecificsController,
    createController,
    deleteController,
    updateController,
    searchController,
  } from "../generics/gen-controller";
  
  // Specific controllers for ticket operations
  export const getAllTicketsController = getAllController(getAllTickets);
  export const getTicketController = getSpecificsController(getTicketById);
  export const createTicketController = createController(createTicket);
  export const deleteTicketController = deleteController(ticketExists, deleteTicket);
  export const updateTicketController = updateController(ticketExists, updateTicket);
  export const searchTicketController = searchController(searchTicket);
  