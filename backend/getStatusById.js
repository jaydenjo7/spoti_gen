const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getStatusById = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db();
    const { statusId, displayName } = req.params;

    const user = await db.collection("users").findOne({ displayName });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "could not find user",
      });
    }

    const status = user.status.find((s) => s.id === statusId);

    if (!status) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Status not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: status,
      message: " status found",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};
module.exports = { getStatusById };
