const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const JWT_SECRET = 'overviewrealtimemetricscollectionssearchprofiler';
router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);

        try {
            await User.create({
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                password: secPassword,
            });
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })


    router.post("/loginuser", [
        body('email').isEmail(),
        body('password', 'Incorrect Password').isLength({ min: 5 })],
        async (req, res) => {
    
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const email = req.body.email;
            try {
                const userData = await User.findOne({ email });
                if (!userData) {
                    // Log the email that was not found in the database.
                    console.log(`User with email '${email}' not found.`);
                    return res.status(400).json({ error: "Invalid email or password" });
                }
                const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
                if (!pwdCompare) {
                    // Log the failed password comparison.
                    console.log(`Password comparison failed for user with email '${email}'.`);
                    return res.status(400).json({ error: "Invalid email or password" });
                }
    
                const data = {
                    user: {
                        id: userData.id,
                    }
                }
    
                const authToken = jwt.sign(data, JWT_SECRET);
                return res.json({ success: true, authToken: authToken });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
            }
        })
    
// router.post("/loginuser", [
//     body('email').isEmail(),
//     body('password', 'Incorrect Password').isLength({ min: 5 })],
//     async (req, res) => {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         let email = req.body.email;
//         try {
//             let userData = await User.findOne({ email });
//             if (!userData) {
//                 return res.status(400).json({ error: "Please try again" });
//             }
//             const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
//             if (!pwdCompare) {
//                 return res.status(400).json({ error: "Please try again" });
//             }

//             const data = {
//                 user: {
//                     id: userData.id,
//                 }
//             }

//             const authToken = jwt.sign(data, JWT_SECRET);
//             return res.json({ success: true,authToken:authToken });
//         } catch (error) {
//             console.log(error)
//             res.json({ success: false });
//         }
//     })

module.exports = router;