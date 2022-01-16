import Cookies from "js-cookie";
import { Box, Heading, Input, Center, Button, Stack } from "@chakra-ui/react";
import React, { memo, useContext, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { signUp } from "../../../api/auth";
import { AuthContext } from "../../../App";

export const SignUp: VFC = memo(() => {
  const history = useHistory();
  const { setIsSignedIn, setCurrentUser } = useContext<any>(AuthContext);

  const [value, setValue] = useState({
    id: 0,
    email: "",
    password: "",
    passwordConfirmation: "",
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
      const res = await signUp(value);
      console.log(res);

      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        history.push("/");
        console.log("signed in successfully");
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
              サインアップ
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
            <Input
              placeholder="passwordConfirmation"
              value={value.passwordConfirmation}
              onChange={(e) => handleChange(e)}
              type="password"
              name="passwordConfirmation"
            />
            <Button
              bg="teal"
              color="white"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              サインアップ
            </Button>
          </Stack>
        </form>
      </Center>
    </Box>
  );
});
