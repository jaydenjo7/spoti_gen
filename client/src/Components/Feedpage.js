import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import useAuth from "../useAuth";
import axios from "axios";
import { useState, useEffect } from "react";

const Feedpage = ({ code }) => {
  const accessToken = useAuth(code);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [status, setStatus] = useState("");

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

  //sends status to server
  const handleSubmit = () => {
    if (!status) return;
    axios
      .post(`/api/users/${displayName}/status`, { status })
      .then((res) => {
        const data = res.data;
        setStatus("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StyledFeedpage>
      <StyledStatusContainer>
        <StyledProfilePic src={profilePic} />
        <StyledStatusInput
          type={"text"}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Tell people about your playlist!"
        />
      </StyledStatusContainer>
      <StatusBtnContainer>
        <StyledPostBtn
          onClick={() => {
            handleSubmit();
          }}
          type="submit"
          style={{ cursor: "pointer", color: COLORS.green }}
        >
          Post
        </StyledPostBtn>
      </StatusBtnContainer>
    </StyledFeedpage>
  );
};

const StyledPostBtn = styled.button`
  border-radius: 20px;
  border: none;
  padding: 10px;
  background-color: ${COLORS.primary};
  color: white;
  font-weight: bold;
  cursor: pointer;
  height: 30px;
`;

const StatusBtnContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  max-width: 640px;
`;

const StyledStatusInput = styled.input`
  height: 50px;
  width: 512px;
  border: none;
  margin-top: 15px;
  ::placeholder {
    color: gray;
  }
`;

const StyledProfilePic = styled.img`
  border-radius: 30px;
  height: 50px;
  width: 50px;
  display: flex;
  margin-right: 15px;
`;

const StyledStatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledFeedpage = styled.div`
  background-color: ${COLORS.black};
  height: 100vh;
`;

export default Feedpage;
