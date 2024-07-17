import { Hono } from "hono";
import {
  getAllFleetRecordsController,
  getFleetRecordController,
  createFleetRecordController,
  deleteFleetRecordController,
  updateFleetRecordController,
  searchFleetRecordController,
} from "./fm-controller";

export const fleetManagementRouter = new Hono();

fleetManagementRouter.get("/fleet-records", getAllFleetRecordsController);
fleetManagementRouter.get("/fleet-record/:id", getFleetRecordController);
fleetManagementRouter.post("/fleet-record", createFleetRecordController);
fleetManagementRouter.delete("/delete-fleet-record/:id", deleteFleetRecordController);
fleetManagementRouter.put("/update-fleet-record/:id", updateFleetRecordController);
fleetManagementRouter.get("/search-fleet-record/:id", searchFleetRecordController);

export default fleetManagementRouter;
