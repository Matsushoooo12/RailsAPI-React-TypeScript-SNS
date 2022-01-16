import { Button, Box, Heading, Text, Center, Stack } from "@chakra-ui/react";
import { memo, useContext, useEffect, useState, VFC } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createLike, deleteLike } from "../../../api/like";
import { deletePost, getDetailPost } from "../../../api/post";
import { AuthContext } from "../../../App";
import { Like } from "../../../types/like";
import { Post } from "../../../types/post";

export const Detail: VFC = memo(() => {
  const { currentUser } = useContext<any>(AuthContext);
  const [value, setValue] = useState({
    id: 0,
    content: "",
    user: {
      id: 0,
      name: "",
      email: "",
    },
    likes: [],
  });

  const [likes, setLikes] = useState<Like[]>();

  const query = useParams();
  const history = useHistory();

  const onClickEditPost = (id: number) => {
    history.push(`/edit/${id}`);
  };

  // 投稿詳細API
  const handleGetDetailPost = async (query: any) => {
    try {
      const res = await getDetailPost(query.id);
      console.log(res.data);
      setValue({
        id: res.data.id,
        content: res.data.content,
        user: {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
        },
        likes: [],
      });
      setLikes(res.data.likes);
    } catch (e) {
      console.log(e);
    }
  };

  // 投稿削除API
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

  // いいね作成API
  const handleCreateLike = async (item: Post) => {
    try {
      const res = await createLike(item.id);
      console.log(res.data);
      handleGetDetailPost(query);
    } catch (e) {
      console.log(e);
    }
  };

  // いいね削除API
  const handleDeleteLike = async (item: Post) => {
    try {
      const res = await deleteLike(item.id);
      console.log(res.data);
      handleGetDetailPost(query);
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
        width="240px"
        height="240px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text textAlign="center">{value?.content}</Text>
          {likes?.find((like) => like.userId === currentUser.id) ? (
            <Text textAlign="center" onClick={() => handleDeleteLike(value)}>
              ♡{likes?.length}
            </Text>
          ) : (
            <Text textAlign="center" onClick={() => handleCreateLike(value)}>
              ♡{likes?.length}
            </Text>
          )}
          <Text textAlign="center">{value?.user.name}</Text>
          <Text textAlign="center">{value?.user.email}</Text>
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
