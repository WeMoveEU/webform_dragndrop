<?php
/**
 * @file
 * Common functions for the webform_dragndrop module.
 */

/**
 * Attaches JS after a webform is built if the dragndrop component is present.
 *
 * @param $form
 *   A form array.
 *
 * @param $form_state
 *   The form state.
 *
 * @return array
 *   The form array.
 */
function webform_dragndrop_attach_js($form, $form_state) {
  foreach($form['#node']->webform['components'] as $component) {
    if ($component['type'] == 'dragndrop') {
      $upload_text = variable_get('webform_dragndrop_upload_text', 'or drag and drop a file here');

      $js_setting = array(
        'dndText' => $upload_text,
      );

      drupal_add_js($js_setting, 'setting');
      break;
    }
  }
  return $form;
}
