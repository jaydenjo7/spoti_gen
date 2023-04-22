const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleComments = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();
    const { displayName, statusId } = req.params;
    const { comment } = req.body;

    console.log();

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

    //generate comment id
    const commentId = uuidv4();

    //find the status object with the matching statusId

    const statusIndex = user.status.findIndex((s) => s.id === statusId);

    if (statusId === -1) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "could not find status with that id",
      });
    }

    // add comment to the comments array in db
    user.status[statusIndex].comments.push({
      id: commentId,
      comment: comment,
    });

    console.log(user.status);

    // add comment to status array in db
    await db
      .collection("users")
      .updateOne(
        { displayName: displayName },
        { $set: { status: user.status } }
      );

    return res
      .status(200)
      .json({ status: 200, success: true, message: "comment added" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

module.exports = { handleComments };
