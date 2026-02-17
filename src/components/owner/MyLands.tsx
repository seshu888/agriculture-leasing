import {
  Box, Container, Heading, SimpleGrid,
  Text, Button, HStack, VStack, Spinner, Center,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlusCircle } from 'react-icons/fi';
import { selectAuth, selectOwnerLands, type AppDispatch, type RootState } from '../../store/store';
import { fetchLandsThunk } from '../../store/thunks/landsThunk';
import LandCard from '../common/LandCard';

const MyLands = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const myLands = useSelector((state: RootState) => selectOwnerLands(user!.id)(state));
  const loading = useSelector((state: RootState) => state.lands.loading);

  useEffect(() => {
    dispatch(fetchLandsThunk());
  }, [dispatch]);

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10} px={{ base: 4, md: 6, lg: 8 }} data-test-id="my-lands-page">
      <Container maxW="container.xl" mx="auto">
        <VStack gap={6} align="stretch" maxW="1400px" mx="auto">

          {/* Header */}
          <HStack justify="space-between" align="center" data-test-id="my-lands-header" mb={2}>
            <Box>
              <Heading 
                size="xl" 
                fontWeight="900" 
                color="gray.800"
                mb={1}
                textShadow="0 2px 4px rgba(0,0,0,0.05)"
              >
                My Lands
              </Heading>
              <Text color="gray.600" fontSize="md" fontWeight="500">
                {myLands.length} {myLands.length === 1 ? 'property' : 'properties'} listed
              </Text>
            </Box>
            <Button
              colorScheme="brand"
              onClick={() => navigate('/owner/add-land')}
              data-test-id="add-land-button"
              bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
              color="white"
              px={6}
              h="40px"
              borderRadius="xl"
              fontWeight="700"
              fontSize="md"
              shadow="lg"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{ 
                transform: 'translateY(-2px)',
                shadow: 'xl',
                bg: 'linear-gradient(135deg, #0ea80e 0%, #2ddc6d 100%)',
              }}
              _active={{ transform: 'translateY(0px)' }}
            >
              <HStack gap={2}>
                <FiPlusCircle size={18} />
                <span>Add Land</span>
              </HStack>
            </Button>
          </HStack>

          {/* Loading */}
          {loading && (
            <Center py={12} data-test-id="loading-spinner">
              <Spinner size="xl" color="brand.500" />
            </Center>
          )}

          {/* Empty State */}
          {!loading && myLands.length === 0 && (
            <Center
              py={16}
              flexDirection="column"
              bg="white"
              borderRadius="lg"
              shadow="sm"
              data-test-id="empty-state"
            >
              <Text fontSize="4xl" mb={4}>🌾</Text>
              <Heading size="md" mb={2} color="gray.600">No Lands Listed Yet</Heading>
              <Text color="gray.400" mb={6}>Start by adding your first agricultural land</Text>
              <Button
                colorScheme="brand"
                onClick={() => navigate('/owner/add-land')}
                data-test-id="empty-add-button"
                bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                color="white"
                px={8}
                h="40px"
                borderRadius="xl"
                fontWeight="700"
                fontSize="md"
                shadow="xl"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{ 
                  transform: 'translateY(-2px)',
                  shadow: '2xl',
                  bg: 'linear-gradient(135deg, #0ea80e 0%, #2ddc6d 100%)',
                }}
                _active={{ transform: 'translateY(0px)' }}
              >
                <HStack gap={2}>
                  <FiPlusCircle size={18} />
                  <span>Add Your First Land</span>
                </HStack>
              </Button>
            </Center>
          )}

          {/* Lands Grid */}
          {!loading && myLands.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} data-test-id="lands-grid">
              {myLands.map((land) => (
                <LandCard
                  key={land.id}
                  land={land}
                  onView={() => navigate(`/owner/land/${land.id}`)}
                  showOwner={false}
                />
              ))}
            </SimpleGrid>
          )}

        </VStack>
      </Container>
    </Box>
  );
};

export default MyLands;
