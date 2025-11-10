const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cardealers';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // serve public/cars.png

let db = null;
let fallbackDealers = [
  { _id: "000000000000000000000001", name: "Sunset Motors", state: "Kansas", city:"Wichita", address:"101 Main St", phone:"555-1001" },
  { _id: "000000000000000000000002", name: "Prairie Auto", state: "Kansas", city:"Topeka", address:"202 Elm St", phone:"555-1002" },
  { _id: "000000000000000000000003", name: "Coastline Cars", state: "California", city:"San Diego", address:"303 Beach Ave", phone:"555-2003" }
];

// in-memory storage for reviews while Mongo is unavailable
let fallbackReviews = {
  "000000000000000000000001": [
    { id: "r1", user: "alice", rating: 5, review: "Great service and friendly staff", created_at: new Date().toISOString() },
    { id: "r2", user: "bob", rating: 4, review: "Nice selection of cars", created_at: new Date().toISOString() }
  ],
  "000000000000000000000002": [
    { id: "r3", user: "charlie", rating: 3, review: "Average experience", created_at: new Date().toISOString() }
  ]
};

async function connectMongo() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('Could not connect to MongoDB, using fallback in-memory data. Error:', err.message);
  }
}
connectMongo();

function getDealersFromDb(filter = {}) {
  if (db) {
    return db.collection('dealers').find(filter).toArray();
  } else {
    if (filter.state) return fallbackDealers.filter(d => d.state === filter.state);
    return fallbackDealers;
  }
}

app.get('/', (req, res) => {
  res.send({ message: "Car Dealership Express API running", endpoints: ["/dealers", "/dealers/:id", "/dealers/state/:state", "/dealers/:id/reviews", "/cars.png"] });
});

app.get('/dealers', async (req, res) => {
  const dealers = await getDealersFromDb();
  res.json(dealers);
});

app.get('/dealers/:id', async (req, res) => {
  const id = req.params.id;
  if (db) {
    const dealer = await db.collection('dealers').findOne({ _id: new ObjectId(id) });
    return res.json(dealer);
  } else {
    const dealer = fallbackDealers.find(d => d._id === id) || fallbackDealers[0];
    return res.json(dealer);
  }
});

app.get('/dealers/state/:state', async (req, res) => {
  const state = req.params.state;
  const dealers = await getDealersFromDb({ state });
  res.json(dealers);
});

app.get('/dealers/:id/reviews', async (req, res) => {
  const id = req.params.id;
  if (db) {
    const reviews = await db.collection('reviews').find({ dealerId: id }).toArray();
    return res.json(reviews);
  } else {
    return res.json(fallbackReviews[id] || []);
  }
});

app.post('/dealers/:id/reviews', async (req, res) => {
  const id = req.params.id;
  const review = req.body;
  review.dealerId = id;
  review.created_at = new Date().toISOString();
  if (db) {
    const r = await db.collection('reviews').insertOne(review);
    res.json({ insertedId: r.insertedId });
  } else {
    // create a simple id and push into fallbackReviews
    const newId = "r" + Date.now();
    const r = { id: newId, ...review };
    if (!fallbackReviews[id]) fallbackReviews[id] = [];
    fallbackReviews[id].push(r);
    res.json({ insertedId: newId, review: r });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express API listening on ${PORT}`);
});
