import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

const StatusModal = ({
  status,
  playlistStatus,
  onStatusChange,
  onPlaylistChange,
  onSubmit,
  selectedPlaylistLink,
}) => {
  return (
    <ModalContainer>
      <div>
        <h1 style={{ color: COLORS.green }}>Add a post to the feed!</h1>
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
          onChange={onPlaylistChange}
          placeholder="Paste the link to your playlist!"
          defaultValue={selectedPlaylistLink}
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
  color: white;
  height: 50px;
  width: 400px;
  border: none;
  margin-top: 15px;
  ::placeholder {
    color: gray;
  }
`;

export default StatusModal;
