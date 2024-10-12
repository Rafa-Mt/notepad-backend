import { User } from "../models/user";
import express from 'express'

const router = express.Router();
export default router;

router.get("/:username", async (req, res) => {
    const { username } = req.params;
    const requestedUser = await User.findOne({username});
    res.json(requestedUser);
})

router.delete("/:username", async (req, res) => {
    console.log(req.params, req.body)
})