import { Box } from '@chakra-ui/react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectAuth } from '../../store/store';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import TopNavbar from './TopNavbar';

const DashboardLayout = () => {
  const { isAuthenticated } = useSelector(selectAuth);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box display="flex" minH="100vh" bg="gray.50">
      <Sidebar
        drawerOpen={sidebarOpen}
        onDrawerOpen={() => setSidebarOpen(true)}
        onDrawerClose={() => setSidebarOpen(false)}
      />
      <Box
        as="main"
        flex={1}
        ml={{ base: 0, md: `${SIDEBAR_WIDTH}px` }}
        minW={0}
        display="flex"
        flexDirection="column"
        h="100vh"
        maxH="100vh"
        overflow="hidden"
        data-test-id="main-content"
      >
        <TopNavbar onMenuOpen={() => setSidebarOpen(true)} />
        <Box flex={1} minH={0} overflow="auto">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
