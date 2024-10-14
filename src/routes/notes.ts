import { User } from "../models/user";
import { Note } from "../models/note";
import express from 'express'
import { FormatError, getErrorMessage } from "../services/utils";
import { auth } from "../services/auth";
import { noteSchema } from "../schemas/models";

const router = express.Router();
export default router;

router.get('/:username/notes', auth, async (req, res) => {
    try {
        const {username} = req.params;
        
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNotes = await Note.find({ $and: [{ owner: foundUser._id }, {deleted: false}]});

        res.status(200).send({notes: foundNotes});
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
});

router.get('/:username/notes/:title', auth, async (req, res) => {
    try {
        const { username, title } = req.params;
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNotes = await Note.findOne(
            { owner: foundUser._id }, {deleted: false}, {title}
        );

        res.status(200).send({notes: foundNotes});
    }
    catch (error) {
        res.status(500).send(getErrorMessage(error));
    }
})

router.get('/:username/notes/:category', auth, async (req, res) => {
    try {
        const { username, category } = req.params;
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');
        
        const foundNotes = await Note.find({ 
            $and: [{ owner: foundUser._id }, {deleted: false}, { categories: category }]
        });

        res.status(200).send({notes: foundNotes});
    }
    catch (error) {
        res.status(500).send(getErrorMessage(error));
    }
});

router.get('/:username/notes/favorites', auth, async (req, res) => {
    try {
        const { username } = req.params;
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNotes = await Note.find({
            $and: [{ owner: foundUser._id }, {deleted: false}, { favorite: true }]
        });

        res.status(200).send({notes: foundNotes});
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error));
    }
});

router.get(':username/note/:_id', auth, async (req, res) => {
try {
    const {username, _id} = req.params;
    
    const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
    if (!foundUser) 
        throw new Error('User not found');

    const foundNote = await Note.findOne({ $and: [{ _id }, {deleted: false}]})
    if (!foundNote)
        throw new Error('Note not found')

    res.status(200).send({note: foundNote})
}
catch(error) {
    res.status(500).send(getErrorMessage(error))
}
});

router.post(':username/note', auth, async (req, res) => {
    try {
        const {username} = req.params;
        const body = noteSchema.safeParse(req.body)
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));
        
        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const {title, content, priority, favorite, categories} = body.data;
        const newNote = new Note({
            title, content, priority, favorite, categories, owner: foundUser._id
        });
        newNote.save();
        res.status(200).send({success: "Note saved succesfully!"})
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
});

router.put(':username/note', auth, async (req, res) => {
    try {
        const { username } = req.params;
        const body = noteSchema.safeParse(req.body);
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));

        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNote = await Note.findOne({ $and: [{ username }, {deleted: false}]})

        if (!foundNote)
            throw new Error('Note not found');

        foundNote.title = body.data.content;
        foundNote.content = body.data.content;
        foundNote.categories = body.data.categories;
        foundNote.priority = body.data.priority;
        foundNote.favorite = body.data.favorite;
        await foundNote.save();

        res.status(200).send({success: "Note saved succesfully!"})
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
});

router.delete(':username/note/:title', auth, async (req, res) => {
    try {
        const { username, title } = req.params;

        const body = noteSchema.safeParse(req.body);
        if (!body.success) 
            throw new FormatError(JSON.stringify(body.error.flatten()));

        const foundUser = await User.findOne({ $and: [{ username }, {deleted: false}]});
        if (!foundUser) 
            throw new Error('User not found');

        const foundNote = await Note.findOne({ $and: [{ username }, {deleted: false}, { title }]});
        if (!foundNote)
            throw new Error('Note not found');

        foundNote.deleted = true;
        foundNote.save();

        res.status(200).send({success: "Note delete succesfully!"})
    }
    catch(error) {
        res.status(500).send(getErrorMessage(error))
    }
});