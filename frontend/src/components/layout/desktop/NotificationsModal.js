import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loader from "../Loader";

function NotificationsModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, userLoading } = useSelector(state => state.user);
  const { notificationModal } = useSelector(state => state.modal);

  useEffect(() => {
    if (user) {
      user.notifications.sort((a, b) => {
        return b.timeStamp - a.timeStamp;
      });
    }
  }, [user]);

  return (
    <>
      {userLoading ? (
        <Loader />
      ) : (
        <>
          {user && (
            <Container notificationModal={notificationModal}>
              <TopDiv>
                <CloseBtn
                  onClick={() => {
                    dispatch({ type: "TOGGLE_NOTIFICATION_MODAL" });
                  }}
                >
                  <i class="fa-solid fa-xmark"></i>
                </CloseBtn>

                <h4>Notifications</h4>
              </TopDiv>
              <hr style={{ margin: "1rem 0" }} />
              <BottomDiv>
                <>
                  {user.notifications.length >= 1 ? (
                    <>
                      {user.notifications.map(item => {
                        return <span onClick={() => navigate(item.reference)}>{item.content}</span>;
                      })}
                    </>
                  ) : (
                    <NoNotifications>
                      <i class="fa-regular fa-heart"></i>
                      <span>Activity on your post</span>
                      <span>When someone likes or comment on one of your posts, you'll see it here.</span>
                    </NoNotifications>
                  )}
                </>
              </BottomDiv>
            </Container>
          )}
        </>
      )}
    </>
  );
}

export default NotificationsModal;

const Container = styled.div`
  height: 100vh;
  width: 30rem;
  position: fixed;
  left: ${props => (props.notificationModal ? "0" : "-30rem")};
  top: 0;
  background-color: white;
  z-index: 10;
  transition: 0.5s;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const TopDiv = styled.div`
  display: flex;
  h4 {
    margin: auto;
  }
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
  overflow-y: scroll;
  span {
    font-size: 1.1rem;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    padding: 5px 20px;
    margin: 0.5rem;
  }
`;
const NoNotifications = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  i {
    font-size: 4rem;
  }
  span {
    border: none;
  }
`;
