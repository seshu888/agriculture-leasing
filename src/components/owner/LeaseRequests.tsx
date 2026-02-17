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
    <Box 
      bg="linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%)" 
      minH="calc(100vh - 64px)" 
      py={10} 
      px={{ base: 4, md: 6, lg: 8 }} 
      data-test-id="lease-requests-page"
    >
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
            <Center py={16} bg="white" borderRadius="2xl" shadow="0 8px 25px rgba(0, 0, 0, 0.08)" data-test-id="empty-state" className="fade-in">
              <VStack gap={3}>
                <Text fontSize="5xl">📭</Text>
                <Text color="gray.600" fontSize="lg" fontWeight="600">No requests found</Text>
                <Text color="gray.400" fontSize="sm">Requests will appear here when seekers apply</Text>
              </VStack>
            </Center>
          )}

          {/* Requests */}
          {!loading && filtered.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} data-test-id="requests-grid">
              {filtered.map((req, i) => {
                const statusGradient = {
                  pending: 'linear-gradient(135deg, #ff980015 0%, #ff6b3515 100%)',
                  approved: 'linear-gradient(135deg, #4caf5015 0%, #8bc34a15 100%)',
                  rejected: 'linear-gradient(135deg, #f4433615 0%, #e91e6315 100%)',
                };
                return (
                <CardRoot 
                  key={req.id} 
                  data-test-id={`request-card-${i}`}
                  className="fade-in card-hover"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{ 
                    transform: 'translateY(-8px) scale(1.02)',
                    shadow: '0 20px 40px rgba(0, 0, 0, 0.12)'
                  }}
                  border="1px solid"
                  borderColor="gray.200"
                  shadow="0 10px 30px rgba(0, 0, 0, 0.08)"
                  bg="white"
                  borderRadius="2xl"
                  overflow="hidden"
                  position="relative"
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
                  <CardBody p={6}>
                    <VStack align="stretch" gap={4}>

                      {/* Status & Date */}
                      <HStack justify="space-between" align="center">
                        <Badge
                          colorScheme={statusColor[req.status]}
                          px={4} 
                          py={1.5} 
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="700"
                          textTransform="uppercase"
                          letterSpacing="0.5px"
                          shadow="sm"
                          data-test-id={`request-status-${i}`}
                        >
                          {req.status}
                        </Badge>
                        <Text fontSize="xs" color="gray.500" fontWeight="600" data-test-id={`request-date-${i}`}>
                          {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </HStack>

                      {/* Seeker Info */}
                      <Box 
                        data-test-id={`seeker-info-${i}`}
                        pb={3}
                        borderBottom="1px solid"
                        borderColor="gray.100"
                      >
                        <HStack gap={3} align="center">
                          <Box
                            w={10}
                            h={10}
                            borderRadius="full"
                            bg="linear-gradient(135deg, #81c784 0%, #66bb6a 100%)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="white"
                            fontWeight="800"
                            fontSize="lg"
                            shadow="md"
                          >
                            {req.seekerName.charAt(0).toUpperCase()}
                          </Box>
                          <VStack align="start" gap={0} flex={1}>
                            <Text fontWeight="800" fontSize="lg" color="gray.800">{req.seekerName}</Text>
                            <Text color="gray.500" fontSize="sm" fontWeight="500">{req.seekerMobile}</Text>
                          </VStack>
                        </HStack>
                      </Box>

                      {/* Lease Details */}
                      <Box 
                        bg="linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)" 
                        p={4} 
                        borderRadius="xl" 
                        border="1px solid"
                        borderColor="gray.100"
                        data-test-id={`lease-details-${i}`}
                      >
                        <SimpleGrid columns={2} gap={4}>
                          <VStack align="start" gap={1}>
                            <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                              Proposed Price
                            </Text>
                            <Text fontWeight="800" fontSize="lg" color="brand.600">
                              ₹{req.proposedPrice.toLocaleString()}
                            </Text>
                            <Text fontSize="xs" color="gray.400">per month</Text>
                          </VStack>
                          <VStack align="start" gap={1}>
                            <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                              Lease Period
                            </Text>
                            <Text fontWeight="800" fontSize="lg" color="gray.800">
                              {req.leasePeriod}
                            </Text>
                            <Text fontSize="xs" color="gray.400">months</Text>
                          </VStack>
                        </SimpleGrid>
                      </Box>

                      {/* Message */}
                      {req.message && (
                        <Box 
                          bg="blue.50" 
                          p={4} 
                          borderRadius="lg" 
                          borderLeft="4px solid"
                          borderLeftColor="blue.400"
                          data-test-id={`request-message-${i}`}
                        >
                          <Text fontSize="xs" color="blue.600" fontWeight="700" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                            Message
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.700"
                            fontStyle="italic"
                            css={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            "{req.message}"
                          </Text>
                        </Box>
                      )}

                      {/* Actions - only for pending */}
                      {req.status === 'pending' && (
                        <HStack gap={3} data-test-id={`request-actions-${i}`} pt={2}>
                          <Button
                            colorScheme="brand"
                            flex={1}
                            onClick={() => handleStatus(req.id, 'approved')}
                            loading={loading}
                            data-test-id={`approve-button-${i}`}
                            bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                            color="white"
                            fontWeight="700"
                            fontSize="md"
                            h="44px"
                            borderRadius="xl"
                            shadow="0 4px 15px rgba(13, 161, 13, 0.2)"
                            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                            _hover={{ 
                              transform: 'translateY(-2px) scale(1.02)',
                              shadow: '0 8px 25px rgba(13, 161, 13, 0.3)'
                            }}
                            _active={{ transform: 'translateY(0px) scale(0.98)' }}
                            className="btn-glow"
                          >
                            <HStack gap={2}>
                              <FiCheck size={18} />
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
                            fontWeight="700"
                            fontSize="md"
                            h="44px"
                            borderRadius="xl"
                            borderWidth="2px"
                            borderColor="red.300"
                            color="red.600"
                            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                            _hover={{ 
                              bg: 'red.50',
                              borderColor: 'red.400',
                              transform: 'translateY(-2px) scale(1.02)',
                              shadow: '0 4px 15px rgba(244, 67, 54, 0.2)'
                            }}
                            _active={{ transform: 'translateY(0px) scale(0.98)' }}
                          >
                            <HStack gap={2}>
                              <FiX size={18} />
                              <span>Reject</span>
                            </HStack>
                          </Button>
                        </HStack>
                      )}

                    </VStack>
                  </CardBody>
                </CardRoot>
                );
              })}
            </SimpleGrid>
          )}

        </VStack>
      </Container>
    </Box>
  );
};

export default LeaseRequests;
