const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Booking = require('./bookingSchema'); // Import your Booking model
const Parking = require('./parkingSchema'); // Import your Parking model

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/check-entry', async (req, res) => {
  const { by_id } = req.body;
  try {
    const booking = await Booking.findOne({ by_id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentTime = new Date();

    if (!booking.entry_time) {
      booking.entry_time = currentTime;
      const slot = await Parking.findOneAndUpdate(
        { "parking_space.slots.by_id": by_id },
        {
          $set: {
            "parking_space.$.slots.$[elem].status": "Entered",
            "parking_space.$.slots.$[elem].entry_time": currentTime
          }
        },
        {
          arrayFilters: [{ "elem.by_id": by_id }],
          new: true
        }
      );

      if (!slot) {
        return res.status(404).json({ message: 'Slot not found' });
      }

      await booking.save();
      return res.json({ message: 'Slot status updated to entered and entry time set to current time' });
    }

    res.json({ message: 'Entry time is already set' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
