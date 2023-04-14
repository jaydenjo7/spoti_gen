import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

const StatusModal = ({ status, onStatusChange, onSubmit }) => {
  return (
    <ModalContainer>
      <div>
        <StyledStatusInput
          type={"text"}
          value={status}
          onChange={onStatusChange}
          placeholder="Tell people about your playlist!"
          required
        />
      </div>
      <div>
        <StyledStatusInput
          type={"text"}
          value={status}
          onChange={onStatusChange}
          placeholder="Paste the link to your playlist!"
          required
        />
      </div>
      <StyledPostBtn onClick={onSubmit}>Post</StyledPostBtn>
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
  background-color: ${COLORS.darkerGrey};
`;

const StyledPostBtn = styled.button`
  margin-top: 10px;
  border-radius: 20px;
  border: none;
  padding: 10px;
  background-color: ${COLORS.green};
  color: white;
  font-weight: bold;
  cursor: pointer;
  height: 30px;
`;

const StyledStatusInput = styled.input`
  background-color: ${COLORS.darkerGrey};
  border-color: ${COLORS.green};
  height: 50px;
  width: 400px;
  border: none;
  margin-top: 15px;
  ::placeholder {
    color: gray;
  }
`;

export default StatusModal;
