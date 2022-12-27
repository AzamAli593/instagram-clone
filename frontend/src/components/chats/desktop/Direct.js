import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Navbar from "../../layout/desktop/Navbar";
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
          <NavbarContainer>
            <Navbar />
          </NavbarContainer>
          <InnerContainer>
            <LeftDiv>
              <LeftHeader>
                <span>{user.username}</span>
              </LeftHeader>
              <hr />
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
            </LeftDiv>
            <VL />
            <RightDiv>
              <NoChatDiv>
                <img src="/send.png" />
                <span style={{ fontSize: "1.4rem" }}>Your Messages</span>
                <span>Send private photos and messages to a friend or group.</span>
              </NoChatDiv>
            </RightDiv>
          </InnerContainer>
        </Container>
      )}
    </>
  );
}

export default Direct;

const Container = styled.div`
  display: flex;
`;
const NavbarContainer = styled.div`
  flex: 0.25;
`;
const InnerContainer = styled.div`
  flex: 0.65;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 50rem;
  height: 90vh;
  margin-top: 3vh;
`;
const VL = styled.div`
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  height: 100%;
`;
const LeftDiv = styled.div`
  flex: 0.35;
`;
const LeftHeader = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 500;
  padding: 1rem 0;
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
const RightDiv = styled.div`
  flex: 0.65;
  display: flex;
`;
const NoChatDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  text-align: center;
  img {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }
`;
