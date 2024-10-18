import { Router } from "express";
import { Category } from "../models/category";
import { User } from "../models/user";
import { categorySchema } from "../schemas/models";
import { FormatError, getErrorMessage } from "../services/utils";
import auth from "./auth";

const router = Router();
export default router;

router.get('/:username/categories', auth, async (req, res) => {
    try {
        const { username } = req.params;
       
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundCategories = await Category.find({owner: foundUser._id});

        res.status(200).send({ success:"Categories found", data: foundCategories })
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
})

router.post('/:username/category', auth, async (req, res) => {
    try {
        const { username } = req.params;
        const body = categorySchema.safeParse(req.body)
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));
        
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const overlap = await Category.find({ $and: [{ owner: foundUser._id }, {deleted: false}, { title: body.data.title }]});

        if (overlap)
            throw new Error('Title already used')

        const createdCategory = new Category({
            owner: foundUser._id,
            title: body.data.title,
            emoji: body.data.title,
        });

        await createdCategory.save();

        res.status(200).send({success: "Category created successfully!"})
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
});

router.put('/:username/category/:_id', auth, async (req, res) => {
    try {
        const { username, _id } = req.params;
        const body = categorySchema.safeParse(req.body)
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));
        
        const {title, emoji} = body.data;

        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const overlap = await Category.find({ $and: [{ owner: foundUser._id }, {deleted: false}, { title: title }]});
        if (overlap)
            throw new Error('Title already used')
        
        const catToSave = await Category.findOne({ $and: [{ _id }, {deleted: false},]});

        if (!catToSave)
            throw new Error('Category not found')

        catToSave.title = title;
        catToSave.emoji = emoji;
        
        await catToSave.save();

        res.status(200).send({ success: "Category edited successfully!" })
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
});

router.delete('/:username/category/:_id', auth, async (req, res) => {
    try {
        const { username, _id } = req.params;

        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        await Category.deleteOne({ $and: [{ _id } ,{deleted: false}]});

        res.status(200).send({ success: "Category deleted successfully!" })
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
});