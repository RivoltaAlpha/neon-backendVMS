import { Hono } from "hono";
import {
  getAllTicketsController,
  getTicketController,
  createTicketController,
  deleteTicketController,
  updateTicketController,
  searchTicketController,
} from "./ticket-controller";

export const ticketRouter = new Hono();
import { authenticateAdmin, authenticateBoth, authenticateUser } from "../middleware/auth";


ticketRouter.get("/tickets",authenticateBoth, getAllTicketsController);
ticketRouter.get("/ticket/:id",authenticateBoth, getTicketController);
ticketRouter.post("/ticket",authenticateUser, createTicketController);
ticketRouter.delete("/delete-ticket/:id",authenticateUser, deleteTicketController);
ticketRouter.put("/update-ticket/:id",authenticateAdmin, updateTicketController);
ticketRouter.get("/search-ticket/:id",authenticateUser, searchTicketController);

export default ticketRouter;
