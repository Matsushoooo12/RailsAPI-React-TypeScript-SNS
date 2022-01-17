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