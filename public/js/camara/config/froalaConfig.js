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
    $.FroalaEditor.DefineIcon('makeVideoResponsive', { NAME: 'mobile' });
    $.FroalaEditor.RegisterCommand('makeVideoResponsive', {
      title: 'Tornar vídeo responsivo',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
         var videoElement;
         var iframeElement;

         if (this.video) {
            videoElement = this.video.get();
         }

         if (videoElement) {
            if (videoElement.context) {
               iframeElement = videoElement.context.firstElementChild;
               if (iframeElement && videoElement.context.classList) {
                  iframeElement.removeAttribute("style");
                  iframeElement.removeAttribute("width");
                  iframeElement.removeAttribute("height");
                  videoElement.context.classList.add("responsiveFroalaVideo");
               }
            }
         }
      }
    });

    $.FroalaEditor.DefineIcon('camaraSelectLegislativeProposition', { NAME: 'file-text-o' });
    $.FroalaEditor.RegisterCommand('camaraSelectLegislativeProposition', {
      title: 'Link para outra propositura',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
         var htmlElement = null;
         var useScope = null;
         var fnOpenSelectLegislativeProposition = null;

         htmlElement = this.$oel;
         if (!htmlElement) {
            return;
         }
         useScope = htmlElement.attr('fn-open-select-legislative-proposition');
         if (!useScope) {
            return;
         }
         fnOpenSelectLegislativeProposition = _.get(htmlElement.scope(), useScope);
         if(!fnOpenSelectLegislativeProposition) {
            return;
         }
         fnOpenSelectLegislativeProposition(this);
      }
    });
});
