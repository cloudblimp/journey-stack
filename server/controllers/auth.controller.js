const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({ username, email, passwordHash });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: { id: user.id, username: user.username, email: user.email }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('_id username email createdAt');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'Missing idToken' });

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const email = payload.email;
        const username = payload.name || email.split('@')[0];

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ username, email, passwordHash: 'google-oauth' });
            await user.save();
        }

        const jwtPayload = { user: { id: user.id } };
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};