const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'Parking';

app.get('/initialize', async (req, res) => {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('parking_spaces');

    const parkingSpaceData = {
      "parking_space": [
        {
          "id": "01",
          "slots": [
            { "slot_number": 'Early Morning', "status": "Empty", "by_id": null, "entry_time": null },
            { "slot_number": 'Noon', "status": "Empty", "by_id": null, "entry_time": null },
            { "slot_number": 'Evening', "status": "Empty", "by_id": null, "entry_time": null },
            { "slot_number": 'Late Night', "status": "Empty", "by_id": null, "entry_time": null }
            // { "slot_number": 5, "status": "Empty", "by_id": null, "entry_time": null }
          ]
        }
      ]
    };

    const result = await collection.insertOne(parkingSpaceData);
    console.log('Inserted document:', result);

    res.send('Parking space data initialized.');
  } catch (err) {
    console.error('Error initializing parking space data:', err);
    res.status(500).send('Error initializing parking space data.');
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
