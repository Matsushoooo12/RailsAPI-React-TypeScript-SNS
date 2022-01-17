import React, { memo, useEffect, useRef, useState, VFC } from "react";
import { Box, Heading, Text, Flex, Input, Button } from "@chakra-ui/react";
import { Message } from "../../../types/dm";
import { useParams } from "react-router-dom";
import { createMessage, getDetailRoom } from "../../../api/dm";
import { User } from "../../../types/user";

export const Room: VFC = memo(() => {
  const [otherUser, setOtherUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>();
  const [content, setContent] = useState<string>("");

  // スクロール位置指定
  const messageBox = useRef(null);

  const query = useParams();

  const handleGetDetailRoom = async (query: any) => {
    try {
      const res = await getDetailRoom(query.id);
      console.log(res.data);
      setOtherUser(res.data.otherUser);
      setMessages(res.data.messages);
      //   if (messageBox.current) {
      //     messageBox.current.scrollTop = messageBox.current.scrollHeight + 16;
      //   }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (
    query: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const res = await createMessage(query.id, { content: content });
      console.log(res.data);
      handleGetDetailRoom(query);
    } catch (e) {
      console.log(e);
    }
    setContent("");
  };

  useEffect(() => {
    handleGetDetailRoom(query);
  }, [query]);

  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        DM詳細
      </Heading>
      <Box
        textAlign="center"
        mx="auto"
        width="500px"
        height="100%"
        p="16px"
        bg="white"
        mb="16px"
        borderRadius="md"
        shadow="md"
      >
        <Text color="teal" fontSize="24px" fontWeight="bold">
          {otherUser?.name}
        </Text>
        <Text>{otherUser?.email}</Text>
      </Box>
      <Box
        width="500px"
        height="500px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        overflow="scroll"
        ref={messageBox}
      >
        {messages?.map((message) => (
          <Box key={message.id} p="16px">
            <Flex
              justify={
                message.userId === otherUser?.id ? "flex-start" : "flex-end"
              }
            >
              <Text color={message.userId === otherUser?.id ? "teal" : "red"}>
                {`${
                  message.userId === otherUser?.id ? otherUser?.name : "自分"
                }:${message.content}`}
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>
      <Box width="500px" mx="auto" bg="teal" p="16px">
        <form>
          <Flex>
            <Input
              bg="white"
              placeholder="content"
              type="text"
              name="content"
              id="content"
              color="gray.800"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              type="submit"
              bg="teal"
              color="white"
              onClick={(e) => handleSubmit(query, e)}
            >
              送信
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
});
