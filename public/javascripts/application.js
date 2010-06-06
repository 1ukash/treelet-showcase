
/**
  * Simple tree 
  */
(function($) {

  function _renderRootSpan(id, name) {
    var li = '<li id="' + id + '"><span id="' + id + '" class="ui-tree-root ui-tree-el ui-tree-title">' + name;
    li += '<span class="ui-add"/><span class="ui-delete"/>';
    li += '</span></li>';
    var r = $(li);
    //var s = $(li).children('span.ui-tree-root');
    r.mouseenter(
      function() {
        $(this).find("span.ui-add").show();
        $(this).find("span.ui-delete").show();
    }).mouseleave(
      function() {
        $(this).find("span.ui-add").hide();
        $(this).find("span.ui-delete").hide();
    });
    return r;
  }

  function _buildFromJson(data, container, options) {
    if (data.nodes.length == 0 && data.elements.length == 0) {
      container.append('<ul><li class="ui-nd">no data</li></ul>');
      return;
    }
    var ul = $('<ul class="ui-tree"/>');

    $.each(data.nodes, function(i,val) {
      var v = val.node;
      ul.append(_renderRootSpan(v.id, v.name));
    });

    $.each(data.elements, function(i,val) {
      var v = val.element;
      ul.append('<li id="' + v.id + '"><span id="' + v.id + '" class="ui-tree-leaf ui-tree-el ui-tree-title">' + v.name + '</span></li>');
    });

    container.append(ul);
    var lis = ul.children('li');
    lis.children('span.ui-tree-leaf').click(options.clickLeaf);
    lis.children('span.ui-tree-root').click(function() {_nodeClickHandler(options, $(this).attr('id'), $(this))});
  }

  function _buildFromHtml(container, options) {
    container.addClass('ui-tree');

    container.find('li').each( function() {
      $(this).html('<span class="ui-tree-root ui-tree-el ui-tree-title" id="' + $(this).attr('id')  + '">' + $(this).html() + '</span>');
    });

    container.find('li').children('span').click(function() {_nodeClickHandler(options, $(this).attr('id'), $(this))});
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
    return this.each(function(options) {
      var options = $.extend({
        url: '/main/branch',
        nodeParameterName: 'id',
        beforeOpen: null,
        dataType: 'json',
        openError: function(XMLHttpRequest, textStatus, errorThrown) { alert(textStatus) },
        clickLeaf: function() {alert('leaf! id=' + $(this).attr('id'));}
      }, callerOptions || {});
      _buildFromHtml($(this), options);

   });
  }

})(jQuery);
