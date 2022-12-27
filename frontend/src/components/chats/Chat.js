import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Navbar from "../layout/desktop/Navbar";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [chats, setChats] = useState(null);
  const [singleChat, setSingleChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const { user } = useSelector(state => state.user);
  const [userMessage, setUserMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const [loading, setLoading] = useState(false);

  const getUserChats = async () => {
    await axios
      .get("/api/v1/chats")
      .then(res => setChats(res.data.chats))
      .catch(err => console.log(err));
  };
  const getChatDetail = async () => {
    await axios
      .get(`/api/v1/direct/${chatId}`)
      .then(res => {
        setSingleChat(res.data.chat);
      })
      .catch(err => console.log(err));
  };
  const getChatMessages = async () => {
    await axios
      .get(`/api/v1/direct/messages/${chatId}`)
      .then(res => {
        setMessages(res.data.messages);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleMessageSubmit = async () => {
    setLoading(true);
    await axios.post(`/api/v1/direct/${chatId}`, { content: userMessage }).then(res => {
      setUserMessage("");
      getChatMessages();
      setLoading(false);
    });

    const reciever = singleChat.users.find(item => item._id !== user._id);
    socket.current.emit("sendMessage", { sender: user, recieverId: reciever._id, content: userMessage });
  };

  useEffect(() => {
    getUserChats();
    getChatMessages();
    getChatDetail();
  }, [chatId]);

  useEffect(() => {
    socket.current = io("https://social-media-mern.onrender.com");
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.sender,
        content: data.content
      });
    });
  }, []);

  useEffect(() => {
    if (user) socket.current.emit("addUser", user._id);
  }, [user]);

  useEffect(() => {
    if (arrivalMessage && singleChat) {
      let isValid = null;
      isValid = singleChat.users.find(item => item._id === arrivalMessage.sender._id);
      if (isValid) setMessages(prev => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, singleChat]);

  useEffect(() => {
    const element = document.getElementById("messagesBody");
    element && (element.scrollTop = element.scrollHeight);
  }, [messages]);

  return (
    <>
      {window.innerWidth > 769 ? (
        <>
          {chats && singleChat && messages && (
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
                  <RightInnerDiv>
                    <RightHeader>
                      {singleChat.users.map(item => {
                        if (item._id !== user._id)
                          return (
                            <div>
                              <img src={item.avatar.url} />
                              <span>{item.name}</span>
                            </div>
                          );
                      })}
                    </RightHeader>
                    <hr />
                    <RightBody id="messagesBody">
                      {messages &&
                        messages.map(item => {
                          return item.sender._id === user._id ? (
                            <div className="sender">
                              <span>{item.content}</span>
                              <img src={item.sender.avatar.url} />
                            </div>
                          ) : (
                            <div className="reciever">
                              <img src={item.sender.avatar.url} />
                              <span>{item.content}</span>
                            </div>
                          );
                        })}
                    </RightBody>
                    <RightFooter>
                      <textarea
                        cols={40}
                        rows={1}
                        placeholder="Message..."
                        value={userMessage}
                        onChange={e => setUserMessage(e.target.value)}
                      ></textarea>
                      <button disabled={userMessage === "" ? true : false || loading ? true : false} onClick={handleMessageSubmit}>
                        <img src="/blue-send.png" />
                      </button>
                    </RightFooter>
                  </RightInnerDiv>
                </RightDiv>
              </InnerContainer>
            </Container>
          )}
        </>
      ) : (
        <>
          {chats && singleChat && messages && (
            <MobileContainer>
              <MobileRightDiv>
                <MobileRightInnerDiv>
                  <MobileRightHeader>
                    <i class="fa-solid fa-chevron-left" onClick={() => navigate("/direct")}></i>

                    {singleChat.users.map(item => {
                      if (item._id !== user._id)
                        return (
                          <div>
                            <img src={item.avatar.url} />
                            <span>{item.name}</span>
                          </div>
                        );
                    })}
                  </MobileRightHeader>
                  <hr />
                  <MobileRightBody id="messagesBody">
                    {messages &&
                      messages.map(item => {
                        return item.sender._id === user._id ? (
                          <div className="sender">
                            <span>{item.content}</span>
                            <img src={item.sender.avatar.url} />
                          </div>
                        ) : (
                          <div className="reciever">
                            <img src={item.sender.avatar.url} />
                            <span>{item.content}</span>
                          </div>
                        );
                      })}
                  </MobileRightBody>
                  <MobileRightFooter>
                    <textarea
                      cols={40}
                      rows={1}
                      placeholder="Message..."
                      value={userMessage}
                      onChange={e => setUserMessage(e.target.value)}
                    ></textarea>
                    <button disabled={userMessage === "" ? true : false || loading ? true : false} onClick={handleMessageSubmit}>
                      <img src="/blue-send.png" />
                    </button>
                  </MobileRightFooter>
                </MobileRightInnerDiv>
              </MobileRightDiv>
            </MobileContainer>
          )}
        </>
      )}
    </>
  );
}

export default Chat;

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
const RightInnerDiv = styled.div`
  width: 100%;
  position: relative;
`;
const RightHeader = styled.div`
  display: flex;
  padding: 0.8rem 1rem;
  font-weight: 500;
  img {
    width: 2rem;
    height: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    margin-right: 1rem;
  }
`;
const RightBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: scroll;
  height: 80%;
  div {
    margin: 0.5rem 0;
  }
  img {
    width: 2rem;
    height: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    margin: 0 0.5rem;
  }
  span {
    padding: 0.5rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
  }
  .sender {
    align-self: flex-end;
    span {
      background-color: #e0e0e0;
      border: none;
    }
  }
  .reciever {
    align-self: flex-start;
  }
`;
const RightFooter = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  padding: 1rem;
  width: 100%;
  align-items: center;
  textarea {
    width: 100%;
    resize: none;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    outline: none;
  }
  img {
    margin-left: 1rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
  button {
    border: none;
    background: transparent;
  }
`;
const MobileContainer = styled.div`
  display: flex;
  height: 90vh;
`;
const MobileRightDiv = styled.div`
  display: flex;
  width: 100%;
`;
const MobileRightInnerDiv = styled.div`
  width: 100%;
  position: relative;
  height: 100%;
`;
const MobileRightHeader = styled.div`
  display: flex;
  padding: 0.8rem 1rem;
  font-weight: 500;
  position: relative;
  align-items: center;
  img {
    width: 2rem;
    height: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    margin-right: 1rem;
  }
  i {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
`;
const MobileRightBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: scroll;
  height: 80%;
  margin-bottom: 0.5rem;
  div {
    margin: 0.5rem 0;
  }
  img {
    width: 2rem;
    height: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    margin: 0 0.5rem;
  }
  span {
    padding: 0.5rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
  }
  .sender {
    align-self: flex-end;
    span {
      background-color: #e0e0e0;
      border: none;
    }
  }
  .reciever {
    align-self: flex-start;
  }
`;
const MobileRightFooter = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  padding: 1rem;
  width: 100%;
  align-items: center;
  textarea {
    width: 100%;
    resize: none;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    outline: none;
  }
  img {
    margin-left: 1rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
  button {
    border: none;
    background: transparent;
  }
`;
