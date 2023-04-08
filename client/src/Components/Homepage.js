import React from "react";
import useAuth from "../useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { fetchGenres } from "../handlers/fetchGenres";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

const Homepage = ({ code }) => {
  const accessToken = useAuth(code);

  const [genres, setGenres] = useState(["", "", ""]);
  const [allGenres, setAllGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlistLink, setPlaylistLink] = useState("");
  const [username, setUsername] = useState("");

  //fetch user's spotify username
  useEffect(() => {
    if (!accessToken) return;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUsername(res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  console.log(username);

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

  //check if songs array is populated
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
      return playlistId;
    } catch (error) {
      console.error(error);
    }
  };

  //add playlist link to user's database. called in "addTracksToPlaylist" function
  const updateUserPlaylist = async (username, playlistLink) => {
    try {
      await axios.patch(`/api/users/${username}/playlists`, {
        playlists: playlistLink,
        username: username,
      });
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
      const playlistLink = `https://open.spotify.com/playlist/${playlistId}`;
      setPlaylistLink(playlistLink);
      await updateUserPlaylist(username, playlistLink);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <StyledHomepage>
        <StyledDropdownContainer>
          <p style={{ color: `${COLORS.green}`, marginTop: "30px" }}>
            Choose your genres:{" "}
          </p>
          <StyledDropdowns
            value={genres[0]}
            onChange={(event) => handleGenreChange(event, 0)}
          >
            <option value="">--Genre 1--</option>
            {allGenres.map((genre, index) => (
              <option key={index + genre} value={genre}>
                {genre}
              </option>
            ))}
          </StyledDropdowns>
          <StyledDropdowns
            value={genres[1]}
            onChange={(event) => handleGenreChange(event, 1)}
          >
            <option value="">--Genre 2--</option>
            {allGenres.map((genre, index) => (
              <option key={index + genre} value={genre}>
                {genre}
              </option>
            ))}
          </StyledDropdowns>
          <StyledDropdowns
            value={genres[2]}
            onChange={(event) => handleGenreChange(event, 2)}
          >
            <option value="">--Genre 3--</option>
            {allGenres.map((genre, index) => (
              <option key={index + genre} value={genre}>
                {genre}
              </option>
            ))}
          </StyledDropdowns>
          <StyledButton onClick={generatePlaylistSongs}>
            Generate Playlist
          </StyledButton>
        </StyledDropdownContainer>
        <StyledMessage>
          {playlistLink && (
            <p>
              Your playlist is ready! Click{" "}
              <a
                style={{ color: `${COLORS.green}` }}
                href={playlistLink}
                target="_blank"
              >
                here
              </a>{" "}
              to open it in Spotify.
            </p>
          )}
        </StyledMessage>
      </StyledHomepage>
    </>
  );
};

const StyledButton = styled.button`
  margin-top: 30px;
  background-color: ${COLORS.green};
  color: white;
  border-radius: 30px;
  border: none;
  cursor: pointer;
`;

const StyledMessage = styled.div`
  margin-top: 300px;
  color: ${COLORS.green};
  text-align: center;
`;

const StyledHomepage = styled.div`
  background-color: ${COLORS.black};
  height: 100vh;
`;

const StyledDropdownContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0px;
`;

const StyledDropdowns = styled.select`
  margin-top: 30px;

  select {
    background-color: ${COLORS.darkerGrey};
    color: ${COLORS.green};
  }

  option {
    background-color: ${COLORS.darkerGrey};
    color: ${COLORS.green};
  }
`;

export default Homepage;
