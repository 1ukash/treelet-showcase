class MainController < ApplicationController
  def index
    @roots = Node.find(:all, :conditions => "parent is NULL", :order => "name asc")
  end

  def branch
    respond_to do |wants|
      wants.json {
        @nodes = Node.find_all_by_parent(params[:id]);
        @elems = Element.find_all_by_parent(params[:id]);
        render :json => {"nodes" => @nodes, "elements" => @elems}.to_json
      }
    end
  end
end
