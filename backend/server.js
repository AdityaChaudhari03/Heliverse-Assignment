const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
const Team = require("./models/Team");

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected successfully"));


app.get("/api/users", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/team", async (req, res) => {
  try {
    const { users } = req.body;

    const uniqueDomains = new Set(users.map((user) => user.domain));
    const uniqueAvailability = new Set(users.map((user) => user.availability));

    // If there are selected users with different domains and availabilities
    if (uniqueDomains.size === users.length && uniqueAvailability.size === 1) {
      const newTeam = await Team.create({ members: users });
      res.status(201).json(newTeam);
    } else {
      res.status(400).json({
        message: "Selected users must have unique domains and availability",
      });
    }
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/team/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/team", async (req, res) => {
  try {
    const teamMembers = await Team.find().populate({
      path: "users",
      select: "first_name",
    });
    console.log(teamMembers); 
    res.json({ members: teamMembers });
  } catch (err) {
    console.error("Error fetching team members:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/teams", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Team.create({ user });
    res.status(201).json({ message: "User added to the team successfully" });
  } catch (err) {
    console.error("Error adding user to team:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
