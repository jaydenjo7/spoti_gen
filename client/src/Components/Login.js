import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=acef137a01a44960b92c90df6bf914d5&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-private%20user-read-email%20playlist-modify-public%20playlist-modify-private%20playlist-read-collaborative";

const Login = () => {
  return (
    <>
      <StyledLoginPage>
        <StyledLogin>
          <div>
            <StyledWelcomeText>Welcome to Spotigen!</StyledWelcomeText>
            <StyledWelcomeText>
              The steps are simple. You pick three genres of music, click
              generate playlist, and your new playlist will be waiting for you
              in your Spotify account!
            </StyledWelcomeText>
            <StyledWelcomeText>
              <br /> Be sure to head to our feed page and let people know how
              you like it!
            </StyledWelcomeText>
          </div>
          <StyledButton>
            <a
              style={{ textDecoration: "none", color: `white` }}
              href={AUTH_URL}
            >
              Login to Spotigen
            </a>
          </StyledButton>
        </StyledLogin>
      </StyledLoginPage>
    </>
  );
};

const StyledWelcomeText = styled.p`
  color: ${COLORS.green};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 75px;
`;

const StyledLoginPage = styled.div`
  background-color: ${COLORS.black};
  height: 100vh;
`;

const StyledLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%, -50%);
`;

const StyledButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${COLORS.green};
  border: none;
  border-radius: 30px;
  padding: 10px;
  width: 200px;
  cursor: pointer;
`;

export default Login;
