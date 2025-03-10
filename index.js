const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://bank-client-pnb6.onrender.com'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

// ✅ Root API
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// ✅ Connect to MongoDB
const PORT = 8080;
mongoose
  .connect("mongodb+srv://pratheep02:mongoDB@cluster0.sxny8.mongodb.net/bank", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ Define Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  amount: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

// ✅ Get All Users
app.get("/data", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

// ✅ Create User
app.post("/create", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// ✅ Delete User
app.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting user", error: error.message });
  }
});

// ✅ Update User
app.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating user", error: error.message });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name, password });
    if (user) {
      res.json({ success: true, amount: user.amount, userId: user._id });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in", error: error.message });
  }
});

// ✅ Deposit Route
app.post("/deposit", async (req, res) => {
  const { userId, deposit } = req.body;

  if (deposit <= 0) return res.json({ success: false, message: "Invalid amount" });

  try {
    const user = await User.findById(userId);
    if (user) {
      user.amount += deposit;
      await user.save();
      res.json({ success: true, newBalance: user.amount });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "❌ Error depositing money", error: error.message });
  }
});


app.post("/withdraw", async (req, res) => {
  const { userId, amount } = req.body;

  if (amount <= 0) return res.json({ success: false, message: "Invalid amount" });

  const user = await User.findById(userId);
  if (user) {
      if (amount > user.amount) {
          return res.json({ success: false, message: "Insufficient balance!" });
      }

      user.amount -= amount;
      await user.save();
      res.json({ success: true, newBalance: user.amount });
  } else {
      res.json({ success: false, message: "User not found" });
  }
});
