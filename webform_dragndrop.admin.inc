<?php
/**
 * @file
 * Webform dragndrop config.
 */

/**
 * Webform dragndrop settings form.
 */
function webform_dragndrop_settings($form, $form_state) {
  $form['webform_dragndrop_upload_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Drag and drop upload text'),
    '#description' => t('The text displayed within the drag and drop element.'),
    '#default_value' => variable_get('webform_drag_and_drop_upload_text', 'or drag and drop a file here'),
  );

  return system_settings_form($form);
}
