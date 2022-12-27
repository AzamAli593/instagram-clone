import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Loader from "../../layout/Loader";
import Navbar from "../../layout/mobile/Navbar";

function Profile() {
  const { user } = useSelector(state => state.user);
  const { username } = useParams();
  const navigate = useNavigate();

  const [searchedUser, setSearchedUser] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hidden, setHidden] = useState(true);

  const getUserDetail = async () => {
    setLoading(true);
    await axios
      .get(`/api/v1/user/${username}`)
      .then(res => {
        setFollowers(res.data.user.followers.length);
        setFollowing(res.data.user.following.length);
        setSearchedUser(res.data.user);
        setFollowed(user && user.following.includes(res.data.user._id));
        setLoading(false);
      })
      .catch(err => {
        window.alert("user does not exist");
        navigate(-1, { replace: true });
      });
  };

  const getUsersPost = async () => {
    await axios.get(`/api/v1/post/user/${username}`).then(res => {
      setPosts(res.data.posts);
    });
  };

  const addFollower = async () => {
    await axios
      .post("/api/v1/follower/add", { searchedUser })
      .then(res => {
        setFollowed(true);
        setFollowers(prev => prev + 1);
      })
      .catch(err => console.log(err.message));
  };

  const removeFollower = async () => {
    await axios
      .post("/api/v1/follower/remove", { searchedUser })
      .then(res => {
        setFollowed(false);
        setFollowers(prev => prev - 1);
      })
      .catch(err => console.log(err.message));
  };

  const handleMessage = async () => {
    await axios
      .post("/api/v1/chat", { secondUser: searchedUser._id })
      .then(res => {
        navigate(`/direct/${res.data.chat._id}`, { replce: true });
      })
      .catch(err => console.log(err));
  };

  const logout = async () => {
    await axios.get("/api/v1/logout").then(res => {
      navigate("/", { replace: true });
    });
  };

  useEffect(() => {
    getUserDetail();
    getUsersPost();
  }, [username]);

  return (
    <>
      {loading || !posts ? (
        <Loader />
      ) : (
        <Container>
          <Header>
            <h6>{searchedUser.username}</h6>
            {user && <i class="fa-solid fa-gear" onClick={() => setHidden(prev => !prev)}></i>}
            <span className={hidden && "hidden"} onClick={logout}>
              Logout
            </span>
          </Header>
          <hr />
          <Body>
            <InfoDiv>
              <TopInfoDiv>
                <div className="img-div">
                  <img src={searchedUser.avatar.url} />
                </div>

                <div>
                  <span>{searchedUser.username}</span>
                  {user && (
                    <>
                      {user.username === searchedUser.username ? (
                        <EditProfileBtn onClick={() => navigate("/accounts/edit")}>Edit profile</EditProfileBtn>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <button className={followed ? "btn btn-outline-dark" : "btn btn-primary"} onClick={followed ? removeFollower : addFollower}>
                            {followed ? "Following" : "Follow"}
                          </button>
                          <button className="btn btn-outline-dark" style={{ marginLeft: "0.5rem" }} onClick={handleMessage}>
                            Message
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TopInfoDiv>
              <MidInfoDiv>
                <span style={{ fontWeight: "500" }}>{searchedUser.name}</span>
                <span>{searchedUser.bio}</span>
              </MidInfoDiv>
              <hr style={{ margin: "1rem -1rem" }} />
              <BottomInfoDiv>
                <div>
                  <b>{searchedUser.posts.length}</b>posts
                </div>
                <div>
                  <b>{followers}</b>followers
                </div>
                <div>
                  <b>{following}</b>following
                </div>
              </BottomInfoDiv>
              <hr style={{ margin: "1rem -1rem 0rem" }} />
            </InfoDiv>
            <div>
              <i class="fa-solid fa-table-cells text-primary" style={{ fontSize: "1.5rem", margin: "0 1rem 1rem" }}></i>
            </div>
            <hr />
            <PostsDiv postsLength={posts.length}>
              {posts.length > 0 ? (
                <>
                  {posts.map(post => {
                    return <Post onClick={() => navigate(`/p/${post._id}`)}>{<img src={post.images[0].url} />}</Post>;
                  })}
                </>
              ) : (
                <div style={{ margin: "2rem auto", fontSize: "1.5rem" }}> No posts </div>
              )}
            </PostsDiv>
          </Body>
          <NavbarContainer>
            <Navbar />
          </NavbarContainer>
        </Container>
      )}
    </>
  );
}

export default Profile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const Header = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  position: relative;
  i {
    position: absolute;
    left: 1rem;
    top: 0.75rem;
    font-size: 1.2rem;
  }
  span {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 0.5rem 1rem;
    position: absolute;
    top: 2.5rem;
    left: 1rem;
    background-color: white;
    z-index: 100;
  }
`;
const Body = styled.div``;
const InfoDiv = styled.div`
  padding: 1rem;
`;
const TopInfoDiv = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  div {
    display: flex;
    flex-direction: column;
    flex: 0.65;
  }
  span {
    font-size: 1.7rem;
    font-weight: 300;
    text-overflow: ellipsis;
    margin-bottom: 5px;
  }
  img {
    width: 5rem;
    height: 5rem;
    border-radius: 150%;
  }
  .img-div {
    flex: 0.35;
  }
  width: 100%;
`;
const EditProfileBtn = styled.button`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  background-color: white;
  width: 100%;
`;
const MidInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  margin-top: 1.5rem;
`;
const BottomInfoDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  font-size: 0.9rem;
  margin: 0 -1rem;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const PostsDiv = styled.div`
  display: ${props => (props.postsLength > 0 ? "grid" : "flex")};
  grid-template-columns: repeat(3, 1fr);
  gap: 0.2rem;
`;
const Post = styled.div`
  display: inline;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 7rem;
    object-fit: cover;
  }
`;
const NavbarContainer = styled.div`
  position: sticky;
  margin-top: auto;
  bottom: 0;
`;
