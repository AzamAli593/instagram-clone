import axios from "axios";
import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

function PostModal({ post, showPostModal, setShowPostModal }) {
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);

  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(null);
  const [likesCount, setLikesCount] = useState(post.usersLiked.length);
  const [commentsArray, setCommentsArray] = useState(post.comments);
  const [moreOption, setMoreOption] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async () => {
    if (!user) alert("login to interact with a post");
    if (loading) return;
    else {
      setLoading(true);
      await axios
        .post("/api/v1/comment", {
          id: post._id,
          body: comment
        })
        .then(res => {
          console.log(res.data.comment);
          setComment("");
          setCommentsArray(prev => [...prev, res.data.comment]);
          setLoading(false);
        })
        .catch(err => console.log(err.message));
    }
  };

  const handleLike = async () => {
    if (!user) alert("login to interact with a post");
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
        .catch(err => console.log(err.message));
    }
  };

  const handleDelete = async () => {
    await axios
      .delete(`/api/v1/post/${post._id}`)
      .then(res => {
        if (res.data.response === true) {
          console.log();
          setShowPostModal(false);
          window.history.pushState(null, null, "/home");
          window.location.reload();
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const handleDeleteComment = async commentId => {
    await axios
      .post("/api/v1/comment/delete", { postId: post._id, commentId })
      .then(res => setCommentsArray(res.data.comments))
      .catch(err => console.log(err));
  };

  const handleModalClose = () => {
    setShowPostModal(false);
    navigate(-1);
    document.querySelector("body").style.overflow = "auto";
  };

  useEffect(() => {
    setLiked(user ? post.usersLiked.includes(user._id) : false);
  }, [user]);

  return (
    <>
      {post && (
        <OuterContainer showPostModal={showPostModal}>
          <CloseBtn className="fa-solid fa-xmark" onClick={handleModalClose}></CloseBtn>
          <Container>
            <MoreOption moreOption={moreOption} onClick={() => setMoreOption(prev => !prev)}>
              <i class="fa-solid fa-ellipsis"></i>

              {user && post.author._id === user._id && <span onClick={handleDelete}>Delete post</span>}
            </MoreOption>
            <Images>
              <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  {post.images.map((item, index) => {
                    return (
                      <div class={index === 0 ? "carousel-item active" : "carousel-item"}>
                        <img src={item.url} alt={`slide ${index}`} className={`${post.images.length === 1 ? "crop" : "non-crop"}`} />
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
            </Images>
            <PostInfo>
              <Header>
                <img src={post.author.avatar.url} className="avatar-img" />
                <span onClick={() => navigate(`/${post.author.username}`)}>{post.author.username}</span>
              </Header>

              <hr />
              <CaptionAndComments>
                <Comment>
                  <div>
                    <img src={post.author.avatar.url} className="avatar-img" />
                    <span>{post.author.username}</span>
                    <span style={{ fontWeight: "400" }}>{post.caption}</span>
                  </div>
                </Comment>

                {commentsArray &&
                  commentsArray.map(item => {
                    return (
                      <Comment>
                        <div>
                          <img src={item.author.avatar.url} className="avatar-img" />
                          <span>{item.author.username}</span>
                          <span style={{ fontWeight: "400" }}>{item.body}</span>
                        </div>
                        {user._id === item.author._id && (
                          <div>
                            <i class="fa-solid fa-trash" style={{ cursor: "pointer" }} onClick={() => handleDeleteComment(item._id)}></i>
                          </div>
                        )}
                      </Comment>
                    );
                  })}
              </CaptionAndComments>

              <Footer>
                <hr />
                <SubFooter>
                  <Actions>
                    <div>
                      <img src={`/${liked}Heart.png`} onClick={handleLike} />
                      <img src="/Comment.png" />
                      <img src="/Send.png" />
                    </div>
                    <div>
                      <img src="/Save.png" />
                    </div>
                  </Actions>
                  <span>{likesCount} likes</span>
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "0.7rem",
                      color: "grey"
                    }}
                  >
                    {timeAgo.format(Date.now() - (new Date() - post.createdAt)).toUpperCase()}
                  </span>
                </SubFooter>
                <hr />
                <AddComment>
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
                </AddComment>
              </Footer>
            </PostInfo>
          </Container>
        </OuterContainer>
      )}
    </>
  );
}

export default PostModal;

const OuterContainer = styled.div`
  width: 100%;
  position: fixed;
  z-index: 1000;
  display: ${props => (props.showPostModal ? "flex" : "none")};
`;
const CloseBtn = styled.i`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1000;
`;
const Container = styled.div`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 80rem;
  height: 40rem;
  margin: auto;
  transition: 0.5s;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  display: flex;
  flex: 1;
`;
const Images = styled.div`
  flex: 0.5;
  img {
    width: 100%;
    height: 40rem;
    object-fit: cover;
  }
`;
const PostInfo = styled.div`
  flex: 0.5;
  flex-direction: column;
  position: relative;
  img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
  }
  .avatar-img {
    border-radius: 50%;
  }
  span {
    font-size: 0.9rem;
    font-weight: 500;
    margin-left: 0.8rem;
  }
`;
const Header = styled.div`
  padding: 0.8rem;
  span {
    cursor: pointer;
  }
`;
const CaptionAndComments = styled.div`
  display: flex;
  flex-direction: column;
  height: 24rem;
  padding: 0.8rem;
  overflow-y: scroll;
  img {
    margin-right: 5px;
  }
  span {
    margin: 0 5px;
    font-size: 0.9rem;
  }
`;
const Comment = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  justify-content: space-between;
`;
const Footer = styled.div`
  bottom: 0;
  position: absolute;
  width: 100%;
`;
const SubFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  span {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 0.2rem;
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
`;
const AddComment = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  span {
    cursor: pointer;
  }
`;
const Textarea = styled.textarea`
  border: none;
  outline: none;
  resize: none;
  width: 90%;
  overflow: hidden;
`;
const MoreOption = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 1000;
  span {
    display: ${props => (props.moreOption ? "flex" : "none")};
    position: absolute;
    top: 3rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 0.5rem;
    font-size: 0.8rem;
    width: 6rem;
    background-color: white;
    cursor: pointer;
  }
`;
