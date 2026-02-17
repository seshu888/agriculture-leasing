import {
  Box, Container, Heading, SimpleGrid,
  Button, VStack, HStack, Icon, Text,
  StatRoot, StatLabel, StatValueText, StatHelpText,
  CardRoot, CardBody,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlusCircle, FiMapPin, FiInbox, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { selectAuth, selectOwnerLands, selectReceivedRequests, type AppDispatch, type RootState } from '../../store/store';
import { fetchLandsThunk } from '../../store/thunks/landsThunk';
import { fetchReceivedRequestsThunk } from '../../store/thunks/requestThunk';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const myLands = useSelector((state: RootState) => selectOwnerLands(user!.id)(state));
  const receivedRequests = useSelector((state: RootState) => selectReceivedRequests(user!.id)(state));

  useEffect(() => {
    dispatch(fetchLandsThunk());
    dispatch(fetchReceivedRequestsThunk(user!.id));
  }, [dispatch, user]);

  const availableLands   = myLands.filter((l) => l.available).length;
  const pendingRequests  = receivedRequests.filter((r) => r.status === 'pending').length;
  const totalRevenue     = myLands.reduce((sum, l) => sum + l.pricePerMonth, 0);

  const stats = [
    { 
      label: 'Total Lands', 
      value: myLands.length, 
      helpText: `${availableLands} available`, 
      icon: FiMapPin, 
      color: 'brand',
      bgGradient: 'linear-gradient(135deg, #81c78415 0%, #a5d6a715 100%)',
      path: '/owner/my-lands',
    },
    { 
      label: 'Pending Requests', 
      value: pendingRequests, 
      helpText: 'Awaiting response', 
      icon: FiInbox, 
      color: 'orange',
      bgGradient: 'linear-gradient(135deg, #ff980015 0%, #ff6b3515 100%)',
      path: '/owner/requests',
    },
    { 
      label: 'Potential Revenue', 
      value: `₹${totalRevenue.toLocaleString()}`, 
      helpText: 'Per month', 
      icon: FiTrendingUp, 
      color: 'green',
      bgGradient: 'linear-gradient(135deg, #4caf5015 0%, #8bc34a15 100%)',
      path: '/owner/my-lands',
    },
  ];

  const actions = [
    { 
      title: 'Add New Land', 
      desc: 'List a new property', 
      icon: FiPlusCircle, 
      path: '/owner/add-land', 
      scheme: 'brand',
      gradient: 'linear-gradient(135deg, #0da10d 0%, #25d366 100%)',
    },
    { 
      title: 'My Lands', 
      desc: 'Manage your properties', 
      icon: FiMapPin, 
      path: '/owner/my-lands', 
      scheme: 'blue',
      gradient: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
    },
    { 
      title: 'Lease Requests', 
      desc: `${pendingRequests} pending`, 
      icon: FiInbox, 
      path: '/owner/requests', 
      scheme: 'orange',
      gradient: 'linear-gradient(135deg, #ff9800 0%, #ff6b35 100%)',
    },
  ];

  return (
    <Box 
      bg="linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%)" 
      minH="calc(100vh - 64px)" 
      py={10} 
      px={{ base: 4, md: 6, lg: 8 }} 
      data-test-id="owner-dashboard"
    >
      <Container maxW="container.xl" mx="auto">
        <VStack gap={10} align="stretch" maxW="1400px" mx="auto">

          {/* Header */}
          <Box data-test-id="dashboard-header" className="fade-in">
            <Heading 
              size={{ base: "lg", md: "xl" }}
              mb={2} 
              fontWeight="900" 
              color="gray.800"
              textShadow="0 2px 4px rgba(0,0,0,0.05)"
            >
              Welcome back, {user?.name}! 👋
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} fontWeight="500">
              Manage your agricultural properties
            </Text>
          </Box>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} data-test-id="stats-grid">
            {stats.map((stat, i) => (
              <CardRoot 
                key={i} 
                data-test-id={`stat-card-${i}`}
                className="fade-in card-hover"
                style={{ animationDelay: `${i * 0.1}s` }}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                cursor="pointer"
                onClick={() => navigate(stat.path)}
                _hover={{ 
                  transform: 'translateY(-8px) scale(1.02)',
                  shadow: '0 20px 40px rgba(0, 0, 0, 0.12)'
                }}
                border="1px solid"
                borderColor="gray.200"
                shadow="0 10px 30px rgba(0, 0, 0, 0.08)"
                borderRadius="2xl"
                overflow="hidden"
                bg="white"
                position="relative"
              >
                {/* Gradient accent */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="4px"
                  bg={stat.bgGradient}
                />
                <CardBody p={{ base: 6, md: 8 }}>
                  <StatRoot>
                    <HStack justify="space-between" mb={4}>
                      <Box
                        p={{ base: 3, md: 4 }}
                        borderRadius="xl"
                        bg={stat.bgGradient}
                        shadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                        transition="all 0.3s"
                        _hover={{ transform: 'scale(1.1) rotate(5deg)' }}
                      >
                        <Icon as={stat.icon} boxSize={{ base: 6, md: 7 }} color={`${stat.color}.600`} />
                      </Box>
                    </HStack>
                    <StatValueText 
                      fontSize={{ base: "3xl", md: "4xl" }}
                      fontWeight="900"
                      color={`${stat.color}.600`} 
                      data-test-id={`stat-value-${i}`}
                      mb={2}
                    >
                      {stat.value}
                    </StatValueText>
                    <StatLabel color="gray.700" fontWeight="700" mb={1} fontSize={{ base: "sm", md: "md" }}>
                      {stat.label}
                    </StatLabel>
                    <StatHelpText color="gray.500" fontSize={{ base: "xs", md: "sm" }} fontWeight="500">
                      {stat.helpText}
                    </StatHelpText>
                  </StatRoot>
                </CardBody>
              </CardRoot>
            ))}
          </SimpleGrid>

          {/* Quick Actions */}
          <Box>
            <Heading 
              size="lg" 
              mb={6} 
              fontWeight="800" 
              color="gray.800"
              textShadow="0 2px 4px rgba(0,0,0,0.05)"
            >
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} data-test-id="quick-actions">
              {actions.map((action, i) => (
                <CardRoot
                  key={i}
                  cursor="pointer"
                  onClick={() => navigate(action.path)}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{ 
                    shadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-10px) scale(1.03)',
                  }}
                  data-test-id={`action-card-${i}`}
                  border="1px solid"
                  borderColor="gray.200"
                  className="fade-in card-hover"
                  style={{ animationDelay: `${(i + 3) * 0.1}s` }}
                  position="relative"
                  overflow="hidden"
                  borderRadius="2xl"
                  shadow="0 10px 30px rgba(0, 0, 0, 0.08)"
                  bg="white"
                >
                  {/* Gradient overlay */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="5px"
                    bg={action.gradient}
                  />
                  <CardBody p={8}>
                    <VStack align="start" gap={5}>
                      <Box
                        p={4}
                        borderRadius="xl"
                        bg={`${action.scheme}.50`}
                        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        shadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                        _hover={{ transform: 'scale(1.15) rotate(10deg)' }}
                      >
                        <Icon as={action.icon} boxSize={9} color={`${action.scheme}.600`} />
                      </Box>
                      <VStack align="start" gap={2} flex={1}>
                        <Text fontWeight="800" fontSize="xl" color="gray.800">
                          {action.title}
                        </Text>
                        <Text color="gray.600" fontSize="sm" fontWeight="500">
                          {action.desc}
                        </Text>
                      </VStack>
                      <Button 
                        colorScheme={action.scheme} 
                        w="full" 
                        data-test-id={`action-button-${i}`}
                        fontWeight="700"
                        fontSize="md"
                        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        _hover={{ 
                          transform: 'translateY(-3px) scale(1.02)',
                          shadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                        }}
                        bg={action.gradient}
                        color="white"
                        h="40px"
                        borderRadius="xl"
                        shadow="0 6px 20px rgba(0, 0, 0, 0.15)"
                        _active={{ transform: 'translateY(-1px) scale(0.98)' }}
                        className="btn-glow"
                      >
                        <HStack gap={2}>
                          <span>Go</span>
                          <FiArrowRight size={16} />
                        </HStack>
                      </Button>
                    </VStack>
                  </CardBody>
                </CardRoot>
              ))}
            </SimpleGrid>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default OwnerDashboard;
