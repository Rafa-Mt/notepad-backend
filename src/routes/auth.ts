import { User, userSchema } from "../models/user";
import { IUser } from "../types";
import { compareSync, hash } from "bcrypt";
import { loginSchema, registerSchema } from "../zodSchemas";
import express from "express";

const router = express.Router();
export default router;
const saltRounds = 8

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) 
        user.password = await hash(user.password, saltRounds);
    
    next();
});

const checkPassword = async (user: {username: string, password: string}) => {
    const { username, password } = user;
    try {
        const foundUser = await User.findOne({ name: username });

        if (!foundUser) throw new Error('Name of user is not correct'); 

        const isMatch = compareSync(password, foundUser.password);

        if (isMatch) return foundUser 
        else throw new Error('Password is not correct');
        
    } 
    catch (error) {
        throw error;
    }
}

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
}

const register = async (user: { username: string, email: string, password: string }) => {
    const { username, email, password } = user;
    try {
        const hashedPassword = await hash(password, saltRounds);
        const newUser = new User({username, email, password: hashedPassword, deleted:false});
        await newUser.save();
    }
    catch (error) {
        throw error;
    }
}

router.post('/login', async (req, res) => {
    const body = loginSchema.safeParse(req.body);

    if (!body.success) {
        res.status(500).send(body.error.format());
        return
    }
    try {
        const foundUser = await checkPassword(body.data);
        res.status(200).send(foundUser);
    } 
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return;
    }
});

router.post('/register', async (req, res) => {
    const body = registerSchema.safeParse(req.body);
    if (!body.success) {
        res.status(500).send(body.error.format());
        return
    }
    try {
        await register(body.data);
        res.status(200).send("User created successfully!");
    }
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return;
    }
});