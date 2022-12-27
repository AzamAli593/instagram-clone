import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Navbar() {
  const navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [hidden, setHidden] = useState(true);

  const toggleCreatePostModal = () => {
    dispatch({ type: "TOGGLE_CREATE_POST_MODAL" });
  };

  const toggleSearchModal = () => {
    dispatch({ type: "TOGGLE_SEARCH_MODAL" });
  };

  const toggleNotificationModal = () => {
    dispatch({ type: "TOGGLE_NOTIFICATION_MODAL" });
  };

  const logout = async () => {
    await axios.get("/api/v1/logout").then(res => {
      window.location.reload();
    });
  };

  return (
    <>
      {user && (
        <OuterContainer>
          <Container>
            {window.innerWidth > 1025 ? (
              <InstaHeading src="/InstagramHeading.png" />
            ) : (
              <img src="/InstaNavLogo.png" style={{ width: "2rem", height: "2rem" }} />
            )}
            <Division
              onClick={() => {
                navigate("/home");
              }}
            >
              <i class="fa-solid fa-house"></i>
              {window.innerWidth > 1025 && <span>Home</span>}
            </Division>
            <Division onClick={toggleSearchModal}>
              <i class="fa-solid fa-magnifying-glass"></i>
              {window.innerWidth > 1025 && <span>Search</span>}
            </Division>
            <Division
              onClick={() => {
                navigate("/direct");
              }}
            >
              <i class="fa-brands fa-facebook-messenger"></i>
              {window.innerWidth > 1025 && <span>Messages</span>}
            </Division>
            <Division onClick={toggleNotificationModal}>
              <i class="fa-regular fa-heart"></i>
              {window.innerWidth > 1025 && <span>Notifications</span>}
            </Division>
            <Division onClick={toggleCreatePostModal}>
              <i class="fa-regular fa-square-plus"></i>
              {window.innerWidth > 1025 && <span>Create</span>}
            </Division>
            <Division
              onClick={() => {
                navigate(`/${user.username}`);
              }}
            >
              <ProfileImg src={user && user.avatar.url} />
              {window.innerWidth > 1025 && <span>Profile</span>}
            </Division>
            <MoreDiv
              className="navbar-more-options"
              onClick={() => {
                setHidden(prev => {
                  return !prev;
                });
              }}
            >
              <MoreOptions className={hidden && "hidden"} onClick={logout}>
                <span>Logout</span>
              </MoreOptions>
              <i class="fa-solid fa-bars"></i>
              {window.innerWidth > 1025 && <span>More</span>}
            </MoreDiv>
          </Container>
          <VerticalLine></VerticalLine>
        </OuterContainer>
      )}
    </>
  );
}

export default Navbar;

const OuterContainer = styled.div`
  display: flex;
  position: fixed;
  background-color: white;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100vh;
  padding: 0 2.5rem;
  font-size: 1.2rem;
`;
const InstaHeading = styled.img`
  width: 9rem;
  height: 9rem;
  margin: -2rem 0;
`;
const Division = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0.2rem 0;
  span {
    margin: 0 1rem;
  }
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  height: 2rem;
  width: 2rem;
  object-fit: contain;
  margin-right: -5px;
`;
const MoreDiv = styled(Division)`
  margin-top: 4rem !important;
`;
const MoreOptions = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
  position: absolute;
  bottom: 5rem;
`;
const VerticalLine = styled.div`
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  height: 100vh;
`;
