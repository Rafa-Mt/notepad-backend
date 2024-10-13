import { User } from "../models/user"

const changeUserEmail = async (_id: string, newEmail: string) => {
    const foundUser = await User.findOne({ _id });
    if (!foundUser || foundUser.deleted) throw new Error('User does not exist');

    foundUser.email = newEmail;
    await foundUser.save();
}

const deleteUser = async (_id: string) => {
    const foundUser = await User.findOne({ _id });
    if (!foundUser || foundUser.deleted) throw new Error('User does not exist');

    foundUser.deleted = true;
    await foundUser.save();
}