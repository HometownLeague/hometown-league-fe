import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from 'react-router-dom';

import { Header } from "./components"
import { Main, Join, TeamManagement, TeamProfile } from "./pages"
import { actionCreators as userActions } from "./redux/userApi"
import { replace } from 'redux-first-history';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const loginToken = useSelector((state) => state.user.token);

  useEffect(() => {
    if (!user && window.location.pathname !== "/join"
    ) {
      dispatch(replace("/"))
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
