import { Hono } from "hono";
import {
  getAllSpecificationsController,
  getSpecificationController,
  createSpecificationController,
  deleteSpecificationController,
  updateSpecificationController,
  searchSpecificationController,
} from "./vh-controller";

import { authenticateAdmin, authenticateBoth } from "../middleware/auth";

export const specificationRouter = new Hono();

specificationRouter.get('specifications', authenticateAdmin, getAllSpecificationsController);
specificationRouter.get('specification/:id',authenticateAdmin, getSpecificationController);
specificationRouter.post('specification',authenticateAdmin, createSpecificationController);
specificationRouter.delete('delete-specification/:id',authenticateAdmin, deleteSpecificationController);
specificationRouter.put('update-specification/:id',authenticateAdmin, updateSpecificationController);
specificationRouter.get('search-specification/:id',authenticateBoth, searchSpecificationController);
export default specificationRouter;
