import {
  Box, Container, VStack, Heading, Text,
  Input, Button, HStack, Icon,
  FieldRoot, FieldLabel,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GiWheat } from 'react-icons/gi';
import { FiCheck } from 'react-icons/fi';
import { verifyAadharThunk } from '../../store/thunks/authThunk';
import { selectAuth, type AppDispatch } from '../../store/store';
import { toaster } from '../../utils/toast';

const AadharVerification = () => {
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tempMobile, tempRole, loading, isAuthenticated, user } = useSelector(selectAuth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'owner' ? '/owner/dashboard' : '/seeker/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const formatAadhar = (val: string) => {
    const nums = val.replace(/\D/g, '');
    return (nums.match(/.{1,4}/g)?.join('-') || nums).slice(0, 14);
  };

  const handleVerify = async () => {
    if (!name || name.length < 3) {
      toaster.create({
        title: 'Invalid Name',
        description: 'Please enter your full name',
        type: 'error',
      });
      return;
    }

    if (aadhar.replace(/-/g, '').length !== 12) {
      toaster.create({
        title: 'Invalid Aadhar',
        description: 'Please enter a valid 12-digit Aadhar number',
        type: 'error',
      });
      return;
    }

    const result = await dispatch(
      verifyAadharThunk({ aadhar, name, mobile: tempMobile, role: tempRole })
    );

    if (verifyAadharThunk.fulfilled.match(result)) {
      toaster.create({
        title: '✅ Verification Successful!',
        description: 'Redirecting to your dashboard...',
        type: 'success',
      });
      const path =
        tempRole === 'owner' ? '/owner/dashboard' : '/seeker/dashboard';
      setTimeout(() => navigate(path), 1500);
    }
  };

  return (
    <Box
      h="100vh"
      overflow="hidden"
      bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)"
      backgroundSize="200% 200%"
      animation="gradient 15s ease infinite"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      position="relative"
      data-test-id="aadhar-page"
      css={{
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="5%"
        left="5%"
        w="200px"
        h="200px"
        bg="whiteAlpha.300"
        borderRadius="full"
        filter="blur(60px)"
        animation="pulse 6s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="5%"
        right="5%"
        w="250px"
        h="250px"
        bg="whiteAlpha.300"
        borderRadius="full"
        filter="blur(80px)"
        animation="pulse 8s ease-in-out infinite"
      />

      <Container maxW="550px" position="relative" zIndex={1}>
        <VStack gap={6} className="fade-in">
          {/* Logo */}
          <VStack gap={2} className="slide-in">
            <Box
              p={3}
              bg="whiteAlpha.400"
              borderRadius="xl"
              backdropFilter="blur(20px)"
              transition="all 0.3s"
              _hover={{ transform: 'scale(1.1) rotate(5deg)' }}
              shadow="lg"
              border="2px solid"
              borderColor="whiteAlpha.500"
            >
              <Icon as={GiWheat} boxSize={12} color="#2e7d32" />
            </Box>
            <VStack gap={0}>
              <Heading 
                color="#1b5e20" 
                size="2xl"
                fontWeight="900"
                textShadow="0 2px 20px rgba(255,255,255,0.5)"
                letterSpacing="tight"
              >
                AgriLease
              </Heading>
              <Text color="#2e7d32" fontSize="sm" fontWeight="600">
                Your Agricultural Land Leasing Platform
              </Text>
            </VStack>
          </VStack>

          {/* Card */}
          <Box
            bg="white"
            p={8}
            borderRadius="2xl"
            shadow="2xl"
            w="100%"
            data-test-id="aadhar-form"
            className="fade-in"
            border="2px solid"
            borderColor="whiteAlpha.400"
            backdropFilter="blur(20px)"
            transition="all 0.3s"
            _hover={{ shadow: '3xl', transform: 'translateY(-2px)' }}
          >
            <VStack gap={6} align="stretch">
              <VStack gap={1}>
                <Heading size="lg" color="gray.800" fontWeight="800">
                  Verify Identity 🔐
                </Heading>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Enter your Aadhar details to complete registration
                </Text>
              </VStack>

              {/* Full Name */}
              <FieldRoot data-test-id="name-input-section">
                <FieldLabel fontWeight="700" fontSize="sm" color="gray.700">
                  Full Name
                </FieldLabel>
                <Input
                  placeholder="Enter your full name as per Aadhar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fontSize="md"
                  data-test-id="name-input"
                  bg="white"
                  h="40px"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="#E0E0E0"
                  px={4}
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
                  style={{ textTransform: 'capitalize' }}
                />
              </FieldRoot>

              {/* Aadhar Number */}
              <FieldRoot data-test-id="aadhar-input-section">
                <FieldLabel fontWeight="700" fontSize="sm" color="gray.700">
                  Aadhar Number
                </FieldLabel>
                <Input
                  placeholder="1234-5678-9012"
                  value={aadhar}
                  onChange={(e) => setAadhar(formatAadhar(e.target.value))}
                  fontSize="md"
                  data-test-id="aadhar-input"
                  bg="white"
                  h="40px"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="#E0E0E0"
                  px={4}
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
                <Text fontSize="xs" color="gray.400" mt={1}>
                  12-digit Aadhar number
                </Text>
              </FieldRoot>

              {/* Verify Button */}
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleVerify}
                disabled={!name || aadhar.replace(/-/g, '').length !== 12}
                loading={loading}
                loadingText="Verifying..."
                data-test-id="verify-aadhar-button"
                fontWeight="700"
                h="56px"
                fontSize="md"
                borderRadius="xl"
                transition="all 0.3s"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'xl',
                }}
                _active={{ transform: 'translateY(0)' }}
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                color="white"
                w="100%"
                border="none"
              >
                <HStack gap={2}>
                  <FiCheck />
                  <span>Complete Verification</span>
                </HStack>
              </Button>

              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate('/verify-otp')}
                data-test-id="back-button"
                transition="all 0.3s"
                _hover={{ transform: 'translateX(-4px)', color: 'brand.600' }}
              >
                ← Back
              </Button>
            </VStack>
          </Box>

          {/* Test Info */}
          <Box 
            bg="whiteAlpha.400" 
            p={4} 
            borderRadius="xl" 
            w="100%"
            backdropFilter="blur(20px)"
            border="none"
            className="fade-in"
            shadow="md"
          >
            <Text color="#1b5e20" fontSize="sm" fontWeight="700" mb={2} textAlign="center">
              🧪 Test Mode
            </Text>
            <VStack align="start" gap={1}>
              <Text color="#2e7d32" fontSize="xs" fontWeight="600">
                Name: Any name
              </Text>
              <Text color="#2e7d32" fontSize="xs" fontWeight="600">
                Aadhar: 1234-5678-9012
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AadharVerification;
