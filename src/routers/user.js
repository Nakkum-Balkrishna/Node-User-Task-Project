const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const userData = await user.save();
    const token = await userData.generateAuthToken();

    res.status(201).send({ userData, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/users/logoutAll', auth, async (req,res)=>{
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(400).send()  
  }

})

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById({ _id });
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isUpdateAllowed = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isUpdateAllowed) {
    return res.status(404).send({ error: "Not allowed param" });
  }

  try {
    const user = req.user
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.user._id);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
