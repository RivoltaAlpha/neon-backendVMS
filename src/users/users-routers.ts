import { Hono } from "hono";
import { authenticateAdmin, authenticateBoth } from "../middleware/auth";
import {
  getAllUsersController,
  getUserController,
  createUserController,
  deleteUserController,
  updateUserController,
  searchUserController,
} from "./users-controller";

export const userRouter = new Hono();

userRouter.get("users", authenticateBoth, getAllUsersController);

userRouter.get("user/:id", authenticateBoth, getUserController);

userRouter.post("user",authenticateBoth, createUserController);

userRouter.delete("delete-user/:id", authenticateBoth,  deleteUserController);

userRouter.put("update-user/:id", authenticateBoth,updateUserController);

userRouter.get("/search-user/:id", authenticateBoth, searchUserController);

export default userRouter;
