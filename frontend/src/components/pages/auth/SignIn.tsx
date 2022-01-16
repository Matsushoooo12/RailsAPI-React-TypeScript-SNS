import Cookies from "js-cookie";
import React, { memo, useContext, useState, VFC } from "react";
import { Box, Heading, Input, Center, Button, Stack } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { signIn } from "../../../api/auth";
import { AuthContext } from "../../../App";

export const SignIn: VFC = memo(() => {
  const history = useHistory();

  const { setIsSignedIn, setCurrentUser } = useContext<any>(AuthContext);

  const [value, setValue] = useState({
    id: 0,
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await signIn(value);

      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        history.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box width="100%" height="100%" p="40px">
      <Center
        width="360px"
        height="360px"
        p="16px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        textAlign="center"
      >
        <form>
          <Stack spacing={4}>
            <Heading as="h1" textAlign="center" mb="16px" fontSize="24px">
              サインイン
            </Heading>
            <Input
              placeholder="email"
              value={value.email}
              onChange={(e) => handleChange(e)}
              type="email"
              name="email"
            />
            <Input
              placeholder="password"
              value={value.password}
              onChange={(e) => handleChange(e)}
              type="password"
              name="password"
            />
            <Button
              bg="teal"
              color="white"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              サインイン
            </Button>
          </Stack>
        </form>
      </Center>
    </Box>
  );
});
