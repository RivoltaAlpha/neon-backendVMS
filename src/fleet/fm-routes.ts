import { Hono } from "hono";
import {
  getAllFleetRecordsController,
  getFleetRecordController,
  createFleetRecordController,
  deleteFleetRecordController,
  updateFleetRecordController,
  searchFleetRecordController,
} from "./fm-controller";

import { authenticateAdmin, authenticateBoth } from "../middleware/auth";


export const fleetManagementRouter = new Hono();

fleetManagementRouter.get("/fleet-records",authenticateBoth, getAllFleetRecordsController);
fleetManagementRouter.get("/fleet-record/:id",authenticateAdmin, getFleetRecordController);
fleetManagementRouter.post("/fleet-record",authenticateAdmin, createFleetRecordController);
fleetManagementRouter.delete("/delete-fleet-record/:id",authenticateAdmin, deleteFleetRecordController);
fleetManagementRouter.put("/update-fleet-record/:id",authenticateAdmin, updateFleetRecordController);
fleetManagementRouter.get("/search-fleet-record/:id",authenticateAdmin, searchFleetRecordController);

export default fleetManagementRouter;
