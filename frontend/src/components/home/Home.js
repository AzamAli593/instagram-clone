import React, { useState } from "react";
import Navbar from "../layout/desktop/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";
import FeedContainer from "../post/FeedContainer";
import styled from "styled-components";
import MobileNavbar from "../layout/mobile/Navbar";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "../post/mobile/CreatePostModal";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userLoading } = useSelector(state => state.user);

  const [postImg, setPostImg] = useState([]);

  const handlePostInput = e => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImg(prev => [...prev, reader.result]);
      }
    };
    reader.readAsDataURL(e.target.files[0]);

    dispatch({ type: "TOGGLE_MOBILE_POST_MODAL" });
    document.querySelector("body").style.overflow = "hidden";
  };

  const clearImage = () => setPostImg([]);

  return window.innerWidth > 768 ? (
    <Container>
      <LeftContainer>
        <Navbar />
      </LeftContainer>
      <MidContainer>
        <FeedContainer />
      </MidContainer>
      <RightContainer></RightContainer>
    </Container>
  ) : (
    <MobileContainer>
      <CreatePostModal images={postImg} clearImage={clearImage} />
      <Header>
        <img src="/InstagramHeading.png" />
        <div>
          <label htmlFor="postInput">
            <i class="fa-regular fa-square-plus"></i>
          </label>
          <input type="file" id="postInput" onChange={handlePostInput} accept="image/*" style={{ display: "none" }} />
          <i class="fa-regular fa-heart" onClick={() => navigate("/notifications")}></i>
        </div>
      </Header>
      <hr />
      <FeedContainer />
      <Footer>
        <MobileNavbar />
      </Footer>
    </MobileContainer>
  );
}

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
`;
const LeftContainer = styled.div`
  flex: 0.3;
`;
const MidContainer = styled.div`
  flex: 0.4;
`;
const RightContainer = styled.div`
  flex: 0.3;
`;
const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  padding: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
  img {
    width: 7rem;
  }
  i {
    font-size: 1.5rem;
    margin-left: 1rem;
  }
`;
const Footer = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 1000;
`;
