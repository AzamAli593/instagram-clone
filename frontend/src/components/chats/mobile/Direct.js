import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Direct() {
  const navigate = useNavigate();

  const [chats, setChats] = useState(null);
  const { user } = useSelector(state => state.user);

  const getUserChats = async () => {
    await axios
      .get("/api/v1/chats")
      .then(res => setChats(res.data.chats))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getUserChats();
  }, []);

  return (
    <>
      {chats && (
        <Container>
          <LeftDiv>
            <LeftHeader>
              <i class="fa-solid fa-chevron-left" onClick={() => navigate("/home")}></i>
              <span>{user.username}</span>
            </LeftHeader>
            <hr />
            {chats && chats.length > 0 ? (
              <LeftBody>
                {chats.map(item => {
                  if (item.messagesCount > 0)
                    return (
                      <div style={{ cursor: "pointer", margin: "1rem 0" }} onClick={() => navigate(`/direct/${item._id}`)}>
                        {item.users.map(ele => {
                          if (ele._id !== user._id) {
                            return (
                              <div>
                                <img src={ele.avatar.url} />
                                <span>{ele.name}</span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                })}
              </LeftBody>
            ) : (
              <NoChatDiv>
                {" "}
                <img src="/send.png" />
                <span style={{ fontSize: "1.4rem" }}>Your Messages</span>
                <span>Send private photos and messages to a friend.</span>
              </NoChatDiv>
            )}
          </LeftDiv>
        </Container>
      )}
    </>
  );
}

export default Direct;

const Container = styled.div`
  display: flex;
`;
const LeftDiv = styled.div`
  width: 100%;
`;
const LeftHeader = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 500;
  padding: 1rem 0;
  position: relative;
  i {
    position: absolute;
    left: 1rem;
    top: 1rem;
    font-size: 1.5rem;
  }
`;
const LeftBody = styled.div`
  padding: 1rem;
  div {
    display: flex;
    align-items: center;
    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
  }
`;
const NoChatDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5vh auto;
  text-align: center;
  width: 95%;

  img {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }
`;
