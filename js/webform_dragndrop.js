(function ($) {
  /**
   * Webform Drag and Drop.
   */
  Drupal.behaviors.webformDragAndDrop = {
    attach: function (context, settings) {
      var $element = $('.webform-component-dragndrop .form-managed-file');
      var uploadText = Drupal.settings.dndText;

      // Hide the input controls.
      $element.find('input').css({'position' : 'absolute', 'opacity' : '0'});
      $element.find('.form-submit, .file').addClass('element-invisible');

      // Build the droppable area.
      var droppable = '<div class="webform-file-list"></div><div class="field-widget-dragndrop-upload-file"><div class="droppable">\n\
        <div class="droppable-message"><span>' + uploadText + "</span></div></div>";

      // Add the droppable area to our element.
      $element.once().append(droppable);

      var $dropZone = $('.droppable');
      var $inputFile = $element.find('input.form-file');

      if ($element.find('.file').length) {

        // We can only upload one file with a webform file input, so disable the
        // drag and drop element if a file already exists.
        $dropZone.addClass('disabled');

        var $file = $('.webform-component-dragndrop .file a');
        var href = $file.attr('href');
        var filename = $file.html();

        var cvRow = '<li><span class="uploaded-file"><a class="file-view-link" target="_blank" href="' + href + '">' + filename + '</a></span>\n\
          <span class="upload-component"><a class="remove-link webform-file managed-file dnd" href="javascript:void(0);" onclick="removeWebformFile(this)">' + Drupal.t('Remove') + '</a>\n\
          <a class="view-link" target="_blank" href="' + href + '">' + Drupal.t('View File') + '</a></span></li>';

        // Add this file to the list.
        $('.webform-file-list').append(cvRow);

        // It's possible we have duplicate files at this point, so remove them.
        removeDuplicates();
      }

      // Position the input element under the mouse cursor on drag.
      $dropZone.on('dragover', function(e) {
        e.preventDefault();
        var originalEvent = e.originalEvent;

        var x = originalEvent.pageX;
        var y = originalEvent.pageY;

        $inputFile.offset({ top: y - 15, left: x - 100 })
      });

      // Trigger the file upload.
      $inputFile.on('drop', function(e) {
        if ($dropZone.hasClass('disabled')) {
          return false;
        }

        setTimeout(function() {
          $('.webform-component-dragndrop input[value=Upload]').mousedown();
        }, 100);
      });

      // Remove an uploaded File from a webform component.
      removeWebformFile = function(element) {
        var $link = $(element).closest('li');

        var href = $link.find('.file-view-link').attr('href');

        // The target link.
        var $target = $(".webform-component-dragndrop .file a[href='" + href + "']");

        // Remove the file from the field.
        var $submit = $target.closest('.form-managed-file').find('.form-submit[value="Remove"]');
        $submit.mousedown();

        // Remove the file link from the list.
        $link.remove();
      }

      // Common function to remove duplicates from a file list.
      removeDuplicates = function() {
        var duplicates = {};
        $('.file-view-link').each(function() {
          var index = $(this).attr('href');
          if (duplicates[index]) {
            $(this).closest('li').remove();
          }
          else {
            duplicates[index] = true;
          }
        });
      }
    }
  };
}(jQuery));
