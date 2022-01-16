import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Detail } from "./components/pages/post/Detail";
import { Edit } from "./components/pages/post/Edit";
import { Home } from "./components/pages/post/Home";
import { New } from "./components/pages/post/New";
import { HeaderLayout } from "./components/templates/HeaderLayout";
import theme from "./theme/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <HeaderLayout>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/new">
              <New />
            </Route>
            <Route path="/post/:id">
              <Detail />
            </Route>
            <Route path="/edit/:id">
              <Edit />
            </Route>
          </HeaderLayout>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
