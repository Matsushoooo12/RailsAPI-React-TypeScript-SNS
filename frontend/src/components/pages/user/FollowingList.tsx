import { VFC, memo, useContext, useState, useEffect } from "react";
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
import { AuthContext } from "../../../App";
import { Follow } from "../../../types/follow";
import { useParams } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { User } from "../../../types/user";
import { deleteFollow } from "../../../api/follow";

export const FollowingList: VFC = memo(() => {
  const { currentUser, handleGetCurrentUser } = useContext<any>(AuthContext);
  const [followings, setFollowings] = useState<Follow[]>([]);
  const [user, setUser] = useState<User>();
  const query = useParams();

  const handleGetFollowings = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      setFollowings(res.data.followings);
      setUser(res.data);
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
    handleGetFollowings(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        フォロー中
      </Heading>
      <Wrap>
        {followings?.map((following) => (
          <WrapItem key={following.id}>
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
                >
                  {following?.name}
                </Text>
                <Text textAlign="center">{following?.email}</Text>
                {currentUser.id === user?.id && (
                  <Button
                    bg="teal"
                    color="white"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => handleDeleteFollow(following)}
                  >
                    フォローを外す
                  </Button>
                )}
              </Stack>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
