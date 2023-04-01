const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const dotenv = require("dotenv");

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
app.use(express.json());

const { SPOTIFY_CLIENT_SECRET } = process.env;

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("hello");
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

app.post("/login", (req, res) => {
  const code = req.body.code;
  console.log("Received code:", code); // added console log

  const spotifyApi = new SpotifyWebApi({
    clientId: "acef137a01a44960b92c90df6bf914d5",
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:3000",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log("Access token granted:", data.body.access_token); // added console log
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err); // added console log
      res.sendStatus(400);
    });
});

app.listen(3001, () => {
  console.log("Server started on port 3001"); // added console log
});
