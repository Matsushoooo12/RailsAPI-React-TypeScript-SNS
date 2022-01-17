import { VFC, memo, useState } from "react";
import { Box, Button, Flex, Divider } from "@chakra-ui/react";
import { FollowerList } from "./FollowerList";
import { FollowingList } from "./FollowingList";

type Props = {
  showFollower: boolean;
};

export const Friends: VFC<Props> = memo((props) => {
  const [showFollower, setShowFollower] = useState(props.showFollower);
  return (
    <Box>
      <Flex>
        <Button onClick={() => setShowFollower(true)}>フォロワー</Button>
        <Button onClick={() => setShowFollower(false)}>フォロー中</Button>
      </Flex>
      <Divider></Divider>
      <Box>{showFollower ? <FollowerList /> : <FollowingList />}</Box>
    </Box>
  );
});
