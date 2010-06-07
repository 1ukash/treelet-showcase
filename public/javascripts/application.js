
/**
  * Simple tree 
  */
(function($) {

  function _renderRoot(id, name, options, isBase) {
    var li = $('<li/>').attr('id', id);
    var span = $('<span class="ui-tree-root ui-tree-el ui-tree-title">' + name + '</span>'). attr('id', id);
    var add = $('<span class="ui-add">&nbsp;</span>');
    
    span.append(add);
    if (!isBase) {
      var del = $('<span class="ui-delete">&nbsp;</span>');
      span.append(del);
    }
    
    li.append(span);
    span.mouseenter(
      function() {
        $(this).find("span.ui-add").css('display','inline-block');
        $(this).find("span.ui-delete").css('display', 'inline-block');
    }).mouseleave(
      function() {
        $(this).find("span.ui-add").css('display','none');
        $(this).find("span.ui-delete").css('display', 'none');
    });
    return li;
  }

  function _renderLeaf(id, name) {
    var li = $('<li/>').attr('id', id);
    var span = $('<span class="ui-tree-leaf ui-tree-el ui-tree-title">' + name + '</span>'). attr('id', id);
    li.append(span);
    return li;
  }

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

  function _buildFromHtml(container, options, isBase) {
    container.addClass('ui-tree');

    container.find('li').each( function() {
      var add = '<span class="ui-add">&nbsp;</span>';
      var del = isBase ? '' : '<span class="ui-delete" >&nbsp;</span>';
      $(this).html('<span class="ui-tree-root ui-tree-el ui-tree-title" id="' + $(this).attr('id')  + '">' + $(this).html() + add + del + '</span>');
    });
    var span = container.find('li').children('span');
    span.mouseenter(
      function() {
        $(this).find("span.ui-add").css('display','inline-block');
        $(this).find("span.ui-delete").css('display', 'inline-block');
    }).mouseleave(
      function() {
        $(this).find("span.ui-add").css('display','none');
        $(this).find("span.ui-delete").css('display', 'none');
    });
   span.click(function() {_nodeClickHandler(options, $(this).attr('id'), $(this))});
  }

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
      //load children data VIA ajax;
      $.ajax({
        url: options.url,
        beforeSend: options.beforeOpen,
        error: options.openError,
        dataType: options.dataType,
        data: (options.nodeParameterName + '=' + pid),
        success: function(data) {
          if (options.dataType = 'json') {
            _buildFromJson(data, container, options);
          } else {
            alert('data type not implemented');
          }
        }
      });
    }
  }

  $.fn.tree = function(callerOptions) {
    return this.each(function(callerOptions) {
      var options = $.extend({
        url: '/main/branch',
        nodeParameterName: 'id',
        beforeOpen: null,
        dataType: 'json',
        openError: function(XMLHttpRequest, textStatus, errorThrown) { alert(textStatus) },
        clickLeaf: function() {alert('leaf! id=' + $(this).attr('id'));},
        treeObject: null
      }, callerOptions || {});
      if (options.treeObject == null) { //building from <ul> components
        _buildFromHtml($(this), options, true);
      } else { //build from JS object
        _buildFromJson(options.treeObject, $(this), options);      
      }
   });
  }

})(jQuery);
