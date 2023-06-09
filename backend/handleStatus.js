const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleStatus = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db();
    const { displayName } = req.params;
    const { status } = req.body;
    const { playlistStatus, selectedPlaylistLink } = req.body;

    console.log(displayName, selectedPlaylistLink);

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

    const statusId = uuidv4();

    //update the user's status array
    await db.collection("users").updateOne(
      { displayName: displayName },
      {
        $push: {
          status: {
            id: statusId,
            status: status,
            playlistStatus: playlistStatus || selectedPlaylistLink,
            comments: [],
          },
        },
      }
    );

    return res
      .status(200)
      .json({ status: 200, success: true, message: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ statusbar: 500, success: false, message: error.message });
  }
};

module.exports = { handleStatus };
