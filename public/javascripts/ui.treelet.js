
/**
  * Treelet jquery plugin.
  * @author lukash (http://github.com/1ukash)
  * Plugin available under GPL v3 license
  */
(function($) {

  /**
   * Renders node li element for tree
   */
  function _renderRoot(id, name, options, isBase) {
    var li = $('<li/>');
    var span = $('<span class="ui-tree-root ui-tree-el ui-tree-title">' + name + '</span>'). attr('id', id);
    var add = $('<span class="ui-add">&nbsp;</span>');
    
    span.append(add);
    if (!isBase) {
      var del = $('<span class="ui-delete">&nbsp;</span>');
      span.append(del);
    }
    li.append(span);
    _appendAddDelEvents(span, options);
    return li;
  }

  /**
   * Appends event handlers for add/remove nodes components
   */
  function _appendAddDelEvents(cont, options) {
    cont.mouseenter(
      function() {
        $(this).find("span.ui-add").css('display','inline-block');
        $(this).find("span.ui-delete").css('display', 'inline-block');
    }).mouseleave(
      function() {
        $(this).find("span.ui-add").css('display','none');
        $(this).find("span.ui-delete").css('display', 'none');
    });
    cont.children("span.ui-add").click(function() {options.addNodeHandler($(this).parent().attr('id'));});
    cont.children("span.ui-delete").click(function() {options.removeNodeHandler($(this).parent().attr('id'));});
  }

  /**
   * Renders leaf li element
   */
  function _renderLeaf(id, name) {
    var li = $('<li/>');
    var span = $('<span class="ui-tree-leaf ui-tree-el ui-tree-title">' + name + '</span>').attr('id', id);
    li.append(span);
    return li;
  }

  /*
   * Builds tree brach or root tree from json data
   * parameter data contains two collections data.nodes and data.elements.
   * Nodes are implemented as folders and elements are implemented as tree leafs.
   */
  function _buildFromJson(data, container, options, isBase) {
    if (data.nodes.length == 0 && data.elements.length == 0) {
      container.append('<ul><li class="ui-nd">no data</li></ul>');
      return;
    }
    var ul = $('<ul class="ui-tree"/>');

    $.each(data.nodes, function(i,val) {
      var v = val.node;
      ul.append(_renderRoot(v.id, v.name, options, isBase));
    });

    $.each(data.elements, function(i,val) {
      var v = val.element;
      ul.append(_renderLeaf(v.id, v.name));
    });

    container.append(ul);
    var lis = ul.children('li');
    lis.children('span.ui-tree-leaf').click(options.clickLeaf);
    lis.children('span.ui-tree-root').click(function() {_nodeClickHandler(options, $(this).attr('id'), $(this))});
  }

  /**
   * Builds folder nodes from <ul> list. All <li> elements becomes folders
   * TODO: implement rendering leafs for li elements with special class i.e. 'leaf'
   */
  function _buildFromHtml(container, options, isBase) {
    container.addClass('ui-tree');
    container.find('li').each( function() {
      var add = '<span class="ui-add">&nbsp;</span>';
      var del = isBase ? '' : '<span class="ui-delete" >&nbsp;</span>';
      $(this).html('<span class="ui-tree-root ui-tree-el ui-tree-title" id="' + $(this).attr('id')  + '">' + $(this).html() + add + del + '</span>');
    });
    container.find('li').removeAttr('id');
    var span = container.find('li').children('span');
    _appendAddDelEvents(span, options);
    span.click(function() {_nodeClickHandler(options, $(this).attr('id'), $(this))});
  }

  /**
   * Handler for node. Performc loading node children via ajax if 
   * it doesn't already loaded
   */
  function _nodeClickHandler(options, pid, el) {
    var container = el.parent();
    var child = container.children('ul');
    if (child.size() > 0) {
      if (child.is(':hidden')) {
        child.show();
        el.addClass('ui-tree-root-expanded').removeClass('ui-tree-root');
      } else {
        child.hide();
        el.addClass('ui-tree-root').removeClass('ui-tree-root-expanded');
      }
    } else {
      el.addClass('ui-tree-root-expanded').removeClass('ui-tree-root');
      $.ajax({
        url: options.url,
        beforeSend: options.beforeOpen,
        error: options.openError,
        dataType: options.dataType,
        data: (options.nodeParameterName + '=' + pid),
        success: function(data) {
          if (options.dataType = 'json') {
            _buildFromJson(data, container, options);
            if (options.openingFinished) {
              options.openingFinished(pid);
            }
          } else {
            alert('data type not implemented');
          }
        }
      });
    }
  }

  /**
   * Plugin method for tree rendering. You can invoke $(selector).tree(options)
   * If options.treeObject is null then tree will be rendered from 'ul' list (selector must points on ul).
   * Otherwise tree will be rendered from options.treeObject JS object and placed in the selector's node(s);
   */
  $.fn.tree = function(callerOptions) {
    var options = $.extend({
      url: '/main/branch',
      nodeParameterName: 'id',
      beforeOpen: null,
      dataType: 'json',
      openError: function(XMLHttpRequest, textStatus, errorThrown) { alert(textStatus) },
      clickLeaf: function() {alert('Default handler for leaf click. id=' + $(this).attr('id'));},
      addNodeHandler: function(id) {alert('Default handler for adding node in node with id=' + id)},
      removeNodeHandler: function(id) {alert('Default handler for removing node with id=' + id)},
      openingFinished: null,
      treeObject: null
    }, callerOptions || {});
    return this.each(function() {
      if (options.treeObject == null) { //building from <ul> components
        _buildFromHtml($(this), options, true);
      } else { //build from JS object
        _buildFromJson(options.treeObject, $(this), options);      
      }
   });
  }

})(jQuery);
