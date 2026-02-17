import { useState } from 'react';
import {
  Box, Image, Text, Badge, HStack,
  VStack, Button, Icon,
} from '@chakra-ui/react';
import { FiMapPin, FiDroplet, FiTrendingUp, FiEye } from 'react-icons/fi';
import { GiFarmer } from 'react-icons/gi';
import type { Land } from '../../store/types';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop';

interface LandCardProps {
  land: Land;
  onView: (id: string) => void;
  showOwner?: boolean;
}

const LandCard = ({ land, onView, showOwner = true }: LandCardProps) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError || !land.images?.[0] ? PLACEHOLDER_IMAGE : land.images[0];

  return (
    <Box
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{ 
        shadow: 'xl', 
        transform: 'translateY(-8px)',
      }}
      cursor="pointer"
      onClick={() => onView(land.id)}
      data-test-id="land-card"
      position="relative"
      border="1px solid"
      borderColor="gray.100"
      className="fade-in"
    >
      {/* Image Container */}
      <Box position="relative" h="200px" overflow="hidden">
        <Image
          src={imgSrc}
          alt={land.title}
          h="100%"
          w="100%"
          objectFit="cover"
          data-test-id="land-image"
          onError={() => setImgError(true)}
          transition="transform 0.5s ease"
          _groupHover={{ transform: 'scale(1.1)' }}
        />
        {/* Overlay gradient */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="60px"
          bg="linear-gradient(to top, rgba(0,0,0,0.3), transparent)"
        />
        {/* Availability Badge */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={land.available ? 'green' : 'red'}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="700"
          textTransform="uppercase"
          data-test-id="availability-badge"
          shadow="md"
        >
          {land.available ? '✓ Available' : '✗ Leased'}
        </Badge>
      </Box>

      <Box p={5}>
        {/* Title & Location */}
        <VStack align="stretch" gap={2} mb={3}>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color="gray.800"
            data-test-id="land-title"
            css={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              lineHeight: '1.4',
            }}
          >
            {land.title}
          </Text>
          <HStack color="gray.500" fontSize="sm" data-test-id="land-location">
            <Icon as={FiMapPin} />
            <Text css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {land.location.village}, {land.location.district}
            </Text>
          </HStack>
        </VStack>

        {/* Details Grid */}
        <HStack justify="space-between" mb={3} flexWrap="wrap" gap={2}>
          <HStack color="gray.600" fontSize="sm" bg="gray.50" px={2} py={1} borderRadius="md">
            <Icon as={GiFarmer} />
            <Text fontWeight="600">{land.area} acres</Text>
          </HStack>
          <HStack color="gray.600" fontSize="sm" bg="gray.50" px={2} py={1} borderRadius="md">
            <Icon as={FiTrendingUp} />
            <Text fontWeight="600" textTransform="capitalize">{land.soilType}</Text>
          </HStack>
          <HStack color="gray.600" fontSize="sm" bg="gray.50" px={2} py={1} borderRadius="md">
            <Icon as={FiDroplet} />
            <Text fontWeight="600" textTransform="capitalize">{land.waterSource}</Text>
          </HStack>
        </HStack>

        {/* Price Section */}
        <Box 
          bg="linear-gradient(135deg, #81c78415 0%, #a5d6a715 100%)" 
          p={4} 
          borderRadius="lg" 
          mb={3} 
          data-test-id="land-price-section"
          border="1px solid"
          borderColor="brand.100"
        >
          <Text color="gray.600" fontSize="xs" mb={1} fontWeight="600" textTransform="uppercase">
            Lease Price
          </Text>
          <HStack justify="space-between" align="baseline">
            <Text fontSize="2xl" fontWeight="bold" color="brand.600" data-test-id="land-price">
              ₹{land.pricePerMonth.toLocaleString()}
            </Text>
            <Text fontSize="sm" color="gray.500" fontWeight="500">
              /month
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={1}>
            ₹{land.pricePerAcre.toLocaleString()}/acre
          </Text>
        </Box>

        {/* Owner */}
        {showOwner && (
          <Text fontSize="sm" color="gray.500" mb={3} data-test-id="land-owner">
            Owner: <Text as="span" fontWeight="600">{land.ownerName}</Text>
          </Text>
        )}

        {/* Button */}
        <Button
          colorScheme="brand"
          w="100%"
          size="md"
          onClick={(e) => { e.stopPropagation(); onView(land.id); }}
          data-test-id="view-details-button"
          fontWeight="600"
          transition="all 0.3s"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
          bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
          color="white"
        >
          <HStack gap={2}>
            <FiEye />
            <span>View Details</span>
          </HStack>
        </Button>
      </Box>
    </Box>
  );
};

export default LandCard;
