import { User } from "../models/user";
import { Note } from "../models/note";
import { Category } from "../models/category";
import express from 'express'
import { FormatError, getErrorMessage } from "../services/utils";
import { auth } from "../services/auth";
import { noteEditSchema, noteSchema } from "../schemas/models";

const router = express.Router();
export default router;

router.get('/:username/notes', auth, async (req, res) => {
    try {
        const {username} = req.params;
        
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNotes = await Note.find({ $and: [{ owner: foundUser._id }, {deleted: false}]});

        res.status(200).json({notes: foundNotes});
    }
    catch(error) {
        res.status(500).json(getErrorMessage(error))
        console.error(error);
    }
});

router.get('/:username/notes/:category', auth, async (req, res) => {
    try {
        const { username, category } = req.params;
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundCategory = await Category.findOne({ _id: category });
        if (!foundCategory) 
            throw new Error('Category not found');
        
        const foundNotes = await Note.find({ 
            $and: [{ owner: foundUser._id }, {deleted: false}, { categories: foundCategory.title }]
        });

        res.status(200).json({ success:"Found notes!", data: foundNotes });
    }
    catch (error) {
        console.error(error);
        res.status(500).json(getErrorMessage(error));
    }
});

router.get('/:username/notes/favorites', auth, async (req, res) => {
    try {
        const { username } = req.params;
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNotes = await Note.find({
            $and: [{ owner: foundUser._id }, { deleted: false }, { favorite: true }]
        });

        res.status(200).json({success:"Found notes!", data: foundNotes});
    }
    catch(error) {
        console.error(error);
        res.status(500).json(getErrorMessage(error));
    }
});

router.get('/:username/note/:_id', auth, async (req, res) => {
    try {
        const {username, _id} = req.params;
        
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNote = await Note.findOne({ $and: [{ _id }, {deleted: false}]})
        if (!foundNote)
            throw new Error('Note not found')

        res.status(200).json({ success:"Found note!", data: foundNote })
    }
    catch(error) {
        console.error(error);
        res.status(500).json(getErrorMessage(error));
    }
});

router.post('/:username/note', auth, async (req, res) => {
    try {
        const {username} = req.params;
        const body = noteSchema.safeParse(req.body)
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));
        
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');
        
        const {title, content, priority, favorite, categories} = body.data;

        const fetchedCategories = await Category.find({ owner: foundUser._id })
        const userCategories = fetchedCategories.map((category) => category.title)
        // console.log(userCategories);

        // categories.forEach((category) => {
        //     if (!(category in userCategories))
        //         throw new Error('Categories not found');
        // });
            
        const newNote = new Note({
            title, content, priority, favorite, categories, owner: foundUser._id
        });
        
        await newNote.save();
        res.status(200).json({success: "Note saved succesfully!"})
    }
    catch(error) {
        res.status(500).json(getErrorMessage(error));
        console.error(error);
    }
});

router.put('/:username/note/:_id', auth, async (req, res) => {
    try {
        const { username, _id } = req.params;
        const body = noteEditSchema.safeParse(req.body);

        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));

        const propsToChange = Object.fromEntries(
            Object.entries(body.data)
        );

        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        if (propsToChange.categories) {
            const fetchedCategories = await Category.find({ owner: foundUser._id })
            const userCategories = fetchedCategories.map((category) => category.title)
            // console.log(propsToChange.categories)
            // console.log(userCategories);

            // (propsToChange.categories as string[]).forEach((category) => {
            //     console.log(`${category} in [${userCategories}]: ${userCategories.includes(category)}`)
            //     if (!userCategories.includes(category))
            //         throw new Error('Categories not found');
            // });
        }

        const foundNote = await Note.findOneAndUpdate(
            { $and: [{ owner: foundUser._id }, { deleted: false }, { _id }]}, 
            propsToChange
        )
        
        if (!foundNote)
            throw new Error('Note not found');

        res.status(200).json({success: "Note saved succesfully!"})
    }
    catch(error) {
        console.error(error);
        res.status(500).json(getErrorMessage(error));
    }
});

router.delete('/:username/note/:_id', auth, async (req, res) => {
    try {
        const { username, _id } = req.params;

        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNote = await Note.findOne({ $and: [{ owner: foundUser._id }, {deleted: false}, { _id }]});
        if (!foundNote)
            throw new Error('Note not found');

        foundNote.deleted = true;
        foundNote.save();

        res.status(200).json({success: "Note deleted succesfully!"})
    }
    catch(error) {
        console.error(error);
        res.status(500).json(getErrorMessage(error));
    }
});