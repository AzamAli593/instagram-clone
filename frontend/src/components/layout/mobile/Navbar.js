import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Navbar() {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <>
      {user && (
        <>
          <hr />
          <Container>
            <i class="fa-solid fa-house" onClick={() => navigate("/home")}></i>
            <i
              class="fa-solid fa-magnifying-glass"
              onClick={() => {
                navigate("/search");
              }}
            ></i>
            <i class="fa-brands fa-facebook-messenger" onClick={() => navigate("/direct")}></i>
            <img src={user.avatar.url} onClick={() => navigate(`/${user.username}`)} />
          </Container>
        </>
      )}
    </>
  );
}

export default Navbar;

const Container = styled.div`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  i {
    font-size: 1.4rem;
  }
  img {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
  }
`;
