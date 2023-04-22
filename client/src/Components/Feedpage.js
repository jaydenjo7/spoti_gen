import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import useAuth from "../useAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import StatusModal from "./StatusModal";
import { MdPostAdd } from "react-icons/md";
import Status from "./Status";

const Feedpage = ({ code }) => {
  const accessToken = useAuth(code);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [status, setStatus] = useState("");
  const [statusArr, setStatusArr] = useState([]);
  const [playlistStatus, setPlaylistStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePlaylistChange = (e) => {
    setPlaylistStatus(e.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
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

  //fetches all of the user's statuses
  useEffect(() => {
    if (!accessToken || !displayName) return;
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(`/api/status/${displayName}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data.data;
        setStatusArr(data);
        // console.log(data[0].id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStatuses();
  }, [accessToken, displayName]);

  return (
    <StyledFeedpage>
      <StatusBtnContainer>
        {showModal && (
          <StatusModal
            status={status}
            playlistStatus={playlistStatus}
            onStatusChange={handleStatusChange}
            onPlaylistChange={handlePlaylistChange}
            onSubmit={handleSubmit}
          />
        )}
      </StatusBtnContainer>
      <div>
        <StyledPostBtnContainer>
          <StyledPostBtn
            onClick={() => {
              setShowModal((prevState) => !prevState);
            }}
            style={{ cursor: "pointer", color: COLORS.green }}
          />
        </StyledPostBtnContainer>
      </div>
      <StatusContainer>
        {statusArr.map((status) => {
          return (
            <Status
              key={status.id}
              statusId={status.id}
              statusText={status.status}
              playlistStatus={status.playlistStatus}
              profilePic={profilePic}
              displayName={displayName}
            />
          );
        })}
      </StatusContainer>
    </StyledFeedpage>
  );
};

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 90px;
`;

const StyledPostBtnContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1;
`;

const StatusBtnContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  max-width: 640px;
`;

const StyledFeedpage = styled.div`
  background-color: ${COLORS.black};
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  margin-top: 66px;
`;

const StyledPostBtn = styled(MdPostAdd)`
  height: 50px;
  width: 50px;
`;

export default Feedpage;
