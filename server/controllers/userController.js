const mongoose = require('mongoose');
const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().lean();
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        const user = await User.findById(id).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getUser = async (req, res) => {
    const { username } = req.user;
    try {
        const user = await User.findOne({username}).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const usernameByToken = req.user.username
    const { firstname, lastname, username, password, email, phone, street, city, building } = req.body

    if (!firstname || !lastname || !username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    try {
        const user = await User.findOne({ username: usernameByToken })
        if (username !== usernameByToken) {
            const duplicate = await User.findOne({ username }).lean()
            if (duplicate) {
                return res.status(409).json({ message: 'username exists' })
            }
        }
        if (building && (typeof building !== 'number' || building <= 0)) {
            return res.status(400).json({ message: 'building number must be a positive number' })
        }
        const address = { street, city, building }

        const hashedPwd = await bcrypt.hash(password, 10)
        user.firstname = firstname
        user.lastname = lastname
        user.username = username
        user.password = hashedPwd
        user.email = email
        user.phone = phone
        user.address = address
        const Updateduser = await user.save()
        if (Updateduser) {
            return res.json(Updateduser)
        } else {
            return res.status(400).json({ message: 'invalid user' })
        }
    } catch (error) {
        console.error('Error updating user:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const updateUserById = async (req, res) => {
    const { id, firstname, lastname, username, password, email, phone, street, city, building, role } = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' })
        }
        const user = await User.findById(id)
        if (!firstname || !lastname || !username || !password || !email) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        if (username !== user.username) {
            const duplicate = await User.findOne({ username }).lean()
            if (duplicate) {
                return res.status(409).json({ message: 'username exists' })
            }
        }
        if (building && (typeof building !== 'number' || building <= 0)) {
            return res.status(400).json({ message: 'building number must be a positive number' })
        }
        const address = { street, city, building }

        const hashedPwd = await bcrypt.hash(password, 10)
        user.firstname = firstname
        user.lastname = lastname
        user.username = username
        user.password = hashedPwd
        user.email = email
        user.phone = phone
        user.address = address
        user.role = role
        const Updateduser = await user.save()
        if (Updateduser) {
            return res.json(Updateduser)
        } else {
            return res.status(400).json({ message: 'invalid user' })
        }
    } catch (error) {
        console.error('Error updating user:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const result = await user.deleteOne()
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    getUserById,
    updateUser,
    updateUserById,
    deleteUser
}
