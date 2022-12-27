import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

function CreatePostModal({ images, clearImage }) {
  const { user } = useSelector(state => state.user);
  const { mobilePostModal } = useSelector(state => state.modal);
  const dispatch = useDispatch();

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    clearImage();
    dispatch({ type: "TOGGLE_MOBILE_POST_MODAL" });
    document.querySelector("body").style.overflow = "auto";
  };

  const handlePostSubmit = async () => {
    if (loading) return;
    else {
      setLoading(true);
      await axios
        .post("/api/v1/create", { caption, images }, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          setCaption("");
          clearImage();
          dispatch({ type: "TOGGLE_MOBILE_POST_MODAL" });
          setLoading(false);
          window.location.reload();
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <>
      {user && (
        <Container mobilePostModal={mobilePostModal}>
          <Header>
            <i class="fa-solid fa-xmark" onClick={closeModal}></i>
            <span>New Post</span>
            <button className="btn btn-primary btn-sm" disabled={loading ? true : false}>
              <span onClick={handlePostSubmit}>Share</span>
            </button>
          </Header>
          <hr />
          <Body>
            <div style={{ display: "flex" }}>
              <img src={user.avatar.url} className="avatar-img" />
              <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption..."></textarea>
            </div>
            <img src={images[0]} className="post-img" />
          </Body>
        </Container>
      )}
    </>
  );
}

export default CreatePostModal;

const Container = styled.div`
  background-color: white;
  height: 100vh;
  width: 100vw;
  z-index: 10000;
  position: absolute;
  display: ${props => (props.mobilePostModal ? "flex" : "none")};
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  font-weight: 500;
  i {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
`;
const Body = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  textarea {
    border: none;
    outline: none;
    margin-left: 0.5rem;
    font-size: 0.85rem;
  }
  .avatar-img {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
  }
  .post-img {
    height: 3rem;
    width: 3rem;
  }
`;
