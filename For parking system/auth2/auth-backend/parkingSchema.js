// parkingSchema.js
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slot_number: String,
  status: String,
  by_id: String,
  entry_time: Date
});


const parkingSpaceSchema = new mongoose.Schema({
  id: String,
  slots: [slotSchema]
});

const Parking = mongoose.model('parking_spaces', new mongoose.Schema({
  parking_space: [parkingSpaceSchema]
}));

module.exports = Parking;
