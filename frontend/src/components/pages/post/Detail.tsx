import { Button, Box, Heading, Text, Center, Stack } from "@chakra-ui/react";
import { memo, useEffect, useState, VFC } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deletePost, getDetailPost } from "../../../api/post";
import { Post } from "../../../types/post";

export const Detail: VFC = memo(() => {
  const [value, setValue] = useState({
    id: 0,
    content: "",
  });

  const query = useParams();
  const history = useHistory();

  const onClickEditPost = (id: number) => {
    history.push(`/edit/${id}`);
  };

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

  const handleDeletePost = async (item: Post) => {
    console.log("click", item.id);
    try {
      const res = await deletePost(item.id);
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
      <Heading as="h1" textAlign="center" mb={4}>
        投稿詳細
      </Heading>
      <Center
        width="180px"
        height="180px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text textAlign="center">{value?.content}</Text>
          <Button
            bg="teal"
            color="white"
            onClick={() => onClickEditPost(value?.id)}
          >
            編集
          </Button>
          <Button
            bg="teal"
            color="white"
            onClick={() => handleDeletePost(value)}
          >
            削除
          </Button>
        </Stack>
      </Center>
    </Box>
  );
});
