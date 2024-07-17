import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  searchUser,
  userExists,
} from "./users-services";

import {
  getAllController,
  getSpecificsController,
  createController,
  deleteController,
  updateController,
  searchController,
} from "../generics/gen-controller";

// Specific controllers for user operations
export const getAllUsersController = getAllController(getAllUsers);
export const getUserController = getSpecificsController(getUserById);
export const createUserController = createController(createUser);
export const deleteUserController = deleteController(userExists, deleteUser);
export const updateUserController = updateController(userExists, updateUser);
export const searchUserController = searchController(searchUser);
