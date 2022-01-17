import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import { SignIn } from "./components/pages/auth/SignIn";
import { SignUp } from "./components/pages/auth/SignUp";
import { Room } from "./components/pages/dm/Room";
import { Rooms } from "./components/pages/dm/Rooms";

import { Detail } from "./components/pages/post/Detail";
import { Edit } from "./components/pages/post/Edit";
import { Home } from "./components/pages/post/Home";
import { New } from "./components/pages/post/New";
import { Friends } from "./components/pages/user/Friends";
import { Profile } from "./components/pages/user/Profile";
import { HeaderLayout } from "./components/templates/HeaderLayout";
import theme from "./theme/theme";
import { User } from "./types/user";

export const AuthContext = createContext({});

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>();

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();

      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        console.log(res.data.data);
      } else {
        console.log("no current user");
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  const Private = ({ children }: any) => {
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        return <Redirect to="/signin" />;
      }
    } else {
      return <></>;
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <AuthContext.Provider
        value={{
          loading,
          setLoading,
          isSignedIn,
          setIsSignedIn,
          currentUser,
          setCurrentUser,
          handleGetCurrentUser,
        }}
      >
        <BrowserRouter>
          <Switch>
            <HeaderLayout>
              <Route exact path="/signup">
                <SignUp />
              </Route>
              <Route exact path="/signin">
                <SignIn />
              </Route>
              <Private>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/new">
                  <New />
                </Route>
                <Route exact path="/rooms">
                  <Rooms />
                </Route>
                <Route path="/post/:id">
                  <Detail />
                </Route>
                <Route path="/edit/:id">
                  <Edit />
                </Route>
                <Route path="/user/:id">
                  <Profile />
                </Route>
                <Route path="/follower/:id">
                  <Friends showFollower={true} />
                </Route>
                <Route path="/following/:id">
                  <Friends showFollower={false} />
                </Route>
                <Route path="/room/:id">
                  <Room />
                </Route>
              </Private>
            </HeaderLayout>
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default App;
