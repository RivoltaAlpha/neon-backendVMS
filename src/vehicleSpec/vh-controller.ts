import {
    getAllSpecifications,
    getSpecificationById,
    createSpecification,
    deleteSpecification,
    updateSpecification,
    searchSpecification,
    specificationExists,
  } from "./vh-spec";
  
  import {
    getAllController,
    getSpecificsController,
    createController,
    deleteController,
    updateController,
    searchController,
  } from "../generics/gen-controller";
  
  // Specific controllers for specification operations
  export const getAllSpecificationsController = getAllController(getAllSpecifications);
  export const getSpecificationController = getSpecificsController(getSpecificationById);
  export const createSpecificationController = createController(createSpecification);
  export const deleteSpecificationController = deleteController(specificationExists, deleteSpecification);
  export const updateSpecificationController = updateController(specificationExists, updateSpecification);
  export const searchSpecificationController = searchController(searchSpecification);
  