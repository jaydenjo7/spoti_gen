// import React, { useState } from "react";
// import styled from "styled-components";
// import { AiFillHeart } from "react-icons/ai";
// import { AiOutlineHeart } from "react-icons/ai";
// import { BsChatText } from "react-icons/bs";
// import { BiCommentDetail } from "react-icons/bi";
// import { AiOutlineRetweet } from "react-icons/ai";
// import { FiShare } from "react-icons/fi";
// import { COLORS } from "../GlobalStyles";

// const ActionIcons = () => {
//   const [isliked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   return (
//     <>
//       <ActionBtnContainer>
//         <StyledBtn
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsLiked(!isliked);
//             if (isliked) {
//               setLikeCount(likeCount - 1);
//             } else {
//               setLikeCount(likeCount + 1);
//             }
//           }}
//         >
//           {isliked ? (
//             <StyledLike style={{ fill: `${COLORS.darkGrey} ` }} />
//           ) : (
//             <StyledNotLiked />
//           )}
//           <span style={{ color: COLORS.darkGrey }}>{likeCount}</span>
//         </StyledBtn>
//         <StyledBtn>
//           <StyledShare />
//         </StyledBtn>
//       </ActionBtnContainer>
//       <StyledSeparator />
//     </>
//   );
// };

// const StyledSeparator = styled.div`
//   width: 640px;
//   height: 1px;
//   background-color: ${COLORS.darkGrey};
//   border-bottom: 1px solid ${COLORS.grey};
//   margin-top: 15px;
//   margin-bottom: 25px;
// `;

// const StyledBtn = styled.button`
//   background: none;
//   border: none;
//   margin-bottom: 15px;
// `;

// const StyledLike = styled(AiFillHeart)`
//   height: 15px;
//   width: 15px;

//   cursor: pointer;
// `;

// const StyledNotLiked = styled(AiOutlineHeart)`
//   height: 15px;
//   width: 15px;
//   color: ${COLORS.darkGrey};
//   cursor: pointer;
//   /* margin-bottom: 15px; */
// `;

// const StyledShare = styled(FiShare)`
//   height: 15px;
//   width: 15px;
// `;

// const ActionBtnContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 200px);
//   grid-gap: 5px;
//   margin: 0 5px;
//   margin-right: 50px;
// `;
// export default ActionIcons;
