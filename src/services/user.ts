import { User } from "../models/user"

const changeUserEmail = async (user_id: string, newEmail: string) => {
    const foundUser = await User.findOne({ _id: user_id });
    if (!foundUser) throw new Error('User does not exist');

    foundUser.email = newEmail;
    await foundUser.save();
}