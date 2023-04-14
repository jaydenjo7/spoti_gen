import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import useAuth from "../useAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import StatusModal from "./StatusModal";
import { MdPostAdd } from "react-icons/md";

const Feedpage = ({ code }) => {
  const accessToken = useAuth(code);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [status, setStatus] = useState("");
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

  const handleModalClose = () => {
    setShowModal(false);
  };

  //sends status to server
  const handleSubmit = () => {
    if (!status) return;
    axios
      .post(`/api/users/${displayName}/status`, { status })
      .then((res) => {
        const data = res.data;
        setStatus("");
        setShowModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StyledFeedpage>
      <StatusBtnContainer>
        {showModal && (
          <StatusModal
            status={status}
            onStatusChange={handleStatusChange}
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
    </StyledFeedpage>
  );
};

// const StyledPostBtnContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-end;
//   align-items: flex-end;
// `;

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

const StyledStatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledFeedpage = styled.div`
  background-color: ${COLORS.black};
  height: 100vh;
`;

const StyledPostBtn = styled(MdPostAdd)`
  height: 50px;
  width: 50px;
`;

export default Feedpage;
