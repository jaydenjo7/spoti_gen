import { FiLoader } from "react-icons/fi";
import styled, { keyframes } from "styled-components";
import { Keyframes } from "styled-components";
import React from "react";
import { COLORS } from "../GlobalStyles";

const Loading = () => {
  return (
    <LoadingContainer>
      <Loader />
    </LoadingContainer>
  );
};

const Rotate = keyframes`
0%{
    transform:rotate(0deg);
}
100% {
    transform: rotate(360deg);
}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${COLORS.black};
`;

const Loader = styled(FiLoader)`
  height: 35px;
  width: 20px;
  animation: rotate 2s infinite;
  animation-name: ${Rotate};
`;

export default Loader;
