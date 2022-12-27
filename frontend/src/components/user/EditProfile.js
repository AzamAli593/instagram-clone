import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../layout/desktop/Navbar";

function EditProfile() {
  const navigate = useNavigate();

  const { user } = useSelector(state => state.user);

  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [bioLength, setBioLength] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = e => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (newPassword !== confirmNewPassword) {
      return setError("password does not match");
    }

    const config = { Headers: { "Content-Type": "application/json" } };
    await axios
      .post("/api/v1/profile/update", { name, username, bio, oldPassword, newPassword, avatar }, config)
      .then(res => {
        setLoading(false);
        navigate(`/${res.data.user.username}`, { replace: true });
      })
      .catch(error => {
        setLoading(false);
        setError(error.response.data.message);
      });
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setBio(user.bio);
      setAvatar(user.avatar.url);
    }
  }, [user]);

  return (
    <>
      {user && (
        <OuterContainer>
          {window.innerWidth > 769 && (
            <NavbarContainer>
              {" "}
              <Navbar />
            </NavbarContainer>
          )}

          <Container>
            {window.innerWidth < 769 && (
              <>
                <Header>Edit Profile</Header>
                <hr style={{ margin: "0.5rem 0" }} />
              </>
            )}
            <AvatarDiv>
              <div className="img-div">
                <img src={avatar} />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1.3rem" }}>{user.username}</span>
                <input type="file" onChange={handleAvatarChange} style={{ display: "none" }} id="avatar" accept="image/*" />
                <div className="input-label-div">
                  <label htmlFor="avatar">
                    <span className="text-primary" style={{ fontSize: "0.9rem", cursor: "pointer" }}>
                      Change profile photo
                    </span>
                  </label>
                  <span
                    className="text-danger"
                    style={{ fontSize: "0.9rem", cursor: "pointer" }}
                    onClick={() => {
                      setAvatar("https://res.cloudinary.com/duvgguhqc/image/upload/v1669574324/Avatars/default-pfp_mltcik.png");
                    }}
                  >
                    Remove profile photo
                  </span>
                </div>
              </div>
            </AvatarDiv>
            <Div>
              <h6>Name</h6>
              <div>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
                <span>
                  Help people discover your account by using the name that you're known by: either your full name, nickname or business name
                </span>
                <span>You can only change your name twice within 14 days.</span>
              </div>
            </Div>
            <Div>
              <h6>Username</h6>
              <div>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <span>In most cases, you'll be able to change your username back to newtonss3rdlaw for another 11 days.</span>
              </div>
            </Div>
            <Div>
              <h6>Bio</h6>
              <div>
                <textarea
                  value={bio}
                  onChange={e => {
                    setBio(e.target.value);
                    setBioLength(e.target.value.length);
                  }}
                  maxLength="150"
                  style={{ fontSize: "0.9rem" }}
                ></textarea>
                <span>{bioLength}/150</span>

                <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>Personal information</span>
                <span>
                  Provide your personal information, even if the account is used for a business, pet or something else. This won't be part of your
                  public profile.
                </span>
              </div>
            </Div>
            <Div>
              <h6>Old password</h6>
              <div>
                <input type="text" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
              </div>
            </Div>
            <Div>
              <h6>New password</h6>
              <div>
                <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
            </Div>
            <Div>
              <h6>Confirm new password</h6>
              <div>
                <input type="text" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
              </div>
            </Div>
            {error && (
              <div class="alert alert-danger" role="alert" style={{ width: "100%" }}>
                {error}
              </div>
            )}
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading ? true : false}>
              Submit
            </button>
          </Container>
        </OuterContainer>
      )}
    </>
  );
}

export default EditProfile;
const OuterContainer = styled.div`
  display: flex;
  position: relative;
  background-color: whitesmoke;
  flex: 1;
`;
const NavbarContainer = styled.div`
  flex: 0.3;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  padding: 5rem;
  margin: 2rem auto;
  background-color: white;
  flex: 0.5;
  button {
    align-self: center;
    margin-top: 2rem;
    width: 6rem;
  }

  @media (max-width: 769px) {
    width: 100%;
    border: none;
    padding: 1rem;
    margin: 0;
    flex: 1;
  }
`;
const AvatarDiv = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  .img-div {
    display: flex;
    flex: 0.2;
    margin-right: 1.5rem;
    justify-content: flex-end;
  }
  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    @media (max-width: 769px) {
      width: 3.5rem;
      height: 3.5rem;
    }
  }
  div {
    display: flex;
    flex: 0.7;
  }
  .input-label-div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    label {
      margin-bottom: 0.3rem;
    }
  }
`;
const Div = styled.div`
  display: flex;
  flex: 1;
  margin: 1rem 0;
  h6 {
    font-weight: 500;
    flex: 0.2;
    text-align: right;
    margin: 0.5rem 1.5rem 0 0;
  }
  div {
    display: flex;
    flex: 0.7;
    flex-direction: column;
    width: 23rem;
    span {
      font-size: 0.7rem;
      margin-top: 0.5rem;
    }
    input {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 0.5rem;
    }
  }
  @media (max-width: 769px) {
    flex-direction: column;
    h6 {
      text-align: left;
      margin-bottom: 5px;
    }
    div {
      width: 100%;
    }
  }
`;
const Header = styled.div`
  font-weight: 500;
  display: flex;
  padding: 0.5rem;
  justify-content: center;
`;
