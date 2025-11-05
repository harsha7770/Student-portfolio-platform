const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
let User = require('../models/user.model');
let Project = require('../models/project.model');  

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const teacherIdSecret = process.env.TEACHER_ID;

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

router.route('/register').post(async (req, res) => {
  try {
    const { username, password, role, registrationCode, rollNumber } = req.body;  

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json('Error: Username already exists!');
    }

    let teacherId = null;
    if (role === 'student') {
        const existingRollNumber = await User.findOne({ rollNumber });
        if (existingRollNumber) {
            return res.status(400).json({ error: 'A student with this roll number already exists.' });
        }

        const teacher = await User.findOne({ role: 'admin', registrationCode: registrationCode });
        if (!teacher) {
            return res.status(400).json({ error: 'Invalid teacher registration code.' });
        }
        teacherId = teacher._id;
    }

    if (role === 'admin') {
      const existingTeacher = await User.findOne({ registrationCode: registrationCode, role: 'admin' });
      if (existingTeacher) {
        return res.status(400).json('Error: A teacher with this code already exists.');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUserObject = {
      username,
      password: hashedPassword,
      role,
      teacherId: teacherId
    };

    if (role === 'admin') {
      newUserObject.registrationCode = registrationCode;
    } else { // It's a student
        newUserObject.rollNumber = rollNumber;
    }

    const newUser = new User(newUserObject);
    await newUser.save();
    res.json('User registered successfully!');
  } catch (err) {
    console.error("Back-end crash during registration:", err);
    res.status(500).json('Error: ' + err);
  }
});

router.route('/login').post(async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json('Error: Invalid credentials!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Error: Invalid credentials!');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

router.route('/delete').delete(auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOneAndDelete({ _id: userId });

        if (!user) {
            return res.status(404).json('User not found.');
        }

        await Project.deleteMany({ owner: userId });

        res.status(200).json('Account and all associated projects deleted.');

    } catch (err) {
        res.status(500).json('Error: ' + err);
    }
});

module.exports = router;