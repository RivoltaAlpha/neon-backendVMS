import {
    getAllLocations,
    getLocationById,
    createLocation,
    deleteLocation,
    updateLocation,
    searchLocation,
    locationExists,
  } from "./locationc-services";
  
  import {
    getAllController,
    getSpecificsController,
    createController,
    deleteController,
    updateController,
    searchController,
  } from "../generics/gen-controller";
  
  // Specific controllers for location operations
  export const getAllLocationsController = getAllController(getAllLocations);
  export const getLocationController = getSpecificsController(getLocationById);
  export const createLocationController = createController(createLocation);
  export const deleteLocationController = deleteController(locationExists, deleteLocation);
  export const updateLocationController = updateController(locationExists, updateLocation);
  export const searchLocationController = searchController(searchLocation);
  