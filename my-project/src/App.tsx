import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Auth } from './components/pages/Auth';
import { Styling } from './components/pages/Styling';
import MainLayout from './components/Layout/MainLayout';
import { Dashboard } from './components/pages/UserDashboard';
import Notes from './components/pages/Notes';
import Tips from './components/pages/Tips';
import Events from './components/pages/Events';
import Announcements from './components/pages/Announcements';
import Files from './components/pages/Files';
import Profile from './components/pages/Profile';

// Simple error boundary
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <div className="p-8">Something went wrong.</div>;
    return this.props.children;
  }
}

// Enhanced RequireAuth with role-based access control
interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: specify allowed roles
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const user = useSelector((s: RootState) => s.auth.user);
  const location = useLocation();
  const userRole = user?.role || 'guest';

  if (!user) {
    // Save the intended URL before redirecting to login
    return (
      <Navigate 
        to={`/login`} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

// Public layout wrapper - only renders children if no user is logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((s: RootState) => s.auth.user);
  const location = useLocation();
  
  if (user) {
    // If user is logged in, redirect to home or the originally requested page
    const from = (location.state as any)?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const user = useSelector((s: RootState) => s.auth.user);
  const location = useLocation();
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <Routes>
          {/* Auth routes - only accessible when not logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />

          {/* Protected routes - only accessible when logged in */}
          <Route path="/" element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="tips" element={<Tips />} />
            <Route path="events" element={<Events />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="files" element={<Files />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Example of role-protected route */}
            <Route
              path="admin"
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <div>Admin Dashboard</div>
                </RequireAuth>
              }
            />
          </Route>

          {/* Public but layout-less routes */}
          <Route path="/styling" element={<Styling />} />

          {/* Catch-all */}
          <Route path="*" element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace state={{ from: location }} />
            )
          } />
        </Routes>
      </Suspense>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ErrorBoundary>
  );
}

export default App;