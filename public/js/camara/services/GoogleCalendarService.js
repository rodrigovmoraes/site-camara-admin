(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('GoogleCalendarService', GoogleCalendarService);

   GoogleCalendarService.$inject = [ 'settings', '$http' ];
   function GoogleCalendarService( settings, $http, messages ) {
      var googleCalendarService = this;

      //map errors received from the server to appropriate error message
      var _handleError = function(error) {
         if(!error.data) {
           //network error
           error.message = messages.serverCommunicationError;
        } else {
           error.message = error.data.error.message;
        }
        throw error;
      }

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

      var _getEvents = function(pageToken) {
        var params = {
            timeZone: settings.GoogleCalendarService.timeZone,
            key: settings.GoogleCalendarService.apiKey,
            pageToken: pageToken
         }

         return new Promise(function(resolve) {
            $http.get( settings.GoogleCalendarService.urlBase +
                           "/calendars/" + settings.GoogleCalendarService.camaraCalendarId + "/events", {
                           "params": params
                     }).then(function(result) {
                          if(result &&  result.data && result.data.items) {
                              var events = [];
                              var items = result.data.items;
                              var i;
                              for(i = 0; i < items.length; i++) {
                                     var resultItem = items[i];
                                     events.push({
                                        id: resultItem.id,
                                        start: _extractDate(resultItem.start).date,
                                        end: _extractDate(resultItem.end).date,
                                        url: resultItem.htmlLink,
                                        title: resultItem.summary,
                                        allDay: _extractDate(resultItem.start).allDay
                                     });
                              }
                              resolve({
                                'nextPageToken': events.length > 0 && result.data ? result.data.nextPageToken : null,
                                'items': events
                              });
                          } else {
                              resolve({  'nextPageToken': null,
                                         'items': []
                                      });
                          }
                     });
         });

      }

      googleCalendarService.getEvents = async function(start, end) {
         var params = {
            timeZone: settings.GoogleCalendarService.timeZone,
            key: settings.GoogleCalendarService.apiKey,
            maxResults : 1
         }
         return $http
                  .get( settings.GoogleCalendarService.urlBase +
                        "/calendars/" + settings.GoogleCalendarService.camaraCalendarId + "/events", {
                        "params": params
                  }).then(async function(result) {
                     //get the first page 
                     var events = [];
                     if(result &&  result.data && result.data.items) {
                        var items = result.data.items;
                        var i;
                        for(i = 0; i < items.length; i++) {
                              var resultItem = items[i];
                              events.push({
                                 id: resultItem.id,
                                 start: _extractDate(resultItem.start).date,
                                 end: _extractDate(resultItem.end).date,
                                 url: resultItem.htmlLink,
                                 title: resultItem.summary,
                                 allDay: _extractDate(resultItem.start).allDay
                              });
                        }
                        //get next pages
                        var next = result.data ? result.data.nextPageToken : null;
                        while(next) {
                           var result = await _getEvents(next);
                           next = result.nextPageToken;
                           var i;
                           for(i = 0; i < result.items.length; i++) {
                                var resultItem = result.items[i];
                                events.push(resultItem);
                           }
                        }
                        return events;
                     } else {
                        return [];
                     }
                  }).catch(function(error) {
                     _handleError(error);
                  });
      }
   }
})();
