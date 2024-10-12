import { loginSchema, passwordResetSchema, registerSchema, resetRequestSchema } from "../schemas/auth";
import express from "express";
import { checkPassword, getErrorMessage, register, sendToken } from "../services/auth";

const router = express.Router();
export default router;

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
})