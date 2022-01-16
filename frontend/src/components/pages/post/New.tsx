import { Box, Heading, Input, Center, Button, Stack } from "@chakra-ui/react";
import React, { memo, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { createPost } from "../../../api/post";

export const New: VFC = memo(() => {
  const [value, setValue] = useState({
    content: "",
  });

  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await createPost(value);
      console.log(res.data);
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box width="100%" height="100%" p="40px">
      <Center
        width="240px"
        height="240px"
        p="16px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        textAlign="center"
      >
        <form>
          <Stack spacing={4}>
            <Heading as="h1" textAlign="center" mb="16px" fontSize="24px">
              新規作成
            </Heading>
            <Input
              placeholder="content"
              value={value.content}
              onChange={(e) => handleChange(e)}
              type="text"
              name="content"
            />
            <Button
              bg="teal"
              color="white"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              投稿
            </Button>
          </Stack>
        </form>
      </Center>
    </Box>
  );
});
