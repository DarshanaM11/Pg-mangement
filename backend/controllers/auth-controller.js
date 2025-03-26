const User = require("../models/user-model");
const bcrypt = require("bcrypt");


// home logic

const home = async (req, res) => {
    try {
        res.status(200).send('This is home page');
    } catch (error) {
        console.log(error);

    }
}

// register logic

const register = async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body
        const userExist = await User.findOne({ email });
        const validRoles = ["user", "owner"];
        if (!validRoles.includes(role.toLowerCase())) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }


        const userCreated = await User.create({ username, email, phone, password, role })
        res.status(201).json(
            {
                // msg: userCreated,
                msg: "Registration Successfull!!",
                token: await userCreated.generateToken(),
                userId: userCreated._id.toString()
            }
        );
    }
    catch (error) {
        console.log(error)
    }
}

//login logic
const login = async (req, res) => {
    try {
        const { email, password,role } = req.body;
        const userExist = await User.findOne({ email });
        console.log("password", password)


        const validRoles = ["user", "owner"];
        if (!validRoles.includes(role.toLowerCase())) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const user = await userExist.comparePassword(password);
        console.log("user", user)

        if (user) {
            res.status(200).json(
                {
                    msg: "Login Successfull!!",
                    token: await userExist.generateToken(),
                    userId: userExist._id.toString()
                }
            );
        }
        else {
            res.status(401).json(
                {
                    message: "Invalid Email or Password",
                }
            )
        }

    } catch (error) {
        console.error(error)
    }
}

module.exports = { home, register, login };