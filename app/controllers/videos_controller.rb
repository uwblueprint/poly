require 'csv'

class VideosController < ApplicationController
  def index
  	video_data = load_data
  	@videos = video_data[0..4]
  end

  def show
    @video = get_by_id(params[:id])
    render 'video'
  end

  private
  def load_data
  	data = []
	  filename = 'archive/resources/video_data.csv'
    CSV.foreach(filename, :headers => true) do |row|
	    data << row.to_hash
    end
	  data
  end

  def get_by_id(id)
    # The quotes in "IDv2" below don't come from the keyboard - they are
    # unicode quotation marks. Typing a double quote in their place
    # will not work!
    line = load_data.find { |row| row["﻿IDv2"] == id }
    line
    # filename = 'archive/resources/video_data.csv'
    # CSV.find(filename, :headers => true)
    # contents = File.read(filename)
    # parsed_contents = CSV.parse(contents, :headers => true)
    # row = parsed_contents.find { |line| line['IDv2'] == 'Dr.KarelOliva_20160330_ces+eng+bul+ita+deu+rus' }
    # if row
    #   row.to_hash
    # end
    # row
  end
end
