import { Hono } from "hono";
import {
  getAllVehiclesController,
  getVehicleController,
  createVehicleController,
  deleteVehicleController,
  updateVehicleController,
  searchVehicleController,
} from "./vehicle-controller";
import { authenticateAdmin, authenticateBoth } from "../middleware/auth";

export const vehicleRouter = new Hono();

vehicleRouter.get("vehicles",  getAllVehiclesController);
vehicleRouter.get("/vehicle/:id", authenticateBoth, getVehicleController);
vehicleRouter.post("/vehicle", authenticateAdmin, createVehicleController);
vehicleRouter.delete("/delete-vehicle/:id", authenticateAdmin, deleteVehicleController);
vehicleRouter.put("/update-vehicle/:id", authenticateAdmin, updateVehicleController);
vehicleRouter.get("/search-vehicle/:id", authenticateBoth, searchVehicleController);

export default vehicleRouter;
