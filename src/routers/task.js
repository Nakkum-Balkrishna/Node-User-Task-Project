const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require('../middleware/auth');
const { findOne } = require("../models/user");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(201).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate('tasks')
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const result = await Task.findOne({_id, owner: req.user._id})
    if (!result) {
      res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdate = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isUpdateAllowed = updates.every((update) =>
    allowedUpdate.includes(update)
  );

  if (!isUpdateAllowed) {
    return res.status(404).send({ error: "invalid input!" });
  }

  try {

    //const task = await Task.findById(req.params.id)
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    // const update = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!task) {
      return res.status(400).send(task);
    }
   
    updates.forEach((update)=>task[update] = req.body[update])
    await task.save()
    res.send(task);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    //const task = await Task.findByIdAndDelete(_id);
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if (!task) {
      return res.status(400).send(task);
    }
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
