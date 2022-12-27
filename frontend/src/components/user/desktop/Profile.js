import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../layout/Loader";
import Navbar from "../../layout/desktop/Navbar";
import styled from "styled-components";
import PostModal from "../../post/desktop/PostModal";
import axios from "axios";
import ConnectedUsers from "./ConnectedUsers";

function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useSelector(state => state.user);

  const [searchedUser, setSearchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [modalPost, setModalPost] = useState(null);
  const [followed, setFollowed] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isFollowers, setIsFollowers] = useState(true);

  const getUserDetail = async () => {
    setLoading(true);
    await axios
      .get(`/api/v1/user/${username}`)
      .then(res => {
        setSearchedUser(res.data.user);
        setFollowers(res.data.user.followers.length);
        setFollowing(res.data.user.following.length);
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
  const toggleModal = () => {
    setShowModal(prev => !prev);
  };

  const handlePostModal = post => {
    window.history.pushState(null, null, `/p/${post._id}`);
    setModalPost(post);
    document.querySelector("body").style.overflow = "hidden";
  };

  const handleMessage = async () => {
    await axios
      .post("/api/v1/chat", { secondUser: searchedUser._id })
      .then(res => {
        navigate(`/direct/${res.data.chat._id}`, { replce: true });
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (!searchedUser || searchedUser.username !== username) {
      getUserDetail();
      getUsersPost();
    }
    if (user && searchedUser && user.following.includes(searchedUser._id)) {
      setFollowed(true);
    } else setFollowed(false);
  }, [searchedUser, username]);

  return (
    <>
      {loading || !searchedUser || !posts ? (
        <Loader />
      ) : (
        <>
          {searchedUser && (
            <OuterContainer>
              {modalPost && <PostModal post={modalPost} showPostModal={showPostModal} setShowPostModal={setShowPostModal} />}
              {user && (
                <ConnectedUsers
                  users={isFollowers ? searchedUser.followers : searchedUser.following}
                  showModal={showModal}
                  toggleModal={toggleModal}
                  isFollowers={isFollowers}
                />
              )}
              <NavbarContainer>
                <Navbar />
              </NavbarContainer>
              <InnerContainer>
                <TopDiv>
                  <Avatar>
                    <img src={searchedUser.avatar.url} />
                  </Avatar>
                  <InfoDiv>
                    <InfoTopDiv>
                      <Username>{searchedUser.username}</Username>
                      {user && (
                        <>
                          {user.username === searchedUser.username ? (
                            <EditProfileBtn onClick={() => navigate("/accounts/edit")}>Edit profile</EditProfileBtn>
                          ) : (
                            <button
                              className={followed ? "btn btn-outline-dark" : "btn btn-primary"}
                              onClick={followed ? removeFollower : addFollower}
                            >
                              {followed ? "Following" : "Follow"}
                            </button>
                          )}
                          {user.username !== searchedUser.username && (
                            <button className="btn btn-outline-dark" style={{ marginLeft: "0.5rem" }} onClick={handleMessage}>
                              Message
                            </button>
                          )}
                        </>
                      )}
                    </InfoTopDiv>
                    <InfoMidDiv>
                      <span>
                        <b>{searchedUser.posts.length}</b> posts
                      </span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsFollowers(true);
                          toggleModal();
                        }}
                      >
                        <b>{followers}</b> followers
                      </span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsFollowers(false);
                          toggleModal();
                        }}
                      >
                        <b>{following}</b> following
                      </span>
                    </InfoMidDiv>
                    <InfoBottomDiv>
                      <h5>{searchedUser.name}</h5>
                      <span>{searchedUser.bio}</span>
                    </InfoBottomDiv>
                  </InfoDiv>
                </TopDiv>
                <hr style={{ width: "70%", margin: "2rem 0" }} />
                <PostsLabel>
                  <i class="fa-solid fa-table-cells"></i> POSTS
                </PostsLabel>
                <PostsDiv postsLength={posts.length}>
                  {posts && posts.length < 1 ? (
                    <h3 style={{ marginTop: "5vh" }}>No posts yet</h3>
                  ) : (
                    <>
                      {posts &&
                        posts.map(post => {
                          return (
                            <PostCard
                              onClick={() => {
                                handlePostModal(post);
                                setShowPostModal(true);
                              }}
                            >
                              <div className="hoverPostCard">
                                <div style={{ margin: "auto" }}>
                                  <span>
                                    <i class="fa-solid fa-heart"></i> {post.usersLiked.length}
                                  </span>
                                  <span>
                                    <i class="fa-solid fa-comment"></i> {post.comments.length}
                                  </span>
                                </div>
                              </div>
                              <img src={post.images[0].url} className="postCard-img" />
                            </PostCard>
                          );
                        })}
                    </>
                  )}
                </PostsDiv>
              </InnerContainer>
            </OuterContainer>
          )}
        </>
      )}
    </>
  );
}

export default Profile;

const OuterContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;
const NavbarContainer = styled.div`
  flex: 0.2;
`;
const InnerContainer = styled.div`
  display: flex;
  flex: 0.8;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2rem auto 0;
`;
const TopDiv = styled.div`
  display: flex;
  width: 38rem;
  flex: 1;
`;
const Avatar = styled.div`
  flex: 0.4;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5rem;
  img {
    border-radius: 50%;
    width: 10rem;
    height: 10rem;
  }
`;
const InfoDiv = styled.div`
  display: flex;
  flex: 0.6;
  flex-direction: column;
  justify-content: space-between;
`;
const InfoTopDiv = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-right: 2rem;
  }
`;
const EditProfileBtn = styled.button`
  width: 7rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background: none;
`;
const InfoMidDiv = styled.div`
  display: flex;
  margin: 1rem 0;
  span {
    margin-right: 2rem;
  }
`;
const InfoBottomDiv = styled.div`
  width: 25rem;
  h5 {
    font-size: 1.1rem;
  }
  span {
    font-size: 0.9rem;
  }
`;
const Username = styled.span`
  font-size: 1.6rem;
  font-weight: 300;
`;
const PostsLabel = styled.span`
  border-top: 1px solid;
  margin: -2rem 0 1rem;
  padding-top: 1rem;
`;
const PostsDiv = styled.div`
  display: ${props => (props.postsLength > 0 ? "grid" : "flex")};
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;
const PostCard = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  .postCard-img {
    width: 15rem;
    height: 15rem;
    object-fit: cover;
  }
  .hoverPostCard {
    width: 15rem;
    height: 15rem;
    position: absolute;
    color: white;
    font-size: 1.4rem;
    display: none;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.3);
    span {
      margin: 0 1rem;
    }
  }

  :hover {
    .hoverPostCard {
      display: flex;
    }
  }
`;
