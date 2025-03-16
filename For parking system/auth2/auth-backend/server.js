const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const QRCode = require('qrcode');
const Booking = require('./bookingSchema'); // Import your Booking model
const Parking = require('./parkingSchema'); // Import your Parking model
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 5000;
const mongoURI = 'mongodb://localhost:27017/Parking';
const secretKey = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define User schema and model
const UserSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  username: { type: String, unique: true },
  password: String,
  mobile: { type: String, unique: true }
});



const User = mongoose.model('User', UserSchema);
// const Booking = mongoose.model('Booking', BookingSchema);

// Routes
app.post('/signup', async (req, res) => {
  const { name, dob, username, password, mobile } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, dob, username, password: hashedPassword, mobile });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ token, username });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { dob, mobile } = req.body;

  try {
    const user = await User.findOne({ dob, mobile });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPassword = 'newPassword123'; // You should generate a random password here
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully', newPassword });
  } catch (error) {
    res.status(400).json({ error: 'Error resetting password' });
  }
});

// Middleware to authenticate the token
const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' });
  }
};

// Endpoint to get user details (protected route)
app.get('/user', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send(user);
});

// Define the /book-slot endpoint
app.post('/book-slot', auth, async (req, res) => {
  const { username, car_number, slot_number, id } = req.body;
  const byId = uuidv4(); // Generate a unique ID

  if (!username || !car_number || !slot_number) {
    return res.status(400).send('Missing required fields');
  }



  try {
    // Check if the slot is empty
    const parkingSpace = await Parking.findOne({
      'parking_space.slots.slot_number': slot_number,
      'parking_space.slots.status': 'Empty'
    });

    if (!parkingSpace) {
      return res.status(404).send('Slot not found or not empty');
    }

    // Create a new booking
    const newBooking = new Booking({
      username,
      car_number,
      by_id: byId,
      transaction_id: '', // Leave blank for payment
      slot_number,
      entry_time: null, // Leave blank here
      exit_time: null // Leave blank here
    });

    await newBooking.save();

    // Update the parking space collection to mark the slot as booked
    const updatedParkingSpace = await Parking.findOneAndUpdate(
      { 'parking_space.slots.slot_number': slot_number },
      {
        $set: {
          'parking_space.$[outer].slots.$[inner].status': 'Booked',
          'parking_space.$[outer].slots.$[inner].by_id': byId,
          'parking_space.$[outer].slots.$[inner].entry_time': null
        }
      },
      {
        arrayFilters: [
          { 'outer.id': id }, // Adjust this if you have different parking space IDs
          { 'inner.slot_number': slot_number }
        ],
        new: true
      }
    );

    if (!updatedParkingSpace) {
      return res.status(404).send('Parking space or slot not found');
    }

    const qrData = `ID:${byId}`;
    const qrCode = await QRCode.toDataURL(qrData);

    res.status(201).send({ success: true, qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// API endpoint to get entries
app.get('/parking_space/slots', async (req, res) => {
  try {
    const id = req.query.for;

    // Find the parking space with the given id
    const parkingSpace = await Parking.findOne({ 'parking_space.id': id });
    //console.log(parkingSpace.parking_space);
    // console.log('loop')
    // Check if the parkingSpace is found and if parking_space array exists
    if (!parkingSpace || !parkingSpace.parking_space) {
      return res.status(404).send('Parking space not found');
    }

    // Find the specific parking space
    const space = parkingSpace.parking_space.find(space => space.id === id);

    // Check if the space object is found and if it has a slots array
    if (!space || !space.slots) {
      return res.status(404).send('No slots found for the given id');
    }

    // Filter slots to get only those with status "Empty"
    const emptySlots = space.slots.filter(slot => slot.status === 'Empty');

    res.json(emptySlots);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send('Server error');
  }
});

// Endpoint to fetch bookings by username
app.post('/bookings', auth, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    const bookings = await Booking.find({ username });

    if (!bookings.length) {
      return res.status(404).send('No bookings found for this user');
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Endpoint to generate QR code for a given by_id
app.get('/generate-qr', async (req, res) => {
  const { by_id } = req.query;

  if (!by_id) {
    return res.status(400).send('by_id is required');
  }

  try {
    const qrCode = await QRCode.toDataURL(`ID: ${by_id}`);
    res.status(200).json({ qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
