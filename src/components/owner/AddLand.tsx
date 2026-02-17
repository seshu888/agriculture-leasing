import {
  Box, Container, Heading, VStack, HStack, Text,
  Input, Button, Textarea, SimpleGrid,
  FieldRoot, FieldLabel,
  NativeSelectRoot, NativeSelectField,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSave } from 'react-icons/fi';
import { selectAuth, type AppDispatch } from '../../store/store';
import { addLandThunk } from '../../store/thunks/landsThunk';
import { toaster } from '../../utils/toast';

const AddLand = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);

  const [form, setForm] = useState({
    title: '',
    state: '',
    district: '',
    village: '',
    pincode: '',
    area: 1,
    soilType: 'loamy' as const,
    waterSource: 'borewell' as const,
    pricePerAcre: 0,
    pricePerMonth: 0,
    minLeasePeriod: 6,
    maxLeasePeriod: 24,
    description: '',
  });

  const handleSubmit = async () => {
    if (!form.title || !form.state || !form.district || !form.village) {
      toaster.create({
        title: 'Missing Fields',
        description: 'Please fill all required fields',
        type: 'error',
      });
      return;
    }

    const result = await dispatch(
      addLandThunk({
        ownerId: user!.id,
        ownerName: user!.name,
        ownerMobile: user!.mobile,
        title: form.title,
        location: {
          state: form.state,
          district: form.district,
          village: form.village,
          pincode: form.pincode,
        },
        area: form.area,
        soilType: form.soilType,
        waterSource: form.waterSource,
        crops: [],
        pricePerAcre: form.pricePerAcre,
        pricePerMonth: form.pricePerMonth,
        minLeasePeriod: form.minLeasePeriod,
        maxLeasePeriod: form.maxLeasePeriod,
        description: form.description,
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
        available: true,
        facilities: [],
      })
    );

    if (addLandThunk.fulfilled.match(result)) {
      toaster.create({
        title: '✅ Land Added!',
        description: 'Your land has been listed successfully',
        type: 'success',
      });
      navigate('/owner/my-lands');
    }
  };

  const states = ['Punjab', 'Haryana', 'Gujarat', 'Maharashtra', 'Uttar Pradesh',
    'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Rajasthan'];
  const soilTypes = ['loamy', 'clay', 'sandy', 'red', 'black', 'alluvial'];
  const waterSources = ['borewell', 'canal', 'river', 'rainwater', 'mixed'];

  const inputStyles = {
    fontSize: 'md',
    bg: 'white',
    h: '40px',
    borderRadius: 'lg',
    borderWidth: '1px',
    borderColor: '#E0E0E0',
    px: 4,
    _focus: { 
      borderColor: '#81c784',
      boxShadow: 'none',
      outline: 'none',
    },
    _focusVisible: {
      boxShadow: 'none',
      outline: 'none',
    },
    _hover: { borderColor: '#BDBDBD' },
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10} px={{ base: 4, md: 6, lg: 8 }} data-test-id="add-land-page">
      <Container maxW="container.lg" mx="auto">
        <VStack gap={10} align="stretch" maxW="900px" mx="auto">

          {/* Header */}
          <Box data-test-id="add-land-header" textAlign="center">
            <Heading 
              size="xl" 
              fontWeight="900" 
              color="gray.800"
              mb={2}
              textShadow="0 2px 4px rgba(0,0,0,0.05)"
            >
              Add New Land
            </Heading>
            <Text color="gray.600" fontSize="lg" fontWeight="500">
              List your agricultural property for lease
            </Text>
          </Box>

          {/* Form - No Card Wrapper */}
          <VStack gap={10} align="stretch" data-test-id="add-land-form">

            {/* Basic Info */}
            <Box>
              <Heading 
                size="lg" 
                color="gray.800" 
                mb={6}
                fontWeight="800"
                textShadow="0 2px 4px rgba(0,0,0,0.05)"
              >
                Basic Information
              </Heading>

              <VStack gap={6} align="stretch">
                <FieldRoot required data-test-id="title-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Land Title
                  </FieldLabel>
                  <Input
                    placeholder="e.g. Premium Agricultural Land in Punjab"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    data-test-id="title-input"
                    {...inputStyles}
                  />
                </FieldRoot>

                <FieldRoot data-test-id="description-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Description
                  </FieldLabel>
                  <Textarea
                    placeholder="Describe your land, facilities, and suitability..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={5}
                    data-test-id="description-input"
                    fontSize="md"
                    bg="white"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="#E0E0E0"
                    px={4}
                    py={3}
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
                </FieldRoot>
              </VStack>
            </Box>

            {/* Location */}
            <Box>
              <Heading 
                size="lg" 
                color="gray.800" 
                mb={6}
                fontWeight="800"
                textShadow="0 2px 4px rgba(0,0,0,0.05)"
              >
                Location
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <FieldRoot required data-test-id="state-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    State
                  </FieldLabel>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      placeholder="Select State"
                      data-test-id="state-select"
                      {...inputStyles}
                    >
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </FieldRoot>

                <FieldRoot required data-test-id="district-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    District
                  </FieldLabel>
                  <Input
                    placeholder="e.g. Ludhiana"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    data-test-id="district-input"
                    {...inputStyles}
                  />
                </FieldRoot>

                <FieldRoot required data-test-id="village-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Village/Town
                  </FieldLabel>
                  <Input
                    placeholder="e.g. Khanna"
                    value={form.village}
                    onChange={(e) => setForm({ ...form, village: e.target.value })}
                    data-test-id="village-input"
                    {...inputStyles}
                  />
                </FieldRoot>

                <FieldRoot data-test-id="pincode-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Pincode
                  </FieldLabel>
                  <Input
                    placeholder="e.g. 141401"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    data-test-id="pincode-input"
                    {...inputStyles}
                  />
                </FieldRoot>
              </SimpleGrid>
            </Box>

            {/* Land Details */}
            <Box>
              <Heading 
                size="lg" 
                color="gray.800" 
                mb={6}
                fontWeight="800"
                textShadow="0 2px 4px rgba(0,0,0,0.05)"
              >
                Land Details
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                <FieldRoot data-test-id="soil-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Soil Type
                  </FieldLabel>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={form.soilType}
                      onChange={(e) => setForm({ ...form, soilType: e.target.value as typeof form.soilType })}
                      data-test-id="soil-select"
                      {...inputStyles}
                    >
                      {soilTypes.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </FieldRoot>

                <FieldRoot data-test-id="water-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Water Source
                  </FieldLabel>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={form.waterSource}
                      onChange={(e) => setForm({ ...form, waterSource: e.target.value as typeof form.waterSource })}
                      data-test-id="water-select"
                      {...inputStyles}
                    >
                      {waterSources.map((w) => (
                        <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </FieldRoot>

                <FieldRoot data-test-id="area-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Area (acres)
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: parseInt(e.target.value) || 1 })}
                    placeholder="e.g. 5"
                    data-test-id="area-input"
                    {...inputStyles}
                  />
                </FieldRoot>
              </SimpleGrid>
            </Box>

            {/* Pricing */}
            <Box>
              <Heading 
                size="lg" 
                color="gray.800" 
                mb={6}
                fontWeight="800"
                textShadow="0 2px 4px rgba(0,0,0,0.05)"
              >
                Pricing
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <FieldRoot data-test-id="price-month-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Price Per Month (₹)
                  </FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    value={form.pricePerMonth || ''}
                    onChange={(e) => setForm({ ...form, pricePerMonth: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 10000"
                    data-test-id="price-month-input"
                    {...inputStyles}
                  />
                </FieldRoot>

                <FieldRoot data-test-id="price-acre-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Price Per Acre (₹)
                  </FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    value={form.pricePerAcre || ''}
                    onChange={(e) => setForm({ ...form, pricePerAcre: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 25000"
                    data-test-id="price-acre-input"
                    {...inputStyles}
                  />
                </FieldRoot>

                <FieldRoot data-test-id="min-lease-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Min Lease Period (months)
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={form.minLeasePeriod}
                    onChange={(e) => setForm({ ...form, minLeasePeriod: parseInt(e.target.value) || 1 })}
                    placeholder="e.g. 6"
                    data-test-id="min-lease-input"
                    {...inputStyles}
                  />
                </FieldRoot>

                <FieldRoot data-test-id="max-lease-section">
                  <FieldLabel fontWeight="700" fontSize="sm" color="gray.700" mb={2}>
                    Max Lease Period (months)
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={form.maxLeasePeriod}
                    onChange={(e) => setForm({ ...form, maxLeasePeriod: parseInt(e.target.value) || 1 })}
                    placeholder="e.g. 24"
                    data-test-id="max-lease-input"
                    {...inputStyles}
                  />
                </FieldRoot>
              </SimpleGrid>
            </Box>

            {/* Buttons */}
            <HStack gap={4} justify="center" data-test-id="form-actions" pt={4}>
              <Button
                variant="outline"
                onClick={() => navigate('/owner/my-lands')}
                data-test-id="cancel-button"
                size="lg"
                px={8}
                borderRadius="xl"
                fontWeight="700"
              >
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleSubmit}
                data-test-id="save-button"
                bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                color="white"
                size="lg"
                px={10}
                borderRadius="xl"
                fontWeight="700"
              >
                <HStack gap={2}>
                  <FiSave />
                  <span>Save Land</span>
                </HStack>
              </Button>
            </HStack>

          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default AddLand;
