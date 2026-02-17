import {
  Box, Container, VStack, Heading, Text,
  Input, Button, HStack, Icon,
  FieldRoot, FieldLabel,
  RadioGroupRoot, RadioGroupItem, RadioGroupItemControl, RadioGroupItemText,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GiWheat } from 'react-icons/gi';
import { FiPhone } from 'react-icons/fi';
import { sendOTPThunk } from '../../store/thunks/authThunk';
import { selectAuth, type AppDispatch } from '../../store/store';
import { toaster } from '../../utils/toast';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'owner' | 'seeker'>('seeker');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated, user } = useSelector(selectAuth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'owner' ? '/owner/dashboard' : '/seeker/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSendOTP = async () => {
    if (!mobile || mobile.length < 10) {
      toaster.create({
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid 10-digit mobile number',
        type: 'error',
      });
      return;
    }

    const result = await dispatch(
      sendOTPThunk({ mobile: `+91-${mobile}`, role })
    );

    if (sendOTPThunk.fulfilled.match(result)) {
      toaster.create({
        title: 'OTP Sent! ✨',
        description: `OTP has been sent to +91-${mobile}`,
        type: 'success',
      });
      navigate('/verify-otp');
    }
  };

  return (
    <Box
      h="100vh"
      overflow="hidden"
      overflowX="hidden"
      bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 30%, #a5d6a7 60%, #81c784 100%)"
      backgroundSize="400% 400%"
      css={{
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        animation: 'gradient 20s ease infinite',
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 3, sm: 4 }}
      position="relative"
      data-test-id="login-page"
      w="100%"
      maxW="100vw"
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="5%"
        left="5%"
        w={{ base: "150px", md: "200px" }}
        h={{ base: "150px", md: "200px" }}
        bg="whiteAlpha.300"
        borderRadius="full"
        filter="blur(60px)"
        animation="pulse 6s ease-in-out infinite"
        display={{ base: "none", sm: "block" }}
      />
      <Box
        position="absolute"
        bottom="5%"
        right="5%"
        w={{ base: "180px", md: "250px" }}
        h={{ base: "180px", md: "250px" }}
        bg="whiteAlpha.300"
        borderRadius="full"
        filter="blur(80px)"
        animation="pulse 8s ease-in-out infinite"
        display={{ base: "none", sm: "block" }}
      />

      <Container 
        maxW="550px" 
        position="relative" 
        zIndex={1} 
        px={{ base: 3, sm: 4, md: 6 }}
        w="100%"
        mx="auto"
      >
        <VStack gap={{ base: 4, md: 6 }} className="fade-in" w="100%">
          {/* Logo */}
          <VStack gap={2} className="slide-in">
            <Box
              p={{ base: 2, md: 3 }}
              bg="whiteAlpha.400"
              borderRadius="xl"
              backdropFilter="blur(20px)"
              transition="all 0.3s"
              _hover={{ transform: 'scale(1.1) rotate(5deg)' }}
              shadow="lg"
              border="2px solid"
              borderColor="whiteAlpha.500"
            >
              <Icon as={GiWheat} boxSize={{ base: 10, md: 12 }} color="#2e7d32" />
            </Box>
            <VStack gap={0}>
              <Heading 
                color="#1b5e20" 
                size={{ base: "xl", md: "2xl" }}
                fontWeight="900"
                textShadow="0 2px 20px rgba(255,255,255,0.5)"
                letterSpacing="tight"
                textAlign="center"
              >
                AgriLease
              </Heading>
              <Text color="#2e7d32" fontSize={{ base: "xs", md: "sm" }} fontWeight="600" textAlign="center">
                Your Agricultural Land Leasing Platform
              </Text>
            </VStack>
          </VStack>

          {/* Card */}
          <Box
            bg="rgba(255, 255, 255, 0.95)"
            p={{ base: 5, md: 8 }}
            borderRadius="3xl"
            shadow="0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)"
            w="100%"
            maxW="100%"
            data-test-id="login-form"
            className="fade-in"
            backdropFilter="blur(20px)"
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{ 
              shadow: '0 25px 70px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.6)',
              transform: 'translateY(-4px) scale(1.01)'
            }}
            overflow="hidden"
            position="relative"
          >
            {/* Decorative gradient overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bg="linear-gradient(90deg, #81c784 0%, #66bb6a 50%, #4caf50 100%)"
            />
            <VStack gap={{ base: 5, md: 6 }} align="stretch">
              <VStack gap={1}>
                <Heading size={{ base: "md", md: "lg" }} color="gray.800" fontWeight="800" textAlign="center">
                  Welcome Back 👋
                </Heading>
                <Text color="gray.600" textAlign="center" fontSize={{ base: "xs", md: "sm" }}>
                  Enter your mobile number to continue
                </Text>
              </VStack>

              {/* Role Selection - Fixed Clickability and Removed Borders */}
              <FieldRoot data-test-id="role-selection">
                <FieldLabel fontWeight="700" mb={3} fontSize={{ base: "xs", md: "sm" }} color="gray.700">
                  I am a
                </FieldLabel>
                <RadioGroupRoot
                  value={role}
                  onValueChange={(e) => {
                    if (e.value) {
                      setRole(e.value as 'owner' | 'seeker');
                    }
                  }}
                >
                  <HStack 
                    gap={{ base: 2, md: 3 }} 
                    justify="center"
                    flexWrap={{ base: "wrap", sm: "nowrap" }}
                    w="100%"
                    maxW="100%"
                    overflow="hidden"
                  >
                    <Box
                      as="label"
                      cursor="pointer"
                      onClick={() => setRole('seeker')}
                      flex={{ base: "1 1 calc(50% - 4px)", sm: "0 0 auto" }}
                      minW={{ base: "calc(50% - 4px)", sm: "auto" }}
                      maxW={{ base: "calc(50% - 4px)", sm: "none" }}
                    >
                      <RadioGroupItem 
                        value="seeker" 
                        colorPalette="brand" 
                        data-test-id="role-seeker"
                        p={{ base: 2.5, md: 3 }}
                        px={{ base: 3, md: 5 }}
                        borderRadius="lg"
                        border="none"
                        bg={role === 'seeker' ? 'brand.50' : 'gray.50'}
                        transition="all 0.3s"
                        _hover={{ bg: 'brand.100' }}
                        whiteSpace="nowrap"
                        shadow={role === 'seeker' ? 'sm' : 'none'}
                        w="100%"
                        justifyContent="center"
                      >
                        <RadioGroupItemControl />
                        <RadioGroupItemText fontWeight="600" fontSize={{ base: "xs", md: "sm" }}>
                          Lease Seeker
                        </RadioGroupItemText>
                      </RadioGroupItem>
                    </Box>
                    <Box
                      as="label"
                      cursor="pointer"
                      onClick={() => setRole('owner')}
                      flex={{ base: "1 1 calc(50% - 4px)", sm: "0 0 auto" }}
                      minW={{ base: "calc(50% - 4px)", sm: "auto" }}
                      maxW={{ base: "calc(50% - 4px)", sm: "none" }}
                    >
                      <RadioGroupItem 
                        value="owner" 
                        colorPalette="brand" 
                        data-test-id="role-owner"
                        p={{ base: 2.5, md: 3 }}
                        px={{ base: 3, md: 5 }}
                        borderRadius="lg"
                        border="none"
                        bg={role === 'owner' ? 'brand.50' : 'gray.50'}
                        transition="all 0.3s"
                        _hover={{ bg: 'brand.100' }}
                        whiteSpace="nowrap"
                        shadow={role === 'owner' ? 'sm' : 'none'}
                        w="100%"
                        justifyContent="center"
                      >
                        <RadioGroupItemControl />
                        <RadioGroupItemText fontWeight="600" fontSize={{ base: "xs", md: "sm" }}>
                          Land Owner
                        </RadioGroupItemText>
                      </RadioGroupItem>
                    </Box>
                  </HStack>
                </RadioGroupRoot>
              </FieldRoot>

              {/* Mobile Input */}
              <FieldRoot data-test-id="mobile-input-section">
                <FieldLabel fontWeight="700" mb={3} fontSize={{ base: "xs", md: "sm" }} color="gray.700">
                  Mobile Number
                </FieldLabel>
                <HStack gap={0} align="stretch" w="100%" maxW="100%" bg="white" borderRadius="lg" borderWidth="1px" borderColor="#E0E0E0" overflow="hidden">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    px={{ base: 3, md: 4 }}
                    bg="gray.50"
                    fontWeight="700"
                    color="gray.700"
                    fontSize={{ base: "sm", md: "md" }}
                    minW={{ base: "65px", md: "75px" }}
                    h={{ base: "44px", md: "40px" }}
                    borderRightWidth="1px"
                    borderRightColor="#E0E0E0"
                  >
                    +91
                  </Box>
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                    }
                    fontSize={{ base: "sm", md: "md" }}
                    data-test-id="mobile-input"
                    flex={1}
                    bg="transparent"
                    h={{ base: "44px", md: "40px" }}
                    border="none"
                    px={{ base: 3, md: 4 }}
                    _focus={{ 
                      boxShadow: 'none',
                      outline: 'none',
                    }}
                    _focusVisible={{
                      boxShadow: 'none',
                      outline: 'none',
                    }}
                    transition="all 0.3s"
                  />
                </HStack>
              </FieldRoot>

              {/* Send OTP Button */}
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleSendOTP}
                loading={loading}
                loadingText="Sending OTP..."
                data-test-id="send-otp-button"
                fontWeight="700"
                h={{ base: "48px", md: "56px" }}
                fontSize={{ base: "sm", md: "md" }}
                borderRadius="xl"
                transition="all 0.3s"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'xl',
                }}
                _active={{ transform: 'translateY(0)' }}
                bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
                color="white"
                w="100%"
                border="none"
              >
                <HStack gap={2}>
                  <FiPhone size={18} />
                  <span>Send OTP</span>
                </HStack>
              </Button>

              <Text fontSize="xs" color="gray.400" textAlign="center">
                By continuing, you agree to our Terms of Service
              </Text>
            </VStack>
          </Box>

          {/* Test Credentials - Compact */}
          <Box 
            bg="whiteAlpha.400" 
            p={{ base: 3, md: 4 }} 
            borderRadius="xl" 
            w="100%"
            maxW="100%"
            backdropFilter="blur(20px)"
            border="none"
            className="fade-in"
            shadow="md"
            overflow="hidden"
          >
            <Text color="#1b5e20" fontSize={{ base: "xs", md: "sm" }} fontWeight="700" mb={2} textAlign="center">
              🧪 Test Accounts
            </Text>
            <VStack gap={2} align="stretch" w="100%">
              <HStack justify="center" gap={2} flexWrap="wrap">
                <HStack gap={2} flexShrink={0}>
                  <Box w="6px" h="6px" bg="#4caf50" borderRadius="full" />
                  <Text color="#2e7d32" fontSize="xs" fontWeight="600" whiteSpace="nowrap">
                    Owner: <Text as="span" fontWeight="800">9876543210</Text>
                  </Text>
                </HStack>
                <HStack gap={2} flexShrink={0}>
                  <Box w="6px" h="6px" bg="#4caf50" borderRadius="full" />
                  <Text color="#2e7d32" fontSize="xs" fontWeight="600" whiteSpace="nowrap">
                    Seeker: <Text as="span" fontWeight="800">9876543211</Text>
                  </Text>
                </HStack>
              </HStack>
              <Text color="#66bb6a" fontSize="xs" fontWeight="500" textAlign="center" mt={1}>
                OTP: Any 6 digits (e.g. 123456)
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
