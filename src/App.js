import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from 'react-router-dom';

import { Header } from "./components"
import { Main, Join, TeamManagement, TeamProfile } from "./pages"
import { actionCreators as userActions } from "./redux/userApi"

import { history } from './redux/configStore';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const loginToken = useSelector((state) => state.user.token);

  useEffect(() => {
    if (window.location.pathname !== "/join"
    ) {
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
      </Routes>
    </>
  );
}

export default App;
