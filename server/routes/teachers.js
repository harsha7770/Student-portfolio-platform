const router = require('express').Router();
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');

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

router.get('/students', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Access denied.' });
  }
  try {
    const students = await User.find({ teacherId: req.user.id, role: 'student' });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

module.exports = router;