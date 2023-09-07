import React, { useEffect } from "react";
import { Route, Routes, Switch } from "react-router-dom"
import { ConnectedRouter } from "connected-react-router";
import { useDispatch } from "react-redux";

import { Header } from "./components"
import { Main, Join, TeamManagement, TeamProfile } from "./pages"

function App() {
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
