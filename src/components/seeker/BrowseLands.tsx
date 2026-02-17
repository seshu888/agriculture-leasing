import {
  Box, Container, Heading, SimpleGrid, Input,
  HStack, VStack, Text, Button, InputGroup,
  Icon, Spinner, Center, Badge,
  MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem,
  CardRoot, CardBody,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiX, FiChevronDown, FiCheck } from 'react-icons/fi';
import { selectLands, type AppDispatch } from '../../store/store';
import { fetchLandsThunk } from '../../store/thunks/landsThunk';
import LandCard from '../common/LandCard';
import type { Land } from '../../store/types';

const BrowseLands = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const landsState = useSelector(selectLands);
  const lands = landsState.lands;
  const loading = landsState.loading;

  useEffect(() => {
    dispatch(fetchLandsThunk());
  }, [dispatch]);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const filteredLands = lands.filter((land: Land) => {
    const matchesSearch =
      land.title.toLowerCase().includes(search.toLowerCase()) ||
      `${land.location.village}, ${land.location.district}, ${land.location.state}`.toLowerCase().includes(search.toLowerCase());
    const matchesCrop = cropFilter ? land.crops.includes(cropFilter) : true;
    const matchesPrice = priceFilter
      ? priceFilter === 'low' ? land.pricePerAcre < 5000
      : priceFilter === 'mid' ? land.pricePerAcre >= 5000 && land.pricePerAcre < 15000
      : land.pricePerAcre >= 15000
      : true;
    return matchesSearch && matchesCrop && matchesPrice && land.available;
  });

  const hasActiveFilters = search || cropFilter || priceFilter;

  const clearFilters = () => {
    setSearch('');
    setCropFilter('');
    setPriceFilter('');
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10} px={{ base: 4, md: 6, lg: 8 }} data-test-id="browse-lands-page">
      <Container maxW="container.xl" mx="auto">
        <VStack align="start" gap={6} maxW="1400px" mx="auto">
          {/* Header */}
          <Box className="fade-in" w="100%">
            <Heading 
              color="green.700" 
              fontWeight="800" 
              mb={2} 
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              Browse Available Lands 🌿
            </Heading>
            <Text color="gray.500" fontSize={{ base: "md", md: "lg" }}>
              Discover the perfect agricultural land for your needs
            </Text>
          </Box>

          {/* Search and Filters */}
          <CardRoot w="100%" className="fade-in" border="1px solid" borderColor="gray.100">
            <CardBody p={{ base: 4, md: 6 }}>
              <VStack gap={{ base: 3, md: 4 }} align="stretch">
                {/* Search Bar */}
                <InputGroup maxW="100%">
                  <InputGroup startElement={
                    <Box pl={{ base: 3, md: 4 }} display="flex" alignItems="center" h={{ base: "44px", md: "48px" }}>
                      <Icon as={FiSearch} color="gray.500" boxSize={{ base: 4, md: 5 }} />
                    </Box>
                  }>
                    <Input
                      placeholder="Search by title or location..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      fontSize={{ base: "sm", md: "md" }}
                      bg="white"
                      h={{ base: "44px", md: "48px" }}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor="#E0E0E0"
                      pl={{ base: 10, md: 12 }}
                      pr={{ base: 3, md: 4 }}
                      _focus={{ 
                        borderColor: '#81c784',
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      _focusVisible={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      _hover={{ borderColor: '#BDBDBD' }}
                    />
                  </InputGroup>
                </InputGroup>

                {/* Filters */}
                <HStack gap={{ base: 2, md: 4 }} flexWrap="wrap">
                  <MenuRoot>
                    <MenuTrigger
                      asChild
                    >
                      <Button
                        variant="outline"
                        bg="white"
                        h={{ base: "44px", md: "40px" }}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="#E0E0E0"
                        px={{ base: 3, md: 4 }}
                        fontWeight="600"
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.700"
                        flex={{ base: '1 1 100%', md: '0 0 200px' }}
                        justifyContent="space-between"
                        minW={{ base: "100%", md: "auto" }}
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
                            {cropFilter === '' ? 'Filter by crop' :
                             cropFilter === 'Rice' ? 'Rice' :
                             cropFilter === 'Wheat' ? 'Wheat' :
                             cropFilter === 'Sugarcane' ? 'Sugarcane' :
                             cropFilter === 'Cotton' ? 'Cotton' : 'Vegetables'}
                          </Text>
                          <FiChevronDown size={18} />
                        </HStack>
                      </Button>
                    </MenuTrigger>
                    <MenuPositioner>
                      <MenuContent 
                        minW="200px"
                        bg="white"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="#E0E0E0"
                        shadow="xl"
                        py={1}
                      >
                        <MenuItem
                          value=""
                          onClick={() => setCropFilter('')}
                          bg={cropFilter === '' ? 'brand.50' : 'transparent'}
                          color={cropFilter === '' ? 'brand.600' : 'gray.700'}
                          fontWeight={cropFilter === '' ? '700' : '500'}
                          _hover={{ bg: 'gray.50' }}
                          px={4}
                          py={2}
                        >
                          <HStack gap={2} w="100%">
                            {cropFilter === '' && <FiCheck size={16} />}
                            <Text flex={1}>All Crops</Text>
                          </HStack>
                        </MenuItem>
                        {['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Vegetables'].map((crop) => (
                          <MenuItem
                            key={crop}
                            value={crop}
                            onClick={() => setCropFilter(crop)}
                            bg={cropFilter === crop ? 'brand.50' : 'transparent'}
                            color={cropFilter === crop ? 'brand.600' : 'gray.700'}
                            fontWeight={cropFilter === crop ? '700' : '500'}
                            _hover={{ bg: 'gray.50' }}
                            px={4}
                            py={2}
                          >
                            <HStack gap={2} w="100%">
                              {cropFilter === crop && <FiCheck size={16} />}
                              <Text flex={1}>{crop}</Text>
                            </HStack>
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRoot>

                  <MenuRoot>
                    <MenuTrigger
                      asChild
                    >
                      <Button
                        variant="outline"
                        bg="white"
                        h={{ base: "44px", md: "40px" }}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="#E0E0E0"
                        px={{ base: 3, md: 4 }}
                        fontWeight="600"
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.700"
                        flex={{ base: '1 1 100%', md: '0 0 200px' }}
                        justifyContent="space-between"
                        minW={{ base: "100%", md: "auto" }}
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
                            {priceFilter === '' ? 'Filter by price' :
                             priceFilter === 'low' ? 'Below ₹5,000/acre' :
                             priceFilter === 'mid' ? '₹5,000 - ₹15,000/acre' : 'Above ₹15,000/acre'}
                          </Text>
                          <FiChevronDown size={18} />
                        </HStack>
                      </Button>
                    </MenuTrigger>
                    <MenuPositioner>
                      <MenuContent 
                        minW="200px"
                        bg="white"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="#E0E0E0"
                        shadow="xl"
                        py={1}
                      >
                        <MenuItem
                          value=""
                          onClick={() => setPriceFilter('')}
                          bg={priceFilter === '' ? 'brand.50' : 'transparent'}
                          color={priceFilter === '' ? 'brand.600' : 'gray.700'}
                          fontWeight={priceFilter === '' ? '700' : '500'}
                          _hover={{ bg: 'gray.50' }}
                          px={4}
                          py={2}
                        >
                          <HStack gap={2} w="100%">
                            {priceFilter === '' && <FiCheck size={16} />}
                            <Text flex={1}>All Prices</Text>
                          </HStack>
                        </MenuItem>
                        <MenuItem
                          value="low"
                          onClick={() => setPriceFilter('low')}
                          bg={priceFilter === 'low' ? 'brand.50' : 'transparent'}
                          color={priceFilter === 'low' ? 'brand.600' : 'gray.700'}
                          fontWeight={priceFilter === 'low' ? '700' : '500'}
                          _hover={{ bg: 'gray.50' }}
                          px={4}
                          py={2}
                        >
                          <HStack gap={2} w="100%">
                            {priceFilter === 'low' && <FiCheck size={16} />}
                            <Text flex={1}>Below ₹5,000/acre</Text>
                          </HStack>
                        </MenuItem>
                        <MenuItem
                          value="mid"
                          onClick={() => setPriceFilter('mid')}
                          bg={priceFilter === 'mid' ? 'brand.50' : 'transparent'}
                          color={priceFilter === 'mid' ? 'brand.600' : 'gray.700'}
                          fontWeight={priceFilter === 'mid' ? '700' : '500'}
                          _hover={{ bg: 'gray.50' }}
                          px={4}
                          py={2}
                        >
                          <HStack gap={2} w="100%">
                            {priceFilter === 'mid' && <FiCheck size={16} />}
                            <Text flex={1}>₹5,000 - ₹15,000/acre</Text>
                          </HStack>
                        </MenuItem>
                        <MenuItem
                          value="high"
                          onClick={() => setPriceFilter('high')}
                          bg={priceFilter === 'high' ? 'brand.50' : 'transparent'}
                          color={priceFilter === 'high' ? 'brand.600' : 'gray.700'}
                          fontWeight={priceFilter === 'high' ? '700' : '500'}
                          _hover={{ bg: 'gray.50' }}
                          px={4}
                          py={2}
                        >
                          <HStack gap={2} w="100%">
                            {priceFilter === 'high' && <FiCheck size={16} />}
                            <Text flex={1}>Above ₹15,000/acre</Text>
                          </HStack>
                        </MenuItem>
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRoot>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      colorScheme="gray"
                      transition="all 0.3s"
                      _hover={{ bg: 'gray.50' }}
                    >
                      <HStack gap={2}>
                        <FiX />
                        <span>Clear Filters</span>
                      </HStack>
                    </Button>
                  )}
                </HStack>

                {/* Results Count */}
                <HStack justify="space-between">
                  <Text color="gray.600" fontWeight="600">
                    {filteredLands.length} {filteredLands.length === 1 ? 'land' : 'lands'} found
                  </Text>
                  {hasActiveFilters && (
                    <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                      Filters Active
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </CardRoot>

          {/* Loading */}
          {loading && (
            <Center w="100%" py={20}>
              <VStack gap={4}>
                <Spinner size="xl" color="brand.500" />
                <Text color="gray.500">Loading lands...</Text>
              </VStack>
            </Center>
          )}

          {/* Empty State */}
          {!loading && filteredLands.length === 0 && (
            <Center w="100%" py={20}>
              <CardRoot w="100%" maxW="500px" className="fade-in">
                <CardBody p={10} textAlign="center">
                  <Text fontSize="6xl" mb={4}>🔍</Text>
                  <Heading size="md" mb={2} color="gray.600">
                    No lands found
                  </Heading>
                  <Text color="gray.400" mb={6}>
                    {hasActiveFilters 
                      ? 'Try adjusting your filters to see more results'
                      : 'No available lands at the moment'}
                  </Text>
                  {hasActiveFilters && (
                    <Button 
                      colorScheme="brand" 
                      onClick={clearFilters}
                      bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                      color="white"
                    >
                      <HStack gap={2}>
                        <FiX />
                        <span>Clear All Filters</span>
                      </HStack>
                    </Button>
                  )}
                </CardBody>
              </CardRoot>
            </Center>
          )}

          {/* Lands Grid */}
          {!loading && filteredLands.length > 0 && (
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              gap={6} 
              w="100%"
              className="fade-in"
            >
              {filteredLands.map((land: Land, index: number) => (
                <Box
                  key={land.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className="fade-in"
                >
                  <LandCard
                    land={land}
                    onView={() => navigate(`/seeker/land/${land.id}`)}
                    showOwner={true}
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BrowseLands;
