import { Context } from "hono";
import "dotenv/config";
import { authenticationService, loginAuthService } from "./auth.services";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { sendWelcomeEmail } from "../emailing/email";
import { compare } from "bcrypt";
import { Console } from "console";

export const registerUser = async (c: Context) => {
  try {
    const user = await c.req.json();
    console.log('Received user data:', user); 

    if (!user.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await authenticationService(user);
    if (!createdUser) return c.text("User not created😭😭", 404);

    if (!user.email) {
      throw new Error("Email field is missing in the user data");
    }

    const subject = "Welcome to Our Vehicle Rental Management System";
    const html = `
    <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 5px;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 3px;
            transition: background-color 0.3s ease;
          }
          .btn:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <p>Hello, ${user.username}</p>
          <p>Thank you for registering with our Vehicle Rental Management System!</p>
          <p>Welcome to our system!</p>
          <p>We help you manage your rentals.</p>

          <img src="https://wallpapercave.com/wp/wp2038248.jpg" alt="Image" style="max-width: 100%; height: auto;">
          <a class="btn" href="https://restaurantsapi1.azurewebsites.net/api">Visit our Website</a>
        </div>
      </body>
    </html>
  `;

    await sendWelcomeEmail(user.email, subject, html);

    return c.json({ msg: "User registered successfully", user: createdUser }, 201);
  } catch (error: any) {
    console.error('Error during registration:', error);
    return c.json({ error: error?.message }, 500);
  }
};

export const loginUser = async (c: Context) => {
  try {
    const user = await c.req.json();
    console.log('Received user data for login:', user); // Debugging step

    const foundUser = await loginAuthService(user);
    if (!foundUser) return c.text("User not found😏", 404);

    const isValid = await compare(user.password, foundUser?.password as string);
    console.log ("isValid:", isValid);
    if (!isValid) {
      return c.json({ error: "Invalid credentials😏" }, 401);
    } else {
      // create payload
      const payload = {
        sub: foundUser?.username,
        role: foundUser?.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 180,
      };
      let secret = process.env.JWT_SECRET as string;
      const token = await sign(payload, secret);
      let user = foundUser?.user;
      let role = foundUser?.role;
      return c.json({ token, user: { role, ...user } }, 200); // return token and user details
    }
  } catch (error: any) {
    console.error('Error during login:', error);
    return c.json({ error: error?.message }, 400);
  }
};
