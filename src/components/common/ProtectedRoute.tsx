import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/store';
import { Box, Spinner, Center } from '@chakra-ui/react';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'owner' | 'seeker';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useSelector(selectAuth);

  if (loading) {
    return (
      <Center h="100vh" data-test-id="loading-spinner">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    const redirectPath =
      user?.role === 'owner' ? '/owner/dashboard' : '/seeker/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Box data-test-id="protected-content">{children}</Box>;
};

export default ProtectedRoute;