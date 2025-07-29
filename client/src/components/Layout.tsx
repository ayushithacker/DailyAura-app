import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BgImage from "../assets/bg.jpeg";

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>

      <div className="fixed top-0 left-0 w-full h-full bg-white/60 backdrop-blur-md z-[-1]" />

      <Navbar />

      <div className="pt-16 sm:pt-20 px-2 sm:px-4 max-w-5xl mx-auto">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
