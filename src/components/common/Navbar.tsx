import {
  Box, Flex, Button, Text, HStack, IconButton, VStack, Badge,
  useDisclosure,
  MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem,
  DrawerRoot, DrawerBackdrop, DrawerPositioner, DrawerContent,
  DrawerCloseTrigger, DrawerHeader, DrawerBody,
  AvatarRoot, AvatarFallback,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import { logout } from '../../store/slices/authSlice';
import { selectAuth, type AppDispatch } from '../../store/store';

const ownerLinks = [
  { label: 'Dashboard',       path: '/owner/dashboard' },
  { label: 'My Lands',        path: '/owner/my-lands'  },
  { label: 'Add Land',        path: '/owner/add-land'  },
  { label: 'Lease Requests',  path: '/owner/requests'  },
];

const seekerLinks = [
  { label: 'Dashboard',    path: '/seeker/dashboard'   },
  { label: 'Browse Lands', path: '/seeker/browse'      },
  { label: 'My Requests',  path: '/seeker/my-requests' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const { open, onOpen, onClose, setOpen } = useDisclosure();

  const links = user?.role === 'owner' ? ownerLinks : seekerLinks;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      bg="rgba(255, 255, 255, 0.95)"
      px={4}
      shadow="0 4px 20px rgba(0, 0, 0, 0.08)"
      position="sticky"
      top={0}
      zIndex={100}
      data-test-id="navbar"
      borderBottom="1px solid"
      borderColor="gray.100"
      backdropFilter="blur(10px)"
      className="glass"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto">
        {/* Logo */}
        <HStack
          gap={3}
          cursor="pointer"
          onClick={() => navigate('/')}
          data-test-id="navbar-logo"
          transition="all 0.3s"
          _hover={{ transform: 'scale(1.05)' }}
        >
          <Box
            p={2.5}
            bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
            borderRadius="xl"
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{ 
              bg: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
              transform: 'rotate(5deg) scale(1.1)',
              shadow: '0 8px 20px rgba(102, 187, 106, 0.3)'
            }}
            shadow="sm"
          >
            <GiWheat size={28} color="#2e7d32" />
          </Box>
          <Text 
            fontSize={{ base: "lg", md: "xl" }} 
            fontWeight="900" 
            className="text-gradient"
            letterSpacing="-0.5px"
          >
            AgriLease
          </Text>
        </HStack>

        {/* Desktop Links */}
        <HStack gap={2} display={{ base: 'none', md: 'flex' }} data-test-id="desktop-nav">
          {links.map((link, i) => {
            const active = isActive(link.path);
            return (
              <Button
                key={i}
                variant="ghost"
                onClick={() => navigate(link.path)}
                fontWeight="700"
                color={active ? 'brand.600' : 'gray.700'}
                bg={active ? 'brand.50' : 'transparent'}
                px={4}
                py={2}
                borderRadius="lg"
                transition="all 0.3s"
                position="relative"
                _hover={{ 
                  bg: active ? 'brand.100' : 'gray.50', 
                  color: active ? 'brand.700' : 'brand.600',
                  transform: 'translateY(-2px)',
                }}
                _before={active ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '3px',
                  bg: 'brand.500',
                  borderRadius: 'full',
                } : {}}
                data-test-id={`nav-link-${i}`}
                shadow={active ? 'sm' : 'none'}
              >
                {link.label}
              </Button>
            );
          })}
        </HStack>

        {/* User Menu */}
        <HStack gap={3}>
          <MenuRoot>
            <MenuTrigger
              asChild
              data-test-id="user-menu-button"
            >
              <Button 
                variant="ghost" 
                rounded="full"
                transition="all 0.3s"
                _hover={{ bg: 'gray.50', transform: 'scale(1.05)' }}
              >
                <HStack gap={2}>
                  <AvatarRoot size="sm">
                    <AvatarFallback 
                      name={user?.name} 
                      bg="brand.500"
                      color="white"
                      fontWeight="700"
                    />
                  </AvatarRoot>
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    align="start"
                    gap={0}
                  >
                    <Text fontSize="sm" fontWeight="700">{user?.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {user?.role === 'owner' ? 'Land Owner' : 'Lease Seeker'}
                    </Text>
                  </VStack>
                </HStack>
              </Button>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent 
                data-test-id="user-menu-list" 
                minW="240px"
                bg="white"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="#E0E0E0"
                shadow="xl"
                py={2}
              >
                <MenuItem 
                  value="user-info" 
                  data-test-id="user-info-item"
                  px={4}
                  py={3}
                  _hover={{ bg: 'gray.50' }}
                  cursor="default"
                  _focus={{ bg: 'transparent' }}
                >
                  <HStack gap={3} w="100%">
                    <AvatarRoot size="md">
                      <AvatarFallback 
                        name={user?.name} 
                        bg="brand.500"
                        color="white"
                        fontWeight="700"
                      />
                    </AvatarRoot>
                    <VStack align="start" gap={0} flex={1}>
                      <Text fontWeight="700" fontSize="md" color="gray.800">
                        {user?.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {user?.mobile}
                      </Text>
                      <Badge 
                        colorScheme="brand" 
                        mt={1}
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="600"
                      >
                        {user?.role === 'owner' ? 'Land Owner' : 'Lease Seeker'}
                      </Badge>
                    </VStack>
                  </HStack>
                </MenuItem>
                <Box px={2} py={1}>
                  <Box h="1px" bg="gray.200" />
                </Box>
                <MenuItem
                  value="logout"
                  onClick={handleLogout}
                  data-test-id="logout-button"
                  px={4}
                  py={3}
                  color="red.600"
                  fontWeight="600"
                  _hover={{ bg: 'red.50', color: 'red.700' }}
                  _focus={{ bg: 'red.50' }}
                  transition="all 0.2s"
                >
                  <HStack gap={3}>
                    <FiLogOut size={18} />
                    <Text>Logout</Text>
                  </HStack>
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>

          {/* Mobile Menu */}
          <IconButton
            aria-label="Open menu"
            display={{ base: 'flex', md: 'none' }}
            variant="ghost"
            onClick={onOpen}
            data-test-id="mobile-menu-button"
            transition="all 0.3s"
            _hover={{ bg: 'gray.50', transform: 'rotate(90deg)' }}
          >
            <FiMenu />
          </IconButton>
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <DrawerRoot open={open} onOpenChange={({ open: next }) => setOpen(next)} placement="end">
        <DrawerBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerPositioner>
          <DrawerContent 
            data-test-id="mobile-drawer"
            maxW="320px"
            bg="white"
            shadow="2xl"
          >
            <DrawerCloseTrigger 
              position="absolute"
              top={4}
              right={4}
              zIndex={10}
            />
            <DrawerHeader 
              fontWeight="800" 
              fontSize="xl" 
              color="gray.800"
              px={6}
              pt={6}
              pb={4}
              borderBottom="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={3}>
                <Box
                  p={2}
                  bg="brand.50"
                  borderRadius="lg"
                >
                  <GiWheat size={24} color="#66bb6a" />
                </Box>
                <Text>Menu</Text>
              </HStack>
            </DrawerHeader>
            <DrawerBody px={0} py={4}>
              <VStack align="stretch" gap={1}>
                {links.map((link, i) => {
                  const active = isActive(link.path);
                  return (
                    <Button
                      key={i}
                      variant="ghost"
                      justifyContent="flex-start"
                      fontWeight={active ? "700" : "600"}
                      fontSize="md"
                      color={active ? 'brand.600' : 'gray.700'}
                      bg={active ? 'brand.50' : 'transparent'}
                      onClick={() => { navigate(link.path); onClose(); }}
                      data-test-id={`mobile-nav-link-${i}`}
                      transition="all 0.2s"
                      px={6}
                      py={4}
                      h="auto"
                      borderRadius={0}
                      borderLeft={active ? "4px solid" : "4px solid transparent"}
                      borderLeftColor={active ? "brand.500" : "transparent"}
                      _hover={{ 
                        bg: active ? 'brand.100' : 'gray.50', 
                        color: active ? 'brand.700' : 'brand.600',
                        transform: 'translateX(4px)',
                      }}
                      _active={{ bg: active ? 'brand.100' : 'gray.100' }}
                    >
                      {link.label}
                    </Button>
                  );
                })}
                <Box px={4} py={2}>
                  <Box h="1px" bg="gray.200" />
                </Box>
                <Box px={6} py={3}>
                  <HStack gap={3} mb={3}>
                    <AvatarRoot size="md">
                      <AvatarFallback 
                        name={user?.name} 
                        bg="brand.500"
                        color="white"
                        fontWeight="700"
                      />
                    </AvatarRoot>
                    <VStack align="start" gap={0} flex={1}>
                      <Text fontSize="sm" fontWeight="700" color="gray.800">
                        {user?.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {user?.mobile}
                      </Text>
                      <Badge 
                        colorScheme="brand" 
                        mt={1}
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="600"
                      >
                        {user?.role === 'owner' ? 'Land Owner' : 'Lease Seeker'}
                      </Badge>
                    </VStack>
                  </HStack>
                </Box>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color="red.600"
                  fontWeight="700"
                  fontSize="md"
                  onClick={handleLogout}
                  data-test-id="mobile-logout-button"
                  transition="all 0.2s"
                  px={6}
                  py={4}
                  h="auto"
                  borderRadius={0}
                  _hover={{ 
                    bg: 'red.50', 
                    color: 'red.700',
                    transform: 'translateX(4px)',
                  }}
                  _active={{ bg: 'red.100' }}
                >
                  <HStack gap={3}>
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </HStack>
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </Box>
  );
};

export default Navbar;
