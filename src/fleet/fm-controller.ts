import {
    getAllFleetRecords,
    getFleetRecordById,
    createFleetRecord,
    deleteFleetRecord,
    updateFleetRecord,
    searchFleetRecord,
    fleetRecordExists,
  } from "./fm-services";
  
  import {
    getAllController,
    getSpecificsController,
    createController,
    deleteController,
    updateController,
    searchController,
  } from "../generics/gen-controller";
  
  import {
    updateControllerWithDates,
    createControllerWithDates
} from '../generics/timeGen';



  // Specific controllers for fleet management operations
  export const getAllFleetRecordsController = getAllController(getAllFleetRecords);
  export const getFleetRecordController = getSpecificsController(getFleetRecordById);
  export const createFleetRecordController = createControllerWithDates(createFleetRecord,['acquisition_date']);
  export const updateFleetRecordController = updateControllerWithDates(fleetRecordExists,updateFleetRecord,['acquisition_date']);
  export const deleteFleetRecordController = deleteController(fleetRecordExists, deleteFleetRecord);
  export const searchFleetRecordController = searchController(searchFleetRecord);
  