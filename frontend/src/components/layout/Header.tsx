import { Flex, Heading, Link, Box } from "@chakra-ui/react";
import { VFC, memo, useCallback } from "react";
import { useHistory } from "react-router-dom";

export const Header: VFC = memo(() => {
  const history = useHistory();

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickNewPost = useCallback(() => {
    history.push("/new");
  }, [history]);

  return (
    <>
      <Flex
        as="nav"
        bg="teal.500"
        color="gray.50"
        align="center"
        justify="space-between"
        padding={5}
      >
        <Flex
          align="center"
          as="a"
          mr={8}
          _hover={{ cursor: "pointer" }}
          onClick={onClickHome}
        >
          <Heading as="h1" fontSize="lg">
            SNS APP
          </Heading>
        </Flex>
        <Flex align="center" fontSize="sm">
          <Box pr={4}>
            <Link onClick={onClickNewPost}>新規投稿</Link>
          </Box>
          <Box>
            <Link>プロフィール</Link>
          </Box>
        </Flex>
      </Flex>
    </>
  );
});
