import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchModal } = useSelector(state => state.modal);

  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    await axios
      .post("/api/v1/search", { username })
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getUsers();
  }, [username]);

  return (
    <Container searchModal={searchModal}>
      <TopDiv>
        <CloseBtn
          onClick={() => {
            dispatch({ type: "TOGGLE_SEARCH_MODAL" });
          }}
        >
          <i class="fa-solid fa-xmark"></i>
        </CloseBtn>

        <h4>Search</h4>
        <input
          type="text"
          name="username"
          value={username}
          placeholder="search"
          className="form-control"
          autoComplete="off"
          onChange={e => {
            setUsername(e.target.value);
          }}
        />
      </TopDiv>
      <hr />
      <BottomDiv>
        {users.map(user => {
          return (
            <div
              onClick={() => {
                dispatch({ type: "TOGGLE_SEARCH_MODAL" });
                navigate(`/${user.username}`);
              }}
            >
              <img src={user.avatar.url} />
              <span>{user.username}</span>
            </div>
          );
        })}
      </BottomDiv>
    </Container>
  );
}

export default SearchModal;

const Container = styled.div`
  height: 100vh;
  width: 30rem;
  position: fixed;
  left: ${props => (props.searchModal ? "0" : "-30rem")};
  top: 0;
  background-color: white;
  z-index: 10;
  transition: 0.5s;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const TopDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 15vh;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CloseBtn = styled.div`
  position: absolute;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
`;
const BottomDiv = styled.div`
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    margin: 0.5rem 0;
    align-items: center;
    cursor: pointer;
  }

  img {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
  }
`;
