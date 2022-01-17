Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 投稿
      resources :posts do
        member do
            resources :likes, only: ["create"]
        end
      end
      resources :likes, only: ["destroy"]
      # ユーザー
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
      # フォロー機能
      resources :relationships, only: [:index, :destroy]
      # ログイン
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }
      namespace :auth do
        resources :sessions, only: %i[index]
      end
    end
  end
end