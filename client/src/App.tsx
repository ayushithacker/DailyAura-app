import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashoard";
import Journal from "./pages/Journal";
import Mood from "./pages/Mood";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuthSuccess from "./pages/OAuthSuccess";

const App: React.FC = () => {
  return (
    <>
      {" "}
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/Mood" element={<Mood />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
