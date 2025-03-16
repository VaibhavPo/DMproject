const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/parking_system', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  carNumber: { type: String, required: true },
  slot: { type: String, required: true },
  qrCode: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const Booking = mongoose.model('Booking', BookingSchema);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key';  // Replace with your own secret key

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send({ error: 'User registration failed, already exists.' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Middleware to authenticate the token
const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' });
  }
};

// Endpoint to get user details (protected route)
app.get('/user', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.send(user);
});

// Book a slot endpoint
app.post('/book-slot', auth, async (req, res) => {
  const { name, carNumber, slot } = req.body;

  try {
    // Generate QR code data
    const qrData = `Name: ${name}, Car Number: ${carNumber}, Slot: ${slot}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Create a new booking
    const booking = new Booking({
      userId: req.user.userId,
      name,
      carNumber,
      slot,
      qrCode,
    });
    await booking.save();

    res.status(201).send({ success: true, qrCode });
  } catch (error) {
    res.status(500).send({ error: 'Booking failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
