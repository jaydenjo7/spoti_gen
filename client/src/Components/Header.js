import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { COLORS } from "../GlobalStyles";

const Header = () => {
  const accessToken = localStorage.getItem("accessToken");
  const notLoggedIn = !accessToken;
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setProfilePic(res.data.images[0].url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  return (
    <HeaderContainer>
      <StyledTitle>Spotigen</StyledTitle>
      <div>
        <StyledLinks to="/">Homepage</StyledLinks>
      </div>
      <div>
        <StyledLinks to="/profile">Profile</StyledLinks>
      </div>
      <div>
        <StyledLinks to="/feed">Feed</StyledLinks>
      </div>
      {notLoggedIn ? (
        <StyledLinks to="/login">
          <p>Login</p>
        </StyledLinks>
      ) : (
        <StyledProfilePic
          src={profilePic}
          alt="user's Spotify profile picture"
        />
      )}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.darkerGrey};
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
`;

const StyledLinks = styled(NavLink)`
  text-decoration: none;
  color: ${COLORS.green};

  &.active {
    border-bottom: 2px solid white;
  }
`;

const StyledProfilePic = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
`;

const StyledTitle = styled.h2`
  color: ${COLORS.green};
`;

export default Header;
