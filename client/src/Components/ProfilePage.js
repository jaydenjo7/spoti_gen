import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../useAuth";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import StatusModal from "./StatusModal";

const ProfilePage = ({ code }) => {
  const accessToken = useAuth(code);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [playlists, setPlaylists] = useState();
  const [playlistImages, setPlaylistImages] = useState([]);
  const [playlistLinks, setPlaylistLinks] = useState("");
  const [status, setStatus] = useState("");
  const [playlistStatus, setPlaylistStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylistLink, setSelectedPlaylistLink] = useState("");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePlaylistChange = (e) => {
    setPlaylistStatus(e.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPlaylistLink("");
  };

  //sends status to server
  const handleSubmit = () => {
    if (!status || !playlistStatus) return;
    axios
      .post(`/api/users/${displayName}/status`, { status, playlistStatus })
      .then((res) => {
        const data = res.data;
        setStatus("");
        setPlaylistStatus("");
        setShowModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        setPlaylists(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPlaylists();
  }, [accessToken, displayName]);

  //get playlist images and set state
  useEffect(() => {
    // const getPlaylistImages = async (playlistLink) => {
    //   if (!accessToken || !displayName || !playlistLink) return;
    //   try {
    //     //get the playlistId from the playlist link
    //     const playlistId = playlistLink.split("/playlist/")[1];

    //     const response = await axios.get(
    //       `https://api.spotify.com/v1/playlists/${playlistId}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //       }
    //     );
    //     setPlaylistLink(response.data.external_urls.spotify);
    //     return response.data.images[1].url;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // //Promise.all waits for all of the promises (fetching the playlistImages) from getPlaylistImages to be resolved before setting state

    // if (playlists) {
    //   Promise.all(
    //     playlists.map((playlist) => {
    //       const playlistLink = playlist.link;
    //       return getPlaylistImages(playlistLink);
    //     })
    //   ).then((images) => setPlaylistImages(images.filter(Boolean)));
    // }
    const getPlaylistImages = async (playlistLink) => {
      if (!accessToken || !displayName || !playlistLink) return;
      try {
        const playlistId = playlistLink.split("/playlist/")[1];
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return {
          image: response.data.images[1].url,
          link: response.data.external_urls.spotify,
        };
      } catch (error) {
        console.log(error);
      }
    };

    if (playlists) {
      Promise.all(playlists.map((playlist) => getPlaylistImages(playlist.link)))
        .then((results) => {
          setPlaylistImages(results.map((result) => result.image));
          setPlaylistLinks(results.map((result) => result.link));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [accessToken, displayName, playlists]);
  return (
    <>
      <StyledProfilePage>
        {showModal && (
          <StatusModal
            status={status}
            playlistStatus={playlistStatus}
            onStatusChange={handleStatusChange}
            onPlaylistChange={handlePlaylistChange}
            onSubmit={handleSubmit}
            selectedPlaylistLink={selectedPlaylistLink}
          />
        )}

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
            <div key={index}>
              <a href={playlistLinks[index]}>
                <StyledPlaylistImages src={image} key={index} />
              </a>
              <div>
                <button
                  key={playlistLinks[index]}
                  onClick={() => {
                    setShowModal((prevState) => !prevState);
                    setSelectedPlaylistLink(playlistLinks[index]);
                  }}
                >
                  share to your feed
                </button>
              </div>
            </div>
          ))}
        </StyledPlaylistImageContainer>
      </StyledProfilePage>
    </>
  );
};

const StyledPlaylistImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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
