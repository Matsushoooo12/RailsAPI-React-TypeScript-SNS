import { Box, Center, Text, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { VFC, memo, useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { createLike, deleteLike } from "../../../api/like";
import { getAllPosts } from "../../../api/post";
import { AuthContext } from "../../../App";
import { Post } from "../../../types/post";

export const Home: VFC = memo(() => {
  const [posts, setPosts] = useState<Post[]>([]);

  const { currentUser } = useContext<any>(AuthContext);

  const history = useHistory();

  const onClickDetailPost = useCallback(
    (id) => {
      history.push(`/post/${id}`);
    },
    [history]
  );

  const onClickProfile = (id: number) => {
    history.push(`/user/${id}`);
  };

  const handleGetAllPosts = async () => {
    try {
      const res = await getAllPosts();
      console.log(res.data);
      setPosts(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // いいね作成API
  const handleCreateLike = async (item: Post) => {
    try {
      const res = await createLike(item.id);
      console.log(res.data);
      handleGetAllPosts();
    } catch (e) {
      console.log(e);
    }
  };

  // いいね削除API
  const handleDeleteLike = async (item: Post) => {
    try {
      const res = await deleteLike(item.id);
      console.log(res.data);
      handleGetAllPosts();
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
              width="240px"
              height="240px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
            >
              <Box textAlign="center">
                <Text
                  color="teal"
                  fontWeight="bold"
                  fontSize="24px"
                  onClick={() => onClickDetailPost(post.id)}
                >
                  {post.content}
                </Text>
                {post.likes?.find((like) => like.userId === currentUser.id) ? (
                  <Text onClick={() => handleDeleteLike(post)}>
                    ♡{post.likes?.length}
                  </Text>
                ) : (
                  <Text onClick={() => handleCreateLike(post)}>
                    ♡{post.likes?.length}
                  </Text>
                )}
                <Box onClick={() => onClickProfile(post.user.id)}>
                  <Text>{post.user.name}</Text>
                  <Text>{post.user.email}</Text>
                </Box>
              </Box>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
