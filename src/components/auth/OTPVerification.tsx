import {
  Box, Container, VStack, Heading, Text,
  Button, HStack, Icon,
  PinInputRoot, PinInputInput,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GiWheat } from 'react-icons/gi';
import { FiCheck, FiRefreshCw } from 'react-icons/fi';
import { verifyOTPThunk } from '../../store/thunks/authThunk';
import { selectAuth, type AppDispatch } from '../../store/store';
import { toaster } from '../../utils/toast';

const OTPVerification = () => {
  const [otp, setOtp] = useState<string[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tempMobile, loading, isAuthenticated, user } = useSelector(selectAuth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'owner' ? '/owner/dashboard' : '/seeker/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toaster.create({
        title: 'Invalid OTP',
        description: 'Please enter all 6 digits',
        type: 'error',
      });
      return;
    }

    const result = await dispatch(verifyOTPThunk(otpString));

    if (verifyOTPThunk.fulfilled.match(result)) {
      toaster.create({
        title: 'OTP Verified! ✨',
        description: 'Proceeding to Aadhar verification',
        type: 'success',
      });
      navigate('/verify-aadhar');
    }
  };

  const handleResend = () => {
    setOtp([]);
    toaster.create({
      title: 'OTP Resent',
      description: `New OTP sent to ${tempMobile}`,
      type: 'info',
    });
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
      data-test-id="otp-page"
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
            data-test-id="otp-form"
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
                  Verify OTP 🔐
                </Heading>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  We sent a 6-digit OTP to
                </Text>
                <Text fontWeight="700" color="brand.500" fontSize="lg" data-test-id="otp-mobile">
                  {tempMobile}
                </Text>
              </VStack>

              {/* OTP Input */}
              <VStack gap={4} data-test-id="otp-input-section">
                <HStack justify="center">
                  <PinInputRoot
                    otp
                    size="lg"
                    value={otp}
                    onValueChange={(e) => setOtp(e.value)}
                  >
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <PinInputInput 
                        key={i} 
                        index={i} 
                        data-test-id={`pin-input-${i}`}
                        bg="gray.50"
                        border="none"
                        borderRadius="lg"
                        _focus={{ 
                          bg: 'white',
                          boxShadow: 'none',
                          outline: 'none',
                        }}
                        _focusVisible={{
                          boxShadow: 'none',
                          outline: 'none',
                        }}
                      />
                    ))}
                  </PinInputRoot>
                </HStack>

                <Button
                  variant="ghost"
                  colorScheme="brand"
                  size="sm"
                  onClick={handleResend}
                  data-test-id="resend-otp-button"
                  transition="all 0.3s"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  <HStack gap={2}>
                    <FiRefreshCw />
                    <span>Resend OTP</span>
                  </HStack>
                </Button>
              </VStack>

              {/* Verify Button */}
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleVerify}
                disabled={otp.join('').length !== 6}
                loading={loading}
                loadingText="Verifying..."
                data-test-id="verify-otp-button"
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
                  <span>Verify OTP</span>
                </HStack>
              </Button>

              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                data-test-id="back-to-login-button"
                transition="all 0.3s"
                _hover={{ transform: 'translateX(-4px)', color: 'brand.600' }}
              >
                ← Back to Login
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
            <Text color="#1b5e20" fontSize="sm" textAlign="center" fontWeight="600">
              🧪 Test Mode: Enter any 6-digit number (e.g. 123456)
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default OTPVerification;
