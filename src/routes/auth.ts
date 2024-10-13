import { loginSchema, passwordResetSchema, registerSchema, resetRequestSchema } from "../schemas/auth";
import { Router, NextFunction, Request, Response } from "express";
import { changePassword, login, register, sendToken } from "../services/auth";
import { getErrorMessage } from "../services/utils";
import { Secret, verify } from "jsonwebtoken";
import { config as dotenv } from 'dotenv'
import { CustomRequest } from "../types";

const router = Router();
export default router;

dotenv();

router.post('/login', async (req, res) => {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
        res.status(500).send(body.error.format());
        return
    }
    try {
        const foundUser = await login(body.data);
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
        res.status(200).send({success: "User created successfully!"});
    }
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return;
    }
});

router.post('/send-reset-token', async (req, res) => {
    const body = resetRequestSchema.safeParse(req.body);

    if (!body.success) {
        res.status(500).send(body.error.format());
        return;
    }

    try {
        await sendToken(body.data.email);
        res.status(200).send({success: "Token sent to user email"})
    } 
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return;
    }

})

router.post('/reset-password', async (req, res) => {
    const body = passwordResetSchema.safeParse(req.body);

    if (!body.success) {
        res.status(500).send(body.error.format());
        return
    }

    try {
        const success = await changePassword(body.data);
        if (!success) throw new Error('Failed to change password');

        res.status(200).send({success: "Password changed successfully"})
    }
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return
    }
})

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');

        if (!token) throw new Error('Token not found');
        const decodedToken = verify(token, process.env.JWT_SECRET_KEY as Secret);
        (req as CustomRequest).token = decodedToken;

        next();
    }
    catch (error) {
        res.status(400).send('User not logged in')
    }
}