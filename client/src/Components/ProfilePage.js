import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../useAuth";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import StatusModal from "./StatusModal";
import StatusConfirmation from "./StatusConfirmation";

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
  const [statusConfirmation, setStatusConfirmation] = useState(false);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePlaylistChange = (e) => {
    setSelectedPlaylistLink(e.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPlaylistLink("");
  };

  //sends status to server
  const handleSubmit = () => {
    if (!status || !selectedPlaylistLink) return;
    axios
      .post(`/api/users/${displayName}/status`, {
        status,
        selectedPlaylistLink,
      })
      .then((res) => {
        const data = res.data;
        setStatus("");
        setSelectedPlaylistLink("");
        setShowModal(false);
        setStatusConfirmation(true);
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

  //makes confirmation message go away after 3 seconds
  useEffect(() => {
    if (statusConfirmation) {
      const timer = setTimeout(() => {
        setStatusConfirmation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusConfirmation]);

  return (
    <>
      <StyledProfilePage>
        {showModal && (
          <StatusModal
            status={status}
            playlistStatus={selectedPlaylistLink}
            onStatusChange={handleStatusChange}
            onPlaylistChange={handlePlaylistChange}
            onSubmit={handleSubmit}
            selectedPlaylistLink={selectedPlaylistLink}
          />
        )}

        <div>{statusConfirmation && <StatusConfirmation />}</div>

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
                <StyledShareButton
                  key={playlistLinks[index]}
                  onClick={() => {
                    setShowModal((prevState) => !prevState);
                    setSelectedPlaylistLink(playlistLinks[index]);
                  }}
                >
                  Share to your feed
                </StyledShareButton>
              </div>
            </div>
          ))}
        </StyledPlaylistImageContainer>
      </StyledProfilePage>
    </>
  );
};

const StyledShareButton = styled.button`
  margin-top: 10px;
  margin-left: 10px;
  background-color: ${COLORS.green};
  color: white;
  border-radius: 30px;
  border: none;
  cursor: pointer;
`;

const StyledPlaylistImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledPlaylistImages = styled.img`
  height: 200px;
  margin: 10px;
  width: 200px;
  background-color: ${COLORS.black};
  box-shadow: 0px 0px 10px 2px ${COLORS.green};
`;

const StyledProfilePage = styled.div`
  height: 100vh;
  background-color: ${COLORS.black};
  overflow: auto;
`;

const StyledProfilePic = styled.img`
  border-radius: 50%;
  margin-left: 20px;
`;

export default ProfilePage;
