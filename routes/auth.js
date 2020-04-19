const router = require('express').Router();
const User = require('../models/User'); // Model user data
const bcrypt = require('bcryptjs'); // Hash pass
const jwt = require('jsonwebtoken'); // Remember user logged in
const {registerValidation, loginValidation} = require('../validation'); // Validate data entry


// Route register new user
router.post('/register', async (req,res) => {

    // Validate data
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Check if email exists
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send('Email already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPass
    });
    try {
        const savedUser = await user.save();
        res.send('User Created');
    } catch(err) {
        res.json({message: err});
    }
});

// Route user login
router.post('/login', async (req,res) => {
    // Validate data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Check if email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email does not exist');

    // Check if password correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Password incorrect');

    // Create/assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN);
    res.header('auth-token', token);
    
    // Notify login successful
    res.send('Login Successful');
});


module.exports = router;