(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ListEventsCalendarController', ListEventsCalendarController);

   ListEventsCalendarController.$inject = [ '$scope', '$compile',
                                            'messages', 'Utils',
                                            '$stateParams', 'settings',
                                            'uiCalendarConfig', 'GoogleCalendarService',
                                            '$uibModal'];
   function ListEventsCalendarController( $scope, $compile,
                                          messages, Utils,
                                          $stateParams, settings,
                                          uiCalendarConfig, GoogleCalendarService,
                                          $uibModal ) {
      var $listEventsCalendarCtrl = this;
      var calendarName = 'camaraCalendar';

      //messages control
      Utils.applyMessageControls($listEventsCalendarCtrl);

      //function for template messages.
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      /* event source that calls a function on every view switch */
      $listEventsCalendarCtrl.loadEvents = function (start, end, timezone, callback) {
        var start = new Date(start);
        var end = new Date(end);
        GoogleCalendarService.getEvents(start, end)
                             .then(function(events) {
                                callback(events);
                             }).catch(function (error) {
                                $listEventsCalendarCtrl.errorMessage = error.message;
                                $scope.$apply();
                             });
      };

      $listEventsCalendarCtrl.refresh = function() {
         uiCalendarConfig.calendars[calendarName].fullCalendar( 'refetchEvents' );
      }

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
        if($scope.isGoogleApiSignedIn) {
          gapi.auth2.getAuthInstance().signOut();
        }
        gapi.auth2.getAuthInstance().signIn({ prompt: 'select_account', ux_mode: 'popup'});
      }
      /*logout from google api*/
      $listEventsCalendarCtrl.googleApiLogout = function() {
        gapi.auth2.getAuthInstance().signOut();
      }
      /* alert on eventClick */
      $listEventsCalendarCtrl.onEventClick = function( eventCalendar ) {
         $uibModal.open({
             templateUrl: 'editCalendarEvent.html',
             animation: false,
             size: 'md',
             controller: 'EditEventModalInstanceController',
             controllerAs: '$modalCtrl',
             scope: $scope,
             resolve: {
                'calendarEvent' : function () {
                   return GoogleCalendarService.getEvent(eventCalendar.id)
                                               .catch(function(error) {
                                                   $listEventsCalendarCtrl.errorMessage = error.message;
                                                   throw error;
                                                });
                }
             }
          }).result.then(function(message) {
             $listEventsCalendarCtrl.infoMessage = message;
             $listEventsCalendarCtrl.refresh();
             App.unblockUI();
          }, function(reasonObject) {
             //removal requested by user
             if(reasonObject && reasonObject.reason && reasonObject.reason === 'remove' && reasonObject.event) {
                var eventRequestedToBeRemoved = reasonObject.event;
                $uibModal.open({
                    templateUrl: 'tpl/camara/includes/confirm.html',
                    animation: false,
                    size: 'md',
                    controller: 'ConfirmModalInstanceController',
                    controllerAs: '$modalCtrl',
                    scope: $scope,
                    resolve: {
                       texts: {
                          'message': _templateMessage(messages.calendarEventRemoveDialogText,
                                                      { description: eventRequestedToBeRemoved.title,
                                                        date:  Utils.dateToDDMMYYYYFormat(Utils.YYYYMMDDFormatToDate(eventRequestedToBeRemoved.start))})
                       }
                    }
                }).result.then(function() {
                   App.blockUI();
                   GoogleCalendarService.removeEvent(eventCalendar.id)
                                        .then(function(result) {
                                           $listEventsCalendarCtrl.infoMessage = _templateMessage( messages.calendarEventRemoved,
                                                                                                   { description: eventRequestedToBeRemoved.title,
                                                                                                     date:  Utils.dateToDDMMYYYYFormat(Utils.YYYYMMDDFormatToDate(eventRequestedToBeRemoved.start)) });
                                           $listEventsCalendarCtrl.refresh();
                                           App.unblockUI();
                                        }).catch(function(error) {
                                           $listEventsCalendarCtrl.errorMessage = error.message;
                                           App.unblockUI();
                                        });
                });
             }
          });
      };
      /* on Drop */
      $listEventsCalendarCtrl.onDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
          var eventStart = event.start.toDate();
          var eventEnd;
          if(event.allDay) {
             eventEnd = Utils.addDays(eventStart, 1);
          } else {
             eventEnd = event.end ? event.end.toDate()
                                  : Utils.addHours(eventStart, 1);
          }

          var droppedEvent = { "summary" : event.title,
                               "start" : event.allDay ?
                                             { date: Utils.UTCDateToYYYYMMDDFormat(eventStart) } :
                                             { dateTime: Utils.UTCDateToYYYYMMDDHHMIFormat(eventStart, settings.GoogleCalendarService.utcHoursOffset) },
                               "end" : event.allDay ?
                                             { date: Utils.UTCDateToYYYYMMDDFormat(eventEnd) } :
                                             { dateTime: Utils.UTCDateToYYYYMMDDHHMIFormat(eventEnd, settings.GoogleCalendarService.utcHoursOffset) }
                             };
          App.blockUI();
          GoogleCalendarService.editEvent(event.id, droppedEvent)
                               .then(function(result) {
                                  $listEventsCalendarCtrl.infoMessage =  _templateMessage(messages.calendarEventMoved,
                                                                                          { description: droppedEvent.summary,
                                                                                            date:  Utils.UTCDateToDDMMYYYYFormat(eventStart),
                                                                                            time:  Utils.UTCDateToHHhMIminFormat(eventStart),
                                                                                          });
                                 $listEventsCalendarCtrl.refresh();
                                 App.unblockUI();
                               }).catch(function(error) {
                                  $listEventsCalendarCtrl.errorMessage = error.message;
                                  App.unblockUI();
                               });
      };
      /* on Resize */
      $listEventsCalendarCtrl.onResize = function(event, delta, revertFunc, jsEvent, ui, view ) {
         var eventStart = event.start;
         var eventEnd = event.end;

         var droppedEvent = { "summary" : event.title,
                              "start" : event.allDay ?
                                            { date: Utils.UTCDateToYYYYMMDDFormat(eventStart.toDate()) } :
                                            { dateTime: Utils.UTCDateToYYYYMMDDHHMIFormat(eventStart.toDate(), settings.GoogleCalendarService.utcHoursOffset) },
                              "end" : event.allDay ?
                                            { date: Utils.UTCDateToYYYYMMDDFormat(eventEnd.toDate()) } :
                                            { dateTime: Utils.UTCDateToYYYYMMDDHHMIFormat(eventEnd.toDate(), settings.GoogleCalendarService.utcHoursOffset) }
                           };
         App.blockUI();
         GoogleCalendarService.editEvent(event.id, droppedEvent)
                              .then(function(result) {
                                 $listEventsCalendarCtrl.infoMessage =  _templateMessage(messages.calendarEventResized,
                                                                                         { description: droppedEvent.summary,
                                                                                           date:  Utils.UTCDateToDDMMYYYYFormat(eventEnd.toDate()),
                                                                                           time:  Utils.UTCDateToHHhMIminFormat(eventEnd.toDate()),
                                                                                         });
                                $listEventsCalendarCtrl.refresh();
                                App.unblockUI();
                              }).catch(function(error) {
                                 $listEventsCalendarCtrl.errorMessage = error.message;
                                 App.unblockUI();
                              });
      };
      /* Change View */
      $listEventsCalendarCtrl.changeView = function(view) {
        uiCalendarConfig.calendars[calendarName].fullCalendar('changeView', view);
      };
      /* go to the day*/
      $listEventsCalendarCtrl.goTo = function() {
         if ($listEventsCalendarCtrl.chooseDayInput.date) {
            var d = $listEventsCalendarCtrl.chooseDayInput.date;
            d.setMilliseconds(0);
            d.setSeconds(0);
            d.setMinutes(0);
            d.setHours(0);
            uiCalendarConfig.calendars[calendarName].fullCalendar('gotoDate', d);
         }
      }
      /* Change View */
      $listEventsCalendarCtrl.renderCalendar = function() {
        if(uiCalendarConfig.calendars[calendarName]) {
          uiCalendarConfig.calendars[calendarName].fullCalendar('render');
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
             header: {
               left: 'title',
               center: '',
               right: 'today prev,next'
             },
             locale: 'pt-br',
             eventClick: $listEventsCalendarCtrl.onEventClick,
             eventDrop: $listEventsCalendarCtrl.onDrop,
             eventResize: $listEventsCalendarCtrl.onResize,
             eventRender: $listEventsCalendarCtrl.eventRender,
             firstDay: 1,
             monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
             monthNamesShort: ['Jan', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'],
             dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
             dayNamesShort : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
        }
      };

      $listEventsCalendarCtrl.newEvent = function() {
        $uibModal.open({
            templateUrl: 'newCalendarEvent.html',
            animation: false,
            size: 'md',
            controller: 'NewEventModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope
         }).result.then(function(message) {
            $listEventsCalendarCtrl.infoMessage = message;
            $listEventsCalendarCtrl.refresh();
            App.unblockUI();
         });
      }

      /* event sources array*/
      $listEventsCalendarCtrl.eventSources = [{
                                                events: $listEventsCalendarCtrl.loadEvents
                                             }];

      $listEventsCalendarCtrl.renderCalendar();
   }
})();
