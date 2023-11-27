import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from 'react-router-dom';

import { Header } from "./components"
import { Main, Join, TeamManagement, TeamProfile, MyMatching, TeamSearch, MyProfile } from "./pages"
import { actionCreators as userActions } from "./redux/userApi"

import { history } from './redux/configStore';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    if (isLogin && user === null) {
      dispatch(userActions.loginCheckDB())
    }
  }, [])
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/join" element={<Join />} />
        <Route path="/teamManagement" element={<TeamManagement />} />
        <Route path="/team/profile/:id" element={<TeamProfile />} />
        <Route path="/myMatching" element={<MyMatching />} />
        <Route path="/searchTeam" element={<TeamSearch />} />
        <Route path="/myProfile" element={< MyProfile />} />
        {/* <Route path="/team/gameResult/:id" element={<GameResult />} /> */}

      </Routes>
    </>
  );
}

export default App;
