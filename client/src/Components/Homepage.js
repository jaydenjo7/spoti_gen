import React from "react";
import useAuth from "../useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { fetchGenres } from "../handlers/fetchGenres";

const Homepage = ({ code }) => {
  const accessToken = useAuth(code);

  const [genres, setGenres] = useState(["", "", ""]);
  const [songs, setSongs] = useState([]);
  const [playlistLink, setPlaylistLink] = useState("");

  const handleGenreChange = (event, index) => {
    const selectedGenre = event.target.value;
    const newGenres = [...genres];
    newGenres[index] = selectedGenre;
    setGenres(newGenres);
  };

  //Fetch genres and filter them
  useEffect(() => {
    const fetchGenresAndSetState = async () => {
      const filteredGenres = await fetchGenres(accessToken);
      setGenres(filteredGenres);
    };
    fetchGenresAndSetState();
  }, [accessToken]);

  //generate 15 songs based on selected genres
  const generatePlaylistSongs = async () => {
    try {
      const response = await axios.get("/api/recommendations", {
        params: {
          genres: genres.join(","),
          limit: 15,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setSongs(data.tracks);

      const playlistId = await createPlaylist();
      await addTracksToPlaylist(playlistId);
    } catch (err) {
      console.error(err.response.data.error.message);
    }
  };
  console.log(songs);

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
        {genres.map((genre, index) => (
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
        {genres.map((genre, index) => (
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
        {genres.map((genre, index) => (
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

//bootstrap version
// import React from "react";
// import useAuth from "../useAuth";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { Form, Button } from "react-bootstrap";

// const Homepage = ({ code }) => {
//   const accessToken = useAuth(code);

//   const [genres, setGenres] = useState(["", "", ""]);
//   const [songs, setSongs] = useState([]);
//   const [playlistLink, setPlaylistLink] = useState("");

//   const handleGenreChange = (event, index) => {
//     const selectedGenre = event.target.value;
//     const newGenres = [...genres];
//     newGenres[index] = selectedGenre;
//     setGenres(newGenres);
//   };

//   //Fetch genres and filter them
//   useEffect(() => {
//     const fetchGenres = async () => {
//       try {
//         const response = await axios.get(
//           "https://api.spotify.com/v1/recommendations/available-genre-seeds",
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
//         const data = response.data;
//         const filteredGenres = data.genres.filter(
//           (genre) =>
//             genre === "rock" ||
//             genre === "pop" ||
//             genre === "hip-hop" ||
//             genre === "jazz" ||
//             genre === "classical" ||
//             genre === "r-n-b" ||
//             genre === "alternative" ||
//             genre === "k-pop" ||
//             genre === "french" ||
//             genre === "afrobeat"
//         );
//         setGenres(filteredGenres);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchGenres();
//   }, [accessToken]);

//   //generate 15 songs based on selected genres
//   const generatePlaylist = async () => {
//     try {
//       const response = await axios.get(
//         `/api/recommendations?genres=${genres.join(",")}&limit=15`
//       );
//       const data = response.data;
//       setSongs(data.tracks);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   //create playist in user's account
//   const createPlaylist = async () => {
//     try {
//       const response = await axios.post(
//         "https://api.spotify.com/v1/me/playlists",
//         { name: "My Spotigen Playlist" },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const createdPlaylistData = response.data;
//       const playlistId = createdPlaylistData.id;
//       return playlistId;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   //add the generated songs to the playlist
//   const addTracksToPlaylist = async (playlistId) => {
//     try {
//       await axios.post(
//         `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//         { uris: songs.map((song) => song.uri) },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setPlaylistLink(`https://open.spotify.com/playlist/${playlistId}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <Form>
//         <Form.Group controlId="formGenre1">
//           <Form.Label>Genre 1:</Form.Label>
//           <Form.Control
//             as="select"
//             value={genres[0]}
//             onChange={(event) => handleGenreChange(event, 0)}
//           >
//             <option value="">--Choose a genre--</option>
//             {genres.map((genre, index) => (
//               <option key={index + genre} value={genre}>
//                 {genre}
//               </option>
//             ))}
//           </Form.Control>
//         </Form.Group>

//         <Form.Group controlId="formGenre2">
//           <Form.Label>Genre 2:</Form.Label>
//           <Form.Control
//             as="select"
//             value={genres[1]}
//             onChange={(event) => handleGenreChange(event, 1)}
//           >
//             <option value="">--Choose a genre--</option>
//             {genres.map((genre, index) => (
//               <option key={index + genre} value={genre}>
//                 {genre}
//               </option>
//             ))}
//           </Form.Control>
//         </Form.Group>

//         <Form.Group controlId="formGenre3">
//           <Form.Label>Genre 3:</Form.Label>
//           <Form.Control
//             as="select"
//             value={genres[2]}
//             onChange={(event) => handleGenreChange(event, 2)}
//           >
//             <option value="">--Choose a genre--</option>
//             {genres.map((genre, index) => (
//               <option key={index + genre} value={genre}>
//                 {genre}
//               </option>
//             ))}
//           </Form.Control>
//         </Form.Group>

//         <Button onClick={generatePlaylist}>Generate Playlist</Button>
//       </Form>

//       {playlistLink && (
//         <div>
//           <Link to={{ pathname: playlistLink }} target="_blank">
//             Go to playlist
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Homepage;
