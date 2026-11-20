
const { User } = require('../models');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists.'
            });
        }

        const user = User.build({
            name,
            email,
            password,
            role
        });

        await user.save();

        res.status(201).json({
            message: 'User added successfully.'
        });

    } catch (error) {
        res.status(400).json({
            message: 'Validation error.',
            errors: error.errors
                ? error.errors.map(err => err.message)
                : [error.message]
        });
    }
};

const createOrUpdateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        await User.upsert({
            id: req.params.id,
            name,
            email,
            role
        }, {
            validate: false
        });

        res.status(200).json({
            message: 'User created or updated successfully'
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        const user = await User.findOne({
            where: { email },
            attributes: {
                exclude: ['password']
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'no user found'
            });
        }

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: {
                exclude: ['role', 'password']
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'no user found'
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signup,
    createOrUpdateUser,
    getUserByEmail,
    getUserById
};
