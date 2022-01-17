import { memo, useCallback, useEffect, useState, VFC } from "react";
import { Box, Heading, Wrap, WrapItem, Center, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { DetailRoom } from "../../../types/dm";
import { getAllRooms } from "../../../api/dm";

export const Rooms: VFC = memo(() => {
  const [rooms, setRooms] = useState<DetailRoom[]>();
  const history = useHistory();

  const onClickDetailRoom = useCallback(
    (id: number) => {
      history.push(`/room/${id}`);
    },
    [history]
  );

  // ルーム一覧API
  const handleGetAllRooms = async () => {
    try {
      const res = await getAllRooms();
      setRooms(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // 最後のメッセージが新しいルーム順
  rooms?.sort(function (a, b) {
    if (a.lastMessage?.id > b.lastMessage?.id) return -1;
    if (a.lastMessage?.id < b.lastMessage?.id) return 1;
    return 0;
  });

  useEffect(() => {
    handleGetAllRooms();
  }, []);

  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        DM一覧
      </Heading>
      <Wrap>
        {rooms?.map((room) => (
          <WrapItem key={room.id}>
            <Center
              width="240px"
              height="240px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
              p="16px"
              onClick={() => onClickDetailRoom(room.id)}
            >
              <Box textAlign="center">
                <Text color="teal" fontWeight="bold" fontSize="24px">
                  {room.otherUser.name}
                </Text>
                <Text>
                  {room.lastMessage === null
                    ? "まだメッセージがありません"
                    : room.lastMessage.content}
                </Text>
              </Box>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
