import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, selectAuth } from './store/store';
import { loadUser } from './store/slices/authSlice';

// Auth Components
import Login from './components/auth/Login';
import OTPVerification from './components/auth/OTPVerification';
import AadharVerification from './components/auth/AadharVerification';

// Common Components
import DashboardLayout from './components/common/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Owner Components
import OwnerDashboard from './components/owner/OwnerDashboard';
import AddLand from './components/owner/AddLand';
import MyLands from './components/owner/MyLands';
import LeaseRequests from './components/owner/LeaseRequests';

// Seeker Components
import SeekerDashboard from './components/seeker/SeekerDashboard';
import BrowseLands from './components/seeker/BrowseLands';
import LandDetails from './components/seeker/LandDetails';
import MyRequests from './components/seeker/MyRequests';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        {/* ── Public Routes ────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/verify-aadhar" element={<AadharVerification />} />

        {/* ── Dashboard (Sidebar) Layout ───────── */}
        <Route element={<DashboardLayout />}>
          <Route path="/owner/dashboard" element={
            <ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>
          } />
          <Route path="/owner/add-land" element={
            <ProtectedRoute role="owner"><AddLand /></ProtectedRoute>
          } />
          <Route path="/owner/my-lands" element={
            <ProtectedRoute role="owner"><MyLands /></ProtectedRoute>
          } />
          <Route path="/owner/requests" element={
            <ProtectedRoute role="owner"><LeaseRequests /></ProtectedRoute>
          } />
          <Route path="/seeker/dashboard" element={
            <ProtectedRoute role="seeker"><SeekerDashboard /></ProtectedRoute>
          } />
          <Route path="/seeker/browse" element={
            <ProtectedRoute role="seeker"><BrowseLands /></ProtectedRoute>
          } />
          <Route path="/seeker/land/:id" element={
            <ProtectedRoute role="seeker"><LandDetails /></ProtectedRoute>
          } />
          <Route path="/seeker/my-requests" element={
            <ProtectedRoute role="seeker"><MyRequests /></ProtectedRoute>
          } />
        </Route>

        {/* ── Default Redirect ─────────────────── */}
        <Route path="/" element={
          isAuthenticated
            ? user?.role === 'owner'
              ? <Navigate to="/owner/dashboard" replace />
              : <Navigate to="/seeker/dashboard" replace />
            : <Navigate to="/login" replace />
        } />

        {/* ── Catch All ────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

export default App;