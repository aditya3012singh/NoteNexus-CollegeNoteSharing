import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../my-project/src/redux/store";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------------- Layout Components ---------------------- */
import UserLayout from "./components/Layout/UserLayout";

/* ---------------------- Auth Pages ---------------------- */
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";

/* ---------------------- User Pages ---------------------- */
import Home from "./pages/user/Home";
import UserDashboard from "./pages/user/UserDashboard";
import UserNotes from "./pages/user/UserNotes";
import NoteDetail from "./pages/user/NoteDetail";
import UserTips from "./pages/user/UserTips";
import TipDetail from "./pages/user/TipDetail";
import UserEvents from "./pages/user/UserEvents";
import UserAnnouncements from "./pages/user/UserAnnouncements";
import UserProfile from "./pages/user/UserProfile";
import UserFiles from "./pages/user/UserFiles";
import FileDetail from "./pages/user/FileDetail";

/* ---------------------- Protected Route Wrapper ---------------------- */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const storedUser = user || JSON.parse(localStorage.getItem("user") || "null");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* ---------------------- Layout Component ---------------------- */
const Layout: React.FC = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  // Hide header for all /user routes (dashboard, notes, files, etc.)
  const hideHeader = location.pathname.startsWith("/user");

  return (
    <div className="relative overflow-hidden">
      {/* Header (only on public routes) */}
      

      {/* Routes */}
      <div className={hideHeader ? "" : "pt-"}>
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route
            path="/"
            element={user ? <Navigate to="/user" replace /> : <Home />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/user" replace /> : <LoginForm />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/user" replace /> : <SignupForm />}
          />

          {/* ---------- Protected Routes ---------- */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="notes" element={<UserNotes />} />
            <Route path="notes/:id" element={<NoteDetail />} />
            <Route path="tips" element={<UserTips />} />
            <Route path="tips/:id" element={<TipDetail />} />
            <Route path="events" element={<UserEvents />} />
            <Route path="announcements" element={<UserAnnouncements />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="files" element={<UserFiles />} />
            <Route path="files/:id" element={<FileDetail />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

/* ---------------------- App Root ---------------------- */
const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
