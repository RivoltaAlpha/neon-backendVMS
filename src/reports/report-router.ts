import { Hono } from "hono";
import {
  getAllReportsController,
  getReportController,
  createReportController,
  deleteReportController,
  updateReportController,
  searchReportController,
} from "./report-controller";

export const reportRouter = new Hono();

reportRouter.get("/reports", getAllReportsController);
reportRouter.get("/report/:id", getReportController);
reportRouter.post("/report", createReportController);
reportRouter.delete("/delete-report/:id", deleteReportController);
reportRouter.put("/update-report/:id", updateReportController);
reportRouter.get("/search-report/:id", searchReportController);

export default reportRouter;