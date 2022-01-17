import { VFC, memo, useState } from "react";
import { Box, Button, Flex, Divider, HStack } from "@chakra-ui/react";
import { FollowerList } from "./FollowerList";
import { FollowingList } from "./FollowingList";

type Props = {
  showFollower: boolean;
};

export const Friends: VFC<Props> = memo((props) => {
  const [showFollower, setShowFollower] = useState(props.showFollower);
  return (
    <Box p="40px">
      <Flex justify="center">
        <HStack>
          <Button
            _hover={{ opacity: 0.8 }}
            bg="teal"
            color="white"
            onClick={() => setShowFollower(true)}
          >
            フォロワー
          </Button>
          <Button
            _hover={{ opacity: 0.8 }}
            bg="teal"
            color="white"
            onClick={() => setShowFollower(false)}
          >
            フォロー中
          </Button>
        </HStack>
      </Flex>
      <Divider mt="16px" />
      <Box>{showFollower ? <FollowerList /> : <FollowingList />}</Box>
    </Box>
  );
});
