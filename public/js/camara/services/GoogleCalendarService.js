(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('GoogleCalendarService', GoogleCalendarService);

   GoogleCalendarService.$inject = [ 'settings', '$http',
                                     'messages', '$q' ];
   function GoogleCalendarService( settings, $http,
                                   messages, $q ) {
      var googleCalendarService = this;

      var _rejectError = function(reject, error) {
        if(!error.result || !error.result.error) {
           //network error
           error.message = messages.serverCommunicationError;
        } else {
           error.message = error.result.error.message;
        }
        reject(error);
      }

      //extract date from start and end fields from calendar api
      var _extractDate = function(dte) {
        if(dte) {
          if(dte.date) {
            return {
              date: dte.date,
              allDay: true
            }
          } else if(dte.dateTime) {
            return {
              date: dte.dateTime,
              allDay: false
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      }

      //get events from a page
      var _getEvents = function(pageToken) {
        var params = {
            timeZone: settings.GoogleCalendarService.timeZone,
            pageToken: pageToken,
            calendarId: settings.GoogleCalendarService.camaraCalendarId
         }

         return $q(function(resolve, reject) {
            gapi.client.calendar
                       .events
                       .list(params)
                       .then(function(response) {
                            var result = response.result;
                            if(result && result.items) {
                                var events = [];
                                var items = result.items;
                                var i;
                                for(i = 0; i < items.length; i++) {
                                       var resultItem = items[i];
                                       events.push({
                                          id: resultItem.id,
                                          start: _extractDate(resultItem.start).date,
                                          end: _extractDate(resultItem.end).date,
                                          title: resultItem.summary,
                                          allDay: _extractDate(resultItem.start).allDay
                                       });
                                }
                                resolve({
                                  'nextPageToken': events.length > 0 && result ? result.nextPageToken : null,
                                  'items': events
                                });
                            } else {
                                resolve({  'nextPageToken': null,
                                           'items': []
                                        });
                            }
                       }).catch(function(error) {
                          reject(error);
                       });
           });
      }

      //retrieve events from calendar api
      googleCalendarService.getEvents = async function(start, end) {
         var params = {
            timeZone: settings.GoogleCalendarService.timeZone,
            calendarId: settings.GoogleCalendarService.camaraCalendarId,
            timeMin: start.toISOString(),
            timeMax: end.toISOString()
         }
         return $q(function(resolve, reject) {
            gapi.client
                .calendar
                .events
                .list(params)
                .then(async function(response) {
                     //get the first page
                     var events = [];
                     var result = response.result;
                     if(result &&  result.items) {
                        var items = result.items;
                        var i;
                        for(i = 0; i < items.length; i++) {
                              var resultItem = items[i];
                              events.push({
                                 id: resultItem.id,
                                 start: _extractDate(resultItem.start).date,
                                 end: _extractDate(resultItem.end).date,
                                 title: resultItem.summary,
                                 allDay: _extractDate(resultItem.start).allDay
                              });
                        }
                        //get next pages
                        var next = result ? result.nextPageToken : null;
                        while(next) {
                           var result = await _getEvents(next);
                           next = result.nextPageToken;
                           var i;
                           for(i = 0; i < result.items.length; i++) {
                                var resultItem = result.items[i];
                                events.push(resultItem);
                           }
                        }
                        resolve(events);
                     } else {
                        resolve([]);
                     }
                }).catch(function(error) {
                     _rejectError(reject, error);
                });
         });
      }

      googleCalendarService.newEvent = function (event) {
         var params = {
            calendarId: settings.GoogleCalendarService.camaraCalendarId,
            resource: event
         }
         return $q(function(resolve, reject) {
                   gapi.client.calendar
                              .events
                              .insert(params)
                              .then(function(result) {
                                 resolve(result);
                              }, function(error) {
                                 _rejectError(reject, error);
                              });
                });

      }

      googleCalendarService.editEvent = function (eventId, event) {
         var params = {
            calendarId: settings.GoogleCalendarService.camaraCalendarId,
            eventId: eventId,
            resource: event
         }
         return $q(function(resolve, reject) {
            gapi.client.calendar
                       .events
                       .update(params)
                       .then(function(result) {
                           resolve(result);
                        }, function(error) {
                           _rejectError(reject, error);
                        });
         });
      }

      googleCalendarService.getEvent = function (eventId) {
         var params = {
            'calendarId': settings.GoogleCalendarService.camaraCalendarId,
            'eventId': eventId
         }
         return $q(function(resolve, reject) {
            gapi.client.calendar
                       .events
                       .get(params)
                       .then(function(response) {
                           var resultItem = response.result;

                           resolve({
                              id: resultItem.id,
                              url: resultItem.htmlLink,
                              start: _extractDate(resultItem.start).date,
                              end: _extractDate(resultItem.end).date,
                              title: resultItem.summary,
                              allDay: _extractDate(resultItem.start).allDay,
                              location: resultItem.location,
                              description: resultItem.description
                           });
                        }, function(error) {
                           _rejectError(reject, error);
                        });
         });
      }

      googleCalendarService.removeEvent = function (eventId) {
         var params = {
            'calendarId': settings.GoogleCalendarService.camaraCalendarId,
            'eventId': eventId
         }
         return $q(function(resolve, reject) {
            gapi.client.calendar.events
                                .delete(params)
                                .then(function(response) {
                                    resolve(response);
                                }, function(error) {
                                    _rejectError(reject, error);
                                });
         });
      }
   }
})();
