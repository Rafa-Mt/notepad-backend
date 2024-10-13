import { loginSchema, passwordResetSchema, registerSchema, resetRequestSchema } from "../schemas/auth";
import { Router } from "express";
import { changePassword, login, register, sendToken } from "../services/auth";
import { FormatError, getErrorMessage } from "../services/utils";
import { config as dotenv } from 'dotenv'


const router = Router();
export default router;

dotenv();

router.post('/login', async (req, res) => {
    try {
        const body = loginSchema.safeParse(req.body);
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()))
        const foundUser = await login(body.data);
        res.status(200).send(foundUser);
    } 
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return;
    }
});

router.post('/register', async (req, res) => {
    try {
        const body = registerSchema.safeParse(req.body);
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));
            
        
        await register(body.data);
        res.status(200).send({success: "User created successfully!"});
    }
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return;
    }
});

router.post('/send-reset-token', async (req, res) => {
    try {
        const body = resetRequestSchema.safeParse(req.body);

        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()))
        
        await sendToken(body.data.email);
        res.status(200).send({success: "Token sent to user email"})
    } 
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return;
    }

})

router.put('/reset-password', async (req, res) => {
    try {
        const body = passwordResetSchema.safeParse(req.body);

        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()))

        const success = await changePassword(body.data);
        if (!success) throw new Error('Failed to change password');

        res.status(200).send({success: "Password changed successfully"})
    }
    catch (error) {
        res.status(500).send(getErrorMessage(error));
        return
    }
})

