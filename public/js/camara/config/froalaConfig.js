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

    $.FroalaEditor.DefineIcon('camaraInsertRadio', { NAME: 'file-audio-o' });
    $.FroalaEditor.RegisterCommand('camaraInsertRadio', {
      title: 'Inserir rádio Web',
      focus: false,
      undo: false,
      refreshAfterCallback: true,
      callback: function () {
         var htmlElement = null;
         var useScope = null;

         htmlElement = this.$oel;
         if (!htmlElement) {
            return;
         }
         this.html.insert(` <div class="radioplayer">
            <table border="0" cellspacing="0" cellpadding="0" height="150" align="center">
            <tbody>
            <tr>
               <td background="/images/radio/player-bg.jpg">&nbsp;&nbsp;<img src="/images/radio/player-logo4.jpg" border="0"></td>
            </tr>
            <tr>
               <td background="/images/radio/player-bg.jpg">
                  <script type="text/javascript" src="https://hosted.muses.org/mrp.js"></script>
                  <script type="text/javascript" >
                       MRP.insert({
                          'url':'http://suaradio1.dyndns.ws:13124/stream',
                          'lang':'pt',
                          'codec':'aac',
                          'volume':65,
                          'autoplay':true,
                          'forceHTML5':true,
                          'jsevents':false,
                          'buffering':1,
                          'title':'Rádio Câmara Sorocaba',
                          'welcome':'Seja Bem Vindo(a)',
                          'wmode':'transparent',
                          'skin':'compact',
                          'width':191,
                          'height':48
                       });
                  </script></td>
            </tr>
            <tr>
               <td>
                  <a href="http://suaradio1.dyndns.ws:13124/stream.m3u">&nbsp;&nbsp;<img src="/images/radio/player-ios.jpg" border="0"></a>
               </td>
            </tr>
            </tbody>
         </table></div>`);
      }
    });
});
