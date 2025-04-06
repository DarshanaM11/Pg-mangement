const { z } = require("zod");

const signUpSchema = z.object({
    username: z
        .string({ required_error: "Name is required." })
        .trim()
        .min(3, { message: "Name must be at least of 3 characters." })
        .max(255, { message: "Name must not be more than 255 characters." }),
    email: z
        .string({ required_error: "Email is required." })
        .trim()
        .email({ message: "Invalid Email" })
        .min(3, { message: "Email must be at least of 3 characters." })
        .max(50, { message: "Email must not be more than 50 characters." }),
    phone: z
        .string({ required_error: "Phone number is required." })
        .trim()
        .min(10, { message: "Phone number must be at least of 10 characters." })
        .max(20, { message: "Phone number must not be more than 20 characters." }),
    password: z
        .string({ required_error: "Password is required." })
        .trim()
        .min(6, { message: "Password must be at least of 6 characters." })
        .max(50, { message: "Password must not be more than 50 characters." }),
    role: z
        .string({ required_error: "Role is required." })
        .trim()
})
// Login Schema
const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required." })
        .trim()
        .email({ message: "Invalid Email" })
        .min(3, { message: "Email must be at least of 3 characters." })
        .max(50, { message: "Email must not be more than 50 characters." }),
    password: z
        .string({ required_error: "Password is required." })
        .trim()
        .min(6, { message: "Password must be at least of 6 characters." })
        .max(50, { message: "Password must not be more than 50 characters." }),
});

module.exports = { signUpSchema, loginSchema };