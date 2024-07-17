import {
    getAllReports,
    getReportById,
    addReport,
    deleteReport,
    updateReport,
    searchReport,
    reportExists,
  } from "./report-services";
  
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


  // Specific controllers for report operations
  export const getAllReportsController = getAllController(getAllReports);
  export const getReportController = getSpecificsController(getReportById);
  export const createReportController = createControllerWithDates(addReport,['generated_at']);
  export const updateReportController = updateControllerWithDates(reportExists,updateReport,['generated_at']);
  export const deleteReportController = deleteController(reportExists, deleteReport);
  export const searchReportController = searchController(searchReport);
  