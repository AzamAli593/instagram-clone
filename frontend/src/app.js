import React, { useState } from "react";
import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/user/Login";
import Home from "./components/home/Home";
import Protected from "./components/protectedRoute/Protected";
import store from "./store";
import Cookie from "js-cookie";
import { loadUser } from "./actions/userActions";
import Register from "./components/user/Register";
import LoginProtected from "./components/protectedRoute/LoginProtected";
import RegisterProtected from "./components/protectedRoute/RegisterProtected";
import Profile from "./components/user/desktop/Profile";
import Post from "./components/post/desktop/Post";
import CreatePostModal from "./components/post/desktop/CreatePostModal";
import Direct from "./components/chats/desktop/Direct";
import NotificationsModal from "./components/layout/desktop/NotificationsModal";
import SearchModal from "./components/layout/desktop/SearchModal";
import Comments from "./components/post//mobile/Comments";
import Notifications from "./components/layout/mobile/Notifications";
import Search from "./components/layout/mobile/Search";
import MobileProfile from "./components/user/mobile/Profile";
import EditProfile from "./components/user/EditProfile";
import MobilePost from "./components/post/mobile/Post";
import NotFound from "./components/layout/NotFound";
import Chat from "./components/chats/Chat";
import MobileDirect from "./components/chats/mobile/Direct";

function app() {
  if (Cookie.get("token")) {
    store.dispatch(loadUser());
  }

  return (
    <Router>
      <div className="App">
        {window.innerWidth > 769 && <CreatePostModal />}
        {window.innerWidth > 769 && <NotificationsModal />}
        {window.innerWidth > 769 && <SearchModal />}

        <Routes>
          <Route
            path="/"
            element={
              <LoginProtected>
                <Login />
              </LoginProtected>
            }
          />
          <Route
            path="/register"
            element={
              <RegisterProtected>
                <Register />
              </RegisterProtected>
            }
          />
          <Route path="/p/:postId" element={window.innerWidth > 769 ? <Post /> : <MobilePost />} />
          <Route
            path="/home"
            element={
              <Protected>
                <Home />
              </Protected>
            }
          />
          <Route path="/direct" element={<Protected>{window.innerWidth > 769 ? <Direct /> : <MobileDirect />}</Protected>} />
          <Route
            path="/direct/:chatId"
            element={
              <Protected>
                <Chat />
              </Protected>
            }
          />
          <Route path="/:username" element={<>{window.innerWidth > 769 ? <Profile /> : <MobileProfile />}</>} />
          <Route path="/p/:postId/comments" element={<Protected>{window.innerWidth < 769 ? <Comments /> : <Post />}</Protected>} />
          <Route
            path="/notifications"
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />
          <Route
            path="/search"
            element={
              <Protected>
                <Search />
              </Protected>
            }
          />
          <Route
            path="/accounts/edit"
            element={
              <Protected>
                <EditProfile />
              </Protected>
            }
          />
          <Route path="/notfound" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default app;
