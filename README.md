# Rails API + React(TypeScript)で簡易的な SNS アプリ を作る

## 作業用ディレクトリ作成

```
$ mkdir rails-react-sns
$ cd rails-react-sns
```

## Rails プロジェクト作成

```
$ rails new api --api
$ cd api
$ rm -rf .git
```

## React プロジェクト作成

```
$ cd rails-react-sns
$ npx create-react-app frontend --template typescript
```

## HTTP 通信設定

```
$ cd api
```

Gemfile

```
gem 'rack-cors'
```

```
$ bundle install
```

app/config/initializer/cors.rb

```
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Front(React)側は3000ポートで繋ぐのでoriginsは3000を許可します
    origins 'localhost:3000'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## ポート番号変更

app/config/puma.rb

```
# Rails→3001、React→3000
port ENV.fetch("PORT") { 3001 }
```

## Post モデル作成

```
$ rails g model Post content:text
$ rails db:migrate
```

## posts コントローラー作成

```
$ rails g controller api/v1/posts
```

app/controllers/api/v1/posts_controller.rb

```
class Api::V1::PostsController < ApplicationController
    def index
        posts = Post.all.order(created_at: :desc)
        render json: posts
    end

    def show
        post = Post.find(params[:id])
        render json: post
    end

    def create
        post = Post.new(post_params)
        if post.save
            render json: post
        else
            render json: post.errors, status: 422
        end
    end

    def update
        post = Post.find(params[:id])
        if post.update(post_params)
            render json: post
        else
            render json: post.errors, status: 422
        end
    end

    def destroy
        post = Post.find(params[:id])
        post.destroy
        render json: post
    end

    private
    def post_params
        params.require(:post).permit(:content)
    end
end
```

## posts ルーティング設定

config/routes.rb

```
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts
    end
  end
end
```

## API 動作確認

## npm パッケージのインストール

```
$ cd frontend
```

```
$ npm i axios axios-case-converter @types/axios react-router-dom@5.2.0 @types/react-router-dom
```

## chakra-ui をインストール

```
$ npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^5
```

- Post の型付け

```
$ mkdir src/types
$ touch src/types/post.ts
```

src/types/post.ts

```
export type Post = {
  // idはループでkeyを指定するため
  id: number;
  content: string;
};
```

## API Client を作成

```
$ mkdir src/api
$ touch src/api/client.ts
$ touch src/api/post.ts
```

src/api/client.ts

```
import applyCaseMiddleware from "axios-case-converter";
import axios from "axios";

const options = {
  ignoreHeaders: true,
};

const client = applyCaseMiddleware(
  axios.create({
    baseURL: "http://localhost:3001/api/v1",
  }),
  options
);

export default client;
```

src/api/post.ts

```
import { Post } from "../types/post";
import client from "./client";

export const getAllPosts = () => {
  return client.get("/posts");
};

export const getDetailPost = (id: number) => {
  return client.get(`/posts/${id}`);
};

export const createPost = (params: Post) => {
  return client.post("/posts", params);
};

export const updatePost = (id: number, params: Post) => {
  return client.patch(`/posts/${id}`, params);
};

export const deletePost = (id: number) => {
  return client.delete(`/posts/${id}`);
};
```

## 全体の UI を設定

```
$ mkdir src/theme
$ touch src/theme/theme.ts
```

src/theme/theme.ts

```
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "gray.100",
        color: "gray.800",
      },
    },
  },
});

export default theme;
```

## ChakraProvider 設定

src/App.tsx

```
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Switch>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
```

## Header 作成

```
$ mkdir src/components/layout
$ touch src/components/layout/Header.tsx
```

src/components/layout/Header.tsx

```
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
```

## HeaderLayout 作成

```
$ mkdir src/components/templates
$ touch src/components/templates/HeaderLayout.tsx
```

src/components/templates/HeaderLayout.tsx

```
import { memo, ReactNode, VFC } from "react";
import { Header } from "../layout/Header";

type Props = {
  children: ReactNode;
};

export const HeaderLayout: VFC<Props> = memo((props) => {
  const { children } = props;
  return (
    <>
      <Header />
      {children}
    </>
  );
});
```

## post/Home ページ作成

```
$ mkdir src/components/pages/post
$ touch mkdir src/components/pages/post/Home.tsx
```

src/components/pages/post/Home.tsx

```
import { Box, Center, Text, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { VFC, memo, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getAllPosts } from "../../../api/post";
import { Post } from "../../../types/post";

export const Home: VFC = memo(() => {
  const [posts, setPosts] = useState<Post[]>([]);

  const history = useHistory();

  // これから追加
  const onClickDetailPost = useCallback(
    (id) => {
      history.push(`/post/${id}`);
    },
    [history]
  );

  const handleGetAllPosts = async () => {
    try {
      const res = await getAllPosts();
      console.log(res.data);
      setPosts(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetAllPosts();
  }, []);
  return (
    <Box p="40px">
      <Heading as="h1" textAlign="center" mb="16px">
        投稿一覧ページ
      </Heading>
      <Wrap>
        {posts.map((post) => (
          <WrapItem key={post.id}>
            <Center
              // これから追加
              onClick={() => onClickDetailPost(post.id)}
              width="180px"
              height="180px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
            >
              <Text>{post.content}</Text>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
```

ルーティング設定

src/App.tsx

```
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from "./components/pages/post/Home";
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
          </HeaderLayout>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
```

## post/Detail ページ作成

```
$ touch src/components/pages/post/Detail.tsx
```

src/components/pages/post/Detail.tsx

```
import { Button, Box, Heading, Text, Center, Stack } from "@chakra-ui/react";
import { memo, useEffect, useState, VFC } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deletePost, getDetailPost } from "../../../api/post";
import { Post } from "../../../types/post";

export const Detail: VFC = memo(() => {
  const [value, setValue] = useState({
    id: 0,
    content: "",
  });

  const query = useParams();
  const history = useHistory();

  // これから追加
  const onClickEditPost = (id: number) => {
    history.push(`/edit/${id}`);
  };

  const handleGetDetailPost = async (query: any) => {
    try {
      const res = await getDetailPost(query.id);
      console.log(res.data);
      setValue({
        id: res.data.id,
        content: res.data.content,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeletePost = async (item: Post) => {
    console.log("click", item.id);
    try {
      const res = await deletePost(item.id);
      console.log(res.data);
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetDetailPost(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        投稿詳細
      </Heading>
      <Center
        width="180px"
        height="180px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text textAlign="center">{value?.content}</Text>
          <Button
            bg="teal"
            color="white"
            // これから追加
            onClick={() => onClickEditPost(value?.id)}
          >
            編集
          </Button>
          <Button
            bg="teal"
            color="white"
            onClick={() => handleDeletePost(value)}
          >
            削除
          </Button>
        </Stack>
      </Center>
    </Box>
  );
});
```

ルーティング設定

src/App.tsx

```
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Detail } from "./components/pages/post/Detail";
import { Home } from "./components/pages/post/Home";
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
            <Route path="/post/:id">
              <Detail />
            </Route>
          </HeaderLayout>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
```

## post/New ページ作成

```
$ touch src/components/pages/post/New.tsx
```

src/components/pages/post/New.tsx

```
import { Box, Heading, Input, Center, Button, Stack } from "@chakra-ui/react";
import React, { memo, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { createPost } from "../../../api/post";

export const New: VFC = memo(() => {
  const [value, setValue] = useState({
    id: 0,
    content: "",
  });

  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await createPost(value);
      console.log(res.data);
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box width="100%" height="100%" p="40px">
      <Center
        width="240px"
        height="240px"
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
              新規作成
            </Heading>
            <Input
              placeholder="content"
              value={value.content}
              onChange={(e) => handleChange(e)}
              type="text"
              name="content"
            />
            <Button
              bg="teal"
              color="white"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              投稿
            </Button>
          </Stack>
        </form>
      </Center>
    </Box>
  );
});
```

ルーティング設定

src/App.tsx

```
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Detail } from "./components/pages/post/Detail";
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
          </HeaderLayout>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
```

## post/Edit ページ作成

```
$ touch src/components/pages/post/Edit.tsx
```

src/components/pages/post/Edit.tsx

```
import React, { VFC, memo, useState, useEffect } from "react";
import { Box, Heading, Input, Center, Button, Stack } from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";
import { getDetailPost, updatePost } from "../../../api/post";

export const Edit: VFC = memo(() => {
  const [value, setValue] = useState({
    id: 0,
    content: "",
  });

  const query = useParams();
  const history = useHistory();

  const handleGetDetailPost = async (query: any) => {
    try {
      const res = await getDetailPost(query.id);
      console.log(res.data);
      setValue({
        id: res.data.id,
        content: res.data.content,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await updatePost(value.id, value);
      console.log(res.data);
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetDetailPost(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Center
        width="240px"
        height="240px"
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
              投稿編集
            </Heading>
            <Input
              placeholder="content"
              value={value.content}
              onChange={(e) => handleChange(e)}
              type="text"
              name="content"
            />
            <Button
              bg="teal"
              color="white"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              更新
            </Button>
          </Stack>
        </form>
      </Center>
    </Box>
  );
});
```

ルーティング設定

src/App.tsx

```
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
```
