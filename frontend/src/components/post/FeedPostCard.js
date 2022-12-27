import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import axios from "axios";
import styled from "styled-components";
import PostModal from "./desktop/PostModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";

function FeedPostCard({ post }) {
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const navigate = useNavigate();

  const { user } = useSelector(state => state.user);

  const [showPostModal, setShowPostModal] = useState(false);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(null);
  const [commentsCount, setCommentsCount] = useState(post.comments.length);
  const [likesCount, setLikesCount] = useState(post.usersLiked.length);
  const [moreOption, setMoreOption] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async () => {
    await axios
      .post("/api/v1/comment", {
        id: post._id,
        body: comment
      })
      .then(res => {
        setComment("");
        setCommentsCount(prev => prev + 1);
      })
      .catch(err => console.log(err.message));
  };

  const handleLike = async () => {
    if (loading) return;
    else {
      setLoading(true);
      await axios
        .post("/api/v1/like", { id: post._id })
        .then(res => {
          setLiked(prev => !prev);
          liked ? setLikesCount(prev => prev - 1) : setLikesCount(prev => prev + 1);
          setLoading(false);
        })
        .catch(err => {
          console.log(err.message);
          setLoading(false);
        });
    }
  };

  const handleDelete = async () => {
    await axios
      .delete(`/api/v1/post/${post._id}`)
      .then(res => {
        if (res.data.response === true) window.location.reload();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const handlePostModal = () => {
    window.history.pushState(null, null, `/p/${post._id}`);
    setShowPostModal(true);
    document.querySelector("body").style.overflow = "hidden";
  };

  useEffect(() => {
    user && setLiked(post.usersLiked.includes(user._id));
  }, [user]);

  return (
    <>
      {!user || liked === null ? (
        <Loader />
      ) : (
        <>
          <PostModal post={post} showPostModal={showPostModal} setShowPostModal={setShowPostModal} />
          <Container>
            <MoreOption moreOption={moreOption} onClick={() => setMoreOption(prev => !prev)}>
              <i class="fa-solid fa-ellipsis"></i>

              {post.author._id === user._id && <span onClick={handleDelete}>Delete post</span>}
            </MoreOption>
            <TopDiv>
              <img src={post.author.avatar.url} />
              <span onClick={() => navigate(`/${post.author.username}`)}>{post.author.username}</span>
            </TopDiv>
            <hr />
            <MidDiv imagesLength={post.images.length} onDoubleClick={handleLike}>
              <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  {post.images.map((item, index) => {
                    return (
                      <div class={`carousel-item ${index === 0 ? "active" : ""}`}>
                        <img src={item.url} alt={`slide ${index}`} />
                      </div>
                    );
                  })}
                </div>
                {post.images.length > 1 && (
                  <>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            </MidDiv>
            <hr />
            <BottomDiv>
              <ActionsDiv>
                <div>
                  <img src={`${liked}Heart.png`} onClick={handleLike} />
                  <img
                    src="Comment.png"
                    onClick={
                      window.innerWidth > 769
                        ? handlePostModal
                        : () => {
                            navigate(`/p/${post._id}/comments`);
                          }
                    }
                  />
                  <img src="Send.png" />
                </div>
                <div>
                  <img src="Save.png" />
                </div>
              </ActionsDiv>
              <span>{likesCount} likes</span>
              <CaptionDiv>
                <span>{post.author.username}</span>
                <span style={{ fontWeight: "400" }}>{post.caption}</span>
              </CaptionDiv>
              <ViewComments
                onClick={
                  window.innerWidth > 769
                    ? handlePostModal
                    : () => {
                        navigate(`/p/${post._id}/comments`);
                      }
                }
              >
                {commentsCount > 0 ? `View all ${commentsCount} comments` : "0 comments"}
              </ViewComments>
              <span style={{ fontWeight: "400", fontSize: "0.6rem", color: "grey" }}>
                {timeAgo.format(Date.now() - (new Date() - post.createdAt)).toUpperCase()}
              </span>
            </BottomDiv>
            {window.innerWidth > 769 && (
              <>
                <hr />
                <AddCommentDiv>
                  <Textarea
                    rows={1}
                    cols={55}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => {
                      setComment(e.target.value);
                    }}
                  ></Textarea>
                  <span className="text-primary" onClick={handleCommentSubmit}>
                    Post
                  </span>
                </AddCommentDiv>
              </>
            )}
          </Container>
        </>
      )}
    </>
  );
}

export default FeedPostCard;

const Container = styled.div`
  width: 30rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin: 1rem 0;
  position: relative;
  @media (max-width: 426px) {
    width: 100%;
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0;
  }
`;
const TopDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
    border-radius: 50%;
  }
  span {
    font-size: 0.9rem;
    font-weight: 500;
    margin-left: 0.8rem;
    cursor: pointer;
  }
`;
const MidDiv = styled.div`
  img {
    width: ${props => (props.imagesLength === 1 ? "100%" : "30rem")};
    height: ${props => (props.imagesLength === 1 ? "100%" : "30rem")};
    object-fit: ${props => (props.imagesLength === 1 ? "full" : "cover")};
  }
  @media (max-width: 426px) {
    img {
      width: 100%;
      height: ${props => (props.imagesLength === 1 ? "100%" : "23rem")};
      object-fit: ${props => (props.imagesLength === 1 ? "full" : "cover")};
    }
  }
`;
const BottomDiv = styled.div`
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  span {
    margin: 0.2rem 0.5rem;
    font-weight: 500;
  }
  @media (max-width: 426px) {
    font-size: 0.9rem;
  }
`;
const ActionsDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
    margin: 0.8rem 0.5rem;
    cursor: pointer;
    transition: 0.3s;
  }
  img:hover {
    filter: opacity(0.5) drop-shadow(0 0 0 grey);
  }
  @media (max-width: 426px) {
    img {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
`;
const CaptionDiv = styled.div`
  display: flex;
  margin: 0 5px 5px;
  span {
    margin: 0 3px;
    font-size: 0.9rem;
  }
  @media (max-width: 426px) {
    span {
      font-size: 0.85rem;
    }
  }
`;
const ViewComments = styled.span`
  font-weight: 400 !important;
  color: grey;
  font-size: 0.9rem;
  cursor: pointer;
  @media (max-width: 426px) {
    font-size: 0.8rem;
  }
`;
const AddCommentDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  span {
    cursor: pointer;
  }
`;
const Textarea = styled.textarea`
  resize: none;
  border: none;
  outline: none;
  font-size: 0.9rem;
  overflow-y: auto;
`;
const MoreOption = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 500;
  span {
    display: ${props => (props.moreOption ? "flex" : "none")};
    position: absolute;
    top: 3rem;
    right: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 0.5rem;
    font-size: 0.8rem;
    width: 6rem;
    background-color: white;
    cursor: pointer;
  }
`;
