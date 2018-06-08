(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ListEventsCalendarController', ListEventsCalendarController);

   ListEventsCalendarController.$inject = [ '$scope', '$compile',
                                            'messages', 'Utils',
                                            '$stateParams', 'settings',
                                            'uiCalendarConfig', 'GoogleCalendarService'];
   function ListEventsCalendarController( $scope, $compile,
                                          messages, Utils,
                                          $stateParams, settings,
                                          uiCalendarConfig, GoogleCalendarService ) {
      var $listEventsCalendarCtrl = this;

      //messages control
      Utils.applyMessageControls($listEventsCalendarCtrl);

      //function for template messages.
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      /* event source that calls a function on every view switch */
      $listEventsCalendarCtrl.loadEvents = function (start, end, timezone, callback) {
        var s = new Date(start).getTime();
        var e = new Date(end).getTime();
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false }];
        GoogleCalendarService.getEvents(null, null)
                             .then(function(events) {
                                console.log(events);
                                callback(events);
                             });
      };

      $listEventsCalendarCtrl.chooseDayInput = {
         date: undefined,
         dateOptions: {
             dateDisabled: false,
             formatYear: 'yyyy',
             maxDate: new Date(2100, 0, 1),
             minDate: 0,
             startingDay: 1
         },
         openChooseDay: function() {
            $listEventsCalendarCtrl.chooseDayInput.isOpen = true;
         },
         isOpen: false
      };

      /*login into google api*/
      $listEventsCalendarCtrl.googleApiLogin = function() {
        gapi.auth2.getAuthInstance().signIn();
      }
      /*logout from google api*/
      $listEventsCalendarCtrl.googleApiLogout = function() {
        gapi.auth2.getAuthInstance().signOut();
      }
      /* alert on eventClick */
      $listEventsCalendarCtrl.alertOnEventClick = function( date, jsEvent, view) {
          $listEventsCalendarCtrl.alertMessage = (date.title + ' was clicked ');
      };
      /* alert on Drop */
       $listEventsCalendarCtrl.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
         $listEventsCalendarCtrl.alertMessage = ('Event Droped to make dayDelta ' + delta);
      };
      /* alert on Resize */
      $listEventsCalendarCtrl.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ) {
         $listEventsCalendarCtrl.alertMessage = ('Event Resized to make dayDelta ' + delta);
      };
      /* Change View */
      $listEventsCalendarCtrl.changeView = function(view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
      };
      /* go to the day*/
      $listEventsCalendarCtrl.goTo = function(calendar) {
         if ($listEventsCalendarCtrl.chooseDayInput.date) {
            var d = $listEventsCalendarCtrl.chooseDayInput.date;
            d.setMilliseconds(0);
            d.setSeconds(0);
            d.setMinutes(0);
            d.setHours(0);
            uiCalendarConfig.calendars[calendar].fullCalendar('gotoDate', d);
         }
      }
      /* Change View */
      $listEventsCalendarCtrl.renderCalendar = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      };
      /* Render Tooltip */
      $listEventsCalendarCtrl.eventRender = function( event, element, view ) {
          element.attr( {'tooltip': event.title,
                         'tooltip-append-to-body': true});
          $compile(element)($scope);
      };
      /* config object */
      $listEventsCalendarCtrl.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          header:{
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          locale: 'pt-br',
          eventClick: $listEventsCalendarCtrl.alertOnEventClick,
          eventDrop: $listEventsCalendarCtrl.alertOnDrop,
          eventResize: $listEventsCalendarCtrl.alertOnResize,
          eventRender: $listEventsCalendarCtrl.eventRender,
          firstDay: 1,
          monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          monthNamesShort: ['Jan', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'],
          dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
          dayNamesShort : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
        }
      };

      /* event sources array*/
      $listEventsCalendarCtrl.eventSources = [{ events: $listEventsCalendarCtrl.loadEvents
                                             }];

      $listEventsCalendarCtrl.renderCalendar('camaraEvents');
   }
})();
