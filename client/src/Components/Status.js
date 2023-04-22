import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { COLORS } from "../GlobalStyles";
import { BiCommentDetail } from "react-icons/bi";
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
                <StyledComment
                  onClick={() => {
                    setComment("");
                    setComments([]);
                  }}
                />
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

        {showCommentForm && (
          <CommentForm onSubmit={handleSubmitComment}>
            <CommentInput
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <CommentButton type="submit">Post</CommentButton>
            <CancelButton
              type="button"
              onClick={() => setShowCommentForm(false)}
            >
              Cancel
            </CancelButton>
          </CommentForm>
        )}
        {comments.length > 0 && (
          <CommentSection>
            {comments.map((comment) => (
              <Comment key={comment}>{comment}</Comment>
            ))}
          </CommentSection>
        )}
      </PageLayout>
    </nav>
  );
};

const CommentIcon = styled.span`
  cursor: pointer;
`;

const CommentSection = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const Comment = styled.div`
  background-color: #f2f2f2;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
`;

const CommentForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  margin-right: 10px;
  padding: 5px;
  border-radius: 5px;
  border: none;
`;

const StyledComment = styled(BiCommentDetail)`
  height: 15px;
  width: 15px;
  color: ${COLORS.green};
  margin-right: 500px;
  /* margin-top: 20px; */
`;

const CommentButton = styled.button`
  background-color: ${COLORS.green};
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: ${COLORS.green};
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
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
