// bookingSchema.js
const mongoose = require('mongoose');
const { type } = require('os');

const bookingSchema = new mongoose.Schema({
  // park_id:{type:any, required:true},
  username: { type: String, required: true },
  car_number: { type: String, required: true },
  by_id: { type: String, required: true },
  transaction_id: String,
  slot_number: { type: String, required: true },
  entry_time: Date,
  exit_time: Date
});

const Booking = mongoose.model('Booking_Log', bookingSchema);

module.exports = Booking;
