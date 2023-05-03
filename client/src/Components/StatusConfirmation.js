import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

const StatusConfirmation = () => {
  return (
    <ModalContainer>
      Status was successfully added to the feedpage!
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  color: ${COLORS.green};
  background-color: ${COLORS.darkerGrey};
`;

export default StatusConfirmation;
