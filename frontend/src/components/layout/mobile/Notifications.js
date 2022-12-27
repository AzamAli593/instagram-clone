import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loader from "../Loader";

function Notifications() {
  const { user, userLoading } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    user &&
      user.notifications.sort((a, b) => {
        return b.timeStamp - a.timeStamp;
      }) &&
      setIsSorted(true);
  }, [user]);
  return (
    <>
      {userLoading || !isSorted ? (
        <Loader />
      ) : (
        <Container>
          <Header>
            <span>Notifications</span>
          </Header>
          <hr />
          <Body>
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
          </Body>
        </Container>
      )}
    </>
  );
}

export default Notifications;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  font-size: 0.9rem;
  span {
    margin: 0.5rem 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
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
`;
