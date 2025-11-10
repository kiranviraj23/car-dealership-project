const { MongoClient } = require('mongodb');
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cardealers";

async function seed() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db();
  await db.collection('dealers').deleteMany({});
  await db.collection('reviews').deleteMany({});

  const dealers = [
    { name: "Sunset Motors", state: "Kansas", city:"Wichita", address:"101 Main St", phone:"555-1001" },
    { name: "Prairie Auto", state: "Kansas", city:"Topeka", address:"202 Elm St", phone:"555-1002" },
    { name: "Coastline Cars", state: "California", city:"San Diego", address:"303 Beach Ave", phone:"555-2003" }
  ];
  const r = await db.collection('dealers').insertMany(dealers);
  const ids = Object.values(r.insertedIds).map(id => id.toString());

  const reviews = [
    { dealerId: ids[0], user:"alice", rating:5, review:"Great service and friendly staff" },
    { dealerId: ids[0], user:"bob", rating:4, review:"Nice selection of cars" },
    { dealerId: ids[1], user:"charlie", rating:3, review:"Average experience" }
  ];
  await db.collection('reviews').insertMany(reviews);
  console.log('Seeded DB with dealers and reviews.');
  await client.close();
}

seed().catch(console.error);
