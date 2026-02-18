import {
  Box, Button, Text, HStack, VStack, Badge,
  MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem,
  AvatarRoot, AvatarFallback,
  IconButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { selectAuth, type AppDispatch } from '../../store/store';

interface TopNavbarProps {
  onMenuOpen?: () => void;
}

const TopNavbar = ({ onMenuOpen }: TopNavbarProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      h={14}
      minH={14}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      shadow="sm"
      flexShrink={0}
      position="sticky"
      top={0}
      zIndex={40}
      data-test-id="top-navbar"
    >
      {/* Left: menu button (mobile only) */}
      <Box w={10} display="flex" alignItems="center">
        <IconButton
          aria-label="Open menu"
          variant="ghost"
          display={{ base: 'flex', md: 'none' }}
          onClick={onMenuOpen}
          data-test-id="navbar-menu-button"
        >
          <FiMenu size={22} />
        </IconButton>
      </Box>

      {/* Right: avatar + logout */}
      <HStack gap={2}>
        <MenuRoot>
          <MenuTrigger asChild data-test-id="user-menu-button">
            <Button
              variant="ghost"
              rounded="full"
              py={2}
              px={2}
              _hover={{ bg: 'gray.50' }}
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
                  display={{ base: 'none', sm: 'flex' }}
                  align="start"
                  gap={0}
                >
                  <Text fontSize="sm" fontWeight="700">
                    {user?.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user?.role === 'owner' ? 'Land Owner' : 'Lease Seeker'}
                  </Text>
                </VStack>
              </HStack>
            </Button>
          </MenuTrigger>
          <MenuPositioner>
            <MenuContent
              minW="240px"
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              shadow="xl"
              py={2}
            >
              <MenuItem
                value="user-info"
                px={4}
                py={3}
                _hover={{ bg: 'gray.50' }}
                cursor="default"
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
                    <Text fontWeight="700" fontSize="md">
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
              >
                <HStack gap={3}>
                  <FiLogOut size={18} />
                  <Text>Logout</Text>
                </HStack>
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      </HStack>
    </Box>
  );
};

export default TopNavbar;
