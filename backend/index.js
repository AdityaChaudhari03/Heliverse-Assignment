const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
const Team = require("./models/Team");

const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

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

app.get("/api/team/:id", async (req, res) => {
  try {
    const memberId = req.params.id;
    const memberDetails = await Team.findById(memberId);

    if (!memberDetails) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json({ memberDetails });
  } catch (error) {
    console.error("Error fetching team member details:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/teams/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract necessary fields from user object
    const { first_name, last_name, email, gender, domain, avatar } = user;

    // Create a new team document with the extracted user details
    const team = await Team.create({
      first_name,
      last_name,
      email,
      gender,
      avatar,
      domain,
    });

    res
      .status(201)
      .json({ message: "User added to the team successfully", team });
  } catch (err) {
    console.error("Error adding user to team:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/team", async (req, res) => {
  try {
    // Fetch team members from the database
    const teamMembers = await Team.find();

    // Send the team members data in the response
    res.json({ members: teamMembers });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
