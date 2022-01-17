class Api::V1::Auth::SessionsController < ApplicationController
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
end