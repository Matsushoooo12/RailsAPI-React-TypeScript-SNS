import { Box, Center, Text, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { VFC, memo, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getAllPosts } from "../../../api/post";
import { Post } from "../../../types/post";

export const Home: VFC = memo(() => {
  const [posts, setPosts] = useState<Post[]>([]);

  const history = useHistory();

  const onClickDetailPost = useCallback(
    (id) => {
      history.push(`/post/${id}`);
    },
    [history]
  );

  const handleGetAllPosts = async () => {
    try {
      const res = await getAllPosts();
      console.log(res.data);
      setPosts(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetAllPosts();
  }, []);
  return (
    <Box p="40px">
      <Heading as="h1" textAlign="center" mb="16px">
        投稿一覧ページ
      </Heading>
      <Wrap>
        {posts.map((post) => (
          <WrapItem key={post.id}>
            <Center
              onClick={() => onClickDetailPost(post.id)}
              width="240px"
              height="240px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
            >
              <Box textAlign="center">
                <Text color="teal" fontWeight="bold" fontSize="24px">
                  {post.content}
                </Text>
                <Text>{post.user.name}</Text>
                <Text>{post.user.email}</Text>
              </Box>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
