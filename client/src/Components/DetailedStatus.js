import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../useAuth";
import axios from "axios";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { BiCommentDetail } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { FiShare } from "react-icons/fi";

const DetailedStatus = ({ code }) => {
  const accessToken = useAuth(code);
  let { statusId } = useParams();
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [statusData, setStatusData] = useState();
  const [isliked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // axios get status by id
  useEffect(() => {
    if (!accessToken || !displayName) return;
    const getStatusById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/feed/${displayName}/${statusId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = response.data.data;
        console.log(data);
        setStatusData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getStatusById();
  }, [accessToken, displayName]);

  //sends comment to db when post button is clicked
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!statusData.playlistStatus || !comment || !statusData.status) return;
    axios
      .post(
        `http://localhost:3001/api/users/${displayName}/${statusId}/comments`,
        { comment }
      )
      .then((res) => {
        const data = res.data;
        setComment("");
        setComments([...comments, { comment: data.comment, id: data.id }]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   console.log(statusData.comments);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <StyledCommentPage>
        {" "}
        <div>
          {" "}
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

            {/* make sure that statusData is defined */}
            {statusData && (
              <StatusTextContainer>
                <p style={{ color: COLORS.green }}>{statusData.status}</p>
                <p style={{ color: COLORS.green }}>
                  <a
                    style={{ textDecoration: "none", color: COLORS.green }}
                    href={statusData.playlistStatus}
                  >
                    {statusData.playlistStatus}
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
            )}

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
            {statusData && statusData.comments && (
              <CommentSection>
                {statusData.comments.map((comment) => (
                  <Comment key={comment.id}>{comment.comment}</Comment>
                ))}
              </CommentSection>
            )}
          </PageLayout>
        </div>
      </StyledCommentPage>
    );
  }
};

const StyledCommentPage = styled.div`
  background-color: ${COLORS.black};
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  margin-top: 66px;
`;

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

export default DetailedStatus;
