import {
  Box, Button, Text, VStack, HStack,
  useDisclosure,
  DrawerRoot, DrawerBackdrop, DrawerPositioner, DrawerContent,
  DrawerCloseTrigger, DrawerHeader, DrawerBody,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiGrid, FiMapPin, FiPlusCircle, FiInbox, FiSearch, FiFileText } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import { selectAuth } from '../../store/store';

const ownerLinks = [
  { label: 'Dashboard', path: '/owner/dashboard', icon: FiGrid },
  { label: 'My Lands', path: '/owner/my-lands', icon: FiMapPin },
  { label: 'Add Land', path: '/owner/add-land', icon: FiPlusCircle },
  { label: 'Lease Requests', path: '/owner/requests', icon: FiInbox },
];

const seekerLinks = [
  { label: 'Dashboard', path: '/seeker/dashboard', icon: FiGrid },
  { label: 'Browse Lands', path: '/seeker/browse', icon: FiSearch },
  { label: 'My Requests', path: '/seeker/my-requests', icon: FiFileText },
];

const SIDEBAR_WIDTH = 260;

interface SidebarProps {
  /** Controlled open state for mobile drawer (from layout) */
  drawerOpen?: boolean;
  onDrawerOpen?: () => void;
  onDrawerClose?: () => void;
}

const Sidebar = ({ drawerOpen, onDrawerClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(selectAuth);
  const { open: internalOpen, onClose: internalOnClose } = useDisclosure();

  const links = user?.role === 'owner' ? ownerLinks : seekerLinks;
  const isControlled = drawerOpen !== undefined && onDrawerClose != null;
  const open = isControlled ? drawerOpen : internalOpen;
  const onClose = isControlled ? onDrawerClose : internalOnClose;

  const isActive = (path: string) => location.pathname === path;

  const navContent = (
    <>
      {/* Logo - same height as navbar so bottom borders align */}
      <Box
        h={14}
        minH={14}
        px={4}
        display="flex"
        alignItems="center"
        borderBottom="1px solid"
        borderColor="gray.200"
        data-test-id="sidebar-logo"
      >
        <HStack
          gap={3}
          cursor="pointer"
          onClick={() => navigate(user?.role === 'owner' ? '/owner/dashboard' : '/seeker/dashboard')}
          transition="all 0.3s"
          _hover={{ opacity: 0.9 }}
        >
          <Box
            p={2}
            bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
            borderRadius="xl"
            shadow="sm"
          >
            <GiWheat size={24} color="#2e7d32" />
          </Box>
          <Text fontWeight="900" fontSize="lg" className="text-gradient" letterSpacing="-0.5px">
            AgriLease
          </Text>
        </HStack>
      </Box>

      {/* Nav links only - menu on the left */}
      <VStack align="stretch" gap={1} flex={1} py={4} px={3} overflowY="auto">
        {links.map((link, i) => {
          const active = isActive(link.path);
          const Icon = link.icon;
          return (
            <Button
              key={i}
              variant="ghost"
              justifyContent="flex-start"
              fontWeight={active ? '700' : '600'}
              fontSize="sm"
              color={active ? 'brand.600' : 'gray.700'}
              bg={active ? 'brand.50' : 'transparent'}
              onClick={() => {
                navigate(link.path);
                onClose();
              }}
              data-test-id={`nav-link-${i}`}
              transition="all 0.2s"
              px={4}
              py={3}
              h="auto"
              borderRadius="lg"
              borderLeft={active ? '4px solid' : '4px solid transparent'}
              borderLeftColor={active ? 'brand.500' : 'transparent'}
              _hover={{
                bg: active ? 'brand.100' : 'gray.50',
                color: active ? 'brand.700' : 'brand.600',
              }}
            >
              <HStack gap={3}>
                <Box as={Icon} boxSize={5} />
                <span>{link.label}</span>
              </HStack>
            </Button>
          );
        })}
      </VStack>
    </>
  );

  return (
    <>
      {/* Desktop: fixed sidebar (menu on the left) */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        w={`${SIDEBAR_WIDTH}px`}
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        shadow="sm"
        zIndex={50}
        data-test-id="sidebar"
      >
        {navContent}
      </Box>

      {/* Mobile: drawer only (navbar with menu button is in TopNavbar) */}
      <DrawerRoot
        open={open}
        onOpenChange={({ open: next }) => { if (!next) onClose(); }}
        placement="start"
      >
        <DrawerBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerPositioner>
          <DrawerContent data-test-id="mobile-drawer" maxW={`${SIDEBAR_WIDTH}px`} bg="white" shadow="2xl">
            <DrawerCloseTrigger position="absolute" top={4} right={4} zIndex={10} />
            <DrawerHeader py={4} px={4} borderBottom="1px solid" borderColor="gray.100">
              <Text fontWeight="800" fontSize="lg">
                Menu
              </Text>
            </DrawerHeader>
            <DrawerBody p={0} display="flex" flexDirection="column">
              {navContent}
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  );
};

export default Sidebar;
export { SIDEBAR_WIDTH };
