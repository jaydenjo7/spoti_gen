const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
app.use(express.json());

const { SPOTIFY_CLIENT_SECRET } = process.env;
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_URI, options);

//endpoint that uses spotify api to generate recommended songs based on user's choice
app.get("/api/recommendations", async (req, res) => {
  console.log("genres:", req.query.genres);
  console.log("limit:", req.query.limit);
  const { genres, limit } = req.query;
  const accessToken = req.headers.authorization.split(" ")[1];
  console.log("accessToken:", accessToken);
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const response = await spotifyApi.getRecommendations({
      limit: limit,
      seed_genres: genres.split(","), // convert genres to an array
    });

    console.log("response body", response);
    const tracks = response.body.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      imageUrl: track.album.images[0].url,
      previewUrl: track.preview_url,
    }));
    console.log("tracks:", tracks);
    res.json({ tracks: tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  const spotifyApi = new SpotifyWebApi({
    clientId: "acef137a01a44960b92c90df6bf914d5",
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:3000",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });

      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", async (req, res) => {
  const code = req.body.code;
  console.log("Received code:", code); // added console log

  const spotifyApi = new SpotifyWebApi({
    clientId: "acef137a01a44960b92c90df6bf914d5",
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:3000",
  });

  try {
    await client.connect();
    const db = client.db();

    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log("Access token granted:", data.body.access_token);

    const { access_token, refresh_token, expires_in } = data.body;

    // Get user's profile info using the Spotify API
    spotifyApi.setAccessToken(access_token);
    const user = await spotifyApi.getMe();

    // Store the user's data in MongoDB

    const existingUser = await db
      .collection("users")
      .findOne({ spotifyUsername: user.body.id });
    if (existingUser) {
      console.log("User already exists in database:", existingUser);
      return res.json({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      });
    }

    await db.collection("users").insertOne({
      _id: uuidv4(),
      spotifyUsername: user.body.id,
      displayName: user.body.display_name,
      profilePicture: user.body.images[0]?.url,
      email: user.body.email,
      playlists: [],
      status: [],
    });

    res.json({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  } finally {
    client.close();
  }
});

app.listen(3001, () => {
  console.log("Server started on port 3001"); // added console log
});
