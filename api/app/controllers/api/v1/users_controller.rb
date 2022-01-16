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
