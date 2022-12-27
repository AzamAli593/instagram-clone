import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Loader from "../../layout/Loader";

function Comments() {
  const { postId } = useParams();
  const { user } = useSelector(state => state.user);
  const [post, setPost] = useState(null);
  const [commentsArray, setCommentsArray] = useState([]);
  const [loading, setLoading] = useState(null);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const getPostDetails = async () => {
    await axios
      .get(`/api/v1/post/${postId}`)
      .then(res => {
        setPost(res.data.post);
        setCommentsArray(res.data.post.comments);
        setLoading(false);
      })
      .catch(err => console.log(err.message));
  };

  const handleCommentSubmit = async () => {
    if (commentLoading) return;
    else {
      setCommentLoading(true);
      await axios
        .post("/api/v1/comment", {
          id: post._id,
          body: comment
        })
        .then(res => {
          setCommentsArray(prev => [...prev, res.data.comment]);
          setComment("");
          setCommentLoading(false);
        })
        .catch(err => console.log(err.message));
    }
  };

  const handleDeleteComment = async commentId => {
    await axios
      .post("/api/v1/comment/delete", { postId, commentId })
      .then(res => setCommentsArray(res.data.comments))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (!post || postId !== post._id) {
      setLoading(true);
      getPostDetails();
    }
  }, [post]);

  return (
    <>
      {loading || !user ? (
        <Loader />
      ) : (
        <Container>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: "0",
              backgroundColor: "white"
            }}
          >
            <Header>
              <span>Comments</span>
            </Header>
            <hr />
            <AddComment>
              <img src={user.avatar.url} />
              <TextAreaDiv>
                <textarea
                  name="comment"
                  value={comment}
                  placeholder="add a comment..."
                  rows={1}
                  onChange={e => {
                    setComment(e.target.value);
                  }}
                ></textarea>
                <span style={{ marginLeft: "0.5rem" }} className="text-primary" onClick={handleCommentSubmit}>
                  Post
                </span>
              </TextAreaDiv>
            </AddComment>
          </div>
          <CommentsDiv>
            {commentsArray &&
              commentsArray.map(item => {
                return (
                  <div>
                    <div>
                      <img src={item.author.avatar.url} />
                      <span style={{ alignSelf: "center" }}>
                        <span style={{ fontWeight: "600", marginRight: "0.5rem" }}>{item.author.username}</span>
                        {item.body}
                      </span>
                    </div>
                    <div>
                      {user._id === item.author._id && (
                        <div>
                          <i
                            class="fa-solid fa-trash"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleDeleteComment(item._id);
                            }}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </CommentsDiv>
        </Container>
      )}
    </>
  );
}

export default Comments;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  img {
    width: 2rem;
    height: 2rem;
    margin-right: 0.7rem;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  span {
    font-weight: 600;
    font-size: 1.2rem;
  }
`;
const CommentsDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.7rem;
  div {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
`;
const AddComment = styled.div`
  display: flex;
  padding: 0.7rem;
  align-items: center;
  background-color: whitesmoke;
  font-size: 0.9rem;
  textarea {
    resize: none;
    border: none;
    outline: none;
  }
`;
const TextAreaDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 2rem;
  width: 100%;
  justify-content: space-between;
`;
