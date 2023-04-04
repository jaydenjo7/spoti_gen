import React from "react";
import useAuth from "../useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { fetchGenres } from "../handlers/fetchGenres";

const Homepage = ({ code }) => {
  const accessToken = useAuth(code);

  const [genres, setGenres] = useState(["", "", ""]);
  const [allGenres, setAllGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlistLink, setPlaylistLink] = useState("");

  //Fetch genres and filter them
  useEffect(() => {
    const fetchGenresAndSetState = async () => {
      const filteredGenres = await fetchGenres(accessToken);
      setAllGenres(filteredGenres);
    };
    fetchGenresAndSetState();
  }, [accessToken]);

  const handleGenreChange = (event, index) => {
    const selectedGenre = event.target.value;
    const newGenres = [...genres];
    newGenres[index] = selectedGenre;
    setGenres(newGenres);
  };

  //generate 15 songs based on selected genres
  const generatePlaylistSongs = async () => {
    try {
      const response = await axios.get("/api/recommendations", {
        params: {
          genres: genres.join(","),
          limit: 30,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setSongs(data.tracks);
    } catch (err) {
      console.error(err.response.data.error.message);
    }
  };

  useEffect(() => {
    const songCheck = async () => {
      if (songs.length > 0) {
        try {
          const playlistId = await createPlaylist();
          await addTracksToPlaylist(playlistId);
        } catch (error) {
          console.error(error.response.data.error.message);
        }
      }
    };
    songCheck();
  }, [songs, accessToken]);

  //create a playlist in the user's Spotify account
  const createPlaylist = async () => {
    try {
      const response = await axios.post(
        "https://api.spotify.com/v1/me/playlists",
        { name: "My Spotigen Playlist" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const createdPlaylistData = response.data;
      const playlistId = createdPlaylistData.id;
      console.log(playlistId);
      return playlistId;
    } catch (error) {
      console.error(error);
    }
  };

  //add the generated songs to the playlist
  const addTracksToPlaylist = async (playlistId) => {
    console.log(songs);
    try {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: songs.map((song) => song.uri) },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPlaylistLink(`https://open.spotify.com/playlist/${playlistId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <select
        value={genres[0]}
        onChange={(event) => handleGenreChange(event, 0)}
      >
        <option value="">--Choose a genre--</option>
        {allGenres.map((genre, index) => (
          <option key={index + genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <select
        value={genres[1]}
        onChange={(event) => handleGenreChange(event, 1)}
      >
        <option value="">--Choose a genre--</option>
        {allGenres.map((genre, index) => (
          <option key={index + genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <select
        value={genres[2]}
        onChange={(event) => handleGenreChange(event, 2)}
      >
        <option value="">--Choose a genre--</option>
        {allGenres.map((genre, index) => (
          <option key={index + genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <button onClick={generatePlaylistSongs}>Generate Playlist</button>
      <div>
        {playlistLink && (
          <p>
            Your playlist is ready! Click{" "}
            <a href={playlistLink} target="_blank">
              here
            </a>{" "}
            to open it in Spotify.
          </p>
        )}
      </div>
    </>
  );
};

export default Homepage;
