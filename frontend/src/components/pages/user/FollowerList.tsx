import { VFC, memo, useState, useContext, useEffect } from "react";
import {
  Text,
  Box,
  Stack,
  Wrap,
  WrapItem,
  Center,
  Button,
  Heading,
} from "@chakra-ui/react";
import { Follow } from "../../../types/follow";
import { AuthContext } from "../../../App";
import { User } from "../../../types/user";
import { useParams, useHistory } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { createFollow, deleteFollow } from "../../../api/follow";

export const FollowerList: VFC = memo(() => {
  const { currentUser, handleGetCurrentUser } = useContext<any>(AuthContext);
  const [followers, setFollowers] = useState<Follow[]>();
  const [user, setUser] = useState<User>();
  const query = useParams();
  const history = useHistory();

  const onClickDetailUser = (id: number) => {
    history.push(`/user/${id}`);
  };

  const handleGetFollowers = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      setFollowers(res.data.followers);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // フォロー機能関数
  const handleCreateFollow = async (item: any) => {
    try {
      await createFollow(item.id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteFollow = async (item: any) => {
    try {
      await deleteFollow(item.id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetFollowers(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        フォロワー
      </Heading>
      <Wrap>
        {followers?.map((follower) => (
          <WrapItem key={follower.id}>
            <Center
              width="240px"
              height="240px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
              p="16px"
            >
              <Stack width="100%">
                <Text
                  textAlign="center"
                  color="teal"
                  fontWeight="bold"
                  fontSize="24px"
                  onClick={() => onClickDetailUser(follower.id)}
                >
                  {follower?.name}
                </Text>
                <Text textAlign="center">{follower?.email}</Text>
                {currentUser.id === user?.id && (
                  <>
                    {currentUser.followings?.find(
                      (follow: any) => follow.id === follower.id
                    ) ? (
                      <Button
                        bg="teal"
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => handleDeleteFollow(follower)}
                      >
                        フォローを外す
                      </Button>
                    ) : (
                      <Button
                        bg="teal"
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => handleCreateFollow(follower)}
                      >
                        フォローをする
                      </Button>
                    )}
                  </>
                )}
              </Stack>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
