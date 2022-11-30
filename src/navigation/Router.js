import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Dash from "../pages/Dash";
import Home from "../pages/Home";


function Routers() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dash" element={<Dash />} />
      </Routes>
    </HashRouter>
  );
}

export default Routers