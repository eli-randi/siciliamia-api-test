const express = require("express");
const axios = require('axios');

const PORT = process.env.PORT || 3001;
const PUBLIC_API_URL = 'https://api.publicapis.org/entries';
const MONGO_DB_URL = "mongodb://localhost:27017/";
const MONGO_DB_NAME = "siciliamia";
const MONGO_DB_COLLECTION = "apiRequests"

const app = express();

app.get("/api", async (req, res) => {
  let responseFromApi;
  try {
    responseFromApi = await axios.get(PUBLIC_API_URL);
  } catch (error) {
    console.error(error);
    throw error;
  }
  const allApis = responseFromApi.data.entries;
  const searchTerm = req.query.API;
  let searchResults = allApis;

  if (searchTerm) {
    searchResults = searchResults.filter((row) => {
      return row['API']
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }
  storeRequestToDatabase(searchResults, searchTerm);
  res.send(searchResults);
})

const storeRequestToDatabase = (searchResults, searchTerm) => {
  const MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(MONGO_DB_URL, function (err, db) {
    if (err) throw err;
    const dbo = db.db(MONGO_DB_NAME);
    const objectToStore = { searchTerm: searchTerm, searchResults: searchResults };
    dbo.collection(MONGO_DB_COLLECTION).insertOne(objectToStore, function (err, res) {
      if (err) throw err;
      db.close();
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
