import { User } from "../models/user";
import express from 'express'
import { auth } from '../services/auth'
import { resetRequestSchema } from "../schemas/auth";

const router = express.Router();
export default router;

router.delete("/:username", async (req, res) => {
    
})

router.put('/:username/change-email', (req, res) => {
    const { username } = req.params;
    const body = resetRequestSchema.safeParse(req.body);

    // if (!body.su)
})