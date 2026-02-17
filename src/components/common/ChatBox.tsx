import {
  Box, Flex, Text, Input, IconButton,
  VStack, HStack, Separator, Spinner, Center,
  AvatarRoot, AvatarFallback,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSend } from 'react-icons/fi';
import { sendMessageThunk, fetchMessagesThunk } from '../../store/thunks/chatThunk';
import { selectAuth, type AppDispatch, type RootState } from '../../store/store';

interface ChatBoxProps {
  conversationId: string;
  receiverId: string;
  receiverName: string;
}

const ChatBox = ({ conversationId, receiverId, receiverName }: ChatBoxProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const messages = useSelector(
    (state: RootState) => state.chat.messages[conversationId] || []
  );
  const loading = useSelector((state: RootState) => state.chat.loading);

  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load messages on mount
  useEffect(() => {
    dispatch(fetchMessagesThunk(conversationId));
  }, [conversationId, dispatch]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !user) return;
    dispatch(
      sendMessageThunk({
        conversationId,
        senderId: user.id,
        receiverId,
        message: text.trim(),
      })
    );
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      h="500px"
      display="flex"
      flexDirection="column"
      bg="white"
      shadow="md"
      data-test-id="chatbox"
    >
      {/* ── Header ─────────────────────────────── */}
      <HStack
        px={4}
        py={3}
        bg="brand.500"
        gap={3}
        data-test-id="chat-header"
      >
        <AvatarRoot size="sm">
          <AvatarFallback name={receiverName} bg="white" color="brand.500" />
        </AvatarRoot>
        <VStack align="start" gap={0}>
          <Text fontWeight="bold" color="white" fontSize="sm" data-test-id="chat-receiver-name">
            {receiverName}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.800">
            Online
          </Text>
        </VStack>
      </HStack>

      <Separator />

      {/* ── Messages Area ───────────────────────── */}
      <VStack
        flex={1}
        overflowY="auto"
        p={4}
        gap={3}
        align="stretch"
        data-test-id="messages-area"
      >
        {/* Loading State */}
        {loading && messages.length === 0 && (
          <Center flex={1} data-test-id="chat-loading">
            <Spinner color="brand.500" />
          </Center>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && (
          <Center flex={1} data-test-id="no-messages">
            <VStack gap={2}>
              <Text fontSize="3xl">💬</Text>
              <Text color="gray.400" fontSize="sm">
                No messages yet. Start the conversation!
              </Text>
            </VStack>
          </Center>
        )}

        {/* Messages */}
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user?.id;
          return (
            <Flex
              key={msg.id || index}
              justify={isMe ? 'flex-end' : 'flex-start'}
              align="flex-end"
              gap={2}
              data-test-id={`message-${index}`}
            >
              {/* Receiver Avatar */}
              {!isMe && (
                <AvatarRoot size="xs" data-test-id={`receiver-avatar-${index}`}>
                  <AvatarFallback name={receiverName} />
                </AvatarRoot>
              )}

              {/* Message Bubble */}
              <Box
                bg={isMe ? 'brand.500' : 'gray.100'}
                color={isMe ? 'white' : 'gray.800'}
                px={4}
                py={2}
                borderRadius={
                  isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                }
                maxW="70%"
                data-test-id={`message-bubble-${index}`}
              >
                <Text fontSize="sm">{msg.message}</Text>
                <Text
                  fontSize="xs"
                  color={isMe ? 'whiteAlpha.700' : 'gray.400'}
                  textAlign="right"
                  mt={1}
                  data-test-id={`message-time-${index}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Box>

              {/* Sender Avatar */}
              {isMe && (
                <AvatarRoot size="xs" data-test-id={`sender-avatar-${index}`}>
                  <AvatarFallback name={user?.name} bg="brand.500" />
                </AvatarRoot>
              )}
            </Flex>
          );
        })}

        {/* Auto scroll anchor */}
        <div ref={bottomRef} />
      </VStack>

      <Separator />

      {/* ── Input Area ──────────────────────────── */}
      <HStack
        px={4}
        py={3}
        bg="gray.50"
        gap={2}
        data-test-id="chat-input-area"
      >
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          bg="white"
          borderRadius="full"
          size="md"
          data-test-id="chat-input"
        />
        <IconButton
          aria-label="Send message"
          colorScheme="brand"
          borderRadius="full"
          onClick={handleSend}
          bg="linear-gradient(135deg, #0da10d 0%, #25d366 100%)"
          color="white"
          disabled={!text.trim()}
          data-test-id="send-button"
        >
          <FiSend />
        </IconButton>
      </HStack>
    </Box>
  );
};

export default ChatBox;