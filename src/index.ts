import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";
import {cors} from 'hono/cors'
import { trimTrailingSlash } from "hono/trailing-slash";
import { timeout } from "hono/timeout";
import { HTTPException } from "hono/http-exception";
import { prometheus } from "@hono/prometheus";
import {readFile} from "fs/promises";


import { authRouter } from './authentication/auth.router'
import { userRouter } from "./users/users-routers"
import { bookingRouter } from './bookings/booking-routes'
import { fleetManagementRouter } from './fleet/fm-routes'
import { locationRouter } from './location/loc-router'
import { paymentRouter } from './payments/p-routes'
import { reportRouter } from './reports/report-router'
import { ticketRouter } from './tickets/tickets-router'
import { vehicleRouter } from './vehicle/vehicle-router'
import { specificationRouter } from './vehicleSpec/vh-routes'
import handleStripeWebhook from './payments/p-controller';

const app = new Hono();
app.post("/webhook", handleStripeWebhook)



const customTimeoutException = () =>
  new HTTPException(408, {
    message: `Request timeout after waiting for more than 10 seconds`,
  });
const { printMetrics, registerMetrics } = prometheus();

// inbuilt middlewares
app.use(logger()); //logs request and response to the console
app.use(csrf()); //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()); //removes trailing slashes from the request URL
app.use("/", timeout(10000, customTimeoutException));
app.use(cors()) //allows cross-origin requests
//3rd party middlewares
app.use("*", registerMetrics);

//default routes
app.get('/', async (c) => {
  try {
      let html = await readFile('./index.html', 'utf-8');
      return c.html(html);
  } catch (err:any) {
      return c.text(err.message, 500);
  }
});

app.notFound((c) => {
  return c.text("Route Not Found", 404);
});

app.get("/timeout", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000));
  return c.text("data after 5 seconds", 200);
});
app.get("/metrics", printMetrics);

// custom routes
app.route("/auth", authRouter);
app.route("/", userRouter);
app.route("/", bookingRouter);
app.route("/", fleetManagementRouter);
app.route("/", locationRouter);
app.route("/", paymentRouter);
app.route("/", reportRouter);
app.route("/", ticketRouter);
app.route("/", vehicleRouter);
app.route("/", specificationRouter);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 8000),
});
console.log(`Server is running on port ${ process.env.PORT || 8000 }`);
