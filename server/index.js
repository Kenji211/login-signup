const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require('./models/User')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();


const app = express()
app.use(express.json())
app.use(cors({
    credentials: true
}))

mongoose.connect("mongodb://localhost:27017/test-project")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS    
    }
});

app.post('/login', async (req, res) => { //'/login'
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return res.json({ status: 'Error', message: 'User not found' });
        }
        
        if (!user.isVerified) {
            return res.json({ status: 'Error', message: 'Please verify your email before logging in' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.json({ status: 'Error', message: 'Incorrect password' });
        }

        res.json({ status: 'Success', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error', message: 'Login failed' });
    }

    // UserModel.findOne({username: username})
    // .then(user =>{
    //     if(user){
    //         if(user.password === password){
    //             res.json({ status: 'Success', user });
    //         }else{
    //             res.json('Password is incorrect')
    //         }
    //     }else{
    //         res.json('User is not registered')
    //     }
    // });
});


app.post('/register', async (req, res) => { // '/register'
    const { username, password, email } = req.body;
    try {

        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ status: 'Error', message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const verificationUrl = `http://localhost:3001/verify/${verificationToken}`;
        await transporter.sendMail({
            from: '"Your App" <krisvon213@gmail.com>',
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Please verify your email by clicking the link below:</p>
                   <a href="${verificationUrl}">${verificationUrl}</a>`
        });

        const user = await UserModel.create({
            //_id must be automated from 1 
            username,
            email,
            password: hashedPassword,
            verificationToken,
            isVerified: false
        });

        res.json({ status: 'Success', message: 'Registration successful! Please verify your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error', message: 'Registration failed' });
    }
})

app.get('/verify/:token', async (req, res) => {
    try {
        const user = await UserModel.findOne({ verificationToken: req.params.token });
        if (!user) {
            return res.status(400).json({ status: 'Error', message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.json({ status: 'Success', message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error', message: 'Verification failed' });
    }
});

app.get('/user/:id', (req, res) => {
    UserModel.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(500).json('User not found'));
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'Error', message: 'No account with that email address exists' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ status: 'Error', message: 'Please verify your email before resetting your password' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: '"Your App" <krisvon213@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetUrl}">${resetUrl}</a>
                   <p>This link will expire in 1 hour.</p>`
        });

        res.json({ status: 'Success', message: 'Password reset link sent to your email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error', message: 'Failed to send password reset email' });
    }
});

app.listen(3001, () => {
    console.log('server is running')
})