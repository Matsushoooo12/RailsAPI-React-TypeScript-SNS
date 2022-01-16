import React, { VFC, memo, useState, useEffect } from "react";
import { Box, Heading, Input, Center, Button, Stack } from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";
import { getDetailPost, updatePost } from "../../../api/post";

export const Edit: VFC = memo(() => {
  const [value, setValue] = useState({
    id: 0,
    content: "",
  });

  const query = useParams();
  const history = useHistory();

  const handleGetDetailPost = async (query: any) => {
    try {
      const res = await getDetailPost(query.id);
      console.log(res.data);
      setValue({
        id: res.data.id,
        content: res.data.content,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await updatePost(value.id, value);
      console.log(res.data);
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetDetailPost(query);
  }, [query]);
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
              投稿編集
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
              更新
            </Button>
          </Stack>
        </form>
      </Center>
    </Box>
  );
});
