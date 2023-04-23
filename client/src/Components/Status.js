import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { COLORS } from "../GlobalStyles";
import { BiCommentAdd } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

const Status = ({
  statusText,
  profilePic,
  displayName,
  playlistStatus,
  statusId,
}) => {
  const [isliked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const navigate = useNavigate();

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!playlistStatus || !comment) return;
    axios
      .post(`/api/users/${displayName}/comments`, { comment })
      .then((res) => {
        const data = res.data;
        setComment("");
      })
      .catch((err) => {
        console.log(err);
      });
    setComments([...comments, comment]);
  };

  const handleClick = (e) => {
    navigate(`/feed/${statusId}`);
    e.preventDefault();
  };

  console.log(statusId);

  return (
    <nav onClick={handleClick}>
      <PageLayout>
        <UserInfoContainer>
          <StyledProfilePic src={profilePic} />
          <NameContainer>
            <div>
              <Link
                style={{ textDecoration: "none" }}
                to={`/profile`}
                onClick={(e) => e.stopPropagation()}
              >
                <StyledDisplayName>{displayName}</StyledDisplayName>
              </Link>
            </div>
          </NameContainer>
        </UserInfoContainer>
        <StatusTextContainer>
          <p style={{ color: COLORS.green }}>{statusText}</p>
          <p style={{ color: COLORS.green }}>
            <a
              style={{ textDecoration: "none", color: COLORS.green }}
              href={playlistStatus}
            >
              {playlistStatus}
            </a>
          </p>
          <ActionBtnContainer>
            <StyledBtn>
              <CommentIcon onClick={() => setShowCommentForm(true)}>
                <StyledComment />
              </CommentIcon>
            </StyledBtn>
            {/* //Like Button logic  */}
            <StyledBtn
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isliked);
                if (isliked) {
                  setLikeCount(likeCount - 1);
                } else {
                  setLikeCount(likeCount + 1);
                }
              }}
            >
              {isliked ? (
                <StyledLike style={{ fill: `${COLORS.darkGrey} ` }} />
              ) : (
                <StyledNotLiked />
              )}
              <span style={{ color: COLORS.darkGrey }}>{likeCount}</span>
            </StyledBtn>
            <StyledBtn>
              <StyledShare />
            </StyledBtn>
          </ActionBtnContainer>
          <StyledSeparator />
        </StatusTextContainer>
      </PageLayout>
    </nav>
  );
};

const CommentIcon = styled.span`
  cursor: pointer;
`;

const StyledComment = styled(BiCommentAdd)`
  height: 100%;
  width: 15px;
  color: ${COLORS.green};
  margin-right: 500px;
  /* margin-top: 20px; */
`;

const StyledBtn = styled.button`
  background: none;
  border: none;
  margin-bottom: 15px;
`;

const StyledLike = styled(AiFillHeart)`
  height: 15px;
  width: 15px;
  cursor: pointer;
`;

const StyledNotLiked = styled(AiOutlineHeart)`
  height: 15px;
  width: 15px;
  color: ${COLORS.darkGrey};
  cursor: pointer;
  /* margin-bottom: 15px; */
`;

const StyledShare = styled(FiShare)`
  height: 15px;
  width: 15px;
`;

const ActionBtnContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-gap: 5px;
  margin: 0 5px;
  margin-right: 50px;
`;

const StatusTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDisplayName = styled.p`
  margin-top: 5px;
  font-weight: bold;
  color: ${COLORS.green};
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledProfilePic = styled.img`
  border-radius: 30px;
  height: 50px;
  width: 50px;
  display: flex;
  margin-right: 15px;
`;

const UserInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 500px;
  flex-direction: row;
  align-items: center;
  * {
    margin-right: 15px;
  }
`;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

const StyledSeparator = styled.div`
  width: 640px;
  height: 1px;
  background-color: ${COLORS.darkGrey};
  border-bottom: 1px solid ${COLORS.grey};
  margin-top: 15px;
  margin-bottom: 25px;
`;
export default Status;
