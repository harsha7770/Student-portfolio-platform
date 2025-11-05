const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Project = require('../models/project.model');
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

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).populate('owner');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

router.get('/all', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Access denied.' });
  }
  try {
    const students = await User.find({ teacherId: req.user.id, role: 'student' });
    const studentIds = students.map(student => student._id);

    const projects = await Project.find({ owner: { $in: studentIds } }).populate('owner');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const { title, description, mediaUrl } = req.body;
    const newProject = new Project({
      title,
      description,
      mediaUrl,
      owner: req.user.id
    });
    await newProject.save();
    res.status(201).json('Project added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      return res.status(404).json('Project not found!');
    }
    project.title = req.body.title;
    project.description = req.body.description;
    project.mediaUrl = req.body.mediaUrl;
    await project.save();
    res.status(200).json('Project updated!');
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      return res.status(404).json('Project not found!');
    }
    res.status(200).json('Project deleted!');
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

module.exports = router;