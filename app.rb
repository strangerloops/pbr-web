require 'sinatra'
require 'json'
require 'sinatra/cross_origin'
require 'pry'
require_relative 'routing.rb'

class PbrApi < Sinatra::Base
  include Routing
  set :run, true
  set :server, 'webrick'
  set :port, 8888

  register Sinatra::CrossOrigin

  configure do
    enable :cross_origin
  end

  get '/' do
    erb :index
  end

  get '/cities' do
    content_type :json
    ['chi', 'nyc'].to_json
  end

  get '/route' do
    city = params[:city]
    origin = params[:origin]
    destination = params[:destination]
    content_type :json
    if city && origin && destination
      route(origin, destination, city).to_json
    else
      { error: 'you are missing some parameters, my friend.' }.to_json
    end
  end

  run! if app_file == $0
end