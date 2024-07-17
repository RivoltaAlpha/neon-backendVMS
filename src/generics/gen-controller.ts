import { Context } from "hono";

export interface getAllGeneric<T> {
  (c: Context): Promise<T[]>;
}

export interface getSpecificsController<T> {
  (id: number, c: Context): Promise<T | undefined>;
}

export interface createController<T> {
  (data: T, c: Context): Promise<T | undefined>;
}

export interface updateController<T> {
  (id: number, data: T, c: Context): Promise<T | undefined>;
}

export interface ExistsServices {
  (id: number, c: Context): Promise<boolean>;
}

export interface deleteController {
  (id: number, c: Context): Promise<string>;
}
export interface searchGeneric<T> {
    (id: number, c: Context): Promise<T | undefined>;
  }
export const getAllController =<T>(service: getAllGeneric<T>) => async (c: Context) => {
    try {
      const generic = await service(c);
      console.log(service);
      if (generic === undefined) {
        {
          return c.text("No generics found", 404);
        }
      }
      return c.json(generic);
    } catch (error) {
      console.error("Error fetching all generics:", error);
      c.text("Internal Server Error", 500);
    }
  };

export const getSpecificsController =<T>(service: getSpecificsController<T>) => async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    console.log(id);
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const generic = await service(id, c);

    try {
      if (generic === undefined) {
        {
          return c.text("No generics found", 404);
        }
      }
      return c.json(generic);
    } catch (error) {
      console.error(`Error fetching generic with ID ${id}:`, error);
      c.text("Internal Server Error", 500);
    }
  };

export const createController = <T>(service: (data: T, c: Context) => Promise<T>) => async (c: Context) => {
    const data = await c.req.json();
    try {
      const createdEntity = await service(data, c);
      if (createdEntity !== undefined) {
        return c.json(createdEntity as [T], 201);
      }       
    } catch (error) {
      console.error("Error creating entity:", error);
      return c.text("Internal Server Error", 500);
    }
  };

  export const deleteController =<T>(exists: ExistsServices, service: deleteController) =>  async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid ID", 400);
    }

    try {
      const entity = await exists(id, c);
      if (!entity) {
        return c.text("not found", 404);
      }

      const deleted = await service(id, c);
      if (!deleted) {
        return c.text("Failed to delete", 500);
      }

      return c.json({ message: deleted }, 200);
    } catch (error) {
      console.error(`Error deleting entity with ID ${id}:`, error);
      return c.text("Internal Server Error", 500);
    }
  };

export const updateController = <T>(exists: ExistsServices, service: updateController<T>) =>  async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid ID", 400);
    }

    try {
      const data = await c.req.json();
      const entity = await exists(id, c);
      if (!entity) {
        return c.text("Entity not found", 404);
      }

      const updatedEntity = await service(id, data, c);
      if (!updatedEntity) {
        return c.text("Failed to update entity", 500);
      }

      return c.json(updatedEntity);
    } catch (error) {
      console.error(`Error updating entity with ID ${id}:`, error);
      return c.text("Internal Server Error", 500);
    }
  };

  export const searchController =<T>(service: searchGeneric<T>) => async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
      const entity = await service(id, c);
      if (entity === undefined) {
        return c.text("Entity not found", 404);
      }
      return c.json(entity, 200);
    } catch (error) {
      console.error(`Error searching entity with ID ${id}:`, error);
      c.text("Internal Server Error", 500);
    }
  };

  export function convertDates<T extends Record<string, any>>(entity: T, dateFields: (keyof T)[]): T { 
    const convertedEntity = { ...entity };
    dateFields.forEach(field => {
      if (convertedEntity[field]) {
        convertedEntity[field] = new Date(convertedEntity[field]) as any;
      }
    });
    return convertedEntity;
  }