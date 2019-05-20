/*****************************************************************************
* This file implements the modal used to select a photo from Flickr albums,
*  the modal is used in Froala component (WYSIWYG HTML Editor)
*  in the news section
******************************************************************************/
$(function() {
    $.FroalaEditor.DefineIcon('camaraFlickr', { NAME: 'file-picture-o' });
    $.FroalaEditor.RegisterCommand('camaraFlickr', {
      title: 'Fotos do Flickr',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
         var htmlElement = null;
         var useScope = null;
         var fnOpenSelectFlickrPhoto = null;

         htmlElement = this.$oel;
         if (!htmlElement) {
            return;
         }
         useScope = htmlElement.attr('fn-open-select-flickr-photo');
         if (!useScope) {
            return;
         }
         fnOpenSelectFlickrPhoto = _.get(htmlElement.scope(), useScope);
         if(!fnOpenSelectFlickrPhoto) {
            return;
         }
         fnOpenSelectFlickrPhoto(this);
      }
    });
});
