# Rails API + React(TypeScript)で簡易的な SNS アプリ を作る

- 作業用ディレクトリ作成

```
$ mkdir rails-react-sns
$ cd rails-react-sns
```

- Rails プロジェクト作成

```
$ rails new api --api
$ cd api
$ rm -rf .git
```

- React プロジェクト作成

```
$ cd rails-react-sns
$ npx create-react-app frontend --template typescript
```

- HTTP 通信設定

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

- ポート番号変更

app/config/puma.rb

```
# Rails→3001、React→3000
port ENV.fetch("PORT") { 3001 }
```

- Post モデル作成

```
$ rails g model Post content:text
$ rails db:migrate
```

- posts コントローラー作成

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

- posts ルーティング設定

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

- API 動作確認

- npm パッケージのインストール
- chakra-ui をインストール
- Post の型付け
- API Client を作成
- 全体の UI を設定
  theme.ts
- ChakraProvider 設定
- Header 作成
- HeaderLayout 作成
- post/Home ページ作成
- ルーティング設定
- post/Detail ページ作成
- post/New ページ作成
- post/Edit ページ作成
