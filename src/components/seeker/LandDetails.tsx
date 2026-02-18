import {
  Box, Container, Heading, Text, Button, Badge,
  VStack, HStack, Separator, TagRoot, TagLabel, Textarea,
  DialogRoot, DialogBackdrop, DialogPositioner, DialogContent, DialogHeader, DialogBody,
  DialogFooter, useDisclosure, Icon, Image, SimpleGrid, CardRoot, CardBody,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiMapPin, FiDroplet, FiSend, FiCalendar, FiDollarSign, FiNavigation } from 'react-icons/fi';
import { GiFarmer } from 'react-icons/gi';
import { useState } from 'react';
import { selectLands, selectAuth, type AppDispatch } from '../../store/store';
import { createRequestThunk } from '../../store/thunks/requestThunk';
import { toaster } from '../../utils/toast';
import MapView from '../common/MapView';

const LandDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { open, onOpen, onClose, setOpen } = useDisclosure();
  const landsState = useSelector(selectLands);
  const { user } = useSelector(selectAuth);
  const [message, setMessage] = useState('');

  const land = landsState.lands.find((l) => l.id === id);

  if (!land) {
    return (
      <Box py={8}>
        <Container maxW="container.lg">
          <CardRoot>
            <CardBody p={10} textAlign="center">
              <Text fontSize="6xl" mb={4}>🌾</Text>
              <Heading mb={4}>Land not found</Heading>
              <Text color="gray.500" mb={6}>The land you're looking for doesn't exist or has been removed.</Text>
              <Button 
                colorScheme="brand" 
                onClick={() => navigate('/seeker/browse')}
                bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                color="white"
              >
                <HStack gap={2}>
                  <FiArrowLeft />
                  <span>Back to Browse</span>
                </HStack>
              </Button>
            </CardBody>
          </CardRoot>
        </Container>
      </Box>
    );
  }

  const handleSendRequest = async () => {
    if (!user) return;
    
    const result = await dispatch(createRequestThunk({
      landId: land.id,
      seekerId: user.id,
      seekerName: user.name,
      seekerMobile: user.mobile,
      ownerId: land.ownerId,
      ownerName: land.ownerName,
      ownerMobile: land.ownerMobile,
      leasePeriod: 12,
      proposedPrice: land.pricePerMonth,
      message,
    }));

    if (createRequestThunk.fulfilled.match(result)) {
      toaster.create({
        title: 'Request sent! ✨',
        description: 'The owner will review your request.',
        type: 'success',
      });
      onClose();
      setMessage('');
    }
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10} px={{ base: 4, md: 6, lg: 8 }} data-test-id="land-details-page">
      <Container maxW="container.lg" mx="auto">
        <Box maxW="1400px" mx="auto">
        <Button 
          variant="ghost" 
          mb={6} 
          onClick={() => navigate('/seeker/browse')}
          className="fade-in"
          transition="all 0.3s"
          _hover={{ transform: 'translateX(-4px)', color: 'brand.600' }}
        >
          <HStack gap={2}>
            <FiArrowLeft />
            <span>Back to Browse</span>
          </HStack>
        </Button>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} className="fade-in">
          {/* Main Content */}
          <Box gridColumn={{ base: '1', lg: '1 / 3' }}>
            <CardRoot overflow="hidden" border="1px solid" borderColor="gray.100">
              {/* Image */}
              <Box position="relative" h="400px" bg="gradient-to-br from-green-100 to-green-200">
                <Image
                  src={land.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'}
                  alt={land.title}
                  h="100%"
                  w="100%"
                  objectFit="cover"
                />
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme={land.available ? 'green' : 'red'}
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontWeight="700"
                  shadow="lg"
                >
                  {land.available ? '✓ Available' : '✗ Not Available'}
                </Badge>
              </Box>

              <CardBody p={6}>
                <VStack align="stretch" gap={4}>
                  {/* Title & Location */}
                  <VStack align="start" gap={2}>
                    <Heading size="xl" fontWeight="800" color="gray.800">
                      {land.title}
                    </Heading>
                    <HStack color="gray.500" fontSize="md" flexWrap="wrap" gap={2}>
                      <HStack>
                        <Icon as={FiMapPin} />
                        <Text>
                          {land.location.village}, {land.location.district}, Andhra Pradesh {land.location.pincode}
                        </Text>
                      </HStack>
                      {land.latitude != null && land.longitude != null && (
                        <Button
                          size="md"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${land.latitude},${land.longitude}`,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                          data-test-id="directions-button"
                          fontWeight="700"
                          h="40px"
                          px={5}
                          borderRadius="xl"
                          bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                          color="white"
                          shadow="0 4px 12px rgba(13, 161, 13, 0.25)"
                          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                          _hover={{
                            transform: 'translateY(-2px)',
                            shadow: '0 6px 20px rgba(13, 161, 13, 0.35)',
                            bg: 'linear-gradient(135deg, #0ea10e 0%, #2dd467 100%)',
                          }}
                          _active={{ transform: 'translateY(0)' }}
                        >
                          <HStack gap={2}>
                            <FiNavigation size={18} />
                            <span>Get Directions</span>
                          </HStack>
                        </Button>
                      )}
                    </HStack>
                  </VStack>

                  {land.latitude != null && land.longitude != null && (
                    <Box borderRadius="xl" overflow="hidden" border="1px solid" borderColor="gray.200" shadow="sm">
                      <HStack justify="space-between" align="center" mb={2} px={4} pt={4}>
                        <Heading size="sm" color="gray.700">Location</Heading>
                        <Button
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${land.latitude},${land.longitude}`,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                          fontWeight="700"
                          h="36px"
                          px={4}
                          borderRadius="lg"
                          bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                          color="white"
                          shadow="0 2px 8px rgba(13, 161, 13, 0.25)"
                          transition="all 0.3s"
                          _hover={{
                            transform: 'translateY(-1px)',
                            shadow: '0 4px 12px rgba(13, 161, 13, 0.35)',
                            bg: 'linear-gradient(135deg, #0ea10e 0%, #2dd467 100%)',
                          }}
                        >
                          <HStack gap={2}>
                            <FiNavigation size={14} />
                            <span>Directions</span>
                          </HStack>
                        </Button>
                      </HStack>
                      <MapView
                        latitude={land.latitude}
                        longitude={land.longitude}
                        title={land.title}
                        height="280px"
                        zoom={13}
                      />
                    </Box>
                  )}

                  <Separator />

                  {/* Description */}
                  <Box>
                    <Heading size="sm" mb={2} color="gray.700">Description</Heading>
                    <Text color="gray.600" lineHeight="1.8">
                      {land.description || 'No description provided.'}
                    </Text>
                  </Box>

                  <Separator />

                  {/* Suitable Crops */}
                  <Box>
                    <Heading size="sm" mb={3} color="gray.700">Suitable Crops</Heading>
                    <HStack flexWrap="wrap" gap={2}>
                      {land.crops.length > 0 ? (
                        land.crops.map((crop: string) => (
                          <TagRoot 
                            key={crop} 
                            colorScheme="green" 
                            borderRadius="full"
                            px={4}
                            py={2}
                            fontSize="sm"
                            fontWeight="600"
                          >
                            <TagLabel>{crop}</TagLabel>
                          </TagRoot>
                        ))
                      ) : (
                        <Text color="gray.400" fontSize="sm">No crops specified</Text>
                      )}
                    </HStack>
                  </Box>

                  <Separator />

                  {/* Water Sources */}
                  <Box>
                    <Heading size="sm" mb={3} color="gray.700">Water Source</Heading>
                    <TagRoot colorScheme="blue" borderRadius="full" px={4} py={2} fontSize="sm" fontWeight="600">
                      <HStack gap={2}>
                        <Icon as={FiDroplet} />
                        <TagLabel textTransform="capitalize">{land.waterSource}</TagLabel>
                      </HStack>
                    </TagRoot>
                  </Box>
                </VStack>
              </CardBody>
            </CardRoot>
          </Box>

          {/* Sidebar */}
          <Box>
            <VStack gap={4} position="sticky" top={20}>
              {/* Land Details Card */}
              <CardRoot w="100%" border="1px solid" borderColor="gray.100">
                <CardBody p={6}>
                  <Heading size="md" mb={4} fontWeight="700">Land Details</Heading>
                  <VStack align="stretch" gap={4}>
                    <HStack justify="space-between">
                      <HStack color="gray.600">
                        <Icon as={GiFarmer} />
                        <Text>Area</Text>
                      </HStack>
                      <Text fontWeight="700" fontSize="lg">{land.area} Acres</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack color="gray.600">
                        <Icon as={FiDollarSign} />
                        <Text>Price/Acre</Text>
                      </HStack>
                      <Text fontWeight="700" color="brand.600" fontSize="lg">
                        ₹{land.pricePerAcre.toLocaleString()}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack color="gray.600">
                        <Icon as={FiDollarSign} />
                        <Text>Monthly</Text>
                      </HStack>
                      <Text fontWeight="700" color="brand.600" fontSize="lg">
                        ₹{land.pricePerMonth.toLocaleString()}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text color="gray.600">Soil Type</Text>
                      <Text fontWeight="600" textTransform="capitalize">{land.soilType}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack color="gray.600">
                        <Icon as={FiCalendar} />
                        <Text>Lease Period</Text>
                      </HStack>
                      <Text fontWeight="600">
                        {land.minLeasePeriod}-{land.maxLeasePeriod} months
                      </Text>
                    </HStack>

                    <Separator />

                    <Box bg="brand.50" p={4} borderRadius="lg" border="1px solid" borderColor="brand.100">
                      <Text fontSize="xs" color="gray.600" mb={1} fontWeight="600" textTransform="uppercase">
                        Total Annual Cost
                      </Text>
                      <Text fontSize="2xl" fontWeight="800" color="brand.600">
                        ₹{(land.pricePerMonth * 12).toLocaleString()}
                      </Text>
                      <Text fontSize="xs" color="gray.500">per year</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </CardRoot>

              {/* Owner & Action Card */}
              <CardRoot w="100%" border="1px solid" borderColor="gray.100">
                <CardBody p={6}>
                  <VStack align="stretch" gap={4}>
                    <Box>
                      <Heading size="md" mb={2} fontWeight="700">Owner</Heading>
                      <Text color="gray.500" fontSize="sm" mb={4}>
                        Contact details shared after approval
                      </Text>
                    </Box>
                    <Button
                      w="100%"
                      colorScheme="brand"
                      size="lg"
                      disabled={!land.available}
                      onClick={onOpen}
                      fontWeight="600"
                      transition="all 0.3s"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                      bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                      color="white"
                    >
                      <HStack gap={2}>
                        <FiSend />
                        <span>Send Lease Request</span>
                      </HStack>
                    </Button>
                  </VStack>
                </CardBody>
              </CardRoot>
            </VStack>
          </Box>
        </SimpleGrid>
        </Box>
      </Container>

      {/* Request Dialog */}
      <DialogRoot open={open} onOpenChange={({ open: next }) => setOpen(next)}>
        <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DialogPositioner>
          <DialogContent 
            maxW={{ base: "95vw", sm: "520px" }}
            bg="white"
            borderRadius="2xl"
            shadow="2xl"
            border="none"
            p={0}
            overflow="hidden"
            mx={4}
          >
            <DialogHeader 
              fontWeight="800" 
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.800"
              px={{ base: 4, md: 6 }}
              pt={{ base: 5, md: 6 }}
              pb={{ base: 3, md: 4 }}
              borderBottom="1px solid"
              borderColor="gray.100"
            >
              Send Lease Request
            </DialogHeader>
            <DialogBody px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
              <VStack align="stretch" gap={5}>
                <Box>
                  <Text 
                    color="gray.700" 
                    fontSize="sm" 
                    fontWeight="600"
                    mb={3}
                  >
                    Add a message to the owner (optional):
                  </Text>
                  <Textarea
                    placeholder="Hi, I'm interested in leasing your land for rice cultivation. I have 5 years of farming experience..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    fontSize="md"
                    bg="white"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="#E0E0E0"
                    px={4}
                    py={3}
                    _focus={{ 
                      borderColor: '#81c784',
                      boxShadow: '0 0 0 3px rgba(129, 199, 132, 0.1)',
                      outline: 'none',
                    }}
                    _focusVisible={{
                      boxShadow: '0 0 0 3px rgba(129, 199, 132, 0.1)',
                      outline: 'none',
                    }}
                    _hover={{ borderColor: '#BDBDBD' }}
                    transition="all 0.2s"
                  />
                </Box>
                <Box 
                  bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
                  p={4} 
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="brand.100"
                >
                  <HStack justify="space-between" align="center">
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.600" fontWeight="600" mb={1}>
                        Proposed Lease Period
                      </Text>
                      <Text fontWeight="700" fontSize="lg" color="gray.800">
                        12 months
                      </Text>
                    </VStack>
                    <Icon as={FiCalendar} boxSize={6} color="brand.600" />
                  </HStack>
                </Box>
              </VStack>
            </DialogBody>
            <DialogFooter 
              gap={{ base: 2, md: 3 }} 
              px={{ base: 4, md: 6 }} 
              py={{ base: 4, md: 5 }}
              borderTop="1px solid"
              borderColor="gray.100"
              bg="gray.50"
              flexDirection={{ base: "column", sm: "row" }}
            >
              <Button 
                variant="outline" 
                onClick={onClose}
                fontWeight="600"
                px={{ base: 4, md: 6 }}
                h={{ base: "44px", md: "40px" }}
                borderRadius="lg"
                borderColor="#E0E0E0"
                w={{ base: "100%", sm: "auto" }}
                _hover={{ bg: 'white', borderColor: '#BDBDBD' }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="brand" 
                onClick={handleSendRequest} 
                fontWeight="700"
                fontSize={{ base: "sm", md: "md" }}
                bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                color="white"
                px={{ base: 6, md: 8 }}
                h={{ base: "44px", md: "40px" }}
                borderRadius="lg"
                shadow="md"
                transition="all 0.3s"
                w={{ base: "100%", sm: "auto" }}
                _hover={{ 
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                  bg: 'linear-gradient(135deg, #0ea80e 0%, #2ddc6d 100%)',
                }}
                _active={{ transform: 'translateY(0px)' }}
              >
                <HStack gap={2}>
                  <FiSend size={18} />
                  <span>Send Request</span>
                </HStack>
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
};

export default LandDetails;
