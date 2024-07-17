import {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    deleteVehicle,
    updateVehicle,
    searchVehicle,
    vehicleExists,
  } from "./vehicle-services";
  
  import {
    getAllController,
    getSpecificsController,
    createController,
    deleteController,
    updateController,
    searchController,
  } from "../generics/gen-controller";
  
  // Specific controllers for vehicle operations
  export const getAllVehiclesController = getAllController(getAllVehicles);
  export const getVehicleController = getSpecificsController(getVehicleById);
  export const createVehicleController = createController(createVehicle);
  export const deleteVehicleController = deleteController(vehicleExists, deleteVehicle);
  export const updateVehicleController = updateController(vehicleExists, updateVehicle);
  export const searchVehicleController = searchController(searchVehicle);
  