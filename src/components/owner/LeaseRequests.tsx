import {
  Box, Container, Heading, VStack, HStack, Text,
  Badge, Button, SimpleGrid,
  Spinner, Center,
  MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem,
  CardRoot, CardBody,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheck, FiX, FiChevronDown } from 'react-icons/fi';
import { selectAuth, selectReceivedRequests, type AppDispatch, type RootState } from '../../store/store';
import { fetchReceivedRequestsThunk } from '../../store/thunks/requestThunk';
import { updateRequestStatusThunk } from '../../store/thunks/requestThunk';

const statusColor = { pending: 'yellow', approved: 'green', rejected: 'red' };

const LeaseRequests = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const requests = useSelector((state: RootState) => selectReceivedRequests(user!.id)(state));
  const loading = useSelector((state: RootState) => state.requests.loading);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchReceivedRequestsThunk(user!.id));
  }, [dispatch, user]);

  const filtered = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter);

  const handleStatus = (id: string, status: 'approved' | 'rejected') => {
    dispatch(updateRequestStatusThunk({ requestId: id, status }));
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10} px={{ base: 4, md: 6, lg: 8 }} data-test-id="lease-requests-page">
      <Container maxW="container.xl" mx="auto">
        <VStack gap={6} align="stretch" maxW="1400px" mx="auto">

          {/* Header */}
          <HStack justify="space-between" data-test-id="requests-header">
            <Box>
              <Heading 
                size="xl" 
                fontWeight="900" 
                color="gray.800"
                mb={1}
                textShadow="0 2px 4px rgba(0,0,0,0.05)"
              >
                Lease Requests
              </Heading>
              <Text color="gray.600" fontSize="md" fontWeight="500">
                {requests.length} total requests
              </Text>
            </Box>
            <MenuRoot>
              <MenuTrigger
                asChild
                data-test-id="status-filter"
              >
                <Button
                  variant="outline"
                  bg="white"
                  h="40px"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="#E0E0E0"
                  px={4}
                  fontWeight="600"
                  fontSize="md"
                  color="gray.700"
                  minW="180px"
                  justifyContent="space-between"
                  _hover={{ 
                    borderColor: '#BDBDBD',
                    bg: 'gray.50',
                  }}
                  _focus={{ 
                    borderColor: '#81c784',
                    boxShadow: 'none',
                    outline: 'none',
                  }}
                >
                  <HStack gap={2} flex={1} justify="space-between">
                    <Text>
                      {filter === 'all' ? 'All Requests' :
                       filter === 'pending' ? 'Pending' :
                       filter === 'approved' ? 'Approved' : 'Rejected'}
                    </Text>
                    <FiChevronDown size={18} />
                  </HStack>
                </Button>
              </MenuTrigger>
              <MenuPositioner>
                <MenuContent 
                  minW="180px"
                  bg="white"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="#E0E0E0"
                  shadow="xl"
                  py={1}
                  data-test-id="status-filter-menu"
                >
                  <MenuItem
                    value="all"
                    onClick={() => setFilter('all')}
                    bg={filter === 'all' ? 'brand.50' : 'transparent'}
                    color={filter === 'all' ? 'brand.600' : 'gray.700'}
                    fontWeight={filter === 'all' ? '700' : '500'}
                    _hover={{ bg: 'gray.50' }}
                    px={4}
                    py={2}
                  >
                    <HStack gap={2} w="100%">
                      {filter === 'all' && <FiCheck size={16} />}
                      <Text flex={1}>All Requests</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    value="pending"
                    onClick={() => setFilter('pending')}
                    bg={filter === 'pending' ? 'brand.50' : 'transparent'}
                    color={filter === 'pending' ? 'brand.600' : 'gray.700'}
                    fontWeight={filter === 'pending' ? '700' : '500'}
                    _hover={{ bg: 'gray.50' }}
                    px={4}
                    py={2}
                  >
                    <HStack gap={2} w="100%">
                      {filter === 'pending' && <FiCheck size={16} />}
                      <Text flex={1}>Pending</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    value="approved"
                    onClick={() => setFilter('approved')}
                    bg={filter === 'approved' ? 'brand.50' : 'transparent'}
                    color={filter === 'approved' ? 'brand.600' : 'gray.700'}
                    fontWeight={filter === 'approved' ? '700' : '500'}
                    _hover={{ bg: 'gray.50' }}
                    px={4}
                    py={2}
                  >
                    <HStack gap={2} w="100%">
                      {filter === 'approved' && <FiCheck size={16} />}
                      <Text flex={1}>Approved</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    value="rejected"
                    onClick={() => setFilter('rejected')}
                    bg={filter === 'rejected' ? 'brand.50' : 'transparent'}
                    color={filter === 'rejected' ? 'brand.600' : 'gray.700'}
                    fontWeight={filter === 'rejected' ? '700' : '500'}
                    _hover={{ bg: 'gray.50' }}
                    px={4}
                    py={2}
                  >
                    <HStack gap={2} w="100%">
                      {filter === 'rejected' && <FiCheck size={16} />}
                      <Text flex={1}>Rejected</Text>
                    </HStack>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </HStack>

          {/* Loading */}
          {loading && (
            <Center py={12} data-test-id="loading-spinner">
              <Spinner size="xl" color="brand.500" />
            </Center>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <Center py={16} bg="white" borderRadius="lg" shadow="sm" data-test-id="empty-state">
              <VStack>
                <Text fontSize="4xl">📭</Text>
                <Text color="gray.500">No requests found</Text>
              </VStack>
            </Center>
          )}

          {/* Requests */}
          {!loading && filtered.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} data-test-id="requests-grid">
              {filtered.map((req, i) => (
                <CardRoot key={req.id} data-test-id={`request-card-${i}`}>
                  <CardBody>
                    <VStack align="stretch" gap={3}>

                      {/* Status & Date */}
                      <HStack justify="space-between">
                        <Badge
                          colorScheme={statusColor[req.status]}
                          px={3} py={1} borderRadius="full"
                          data-test-id={`request-status-${i}`}
                        >
                          {req.status.toUpperCase()}
                        </Badge>
                        <Text fontSize="xs" color="gray.400" data-test-id={`request-date-${i}`}>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>

                      {/* Seeker Info */}
                      <Box data-test-id={`seeker-info-${i}`}>
                        <Text fontWeight="700" fontSize="lg">{req.seekerName}</Text>
                        <Text color="gray.500" fontSize="sm">{req.seekerMobile}</Text>
                      </Box>

                      {/* Lease Details */}
                      <Box bg="gray.50" p={3} borderRadius="md" data-test-id={`lease-details-${i}`}>
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="sm" color="gray.500">Proposed Price</Text>
                          <Text fontWeight="700" color="brand.600">
                            ₹{req.proposedPrice.toLocaleString()}/month
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">Lease Period</Text>
                          <Text fontWeight="600">{req.leasePeriod} months</Text>
                        </HStack>
                      </Box>

                      {/* Message */}
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        css={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        data-test-id={`request-message-${i}`}
                      >
                        "{req.message}"
                      </Text>

                      {/* Actions - only for pending */}
                      {req.status === 'pending' && (
                        <HStack gap={3} data-test-id={`request-actions-${i}`}>
                          <Button
                            colorScheme="brand"
                            flex={1}
                            onClick={() => handleStatus(req.id, 'approved')}
                            loading={loading}
                            data-test-id={`approve-button-${i}`}
                            bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                            color="white"
                          >
                            <HStack gap={2}>
                              <FiCheck />
                              <span>Approve</span>
                            </HStack>
                          </Button>
                          <Button
                            colorScheme="red"
                            variant="outline"
                            flex={1}
                            onClick={() => handleStatus(req.id, 'rejected')}
                            loading={loading}
                            data-test-id={`reject-button-${i}`}
                          >
                            <HStack gap={2}>
                              <FiX />
                              <span>Reject</span>
                            </HStack>
                          </Button>
                        </HStack>
                      )}

                    </VStack>
                  </CardBody>
                </CardRoot>
              ))}
            </SimpleGrid>
          )}

        </VStack>
      </Container>
    </Box>
  );
};

export default LeaseRequests;
