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
