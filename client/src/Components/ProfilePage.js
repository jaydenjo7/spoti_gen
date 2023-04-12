import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../useAuth";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

const ProfilePage = ({ code }) => {
  const accessToken = useAuth(code);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [playlists, setPlaylists] = useState();
  const [playlistImages, setPlaylistImages] = useState([]);
  const [imageLink, setImageLink] = useState("");

  //fetch user's profile pic and display name
  useEffect(() => {
    if (!accessToken) return;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setDisplayName(res.data.display_name);
        setProfilePic(res.data.images[0].url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  //fetch user's generated playlists
  useEffect(() => {
    const getPlaylists = async () => {
      if (!accessToken || !displayName) return;
      try {
        const response = await axios.get(`/api/playlists/${displayName}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = response.data.data;
        // console.log(data);
        setPlaylists(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPlaylists();
  }, [accessToken, displayName]);

  //get playlist images
  useEffect(() => {
    const getPlaylistImages = async (playlistLink) => {
      if (!accessToken || !displayName || !playlistLink) return;
      try {
        //get the playlistId from the playlist link
        const playlistId = playlistLink.split("/playlist/")[1];
        console.log(playlistId);

        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log(response.data.external_urls.spotify);
        setPlaylistImages((prevImages) => [
          ...prevImages,
          response.data.images[1].url,
        ]);

        setImageLink(response.data.external_urls.spotify);
      } catch (error) {
        console.log(error);
      }
    };

    if (playlists) {
      playlists.map((playlist) => {
        const playlistLink = playlist.link;
        getPlaylistImages(playlistLink);
      });
    }
  }, [accessToken, displayName, playlists]);

  console.log(playlistImages);
  return (
    <>
      <StyledProfilePage>
        <h1
          style={{
            marginTop: "0px",
            color: `${COLORS.green}`,
            marginLeft: "20px",
          }}
        >
          Welcome, {displayName}
        </h1>
        <StyledProfilePic src={profilePic} />

        <h2 style={{ color: `${COLORS.green}` }}>Your Generated Playlists </h2>

        <StyledPlaylistImageContainer>
          {playlistImages.map((image, index) => (
            <a href={imageLink} key={index}>
              <StyledPlaylistImages src={image} key={index} />
            </a>
          ))}
        </StyledPlaylistImageContainer>
      </StyledProfilePage>
    </>
  );
};

const StyledPlaylistImageContainer = styled.div`
  display: flex;
`;

const StyledPlaylistImages = styled.img`
  height: 200px;
  margin: 5px;
  width: 200px;
`;

const StyledProfilePage = styled.div`
  background-color: ${COLORS.black};
  height: 100vh;
`;

const StyledProfilePic = styled.img`
  border-radius: 50%;
  margin-left: 20px;
`;

export default ProfilePage;
