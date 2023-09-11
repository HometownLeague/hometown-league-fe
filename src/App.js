import React from "react";

import { Header } from "./components"
import { Main, Join, TeamManagement, TeamProfile } from "./pages"
import { Route, Routes } from 'react-router-dom';

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
