const mongoose = require('mongoose');

const parkingSpaceSchema = new mongoose.Schema({
    parking_space: [
        {
            id: String,
            slots: [
                {
                    slot_number: Number,
                    status: String,
                    by_id: String,
                    entry_time: Date
                }
            ]
        }
    ]
});

module.exports = mongoose.model('parking_spaces', parkingSpaceSchema);
