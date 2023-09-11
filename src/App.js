import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Header } from "./components"
import { Main, Join, TeamManagement, TeamProfile } from "./pages"
import { Route, Routes, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

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
