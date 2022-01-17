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