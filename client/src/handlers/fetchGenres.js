import React from "react";
import axios from "axios";
// spotifyApi.js

export const fetchGenres = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = response.data;
    const filteredGenres = data.genres.filter(
      (genre) =>
        genre === "rock" ||
        genre === "pop" ||
        genre === "hip-hop" ||
        genre === "jazz" ||
        genre === "classical"
    );
    return filteredGenres;
  } catch (err) {
    console.error(err);
  }
};
