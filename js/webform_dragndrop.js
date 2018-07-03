/**
 * @file
 * JS for the webform dragndrop component.
 */

(function ($) {
  'use strict';

  /**
   * Webform Drag and Drop.
   */
  Drupal.behaviors.webformDragAndDrop = {
    attach: function (context, settings) {
      var $element = $('.webform-component-dragndrop .form-managed-file');
      var uploadText = Drupal.settings.dndText;
      var removeBtnValue = Drupal.settings.removeText;

      // Check for IE here. This method of dragging a file into the input field
      // is incompatible with these browsers, so display the default file input
      // field.
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      var trident = ua.indexOf('Trident/');

      if (msie > 0 || trident > 0) {
        return false;
      }

      // Hide the input controls.
      $element.find('input').css({position: 'absolute', opacity: '0'});
      $element.find('.form-submit, .file').addClass('element-invisible');

      // Build the droppable area.
      var droppable = '<div class="webform-file-list"><ul></ul></div><div class="field-widget-dragndrop-upload-file"><div class="droppable">';
      droppable += '<div class="droppable-message"><span>' + uploadText + '</span></div></div></div>';

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

        var cvRow = '<li><span class="uploaded-file">';
        cvRow += '<a class="file-view-link" target="_blank" title="' + filename + '" href="' + href + '"><img src="' + href + '"/></a></span>';
        cvRow += '<span class="upload-component"><a class="remove-link webform-file managed-file dnd" href="javascript:void(0);">' + Drupal.t('Remove') + '</a>';
        cvRow += '<a class="view-link" target="_blank" href="' + href + '">' + Drupal.t('View File') + '</a></span></li>';

        // Add this file to the list.
        $('.webform-file-list ul').append(cvRow);

        // It's possible we have duplicate files at this point, so remove them.
        var duplicates = {};
        $('.file-view-link').each(function () {
          var index = $(this).attr('href');
          if (duplicates[index]) {
            $(this).closest('li').remove();
          }
          else {
            duplicates[index] = true;
          }
        });
      }

      // Remove a file on click.
      $('.webform-file-list .remove-link').click(function () {
        var $link = $(this).closest('li');

        var href = $link.find('.file-view-link').attr('href');

        // The target link.
        var $target = $(".webform-component-dragndrop .file a[href='" + href + "']");

        // Remove the file from the field.
        var $submit = $target.closest('.form-managed-file').find('.form-submit[value="'+removeBtnValue+'"]');
        $submit.mousedown();

        // Remove the file link from the list.
        $link.remove();
      });

      // Position the input element under the mouse cursor on drag.
      $dropZone.on('dragover', function (e) {
        e.preventDefault();
        var originalEvent = e.originalEvent;

        var x = originalEvent.pageX;
        var y = originalEvent.pageY;

        $inputFile.offset({top: y - 15, left: x - 100});
      });

      // Launch the file browser if a user clicks inside the droppable area.
      $dropZone.once().on('click', function () {
        $(this).closest('.form-managed-file').find('input[type=file]').click();
      });

      // Prevent file upload if the element is disabled.
      $inputFile.on('drop', function () {
        if ($dropZone.hasClass('disabled')) {
          return false;
        }
      });

      // When a file has been added, upload it.
      $('.webform-component-dragndrop input.form-file').on('change', function(event) {
        setTimeout(function () {
          // Gather the changed file upload parent.
          var $parent = $(event.target).parents('.form-item');

          if ($parent.find('.error').length) {
            // If an error exists the file will no longer be present, so don't
            // attempt to upload.
            return false;
          }
          else {
            $('.webform-component-dragndrop input[type=Submit], .webform-component-dragndrop button[type=Submit]').mousedown();
          }
        }, 100);
      });
    }
  };
}(jQuery));
