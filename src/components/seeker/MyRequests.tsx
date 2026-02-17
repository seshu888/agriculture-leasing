import {
  Box, Container, Heading, Text, VStack, HStack,
  Badge, Icon, SimpleGrid, Separator,
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
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10} px={{ base: 4, md: 6, lg: 8 }} data-test-id="my-requests-page">
      <Container maxW="container.xl" mx="auto">
        <VStack gap={6} align="stretch" maxW="1400px" mx="auto">
          <Heading color="green.700" mb={2} fontWeight="900" textShadow="0 2px 4px rgba(0,0,0,0.05)">
            My Lease Requests 📋
          </Heading>

        {myRequests.length === 0 ? (
          <Box bg="white" p={10} borderRadius="xl" shadow="sm" textAlign="center">
            <Text fontSize="xl" mb={2}>No requests yet</Text>
            <Text color="gray.400" mb={4}>Browse available lands and send your first lease request!</Text>
          </Box>
        ) : (
          <VStack gap={4} align="stretch">
            {myRequests.map((req) => {
              const land = landsState.lands.find((l) => l.id === req.landId);
              const status = statusConfig[req.status];
              return (
                <Box key={req.id} bg="white" p={6} borderRadius="xl" shadow="sm" data-test-id={`request-card-${req.id}`}>
                  <HStack justify="space-between" flexWrap="wrap" gap={2}>
                    <VStack align="start" gap={1}>
                      <Heading size="md">{land?.title ?? 'Land'}</Heading>
                      <HStack color="gray.500">
                        <Icon as={FiMapPin} />
                        <Text fontSize="sm">{land ? `${land.location.village}, ${land.location.district}, ${land.location.state}` : 'N/A'}</Text>
                      </HStack>
                    </VStack>
                    <Badge
                      colorScheme={status.color}
                      fontSize="sm"
                      px={3} py={1}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={status.icon} mr={1} />
                      {status.label}
                    </Badge>
                  </HStack>

                  <Separator my={3} />

                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <Box>
                      <Text fontSize="xs" color="gray.400">Area</Text>
                      <Text fontWeight="bold">{land?.area ?? 'N/A'} Acres</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.400">Price</Text>
                      <Text fontWeight="bold" color="green.600">₹{land?.pricePerAcre.toLocaleString() ?? 'N/A'}/acre</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.400">Requested On</Text>
                      <Text fontWeight="bold">{new Date(req.createdAt).toLocaleDateString()}</Text>
                    </Box>
                  </SimpleGrid>

                  {req.message && (
                    <>
                      <Separator my={3} />
                      <Box>
                        <Text fontSize="xs" color="gray.400" mb={1}>Your Message</Text>
                        <Text fontSize="sm" color="gray.600" fontStyle="italic">"{req.message}"</Text>
                      </Box>
                    </>
                  )}

                  {req.status === 'approved' && (
                    <>
                      <Separator my={3} />
                      <Box bg="green.50" p={3} borderRadius="md">
                        <Text color="green.700" fontWeight="bold">🎉 Request Approved!</Text>
                        <Text color="green.600" fontSize="sm">Owner contact: {land?.ownerMobile ?? 'N/A'}</Text>
                      </Box>
                    </>
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
