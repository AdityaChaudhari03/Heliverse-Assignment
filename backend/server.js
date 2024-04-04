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

// app.get("/api/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.json(user);
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// app.get("/api/team/:id", async (req, res) => {
//   try {
//     const team = await Team.findById(req.params.id);
//     res.json(team);
//   } catch (err) {
//     console.error("Error fetching team:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });
//   try {
//     const teamMembers = await Team.find().populate({
//       path: "users",
//       select: "first_name",
//     });
//     console.log(teamMembers);
//     res.json({ members: teamMembers });
//   } catch (err) {
//     console.error("Error fetching team members:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

app.post("/api/teams/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);
    console.log(user);
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new team document with the user's first_name and last_name
    const team = await Team.create(user);

    // Respond with success message
    res
      .status(201)
      .json({ message: "User added to the team successfully", team });
  } catch (err) {
    console.error("Error adding user to team:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
