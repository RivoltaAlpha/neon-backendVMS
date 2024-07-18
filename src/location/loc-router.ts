import { Hono } from "hono";
import {
  getAllLocationsController,
  getLocationController,
  createLocationController,
  deleteLocationController,
  updateLocationController,
  searchLocationController,
} from "./location-controller";

export const locationRouter = new Hono();
import { authenticateAdmin, authenticateBoth } from "../middleware/auth";


locationRouter.get("/locations",authenticateBoth, getAllLocationsController);
locationRouter.get("/location/:id",authenticateAdmin, getLocationController);
locationRouter.post("/location", authenticateAdmin,createLocationController);
locationRouter.delete("/delete-location/:id",authenticateAdmin, deleteLocationController);
locationRouter.put("/update-location/:id",authenticateAdmin, updateLocationController);
locationRouter.get("/search-location/:id",authenticateAdmin, searchLocationController);

export default locationRouter;
