import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import FeedPostCard from "./FeedPostCard";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";

function FeedContainer() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector(state => state.user);

  const getFeedPosts = async () => {
    await axios.get("/api/v1/feed").then(res => {
      setPosts(res.data.posts);
      setLoading(false);
    });
  };

  useEffect(() => {
    getFeedPosts();
  }, []);

  return (
    <>
      {!posts ? (
        <Loader />
      ) : (
        <>
          {posts.length > 0 ? (
            <>
              {posts && (
                <Container>
                  {posts.map(post => {
                    return (
                      <>
                        <FeedPostCard post={post} />
                      </>
                    );
                  })}
                </Container>
              )}
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                marginTop: "10rem"
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>Welcome to Instagram</span>
              <span>When you follow people, you'll see the photos that they post here.</span>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default FeedContainer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  position: relative;
  align-items: center;
`;
