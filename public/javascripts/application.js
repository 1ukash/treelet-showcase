/* 
 * FUNCTIONs for tree example application 
 * Author lukash (http://github.com/1ukash)
 */

function showDeleteDialog(id) {
  $("#delete-dialog-confirm").dialog({
    resizable: false,
	height:300,
	modal: true,
    buttons: {
  	  Delete: function() {
	    $(this).dialog('destroy');
        deleteNode(id);
	  },
	  Cancel: function() {
	    $(this).dialog('destroy');
      }
    }
  });

}

function showAddDialog(id) {
  $("#add-dialog-confirm").dialog({
    resizable: false,
	height:300,
	modal: true,
    buttons: {
  	  Add: function() {
        var name = $.trim($('#folder-name').val());
        if (name.length > 0) {
          $(this).dialog('destroy');
          addNode(id, name);
        } else {
          $('#alert-name').show();
        }
	  },
	  Cancel: function() {
	    $(this).dialog('destroy');
      }
    }
  });

}


function deleteNode(id) {
  $.ajax({
    url: '/main/delete',
    beforeSend: function() { $('#loader').show(); },
    data: ('id=' + id),
    error: function() { $('#loader').hide();alert('error deleting node with id=' + id); },
    success: function(data) {
      $('#loader').hide();
      var ul = $('#' + id).parent().parent();
      $('#' + id).parent().remove();
      if(ul.children('li').size() == 0) {
        ul.remove();
      }
    }
  });
}

function addNode(id, name) {
  $('#alert-name').hide();
  $.ajax({
    url: '/main/add',
    beforeSend: function() { $('#loader').show(); },
    data: ({parent: id, name: name}),
    error: function() { $('#loader').hide();alert('error adding node to parent with id=' + id); },
    success: function(data) {
      $('#loader').hide();
      $('#' + id).children().remove();
    }
  });
}
