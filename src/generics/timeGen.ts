import { Context } from "hono";
import { convertDates } from "./gen-controller";
import { createController, updateController, ExistsServices } from "./gen-controller";

// Generic create controller
export const createControllerWithDates = <T>(service: createController<T>, dateFields: (keyof T)[]) =>
    async (c: Context): Promise<Response> => {
        const entity = await c.req.json();
        console.log(entity);
        try {
            const convertedEntity = convertDates(entity, dateFields);
            const res = await service(convertedEntity, c);
            if (!res) return c.text('Not created', 400);
            return c.json({ message: res }, 201);
        }
        catch (error) {
            console.error('Error creating entity:', error);
            return c.text('Internal Server Error', 500);
        }
    };

// Generic update controller
export const updateControllerWithDates = <T>(existsService: ExistsServices, service: updateController<T>, dateFields: (keyof T)[]) =>
    async (c: Context): Promise<Response> => {
        const id = parseInt(c.req.param('id'));
try {
        if (isNaN(id)) 
            return c.text('Invalid ID', 400);

        const exists = await existsService(id, c);
        if (!exists) 
            return c.text('Entity not found', 404);
        const entity = await c.req.json();
        const convertedEntity = convertDates(entity, dateFields);
        const res = await service(id, convertedEntity, c);
        if (!res) return c.text('Not updated', 400);
        return c.json({ message: res }, 200);
    } catch (error) {
        console.error('Error updating entity:', error);
        return c.text('Internal Server Error', 500);
    }
}