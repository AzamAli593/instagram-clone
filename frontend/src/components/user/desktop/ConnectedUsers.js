import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ConnectedUsers({ users, showModal, toggleModal, isFollowers }) {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <Container showModal={showModal}>
      <Header>
        <i class="fa-solid fa-xmark" onClick={toggleModal}></i>
        <span>{isFollowers ? "Followers" : "Following"}</span>
      </Header>
      <hr />
      <Body>
        {users.map(item => {
          return (
            <div>
              <div>
                <img src={item.avatar.url} />
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/${item.username}`);
                    toggleModal();
                  }}
                >
                  {item.username}
                </span>
              </div>
              {user._id !== item._id && (
                <button className={user.following.includes(item._id) ? "btn btn-outline-dark btn-sm" : "btn btn-primary btn-sm"}>
                  {user.following.includes(item._id) ? "Following" : "Follow"}
                </button>
              )}
            </div>
          );
        })}
      </Body>
    </Container>
  );
}

export default ConnectedUsers;

const Container = styled.div`
  display: ${props => (props.showModal ? "flex" : "none")};
  flex-direction: column;
  margin: auto;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: 1000;
  width: 30rem;
  height: 30rem;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  transition: 0.3s;
`;
const Header = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  font-weight: 500;
  position: relative;
  i {
    position: absolute;
    right: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 1rem;
  div {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0.5rem;
    align-items: center;
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      margin-right: 1rem;
    }
  }
`;
