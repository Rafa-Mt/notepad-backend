import { app } from "..";
import { Category } from "../models/category";

app.get('user/:owner/categories', async (req, res) => {
    const { owner } = req.params;
    const requestedCategories = await Category.find({owner});
    res.json(requestedCategories)
})