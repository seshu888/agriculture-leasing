import {
  Box, Container, Heading, Text, VStack, HStack,
  Badge, Icon, SimpleGrid,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { FiMapPin, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { selectRequests, selectLands, selectAuth } from '../../store/store';

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: 'orange', icon: FiClock, label: 'Pending' },
  approved: { color: 'green', icon: FiCheckCircle, label: 'Approved' },
  rejected: { color: 'red', icon: FiXCircle, label: 'Rejected' },
};

const MyRequests = () => {
  const { user } = useSelector(selectAuth);
  const requestsState = useSelector(selectRequests);
  const landsState = useSelector(selectLands);

  const myRequests = requestsState.requests.filter((r) => r.seekerId === user?.id);

  return (
    <Box 
      bg="linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%)" 
      minH="calc(100vh - 64px)" 
      py={10} 
      px={{ base: 4, md: 6, lg: 8 }} 
      data-test-id="my-requests-page"
    >
      <Container maxW="container.xl" mx="auto">
        <VStack gap={6} align="stretch" maxW="1400px" mx="auto">
          <Heading color="green.700" mb={2} fontWeight="900" textShadow="0 2px 4px rgba(0,0,0,0.05)">
            My Lease Requests 📋
          </Heading>

        {myRequests.length === 0 ? (
          <Box 
            bg="white" 
            p={12} 
            borderRadius="2xl" 
            shadow="0 8px 25px rgba(0, 0, 0, 0.08)" 
            textAlign="center"
            className="fade-in"
          >
            <Text fontSize="5xl" mb={3}>📋</Text>
            <Text fontSize="xl" mb={2} fontWeight="700" color="gray.800">No requests yet</Text>
            <Text color="gray.500" fontSize="sm">Browse available lands and send your first lease request!</Text>
          </Box>
        ) : (
          <VStack gap={6} align="stretch">
            {myRequests.map((req, i) => {
              const land = landsState.lands.find((l) => l.id === req.landId);
              const status = statusConfig[req.status];
              const statusGradient = {
                pending: 'linear-gradient(135deg, #ff980015 0%, #ff6b3515 100%)',
                approved: 'linear-gradient(135deg, #4caf5015 0%, #8bc34a15 100%)',
                rejected: 'linear-gradient(135deg, #f4433615 0%, #e91e6315 100%)',
              };
              return (
                <Box 
                  key={req.id} 
                  bg="white" 
                  p={6} 
                  borderRadius="2xl" 
                  shadow="0 10px 30px rgba(0, 0, 0, 0.08)"
                  border="1px solid"
                  borderColor="gray.200"
                  data-test-id={`request-card-${req.id}`}
                  className="fade-in card-hover"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{ 
                    transform: 'translateY(-8px) scale(1.01)',
                    shadow: '0 20px 40px rgba(0, 0, 0, 0.12)'
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Status gradient accent */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="4px"
                    bg={statusGradient[req.status]}
                  />
                  <HStack justify="space-between" flexWrap="wrap" gap={3} mb={2}>
                    <VStack align="start" gap={2} flex={1}>
                      <Heading size="lg" fontWeight="800" color="gray.800">{land?.title ?? 'Land'}</Heading>
                      <HStack color="gray.500" fontSize="sm">
                        <Icon as={FiMapPin} />
                        <Text fontWeight="500">{land ? `${land.location.village}, ${land.location.district}, AP` : 'N/A'}</Text>
                      </HStack>
                    </VStack>
                    <Badge
                      colorScheme={status.color}
                      fontSize="xs"
                      px={4}
                      py={2}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.5px"
                      shadow="sm"
                    >
                      <Icon as={status.icon} />
                      {status.label}
                    </Badge>
                  </HStack>

                  <Box 
                    bg="linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)" 
                    p={4} 
                    borderRadius="xl" 
                    border="1px solid"
                    borderColor="gray.100"
                    my={2}
                  >
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                          Area
                        </Text>
                        <Text fontWeight="800" fontSize="lg" color="gray.800">{land?.area ?? 'N/A'} Acres</Text>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                          Price
                        </Text>
                        <Text fontWeight="800" fontSize="lg" color="brand.600">₹{land?.pricePerAcre.toLocaleString() ?? 'N/A'}/acre</Text>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                          Requested On
                        </Text>
                        <Text fontWeight="800" fontSize="lg" color="gray.800">
                          {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  </Box>

                  {req.message && (
                    <Box 
                      bg="blue.50" 
                      p={4} 
                      borderRadius="lg" 
                      borderLeft="4px solid"
                      borderLeftColor="blue.400"
                      mt={2}
                    >
                      <Text fontSize="xs" color="blue.600" fontWeight="700" mb={2} textTransform="uppercase" letterSpacing="0.5px">
                        Your Message
                      </Text>
                      <Text fontSize="sm" color="gray.700" fontStyle="italic">"{req.message}"</Text>
                    </Box>
                  )}

                  {req.status === 'approved' && (
                    <Box 
                      bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)" 
                      p={4} 
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="green.300"
                      mt={2}
                    >
                      <HStack gap={2} mb={2}>
                        <Text fontSize="xl">🎉</Text>
                        <Text color="green.700" fontWeight="800" fontSize="lg">Request Approved!</Text>
                      </HStack>
                      <Text color="green.600" fontSize="sm" fontWeight="600">
                        Owner contact: <Text as="span" fontWeight="800">{land?.ownerMobile ?? 'N/A'}</Text>
                      </Text>
                    </Box>
                  )}
                </Box>
              );
            })}
          </VStack>
        )}
        </VStack>
      </Container>
    </Box>
  );
};

export default MyRequests;
