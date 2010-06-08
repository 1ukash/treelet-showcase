class MainController < ApplicationController
  def index
    @roots = Node.find(:all, :conditions => "parent is NULL", :order => "name asc")
  end

  def branch
    respond_to do |wants|
      wants.json {
        render :json => nodes_and_elements(params[:id]).to_json
      }
    end
  end

  def add
    respond_to do |wants|
      wants.json {
        n = Node.create(:parent => params[:parent], :name => params[:name])
        render :json => nodes_and_elements(params[:parent]).to_json
      }
    end;
  end

  def delete
    Node.delete(params[:id])
    Node.delete_all(:parent => params[:id])
    Element.delete_all(:parent => params[:id])
    render :nothing => true
  end

  private

  def nodes_and_elements(id)
    nodes = Node.find_all_by_parent(id, :order => 'name asc');
    elems = Element.find_all_by_parent(id, :order => 'name asc');
    return {"nodes" => nodes, "elements" => elems}
  end
end
