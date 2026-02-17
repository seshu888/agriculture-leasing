import {
  Box, Container, Heading, Text,
  StatRoot, StatLabel, StatValueText, Button,
  VStack, HStack, Badge, Icon, SimpleGrid, CardRoot, CardBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiFileText, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { selectRequests, selectLands, selectAuth } from '../../store/store';

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const requestsState = useSelector(selectRequests);
  const landsState = useSelector(selectLands);

  const myRequests = requestsState.requests.filter((r) => r.seekerId === user?.id);
  const pendingRequests = myRequests.filter((r) => r.status === 'pending');
  const approvedRequests = myRequests.filter((r) => r.status === 'approved');
  const availableLands = landsState.lands.filter((l) => l.available);

  const stats = [
    { 
      label: 'Available Lands', 
      value: availableLands.length, 
      icon: FiSearch, 
      color: 'green.500',
      bgGradient: 'linear-gradient(135deg, #4caf5015 0%, #8bc34a15 100%)',
    },
    { 
      label: 'My Requests', 
      value: myRequests.length, 
      icon: FiFileText, 
      color: 'blue.500',
      bgGradient: 'linear-gradient(135deg, #2196f315 0%, #64b5f615 100%)',
    },
    { 
      label: 'Pending', 
      value: pendingRequests.length, 
      icon: FiClock, 
      color: 'orange.500',
      bgGradient: 'linear-gradient(135deg, #ff980015 0%, #ff6b3515 100%)',
    },
    { 
      label: 'Approved', 
      value: approvedRequests.length, 
      icon: FiCheckCircle, 
      color: 'teal.500',
      bgGradient: 'linear-gradient(135deg, #00968815 0%, #4db6ac15 100%)',
    },
  ];

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10} px={{ base: 4, md: 6, lg: 8 }} data-test-id="seeker-dashboard">
      <Container maxW="container.xl" mx="auto">
        <VStack align="start" gap={10} maxW="1400px" mx="auto">
          {/* Header */}
          <Box className="fade-in">
            <Heading 
              size="xl" 
              color="gray.800" 
              fontWeight="900" 
              mb={2}
              textShadow="0 2px 4px rgba(0,0,0,0.05)"
            >
              Welcome back, {user?.name}! 🌾
            </Heading>
            <Text color="gray.600" fontSize="lg" fontWeight="500">
              Find the perfect agricultural land for your needs
            </Text>
          </Box>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6} w="100%">
            {stats.map((stat, i) => (
              <CardRoot 
                key={stat.label} 
                className="fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-6px)', shadow: 'xl' }}
                border="1px solid"
                borderColor="gray.200"
                borderTop="4px solid"
                borderTopColor={stat.color}
                borderRadius="2xl"
                shadow="lg"
                overflow="hidden"
              >
                <CardBody p={8}>
                  <StatRoot>
                    <HStack justify="space-between" mb={3}>
                      <Box
                        p={3}
                        borderRadius="xl"
                        bg={stat.bgGradient}
                        shadow="md"
                      >
                        <Icon as={stat.icon} boxSize={7} color={stat.color} />
                      </Box>
                    </HStack>
                    <StatLabel color="gray.700" fontWeight="700" mb={1} fontSize="md">
                      {stat.label}
                    </StatLabel>
                    <StatValueText fontSize="4xl" fontWeight="900" color={stat.color}>
                      {stat.value}
                    </StatValueText>
                  </StatRoot>
                </CardBody>
              </CardRoot>
            ))}
          </SimpleGrid>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="100%">
            <CardRoot
              className="fade-in"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              shadow="lg"
            >
              <CardBody p={8}>
                <Heading 
                  size="lg" 
                  mb={6} 
                  fontWeight="800"
                  color="gray.800"
                  textShadow="0 2px 4px rgba(0,0,0,0.05)"
                >
                  Quick Actions
                </Heading>
                <VStack gap={4}>
                  <Button 
                    w="100%" 
                    colorScheme="green" 
                    size="lg"
                    onClick={() => navigate('/seeker/browse')}
                    fontWeight="700"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateX(4px)' }}
                    bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                    color="white"
                    h="56px"
                    borderRadius="xl"
                  >
                    <HStack gap={2}>
                      <FiSearch />
                      <span>Browse Available Lands</span>
                      <FiArrowRight />
                    </HStack>
                  </Button>
                  <Button 
                    w="100%" 
                    variant="outline" 
                    colorScheme="blue" 
                    size="lg"
                    onClick={() => navigate('/seeker/my-requests')}
                    fontWeight="700"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateX(4px)' }}
                    h="56px"
                    borderRadius="xl"
                  >
                    <HStack gap={2}>
                      <FiFileText />
                      <span>View My Requests</span>
                      <FiArrowRight />
                    </HStack>
                  </Button>
                </VStack>
              </CardBody>
            </CardRoot>

            <CardRoot
              className="fade-in"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              shadow="lg"
            >
              <CardBody p={8}>
                <Heading 
                  size="lg" 
                  mb={6} 
                  fontWeight="800"
                  color="gray.800"
                  textShadow="0 2px 4px rgba(0,0,0,0.05)"
                >
                  Recent Requests
                </Heading>
                {myRequests.length === 0 ? (
                  <VStack py={8}>
                    <Text fontSize="4xl">📋</Text>
                    <Text color="gray.400" textAlign="center">
                      No requests yet. Start by browsing lands!
                    </Text>
                  </VStack>
                ) : (
                  <VStack align="start" gap={3}>
                    {myRequests.slice(0, 3).map((req) => {
                      const land = landsState.lands.find((l) => l.id === req.landId);
                      return (
                        <HStack 
                          key={req.id} 
                          justify="space-between" 
                          w="100%" 
                          p={4} 
                          bg="gray.50" 
                          borderRadius="lg"
                          transition="all 0.2s"
                          _hover={{ bg: 'gray.100', transform: 'translateX(4px)' }}
                        >
                          <VStack align="start" gap={0} flex={1}>
                            <Text fontSize="sm" fontWeight="700" color="gray.800">
                              {land?.title ?? 'Land'}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </Text>
                          </VStack>
                          <Badge 
                            colorScheme={
                              req.status === 'approved' ? 'green' :
                              req.status === 'rejected' ? 'red' : 'orange'
                            }
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="700"
                            textTransform="capitalize"
                          >
                            {req.status}
                          </Badge>
                        </HStack>
                      );
                    })}
                  </VStack>
                )}
              </CardBody>
            </CardRoot>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default SeekerDashboard;
