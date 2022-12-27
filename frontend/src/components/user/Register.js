import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";
import Cookie from "js-cookie";
import styled from "styled-components";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [onboardLoading, setOnboardLoading] = useState(null);
  const [registerDataLoading, setRegisterDataLoading] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setOnboardLoading(true);
    const config = { Headers: { "Content-Type": "application/json" } };
    await axios
      .post("/api/v1/register/process/s3", { name, username, password }, config)
      .then(res => {
        setOnboardLoading(false);
        window.location.reload();
      })
      .catch(err => {
        setOnboardLoading(false);
        setError(err);
      });
  };

  const loadRegisterData = async () => {
    setRegisterDataLoading(true);
    await axios
      .get("/api/v1/register/process/s2")
      .then(res => {
        setUser(res.data.user);
        setRegisterDataLoading(false);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (!user && !Cookie.get("token")) {
      loadRegisterData();
    }
  }, [user]);

  return (
    <>
      {registerDataLoading || onboardLoading ? (
        <Loader />
      ) : (
        <>
          {user && (
            <Container>
              {window.innerWidth > 769 && <OnboardImage src="OnboardImage.png" />}

              <LoginCard>
                <InstaHeading src="InstagramHeading.png" />
                <LoginForm onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    placeholder="name"
                    value={name}
                    autoComplete="off"
                    onChange={e => {
                      setName(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="email"
                    value={user.email}
                    disabled
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="form-control onboarding-input"
                    placeholder="username"
                    autoComplete="off"
                    required
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value);
                    }}
                  />
                  {error && (
                    <div class="alert alert-danger" role="alert" style={{ width: "100%" }}>
                      username has already been taken
                    </div>
                  )}
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control onboarding-input"
                    placeholder="password"
                    required
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                  />

                  <button className="btn btn-primary" type="submit">
                    Create account
                  </button>
                </LoginForm>
              </LoginCard>
            </Container>
          )}
        </>
      )}
    </>
  );
}

export default Register;

const Container = styled.div`
  width: 80%;
  margin: 5rem auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 769px) {
    width: 98%;
  }
`;
const OnboardImage = styled.img`
  width: 37rem;
  height: 37rem;
`;
const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 2rem;
  width: 30rem;
  @media (max-width: 769px) {
    width: 100%;
    padding: 0.5rem;
    border: none;
    input {
      margin: 2rem 0;
    }
  }
`;
const InstaHeading = styled.img`
  width: 14rem;
  margin-bottom: 2rem;
  @media (max-width: 769px) {
    width: 10rem;
  }
`;
const LoginForm = styled.form`
  width: 100%;
  input,
  button {
    margin: 0.5rem 0;
    width: 100%;
  }
`;
