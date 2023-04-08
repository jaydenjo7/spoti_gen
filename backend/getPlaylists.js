const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getPlaylists = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db();
    const { displayName } = req.params;
    const user = await db
      .collection("users")
      .findOne({ displayName: displayName });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "could not find user",
      });
    }

    const { playlists } = user;

    return res
      .status(200)
      .json({ status: 200, success: true, data: playlists });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "could not find playlists",
    });
  } finally {
    client.close();
  }
};

module.exports = { getPlaylists };
