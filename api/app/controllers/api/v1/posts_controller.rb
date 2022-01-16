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