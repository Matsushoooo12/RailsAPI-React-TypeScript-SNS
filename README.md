# Rails API + React(TypeScript)で簡易的な SNS アプリ を作る

まとめた記事はこちら

https://zenn.dev/shogo_matsumoto/articles/971a1f9e50bd67

## ER 図

<img width="836" alt="スクリーンショット 2022-02-13 15 06 56" src="https://user-images.githubusercontent.com/66903388/153749316-c7cb7aa1-60e4-4e23-86e7-3a3562db9af7.png">

## アプリイメージ

- 今回のアプリではスタイルに`chakra-ui`を用いました。

### サインアップページ

- サインアップページでは`名前、メールアドレス、パスワード、パスワード確認`の４つのフォームを用意しました。

- ログイン機能は`devise-token-auth`というRailsのgemを使ってトークンを渡すようにしています。

![](https://storage.googleapis.com/zenn-user-upload/1d71f0a6d3d9-20220120.png)

### サインインページ

- サインインページでは`メールアドレス、パスワード`の２つのフォームを用意しました。

![](https://storage.googleapis.com/zenn-user-upload/305f6680b43b-20220120.png)

### 新規投稿ページ

- 新規投稿ページでは一つの投稿フォームを作りました。

![](https://storage.googleapis.com/zenn-user-upload/06146fe34841-20220120.png)


### 投稿一覧ページ

- 投稿一覧ページでは、投稿の内容を目立たせ、その下に投稿をしたユーザー名とユーザーのメールアドレスを表示しました。

- 投稿テキストをクリックすることで投稿詳細に遷移され、ユーザー名やユーザーのメールアドレスをクリックすることでそのユーザーのプロフィールページに遷移されます。

- また、投稿の下にあるハートアイコンをクリックすることでいいねをつけたり外したりできるようになります。

![](https://storage.googleapis.com/zenn-user-upload/a0f11919411b-20220120.png)

### 投稿詳細ページ

- 投稿詳細ページでは、投稿一覧ページ同様、投稿の内容を目立たせ、その下に投稿をしたユーザー名とユーザーのメールアドレスを表示しました。

- ユーザー名やユーザーのメールアドレスをクリックすることでそのユーザーのプロフィールページに遷移されます。

- こちらでも、ハートアイコンをクリックするといいねをつけたり外したりできるようになります。

![](https://storage.googleapis.com/zenn-user-upload/1c685a49eaa0-20220120.png)

### 自分のプロフィールページ

- 自分のプロフィールページは自分の投稿に表示されたユーザー名やユーザーのメールアドレスからだけでなく、ヘッダーリンクにある自分のメールアドレスからも遷移することができます。

- フォロー数をクリックするとフォロー中一覧、フォロワー数をクリックするとフォロワー一覧へ遷移します。

![](https://storage.googleapis.com/zenn-user-upload/179f51dc91f2-20220120.png)

### 他人のプロフィールページ

- 投稿に表示されたユーザー名やユーザーのメールアドレスから遷移することができます。

- 自分のプロフィールにはなかった、フォローボタンとDMボタンがあり、フォローボタンは、フォローしていないユーザーだと「フォローをする」、フォローをしているユーザーだと「フォローを外す」というボタンが表示されます。

- DMボタンをクリックすると、そのユーザーとのDMルームに遷移して、DMルームがまだ存在しない場合には作成されます。

![](https://storage.googleapis.com/zenn-user-upload/4c2389e55e28-20220120.png)

### フォロー中一覧

- フォロー中のユーザー一覧が表示されます。
- フォローを外すボタンを押すとその一覧からユーザーが消えます。

![](https://storage.googleapis.com/zenn-user-upload/35348cfb846e-20220120.png)

### フォロワー一覧

- フォロワーのユーザー一覧が表示されます。

![](https://storage.googleapis.com/zenn-user-upload/12e21ba1fa44-20220120.png)

### DM一覧

- 存在するDMルームの一覧が表示されます。
- 最後のメッセージが新しいルームが一番左になるようにソートされています。

- このDM一覧へはヘッダーリンクのDMから遷移することができます。

![](https://storage.googleapis.com/zenn-user-upload/78c7f8eea0c4-20220120.png)

### DM詳細

- DMのルーム内ページです。
- そのルームの相手ユーザーが上に表示されています。

- 相手ユーザーのコメントは左側に表示され、自分のコメントは右側に表示されています。

- メッセージはどんどん上から下に追加されていきます。

- メッセージが多くなり、スクロールする状態になると、デフォルトでスクロール開始位置が一番下になり、過去の履歴を見たい場合は上にスクロールする必要があります。

![](https://storage.googleapis.com/zenn-user-upload/8ebb083d1d99-20220120.png)

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

# 投稿機能作成

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

## Post の型付け

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

# ログイン機能

## devise-token-auth を導入

```
gem 'devise'
gem 'devise_token_auth'
```

```
$ bundle install
```

```
$ rails g devise:install
$ rails g devise_token_auth:install User auth
$ rails db:migrate
```

## devise-token-auth の設定

```
DeviseTokenAuth.setup do |config|
  config.change_headers_on_each_request = false
  config.token_lifespan = 2.weeks
  config.token_cost = Rails.env.test? ? 4 : 10

  config.headers_names = {:'access-token' => 'access-token',
                         :'client' => 'client',
                         :'expiry' => 'expiry',
                         :'uid' => 'uid',
                         :'token-type' => 'token-type' }
end
```

## HTTP 通信設定の修正

./config/initializers/cors.rb

```
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "localhost:3000" # React側はポート番号3000で作るので「localhost:3000」を指定

    resource "*",
      headers: :any,
      expose: ["access-token", "expiry", "token-type", "uid", "client"], # 追記
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## コントローラー作成

```
$ rails g controller api/v1/auth/registrations
$ rails g controller api/v1/auth/sessions
```

./app/controllers/api/v1/auth/registrations_controller.rb

```
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
    private
    def sign_up_params
        params.permit(:email, :password, :password_confirmation)
    end
end
```

./app/controllers/api/v1/auth/sessions_controller.rb

```
class Api::V1::Auth::SessionsController < ApplicationController
    def index
        if current_api_v1_user
            render json: {is_login: true, data: current_api_v1_user }
        else
            render json: {is_login: false, message: "ユーザーが存在しません"}
        end
    end
end
```

./app/controllers/application_controller.rb

```
class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken

  skip_before_action :verify_authenticity_token
  helper_method :current_user, :user_signed_in?
end
```

## ルーティング設定

./app/config/routes.rb

```
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }

      namespace :auth do
        resources :sessions, only: %i[index]
      end
    end
  end
end
```

## 動作確認 →postman

---

**_サインアップ_**

POST `http://localhost:3001/api/v1/auth`

値

```
{
    "email": "example@gmail.com",
    "password": "password"
}
```

<img width="1301" alt="スクリーンショット 2021-09-12 17 19 03" src="https://user-images.githubusercontent.com/66903388/132979343-b2872067-3795-4325-a0c5-2dc3314e92bf.png">

ヘッダー情報には設定した'uid'、'access-token'、'client'情報が含まれています。

<img width="1301" alt="スクリーンショット 2021-09-12 17 24 31" src="https://user-images.githubusercontent.com/66903388/132979483-bf2947d5-04ab-45e9-8ad8-2940718b61c7.png">

**_サインイン_**

POST `http://localhost:3001/api/v1/auth/sign_in`

値

```
{
    "email": "example@gmail.com",
    "password": "password"
}
```

<img width="1301" alt="スクリーンショット 2021-09-12 17 22 01" src="https://user-images.githubusercontent.com/66903388/132979409-2450359b-7e37-4906-8d5c-93828d6c97e5.png">

こちらのヘッダー情報にも設定した'uid'、'access-token'、'client'情報が含まれています。

<img width="1301" alt="スクリーンショット 2021-09-12 17 25 16" src="https://user-images.githubusercontent.com/66903388/132979499-66e94890-57df-470e-be75-a291d71c4203.png">

**_サインアウト_**

DELETE `http://localhost:3001/api/v1/auth/sign_out`

サインアウト API に、サインイン情報に含まれた'uid'、'access-token'、'client'の ID を含めて送ることでサインアウトが完了します。

```
{
    "uid": "shogo@example.com",
    "access-token": "O6naQEOPRlt558FI9oEKXA",
    "client": "ZstUQu3TGkXzCZ4JAsBAGw"
}
```

## ログイン機能のための npm パッケージをインストール

```
$ cd frontend
$ npm i js-cookie @types/js-cookie
```

## Post の型付け

```
$ touch src/types/user.ts
```

src/types/user.ts

```
export type User = {
  id: number;
  email: string;
  password: string;
  passwordConfirmation: string;
};
```

## ログイン用の API 通信関数を定義

```
$ touch src/api/auth.ts
```

src/api/auth.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { User } from "../types/user";
import client from "./client";

// サインアップ
export const signUp = (params: User) => {
  return client.post("/auth", params);
};

// サインイン
export const signIn = (params: Omit<User, "passwordConfirmation">) => {
  return client.post("/auth/sign_in", params);
};

// サインアウト
export const signOut = () => {
  return client.delete("/auth/sign_out", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ログインユーザーの取得
export const getCurrentUser = () => {
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return;

  return client.get("/auth/sessions", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
```

## サインアップコンポーネントとサインインコンポーネントを作成

```
$ mkdir src/components/pages/auth
$ touch src/components/pages/auth/SignUp.jsx
$ touch src/components/pages/auth/SignIn.jsx
```

src/components/pages/auth/SignUp.jsx

```
import { memo, VFC } from "react";

export const SignUp: VFC = memo(() => {
  return <div>サインアップページです</div>;
});
```

src/components/pages/auth/SignIn.jsx

```
import { memo, VFC } from "react";

export const SignIn: VFC = memo(() => {
  return <div>サインインページです</div>;
});
```

## App.jsx でログイン状態によってコンテンツを切り分ける

src/App.tsx

```
import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import { SignIn } from "./components/pages/auth/SignIn";
import { SignUp } from "./components/pages/auth/SignUp";

import { Detail } from "./components/pages/post/Detail";
import { Edit } from "./components/pages/post/Edit";
import { Home } from "./components/pages/post/Home";
import { New } from "./components/pages/post/New";
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
                <Route path="/post/:id">
                  <Detail />
                </Route>
                <Route path="/edit/:id">
                  <Edit />
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
```

## ログイン状態とログアウト状態でのヘッダーを切り分ける

src/components/layout/Header.tsx

```
import { Flex, Heading, Link, Box } from "@chakra-ui/react";
import { VFC, memo, useCallback, useContext, ContextType } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../App";

export const Header: VFC = memo(() => {
  const history = useHistory();

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickNewPost = useCallback(() => {
    history.push("/new");
  }, [history]);
  const onClickSignUp = useCallback(() => {
    history.push("/signup");
  }, [history]);
  const onClickSignIn = useCallback(() => {
    history.push("/signin");
  }, [history]);

  // ログイン状態によってメニュー切り替え
  const { loading, isSignedIn } = useContext<any>(AuthContext);

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickNewPost}>新規投稿</Link>
            </Box>
            <Box mr="24px">
              <Link>DM</Link>
            </Box>
            <Box mr="24px">
              <Link>プロフィール</Link>
            </Box>
            <Box>
              <Link>ログアウト</Link>
            </Box>
          </Flex>
        );
      } else {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickSignUp}>サインアップ</Link>
            </Box>
            <Box>
              <Link onClick={onClickSignIn}>サインイン</Link>
            </Box>
          </Flex>
        );
      }
    } else {
      return <></>;
    }
  };
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
        <AuthButtons />
      </Flex>
    </>
  );
});
```

## サインアップページ作成

src/components/pages/auth/SignUp.tsx

```
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
```

## サインインページ作成

src/components/pages/auth/SignIn.tsx

```
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
```

## ヘッダーにログアウトボタン配置

src/components/layout/Header.tsx

```
import { Flex, Heading, Link, Box } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { VFC, memo, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { signOut } from "../../api/auth";
import { AuthContext } from "../../App";

export const Header: VFC = memo(() => {
  const history = useHistory();

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickNewPost = useCallback(() => {
    history.push("/new");
  }, [history]);
  const onClickSignUp = useCallback(() => {
    history.push("/signup");
  }, [history]);
  const onClickSignIn = useCallback(() => {
    history.push("/signin");
  }, [history]);

  // サインイン情報更新
  const { setIsSignedIn } = useContext<any>(AuthContext);
  // ログアウト関数
  const handleSignOut = async () => {
    try {
      const res = await signOut();

      // eslint-disable-next-line no-cond-assign
      if ((res.data.success = true)) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false);
        history.push("/signin");
        console.log("succeeded in sign out");
      } else {
        console.log("failed in sign out");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // ログイン状態によってメニュー切り替え
  const { loading, isSignedIn } = useContext<any>(AuthContext);

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickNewPost}>新規投稿</Link>
            </Box>
            <Box mr="24px">
              <Link>DM</Link>
            </Box>
            <Box mr="24px">
              <Link>プロフィール</Link>
            </Box>
            <Box>
              <Link onClick={handleSignOut}>ログアウト</Link>
            </Box>
          </Flex>
        );
      } else {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickSignUp}>サインアップ</Link>
            </Box>
            <Box>
              <Link onClick={onClickSignIn}>サインイン</Link>
            </Box>
          </Flex>
        );
      }
    } else {
      return <></>;
    }
  };
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
        <AuthButtons />
      </Flex>
    </>
  );
});
```

# User モデルと Post モデルを 1 対多で関連付け

## posts テーブルに外部キーの user_id を追加する

```
$ cd api
$ rails g migration AddUserIdToPosts
```

db/migrate/日付\_add_columns_to_posts.rb

```
class AddColumnsToPosts < ActiveRecord::Migration[6.1]
  def change
    add_reference :posts, :user, foreign_key: true, after: :content
  end
end
```

```
$ rails db:migrate
```

db/schema.rb

```
create_table "posts", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "user_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
end
```

## アソシエーション設定

app/models/user.rb

```
class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :posts, dependent: :destroy # 追加
end
```

app/models/post.rb

```
class Post < ApplicationRecord
    belongs_to :user # 追加
end
```

## コントローラーの修正

app/controllers/application_controller.rb

```
class ApplicationController < ActionController::Base
        include DeviseTokenAuth::Concerns::SetUserByToken

        skip_before_action :verify_authenticity_token
        helper_method :current_user, :user_signed_in?, :authenticate_user! # 追加
end
```

app/controllers/posts_controller.rb

```
class Api::V1::PostsController < ApplicationController
    before_action :authenticate_api_v1_user!, only: [:create, :update, :destroy] # 追加
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

    def update # 修正
        post = Post.find(params[:id])
        if current_api_v1_user.id == post.user_id
            if post.update(post_params)
                render json: post
            else
                render json: post.errors, status: 422
            end
        else
            render json: {message: 'can not update data'}, status: 422
        end
    end

    def destroy # 修正
        post = Post.find(params[:id])
        if current_api_v1_user.id == post.user_id
            post.destroy
            render json: post
        else
            render json: {message: 'can not delete data'}, status: 422
        end
    end

    private
    def post_params
        params.require(:post).permit(:content).merge(user_id: current_api_v1_user.id) # 追加
    end
end
```

## User コントローラー作成

```
$ rails g controller api/v1/users
```

app/controllers/api/v1/users_controller.rb

```
class Api::V1::UsersController < ApplicationController
    def index
        users = User.all.order(created_at: :desc)
        render json: users
    end

    def show
        user = User.find_by(id: params[:id])
        render json: user
    end

    def update
        user = User.find_by(id: params[:id])
        if user.id == current_api_v1_user.id
            if user.update(user_params)
                render json: user
            else
                render json: user.errors, status: 422
            end
        else
            render json: {message: 'can not update data'}, status: 422
        end
    end

    private
    def user_params
        params.permit(:name)
    end
end
```

users テーブルの name カラムをデータ格納に追加

app/controllers/api/v1/auth/registrations_controller.rb

```
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
    private
    def sign_up_params
        params.permit(:name, :email, :password, :password_confirmation)
    end
end
```

## ルーティング設定

config/routes.rb

```
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts
      resources :users # 追加
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }

      namespace :auth do
        resources :sessions, only: %i[index]
      end
    end
  end
end
```

## データベース情報をリセット

```
$ rails db:migrate:reset
```

## ポストマンで API を確認

まずはユーザーをサインアップする

Create a post

http://localhost:3001/api/v1/posts

Headers 情報に、`access-token, client, uid`情報を追加して send を押す

これで成功して、user_id がレスポンスに入っていれば成功

## User の型を編集

src/types/user.ts

```
export type User = {
  id: number;
  // 追加
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};
```

## user の APIClient を作成

```
$ cd frontend
$ touch src/api/user.ts
```

src/api/user.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { User } from "../types/user";
import client from "./client";

export const getDetailUser = (id: number) => {
  return client.get(`/users/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const updateUser = (id: number, params: Pick<User, "name">) => {
  return client.patch(`/users/${id}`, params, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
```

## post の APIClient を修正

src/api/post.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { Post } from "../types/post";
import client from "./client";

export const getAllPosts = () => {
  return client.get("/posts");
};

export const getDetailPost = (id: number) => {
  return client.get(`/posts/${id}`);
};

export const createPost = (params: Post) => {
  return client.post("/posts", params, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const updatePost = (id: number, params: Post) => {
  return client.patch(`/posts/${id}`, params, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const deletePost = (id: number) => {
  return client.delete(`/posts/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

```

## サイン情報の API を編集

src/api/auth.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { User } from "../types/user";
import client from "./client";

// サインアップ
export const signUp = (params: User) => {
  return client.post("/auth", params);
};

// サインイン
// 追加
export const signIn = (params: Omit<User, "passwordConfirmation" | "name">) => {
  return client.post("/auth/sign_in", params);
};

// サインアウト
export const signOut = () => {
  return client.delete("/auth/sign_out", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ログインユーザーの取得
export const getCurrentUser = () => {
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return;

  return client.get("/auth/sessions", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
```

## サインアップページを編集

src/components/pages/auth/SignUp.tsx

```
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
    // 追加
    name: "",
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
            // ここから追加
            <Input
              placeholder="name"
              value={value.name}
              onChange={(e) => handleChange(e)}
              type="text"
              name="name"
            />
            // ここまで追加
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
```

## ログイン → 投稿確認

## Profile コンポーネント作成

```
$ mkdir src/components/pages/user
$ touch src/components/pages/user/Profile.tsx
```

src/components/pages/user/Profile.tsx

```
import { useEffect, useState, VFC } from "react";
import { Box, Heading, Text, Center, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getDetailUser } from "../../../api/user";

export const Profile: VFC = () => {
  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
  });

  const query = useParams();

  const handleGetDetailUser = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      console.log(res.data);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetDetailUser(query);
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
          <Text textAlign="center">{user?.name}</Text>
          <Text textAlign="center">{user?.email}</Text>
        </Stack>
      </Center>
    </Box>
  );
};
```

## Profile コンポーネントのルーティング設定

src/App.tsx

```
import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import { SignIn } from "./components/pages/auth/SignIn";
import { SignUp } from "./components/pages/auth/SignUp";

import { Detail } from "./components/pages/post/Detail";
import { Edit } from "./components/pages/post/Edit";
import { Home } from "./components/pages/post/Home";
import { New } from "./components/pages/post/New";
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
                <Route path="/post/:id">
                  <Detail />
                </Route>
                <Route path="/edit/:id">
                  <Edit />
                </Route>
                // 追加
                <Route path="/user/:id">
                  <Profile />
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
```

## ヘッダーのプロフィールリンクを設定

src/components/layout/Header.tsx

```
import { Flex, Heading, Link, Box } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { VFC, memo, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { signOut } from "../../api/auth";
import { AuthContext } from "../../App";

export const Header: VFC = memo(() => {
  const history = useHistory();
  // 追加
  const { loading, isSignedIn, currentUser } = useContext<any>(AuthContext);

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickNewPost = useCallback(() => {
    history.push("/new");
  }, [history]);
  const onClickSignUp = useCallback(() => {
    history.push("/signup");
  }, [history]);
  const onClickSignIn = useCallback(() => {
    history.push("/signin");
  }, [history]);
  // 追加
  const onClickProfile = () => {
    history.push(`/user/${currentUser.id}`);
  };

  // サインイン情報更新
  const { setIsSignedIn } = useContext<any>(AuthContext);
  // ログアウト関数
  const handleSignOut = async () => {
    try {
      const res = await signOut();

      // eslint-disable-next-line no-cond-assign
      if ((res.data.success = true)) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false);
        history.push("/signin");
        console.log("succeeded in sign out");
      } else {
        console.log("failed in sign out");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // ログイン状態によってメニュー切り替え

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickNewPost}>新規投稿</Link>
            </Box>
            <Box mr="24px">
              <Link>DM</Link>
            </Box>
            <Box mr="24px">
              // 追加
              <Link onClick={onClickProfile}>プロフィール</Link>
            </Box>
            <Box>
              <Link onClick={handleSignOut}>ログアウト</Link>
            </Box>
          </Flex>
        );
      } else {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickSignUp}>サインアップ</Link>
            </Box>
            <Box>
              <Link onClick={onClickSignIn}>サインイン</Link>
            </Box>
          </Flex>
        );
      }
    } else {
      return <></>;
    }
  };
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
        <AuthButtons />
      </Flex>
    </>
  );
});
```

# 投稿にユーザーを表示する

# posts コントローラー修正

```
$ cd api
```

app/controllers/api/v1/posts_controller.rb

```
class Api::V1::PostsController < ApplicationController
    before_action :authenticate_api_v1_user!, only: [:create, :update, :destroy]
    def index
        posts = Post.all.order(created_at: :desc)
        posts_array = posts.map do |post|
            {
                id: post.id,
                content: post.content,
                user: User.find_by(id: post.user_id)
            }
        end
        render json: posts_array
    end

    def show
        post = Post.find(params[:id])
        post_list = {
            id: post.id,
            content: post.content,
            user: post.user
        }
        render json: post_list
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
        if current_api_v1_user.id == post.user_id
            if post.update(post_params)
                render json: post
            else
                render json: post.errors, status: 422
            end
        else
            render json: {message: 'can not update data'}, status: 422
        end
    end

    def destroy
        post = Post.find(params[:id])
        if current_api_v1_user.id == post.user_id
            post.destroy
            render json: post
        else
            render json: {message: 'can not delete data'}, status: 422
        end
    end

    private
    def post_params
        params.require(:post).permit(:content).merge(user_id: current_api_v1_user.id)
    end
end
```

## post の型付けを修正

src/types/post.ts

```
export type Post = {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};
```

## post API 設定修正

src/api/post.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { Post } from "../types/post";
import client from "./client";

export const getAllPosts = () => {
  return client.get("/posts");
};

export const getDetailPost = (id: number) => {
  return client.get(`/posts/${id}`);
};

// 修正
export const createPost = (params: Pick<Post, "content">) => {
  return client.post("/posts", params, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const updatePost = (id: number, params: Post) => {
  return client.patch(`/posts/${id}`, params, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const deletePost = (id: number) => {
  return client.delete(`/posts/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
```

## それぞれのコンポーネントを修正

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
              onClick={() => onClickDetailPost(post.id)}
              width="240px"
              height="240px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
            >
              <Box textAlign="center">
                <Text>{post.content}</Text>
                // 追加
                <Text>{post.user.name}</Text>
                // 追加
                <Text>{post.user.email}</Text>
              </Box>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
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
    // 追加
    user: {
      id: 0,
      name: "",
      email: "",
    },
  });

  const query = useParams();
  const history = useHistory();

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
        // 追加
        user: {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
        },
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
        width="240px"
        height="240px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text textAlign="center">{value?.content}</Text>
          // 追加
          <Text textAlign="center">{value?.user.name}</Text>
          // 追加
          <Text textAlign="center">{value?.user.email}</Text>
          <Button
            bg="teal"
            color="white"
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

src/components/pages/post/New.tsx

```
import { Box, Heading, Input, Center, Button, Stack } from "@chakra-ui/react";
import React, { memo, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { createPost } from "../../../api/post";

export const New: VFC = memo(() => {
  const [value, setValue] = useState({
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

# いいね機能作成

## Like モデル作成

```
$ cd api
$ rails g model Like user:references post:references
```

db/migrate/日付\_create_like.rb

```
class CreateMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :messages do |t|
      t.references :user
      t.references :post
      t.timestamps
    end
  end
end
```

```
$ rails db:migrate
```

## Like アソシエーション追加

model/user.rb

```
# 追加
has_many :likes
```

model/post.rb

```
# 追加
has_many :likes
```

model/like.rb

```
belongs_to :user
belongs_to :post
```

## likes コントローラー作成

```
$ rails g controller api/v1/likes
```

controllers/api/v1/likes

```
class Api::V1::LikesController < ApplicationController
    before_action :authenticate_api_v1_user!, only: ['create']

    def create
        like = Like.new(post_id: params[:id], user_id: current_api_v1_user.id)

        if like.save
            render json: like
        else
            render json: like.errors, status: 422
        end
    end

    def destroy
        like = Like.find_by(user_id: current_api_v1_user.id, post_id: params[:id])
        if like.destroy
            render json: like
        else
            render json: like.errors, status: 422
        end
    end
end
```

## like ルーティング設定

```
# 追加
resources :posts do
    member do
        resources :likes, only: ["create"]
    end
end
resources :likes, only: ["destroy"]
```

ルーティング確認

```
$ rails routes | grep likes

api_v1_likes POST   /api/v1/posts/:id/likes(.:format)    api/v1/likes#create
api_v1_like DELETE  /api/v1/likes/:id(.:format)   api/v1/likes#destroy
```

## Postman でテスト

サインイン情報に含まれる以下の情報を likes のエンドポイント API に入れる

- access-token
- client
- uid

いいね作成

http://localhost:3001/api/v1/posts/1/likes

ヘッダー情報にログイン情報で得た`access-token, client, uid`を入れて send ボタンを押す

成功したら以下のような response が返ってくる

```
{
    "id": 2,
    "user_id": 3,
    "post_id": 2,
    "created_at": "2021-12-15T17:54:00.684Z",
    "updated_at": "2021-12-15T17:54:00.684Z"
}
```

いいね削除

http://localhost:3001/api/v1/likes/1

ヘッダー情報にログイン情報で得た`access-token, client, uid`を入れて send ボタンを押す

成功したら以下のような response が返ってくる

```
{
    "id": 1,
    "user_id": 3,
    "post_id": 1,
    "created_at": "2021-12-15T18:22:09.657Z",
    "updated_at": "2021-12-15T18:22:09.657Z"
}
```

## API エンドポイント作成

```
$ cd frontend
$ touch src/api/like.ts
```

src/api/like.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import client from "./client";

export const createLike = (id: number) => {
  return client.post(
    `/posts/${id}/likes`,
    {},
    {
      headers: <any>{
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    }
  );
};

export const deleteLike = (id: number) => {
  return client.delete(`/likes/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
```

## Like の型付け

```
$ touch src/types/like.ts
```

src/types/like.ts

```
export type Like = {
  id: number;
  userId: number;
  postId: number;
};
```

## いいね機能の API 関数作成

src/components/pages/post/Detail.tsx

```
import { Button, Box, Heading, Text, Center, Stack } from "@chakra-ui/react";
import { memo, useContext, useEffect, useState, VFC } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createLike, deleteLike } from "../../../api/like";
import { deletePost, getDetailPost } from "../../../api/post";
import { AuthContext } from "../../../App";
import { Like } from "../../../types/like";
import { Post } from "../../../types/post";

export const Detail: VFC = memo(() => {
  const { currentUser } = useContext<any>(AuthContext);
  const [value, setValue] = useState({
    id: 0,
    content: "",
    user: {
      id: 0,
      name: "",
      email: "",
    },
  });

  const [likes, setLikes] = useState<Like[]>();

  const query = useParams();
  const history = useHistory();

  const onClickEditPost = (id: number) => {
    history.push(`/edit/${id}`);
  };

  // 投稿詳細API
  const handleGetDetailPost = async (query: any) => {
    try {
      const res = await getDetailPost(query.id);
      console.log(res.data);
      setValue({
        id: res.data.id,
        content: res.data.content,
        user: {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
        },
      });
      setLikes(res.data.likes);
    } catch (e) {
      console.log(e);
    }
  };

  // 投稿削除API
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

  // いいね作成API
  const handleCreateLike = async (item: Post) => {
    try {
      const res = await createLike(item.id);
      console.log(res.data);
      handleGetDetailPost(query);
    } catch (e) {
      console.log(e);
    }
  };

  // いいね削除API
  const handleDeleteLike = async (item: Post) => {
    try {
      const res = await deleteLike(item.id);
      console.log(res.data);
      handleGetDetailPost(query);
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
        width="240px"
        height="240px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text textAlign="center">{value?.content}</Text>
          {likes?.find((like) => like.userId === currentUser.id) ? (
            <Text textAlign="center" onClick={() => handleDeleteLike(value)}>
              ♡{likes?.length}
            </Text>
          ) : (
            <Text textAlign="center" onClick={() => handleCreateLike(value)}>
              ♡{likes?.length}
            </Text>
          )}
          <Text textAlign="center">{value?.user.name}</Text>
          <Text textAlign="center">{value?.user.email}</Text>
          <Button
            bg="teal"
            color="white"
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

src/components/pages/post/Home.tsx

```
import { Box, Center, Text, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { VFC, memo, useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { createLike, deleteLike } from "../../../api/like";
import { getAllPosts } from "../../../api/post";
import { AuthContext } from "../../../App";
import { Post } from "../../../types/post";

export const Home: VFC = memo(() => {
  const [posts, setPosts] = useState<Post[]>([]);

  const { currentUser } = useContext<any>(AuthContext);

  const history = useHistory();

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

  // いいね作成API
  const handleCreateLike = async (item: Post) => {
    try {
      const res = await createLike(item.id);
      console.log(res.data);
      handleGetAllPosts();
    } catch (e) {
      console.log(e);
    }
  };

  // いいね削除API
  const handleDeleteLike = async (item: Post) => {
    try {
      const res = await deleteLike(item.id);
      console.log(res.data);
      handleGetAllPosts();
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
              width="240px"
              height="240px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
            >
              <Box textAlign="center">
                <Text
                  color="teal"
                  fontWeight="bold"
                  fontSize="24px"
                  onClick={() => onClickDetailPost(post.id)}
                >
                  {post.content}
                </Text>
                {post.likes?.find((like) => like.userId === currentUser.id) ? (
                  <Text onClick={() => handleDeleteLike(post)}>
                    ♡{post.likes?.length}
                  </Text>
                ) : (
                  <Text onClick={() => handleCreateLike(post)}>
                    ♡{post.likes?.length}
                  </Text>
                )}
                <Text>{post.user.name}</Text>
                <Text>{post.user.email}</Text>
              </Box>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
```

# フォロー機能作成

## フォロー機能作成

作成手順

1. Relationship モデルを作る
2. Relationship のマイグレーションファイルを編集&実行
3. user モデルと Relationship モデルにアソシエーションを書く
4. relationships コントローラで API を作成
5. ルーティング設定
6. フロントエンドで API 設定
7. 表示実装

### 1. Relationship モデルを作る

user テーブル同士で「多対多」の関係を作ります。

何故ならフォロワーもまた user だからです。イメージとしては user テーブル同士を relationships という中間テーブルでアソシエーションを組むイメージ

```
$ rails g model Relationship
```

### 2. Relationship のマイグレーションファイルを編集&実行

db/migrate/年月日時\_create_relationships.rb

```
class CreateRelationships < ActiveRecord::Migration[5.0]
  def change
    create_table :relationships do |t|
      t.references :user, foreign_key: true
      t.references :follow, foreign_key: { to_table: :users }

      t.timestamps

      t.index [:user_id, :follow_id], unique: true
    end
  end
end
```

```
$ rails db:migrate
```

### 3. user モデルと Relationship モデルにアソシエーションを書く

app/models/relationship.rb

```
class Relationship < ApplicationRecord
  belongs_to :user
  belongs_to :follow, class_name: 'User'

  validates :user_id, presence: true
  validates :follow_id, presence: true
end
```

class_name: ‘User’ と補足設定することで、Follow クラスという存在しないクラスを参照することを防ぎ、User クラスであることを明示しています。

app/models/user.rb

```
class User < ApplicationRecord
  has_many :relationships
  has_many :followings, through: :relationships, source: :follow
  has_many :reverse_of_relationships, class_name: 'Relationship', foreign_key: 'follow_id'
  has_many :followers, through: :reverse_of_relationships, source: :user
end
```

- foregin_key = 入口
- source = 出口
- through: :relationships は「中間テーブルは relationships だよ」って設定してあげてるだけ
- user.followings と打つだけで、user が中間テーブル relationships を取得し、その 1 つ 1 つの relationship の follow_id から、「フォローしている User 達」を取得

### 4. relationships コントローラで API を作成

```
$ rails g controller api/v1/relationships
```

app/controllers/api/v1/relationships_controller.rb

```
class Api::V1::RelationshipsController < ApplicationController

    def index
        relationships = Relationship.all.order(created_at: :desc)
        render json: relationships
    end

    def create
        relationship = Relationship.new(follow_id: params[:id], user_id: current_api_v1_user.id)
        if relationship.save
            render json: relationship
        else
            render json: relationship.errors, status: 422
        end
    end

    def destroy
        relationship = Relationship.find_by(follow_id: params[:id], user_id: current_api_v1_user.id)
        if relationship.destroy
            render json: relationship
        else
            render json: relationship.errors, status: 422
        end
    end
end
```

## ユーザー情報のコントローラーを修正

app/controllers/api/v1/users_controller.rb

```
# 修正
def show
    user = User.find_by(id: params[:id])
    user_list = {
        id: user.id,
        name: user.name,
        email: user.email,
        followings: user.followings,
        followers: user.followers,
    }
    render json: user_list
end
```

app/controllers/api/v1/auth/sessisions_controller.rb

```
# 修正
def index
    current_user = {
        id: current_api_v1_user.id,
        name: current_api_v1_user.name,
        email: current_api_v1_user.email,
        followings: current_api_v1_user.followings,
        followers: current_api_v1_user.followers,
    }
    if current_api_v1_user
        render json: {is_login: true, data: current_user }
    else
        render json: {is_login: false, message: "ユーザーが存在しません"}
    end
end
```

### 5. ルーティング設定

config/routes.rb

```
# 追加
resources :relationships, only: [:index, :destroy]
# 編集＆追加
resources :users do
  member do
    resources :relationships, only: [:create]
  end
end
```

## フォロー機能 API エンドポイント設定

```
$ cd frontend
$ touch src/api/follow.ts
```

src/api/follow.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import client from "./client";

export const createFollow = (id: number) => {
  return client.post(
    `/users/${id}/relationships`,
    {},
    {
      headers: <any>{
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    }
  );
};

export const deleteFollow = (id: number) => {
  return client.delete(`/relationships/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
```

## Follow の型付け

```
$ touch src/types/follow.ts
```

src/types/follow.ts

```
export type Follow = {
  id: number;
  name: string;
  email: string;
};
```

src/types/user.ts

```
import { Follow } from "./follow";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  // 追加
  followings: Follow[];
  followers: Follow[];
};
```

## Follow 機能の表示実装

src/components/pages/user/Profile.tsx

```
import { useContext, useEffect, useState, VFC, memo } from "react";
import { Box, Heading, Text, Center, Stack, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { createFollow, deleteFollow } from "../../../api/follow";
import { AuthContext } from "../../../App";
import { Follow } from "../../../types/follow";

export const Profile: VFC = memo(() => {
  // 追加
  const { handleGetCurrentUser, currentUser } = useContext<any>(AuthContext);

  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
    // 追加
    followings: [],
    followers: [],
  });

  const query = useParams();

  const handleGetDetailUser = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      console.log(res.data);
      setUser({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        // 追加
        followings: res.data.followings,
        followers: res.data.followers,
      });
      //   setFollowings(res.data.followings);
    } catch (e) {
      console.log(e);
    }
  };

  // 追加
  // フォロー機能API
  const handleCreateFollow = async (id: number) => {
    try {
      await createFollow(id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteFollow = async (id: number) => {
    try {
      await deleteFollow(id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetDetailUser(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        プロフィール
      </Heading>
      <Center
        width="240px"
        height="240px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text
            textAlign="center"
            color="teal"
            fontWeight="bold"
            fontSize="24px"
          >
            {user?.name}
          </Text>
          <Text textAlign="center">{user?.email}</Text>
          // 追加
          {user?.id === currentUser.id ? (
            <Text textAlign="center">現在のユーザーです</Text>
          ) : (
            <>
              {currentUser.followings?.find(
                (following: Follow) => user?.id === following.id
              ) ? (
                <Button
                  _hover={{ opacity: 0.8 }}
                  bg="teal"
                  color="white"
                  onClick={() => handleDeleteFollow(user?.id)}
                >
                  フォローを外す
                </Button>
              ) : (
                <Button
                  _hover={{ opacity: 0.8 }}
                  bg="teal"
                  color="white"
                  onClick={() => handleCreateFollow(user?.id)}
                >
                  フォローをする
                </Button>
              )}
            </>
          )}
        </Stack>
      </Center>
    </Box>
  );
});
```

## フォロー・フォロワー一覧ページ作成

```
$ touch src/components/pages/user/Friends.tsx
$ touch src/components/pages/user/FollowingList.tsx
$ touch src/components/pages/user/FollowerList.tsx
```

src/components/pages/user/Friends.tsx

```
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
```

src/components/pages/user/FollowingList.tsx

```
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
```

src/components/pages/user/FollowerList.tsx

```
import { VFC, memo, useState, useContext, useEffect } from "react";
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
import { Follow } from "../../../types/follow";
import { AuthContext } from "../../../App";
import { User } from "../../../types/user";
import { useParams } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { createFollow, deleteFollow } from "../../../api/follow";

export const FollowerList: VFC = memo(() => {
  const { currentUser, handleGetCurrentUser } = useContext<any>(AuthContext);
  const [followers, setFollowers] = useState<Follow[]>();
  const [user, setUser] = useState<User>();
  const query = useParams();

  const handleGetFollowers = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      setFollowers(res.data.followers);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // フォロー機能関数
  const handleCreateFollow = async (item: any) => {
    try {
      await createFollow(item.id);
      handleGetCurrentUser();
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
    handleGetFollowers(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        フォロワー
      </Heading>
      <Wrap>
        {followers?.map((follower) => (
          <WrapItem key={follower.id}>
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
                  {follower?.name}
                </Text>
                <Text textAlign="center">{follower?.email}</Text>
                {currentUser.id === user?.id && (
                  <>
                    {currentUser.followings?.find(
                      (follow: any) => follow.id === follower.id
                    ) ? (
                      <Button
                        bg="teal"
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => handleDeleteFollow(follower)}
                      >
                        フォローを外す
                      </Button>
                    ) : (
                      <Button
                        bg="teal"
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => handleCreateFollow(follower)}
                      >
                        フォローをする
                      </Button>
                    )}
                  </>
                )}
              </Stack>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});
```

## フォローページ一覧のルーティング

src/App.tsx

```
import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import { SignIn } from "./components/pages/auth/SignIn";
import { SignUp } from "./components/pages/auth/SignUp";

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
                <Route path="/post/:id">
                  <Detail />
                </Route>
                <Route path="/edit/:id">
                  <Edit />
                </Route>
                <Route path="/user/:id">
                  <Profile />
                </Route>
                // 追加
                <Route path="/follower/:id">
                  <Friends showFollower={true} />
                </Route>
                <Route path="/following/:id">
                  <Friends showFollower={false} />
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
```

# DM 機能

## Room モデル作成

```
$ cd api
$ rails g model Room
```

db/migrate/日付\_create_rooms.rb

```
class CreateRooms < ActiveRecord::Migration[6.1]
  def change
    create_table :rooms do |t|

      t.timestamps
    end
  end
end
```

```
$ rails db:migrate
```

## Entry モデル作成

```
$ rails g model Entry user:references room:references
```

db/migrate/日付\_create_entries.rb

```
class CreateEntries < ActiveRecord::Migration[6.1]
  def change
    create_table :entries do |t|
      t.references :user, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true

      t.timestamps
    end
  end
end
```

```
$ rails db:migrate
```

## Message モデル作成

```
$ rails g model Message user:references room:references content:text
```

db/migrate/日付\_create_messages.rb

```
class CreateMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :messages do |t|
      t.references :user, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true
      t.text :content

      t.timestamps
    end
  end
end
```

```
$ rails db:migrate
```

## アソシエーション設定

models/room.rb

```
class Room < ApplicationRecord
    has_many :messages, dependent: :destroy
    has_many :entries, dependent: :destroy
    has_many :users, through: :entries
end
```

models/user.rb

```
# 追加
has_many :messages, dependent: :destroy
has_many :entries, dependent: :destroy
has_many :rooms, through: :entries
```

models/entry.rb

```
class Entry < ApplicationRecord
  belongs_to :user
  belongs_to :room
end
```

models/message.rb

```
belongs_to :user
belongs_to :room
```

## コントローラー作成

```
$ touch app/controllers/api/v1/rooms
$ touch app/controllers/api/v1/messages
```

api/v1/rooms_controller.rb

```
class Api::V1::RoomsController < ApplicationController
    before_action :authenticate_api_v1_user!

    def index
        rooms = current_api_v1_user.rooms.order(created_at: :desc)
        rooms_array = rooms.map do |room|
            {
                id: room.id,
                current_user: room.users.where(id: current_api_v1_user.id)[0],
                other_user: room.users.where.not(id: current_api_v1_user.id)[0],
                last_message: room.messages[-1]
            }
        end
        render json: rooms_array
    end

    def create
        isRoom = false
        my_entry = Entry.where(user_id: current_api_v1_user.id)
        other_entry = Entry.where(user_id: params[:id])
        my_entry.each do |me|
            other_entry.each do |oe|
                if me.room_id == oe.room_id
                    isRoom = true
                end
            end
        end
        if isRoom
            my_entry = Entry.where(user_id: current_api_v1_user.id)
            other_entry = Entry.where(user_id: params[:id])
            my_entry.each do |me|
                other_entry.each do |oe|
                    if me.room_id == oe.room_id
                        room = Room.find_by(id: me.room_id)
                        render json: room
                    end
                end
            end
        else
            room = Room.create
            Entry.create(room_id: room.id, user_id: current_api_v1_user.id)
            Entry.create(room_id: room.id, user_id: params[:id])
            room = Room.find_by(id: room.id)
            render json: room
        end
    end

    def show
        room = Room.find_by(id: params[:id])
        other_user = room.users.where.not(id: current_api_v1_user.id)[0]
        messages = room.messages.order(created_at: :asc)

        render json: { other_user: other_user, messages: messages }
    end
end
```

api/v1/messages_controller.rb

```
class Api::V1::MessagesController < ApplicationController
    before_action :authenticate_api_v1_user!

    def create
        message = Message.new(user_id: current_api_v1_user.id, room_id: params[:id], content: params[:content])

        if message.save
            render json: message
        else
            render json: message.errors, status: 422
        end
    end
end
```

## ルーティング設定

config/routes.rb

```
# 修正
resources :users do
    member do
        resources :relationships, only: [:create]
        resources :rooms, only: %i[create]
    end
end
# DM機能
resources :rooms, only: %i[show index] do
    member do
        resources :messages, only: %i[create]
    end
end
```

## DM 型付け

```
$ cd frontend
$ touch src/types/dm.ts
```

```
import { User } from "./user";

export type DetailRoom = {
  id: number;
  currentUser: User;
  otherUser: User;
  lastMessage: Message[];
};

export type Message = {
  id: number;
  content: string;
};
```

## DM 機能 API エンドポイント

src/api/dm.ts

```
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { Message } from "../types/dm";
import client from "./client";

// ルーム作成
export const createRoom = (id: number) => {
  return client.post(
    `/users/${id}/rooms`,
    {},
    {
      headers: <any>{
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    }
  );
};

// ルーム一覧
export const getAllRooms = () => {
  return client.get("/rooms", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ルーム詳細
export const getDetailRoom = (id: number) => {
  return client.get(`/rooms/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// メッセージ作成
export const createMessage = (id: number, params: Message) => {
  return client.post(`/rooms/${id}/messages`, params, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
```

## DM コンポーネント作成

```
$ mkdir src/components/pages/dm
$ touch src/components/pages/dm/Room.tsx
$ touch src/components/pages/dm/Rooms.tsx
```

src/components/pages/dm/Room.tsx

```
import React, { memo, useEffect, useRef, useState, VFC } from "react";
import { Box, Heading, Text, Flex, Input, Button } from "@chakra-ui/react";
import { Message } from "../../../types/dm";
import { useParams } from "react-router-dom";
import { createMessage, getDetailRoom } from "../../../api/dm";
import { User } from "../../../types/user";

export const Room: VFC = memo(() => {
  const [otherUser, setOtherUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>();
  const [content, setContent] = useState<string>("");

  // スクロール位置指定
  const messageBox = useRef(null);

  const query = useParams();

  const handleGetDetailRoom = async (query: any) => {
    try {
      const res = await getDetailRoom(query.id);
      console.log(res.data);
      setOtherUser(res.data.otherUser);
      setMessages(res.data.messages);
      //   if (messageBox.current) {
      //     messageBox.current.scrollTop = messageBox.current.scrollHeight + 16;
      //   }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (
    query: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const res = await createMessage(query.id, { content: content });
      console.log(res.data);
      handleGetDetailRoom(query);
    } catch (e) {
      console.log(e);
    }
    setContent("");
  };

  useEffect(() => {
    handleGetDetailRoom(query);
  }, [query]);

  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        DM詳細
      </Heading>
      <Box
        textAlign="center"
        mx="auto"
        width="500px"
        height="100%"
        p="16px"
        bg="white"
        mb="16px"
        borderRadius="md"
        shadow="md"
      >
        <Text color="teal" fontSize="24px" fontWeight="bold">
          {otherUser?.name}
        </Text>
        <Text>{otherUser?.email}</Text>
      </Box>
      <Box
        width="500px"
        height="500px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        overflow="scroll"
        ref={messageBox}
      >
        {messages?.map((message) => (
          <Box key={message.id} p="16px">
            <Flex
              justify={
                message.userId === otherUser?.id ? "flex-start" : "flex-end"
              }
            >
              <Text color={message.userId === otherUser?.id ? "teal" : "red"}>
                {`${
                  message.userId === otherUser?.id ? otherUser?.name : "自分"
                }:${message.content}`}
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>
      <Box width="500px" mx="auto" bg="teal" p="16px">
        <form>
          <Flex>
            <Input
              bg="white"
              placeholder="content"
              type="text"
              name="content"
              id="content"
              color="gray.800"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              type="submit"
              bg="teal"
              color="white"
              onClick={(e) => handleSubmit(query, e)}
            >
              送信
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
});
```

touch src/components/pages/dm/Rooms.tsx

```
import React, { memo, useEffect, useRef, useState, VFC } from "react";
import { Box, Heading, Text, Flex, Input, Button } from "@chakra-ui/react";
import { Message } from "../../../types/dm";
import { useParams } from "react-router-dom";
import { createMessage, getDetailRoom } from "../../../api/dm";
import { User } from "../../../types/user";

export const Room: VFC = memo(() => {
  const [otherUser, setOtherUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>();
  const [content, setContent] = useState<string>("");

  // スクロール位置指定
  const messageBox = useRef<HTMLDivElement>(null);

  const query = useParams();

  const handleGetDetailRoom = async (query: any) => {
    try {
      const res = await getDetailRoom(query.id);
      console.log(res.data);
      setOtherUser(res.data.otherUser);
      setMessages(res.data.messages);
      if (messageBox.current) {
        messageBox.current.scrollTop = messageBox.current.scrollHeight + 16;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (
    query: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const res = await createMessage(query.id, { content: content });
      console.log(res.data);
      handleGetDetailRoom(query);
    } catch (e) {
      console.log(e);
    }
    setContent("");
  };

  useEffect(() => {
    handleGetDetailRoom(query);
  }, [query]);

  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        DM詳細
      </Heading>
      <Box
        textAlign="center"
        mx="auto"
        width="500px"
        height="100%"
        p="16px"
        bg="white"
        mb="16px"
        borderRadius="md"
        shadow="md"
      >
        <Text color="teal" fontSize="24px" fontWeight="bold">
          {otherUser?.name}
        </Text>
        <Text>{otherUser?.email}</Text>
      </Box>
      <Box
        width="500px"
        height="500px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        overflow="scroll"
        ref={messageBox}
      >
        {messages?.map((message) => (
          <Box key={message.id} p="16px">
            <Flex
              justify={
                message.userId === otherUser?.id ? "flex-start" : "flex-end"
              }
            >
              <Text color={message.userId === otherUser?.id ? "teal" : "red"}>
                {`${
                  message.userId === otherUser?.id ? otherUser?.name : "自分"
                }:${message.content}`}
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>
      <Box width="500px" mx="auto" bg="teal" p="16px">
        <form>
          <Flex>
            <Input
              bg="white"
              placeholder="content"
              type="text"
              name="content"
              id="content"
              color="gray.800"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              type="submit"
              bg="teal"
              color="white"
              onClick={(e) => handleSubmit(query, e)}
            >
              送信
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
});
```

## DM リンク指定

src/components/layout/Header.tsx

```
import { Flex, Heading, Link, Box } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { VFC, memo, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { signOut } from "../../api/auth";
import { AuthContext } from "../../App";

export const Header: VFC = memo(() => {
  const history = useHistory();
  const { loading, isSignedIn, currentUser } = useContext<any>(AuthContext);

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickNewPost = useCallback(() => {
    history.push("/new");
  }, [history]);
  const onClickSignUp = useCallback(() => {
    history.push("/signup");
  }, [history]);
  const onClickSignIn = useCallback(() => {
    history.push("/signin");
  }, [history]);
  const onClickProfile = useCallback(() => {
    history.push(`/user/${currentUser.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  // 追加
  const onClickRooms = () => {
    history.push("/rooms");
  };

  // サインイン情報更新
  const { setIsSignedIn } = useContext<any>(AuthContext);
  // ログアウト関数
  const handleSignOut = async () => {
    try {
      const res = await signOut();

      // eslint-disable-next-line no-cond-assign
      if ((res.data.success = true)) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false);
        history.push("/signin");
        console.log("succeeded in sign out");
      } else {
        console.log("failed in sign out");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // ログイン状態によってメニュー切り替え

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickNewPost}>新規投稿</Link>
            </Box>
            <Box mr="24px">
              // 修正
              <Link onClick={onClickRooms}>DM</Link>
            </Box>
            <Box mr="24px">
              <Link onClick={onClickProfile}>{currentUser.email}</Link>
            </Box>
            <Box>
              <Link onClick={handleSignOut}>ログアウト</Link>
            </Box>
          </Flex>
        );
      } else {
        return (
          <Flex align="center" fontSize="sm">
            <Box mr="24px">
              <Link onClick={onClickSignUp}>サインアップ</Link>
            </Box>
            <Box>
              <Link onClick={onClickSignIn}>サインイン</Link>
            </Box>
          </Flex>
        );
      }
    } else {
      return <></>;
    }
  };
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
        <AuthButtons />
      </Flex>
    </>
  );
});
```

## DM コンポーネント ルーティング指定

src/App.tsx

```
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
                // 追加
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
                // 追加
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
```

src/components/components/pages/user/Profile.tsx

```
import { useContext, useEffect, useState, VFC, memo } from "react";
import { Box, Heading, Text, Center, Stack, Button } from "@chakra-ui/react";
import { useParams, Link, useHistory } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { createFollow, deleteFollow } from "../../../api/follow";
import { AuthContext } from "../../../App";
import { Follow } from "../../../types/follow";
import { createRoom } from "../../../api/dm";

export const Profile: VFC = memo(() => {
  const { handleGetCurrentUser, currentUser } = useContext<any>(AuthContext);

  const history = useHistory();
  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
    followings: [],
    followers: [],
  });

  const query = useParams();

  const handleGetDetailUser = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      console.log(res.data);
      setUser({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        followings: res.data.followings,
        followers: res.data.followers,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // フォロー機能API
  const handleCreateFollow = async (id: number) => {
    try {
      await createFollow(id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteFollow = async (id: number) => {
    try {
      await deleteFollow(id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  // 追加
  // ルーム機能API
  const handleCreateRoom = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    e.preventDefault();
    try {
      const res = await createRoom(id);
      console.log(res);
      history.push(`/room/${res.data.id}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetDetailUser(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        プロフィール
      </Heading>
      <Center
        width="240px"
        height="240px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text
            textAlign="center"
            color="teal"
            fontWeight="bold"
            fontSize="24px"
          >
            {user?.name}
          </Text>
          <Text textAlign="center">{user?.email}</Text>
          {user?.id === currentUser.id ? (
            <Text textAlign="center">現在のユーザーです</Text>
          ) : (
            <>
              {currentUser.followings?.find(
                (following: Follow) => user?.id === following.id
              ) ? (
                <Button
                  _hover={{ opacity: 0.8 }}
                  bg="teal"
                  color="white"
                  onClick={() => handleDeleteFollow(user?.id)}
                >
                  フォローを外す
                </Button>
              ) : (
                <Button
                  _hover={{ opacity: 0.8 }}
                  bg="teal"
                  color="white"
                  onClick={() => handleCreateFollow(user?.id)}
                >
                  フォローをする
                </Button>
              )}
              // 追加
              <Button
                _hover={{ opacity: 0.8 }}
                bg="teal"
                color="white"
                onClick={(e) => handleCreateRoom(e, user.id)}
              >
                DM
              </Button>
            </>
          )}
          <p>
            <Link to={`/following/${user.id}`}>
              フォロー数{user.followings?.length}
            </Link>
            <Link to={`/follower/${user.id}`}>
              フォロワー数{user.followers?.length}
            </Link>
          </p>
        </Stack>
      </Center>
    </Box>
  );
});
```

## フォロー一覧のユーザー詳細遷移リンクを配置

src/components/pages/user/FollowerList.tsx

```
import { VFC, memo, useState, useContext, useEffect } from "react";
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
import { Follow } from "../../../types/follow";
import { AuthContext } from "../../../App";
import { User } from "../../../types/user";
import { useParams, useHistory } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { createFollow, deleteFollow } from "../../../api/follow";

export const FollowerList: VFC = memo(() => {
  const { currentUser, handleGetCurrentUser } = useContext<any>(AuthContext);
  const [followers, setFollowers] = useState<Follow[]>();
  const [user, setUser] = useState<User>();
  const query = useParams();
  // 追加
  const history = useHistory();
  // 追加
  const onClickDetailUser = (id: number) => {
    history.push(`/user/${id}`);
  };

  const handleGetFollowers = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      setFollowers(res.data.followers);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // フォロー機能関数
  const handleCreateFollow = async (item: any) => {
    try {
      await createFollow(item.id);
      handleGetCurrentUser();
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
    handleGetFollowers(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        フォロワー
      </Heading>
      <Wrap>
        {followers?.map((follower) => (
          <WrapItem key={follower.id}>
            <Center
              width="240px"
              height="240px"
              bg="white"
              borderRadius="md"
              shadow="md"
              cursor="pointer"
              p="16px"
              // 追加
              onClick={() => onClickDetailUser(follower.id)}
            >
              <Stack width="100%">
                <Text
                  textAlign="center"
                  color="teal"
                  fontWeight="bold"
                  fontSize="24px"
                >
                  {follower?.name}
                </Text>
                <Text textAlign="center">{follower?.email}</Text>
                {currentUser.id === user?.id && (
                  <>
                    {currentUser.followings?.find(
                      (follow: any) => follow.id === follower.id
                    ) ? (
                      <Button
                        bg="teal"
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => handleDeleteFollow(follower)}
                      >
                        フォローを外す
                      </Button>
                    ) : (
                      <Button
                        bg="teal"
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => handleCreateFollow(follower)}
                      >
                        フォローをする
                      </Button>
                    )}
                  </>
                )}
              </Stack>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
});

```

src/components/pages/user/FollowingList.tsx

```
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
import { useHistory, useParams } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { User } from "../../../types/user";
import { deleteFollow } from "../../../api/follow";

export const FollowingList: VFC = memo(() => {
  const { currentUser, handleGetCurrentUser } = useContext<any>(AuthContext);
  const [followings, setFollowings] = useState<Follow[]>([]);
  const [user, setUser] = useState<User>();
  const query = useParams();
  // 追加
  const history = useHistory();
  // 追加
  const onClickDetailUser = (id: number) => {
    history.push(`/user/${id}`);
  };

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
              // 追加
              onClick={() => onClickDetailUser(following.id)}
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
```
