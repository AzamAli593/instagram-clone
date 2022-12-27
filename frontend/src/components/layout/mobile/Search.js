import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Search() {
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
      <hr style={{ margin: "1rem 0" }} />
      <BottomDiv>
        {users.map(user => {
          return (
            <div
              onClick={() => {
                navigate(`/${user.username}`);
              }}
            >
              <img src={user.avatar.url} />
              <span>{user.username}</span>
            </div>
          );
        })}
      </BottomDiv>
      <Navbar />
    </Container>
  );
}

export default Search;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0 0;
  height: 100vh;
`;
const TopDiv = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  input {
    width: 90vw;
  }
`;
const BottomDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  height: 80vh;
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
