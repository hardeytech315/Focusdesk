const Task = require("../models/Task");

exports.createTask = async (req, res) => {

  try {

    const task = await Task.create({
      ...req.body,
      user: req.user
    });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


exports.getTasks = async (req, res) => {

  try {

    const tasks = await Task.find({ user: req.user });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


exports.updateTask = async (req, res) => {

  try {

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};