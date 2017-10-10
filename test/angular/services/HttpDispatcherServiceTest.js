/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var expect = require('chai').expect;
var should = require('chai').should;
var assert = require('chai').assert;
require('../helper.js');

/*****************************************************************************
******************************* PRIVATE*********************************
/*****************************************************************************/

function _settings() {
   this.baseUrlSiteCamaraApi = 'http://test:1122'
}

function _messages () {
   this.serverCommunicationError = 'serverCommunicationError';
   this.security = {
      accessDenied: 'accessDenied'
   };
}

function _authenticationServiceMock(){
   this.getToken = function() {
      return "token";
   }
}
/*****************************************************************************
******************************* GLOBAL CONFIG*********************************
/*****************************************************************************/
// Loads the module we want to test
angular.module('SiteCamaraAdminApp', [])
require('../../../public/js/camara/services/HttpDispatcherService.js');
angular.module('SiteCamaraAdminApp').service('settings', _settings);
angular.module('SiteCamaraAdminApp').service('messages', _messages);
angular.module('SiteCamaraAdminApp').service('AuthenticationService', _authenticationServiceMock);

/*****************************************************************************
********************************* TEST SUITE**********************************
/*****************************************************************************/
describe('HttpDispatcherService', function() {

      var _method;
      var _url;
      var _data;
      var _headers;
      var _params;
      var $httpBackend;
      var injector;
      var settings;
      var messages;

      function _handleRequest(method, url, data, headers, params) {
         _method =  method;
         _url = url;
         _data = data;
         _headers = headers;
         _params = params;
      }

      /*****************************************************************************
      ********************************* TEST CONFIG*********************************
      /*****************************************************************************/
     beforeEach(ngModule('SiteCamaraAdminApp'));

     //beforeEach(inject(function(HttpDispatcherServiceMock) {
    //    HttpDispatcherServiceMock._setHttpDispatcherServiceMockData(_httpDispatcherServiceMockData);
     //}));

     beforeEach(inject(function($injector) {
           injector = $injector;
           // Set up the mock http service responses
           $httpBackend = $injector.get('$httpBackend');
           settings = $injector.get('settings');
           messages = $injector.get('messages');
           // backend definition common for all tests
           $httpBackend.whenRoute('GET', settings.baseUrlSiteCamaraApi + "/testGet")
                                         .respond(function(method, url, data, headers, params) {
                                             _handleRequest(method, url, data, headers, params)
                                             return [200, {message: "testGetResponse"}]
                                          });
           $httpBackend.whenRoute('POST', settings.baseUrlSiteCamaraApi + "/testPost")
                                         .respond(function(method, url, data, headers, params) {
                                             _handleRequest(method, url, data, headers, params)
                                             return [200, {message: "testPostResponse"}]
                                          });
           $httpBackend.whenRoute('PUT', settings.baseUrlSiteCamaraApi + "/testPut")
                                         .respond(function(method, url, data, headers, params) {
                                             _handleRequest(method, url, data, headers, params)
                                             return [200, {message: "testPutResponse"}]
                                          });

           $httpBackend.whenRoute('DELETE', settings.baseUrlSiteCamaraApi + "/testDelete")
                                         .respond(function(method, url, data, headers, params) {
                                             _handleRequest(method, url, data, headers, params)
                                             return [200, {message: "testDeleteResponse"}]
                                          });

          $httpBackend.whenRoute('GET', settings.baseUrlSiteCamaraApi + "/testCommunicationError")
                                       .respond(function(method, url, data, headers, params) {
                                           _handleRequest(method, url, data, headers, params)
                                           return [-1, undefined];
                                       });

          $httpBackend.whenRoute('POST', settings.baseUrlSiteCamaraApi + "/testServerError500")
                                         .respond(function(method, url, data, headers, params) {
                                             _handleRequest(method, url, data, headers, params)
                                             return [500, {message: 'errorTestMessage'}];
                                         });

         $httpBackend.whenRoute('GET', settings.baseUrlSiteCamaraApi + "/testAccessError")
                                        .respond(function(method, url, data, headers, params) {
                                            _handleRequest(method, url, data, headers, params)
                                            return [401, {message: 'AccessErrorMessage'}];
                                        });
     }));

     /*****************************************************************************
     ********************************* TEST CASES *********************************
     /*****************************************************************************/
     //GET
     it('GET', function(done){
        var HttpDispatcherServiceReal = injector.get('HttpDispatcherServiceReal');
        HttpDispatcherServiceReal.get( "/testGet",
                                       {
                                          headers: {
                                             field1: 'field1Value',
                                             field2: 'field2Value',
                                          }
                                       }
                                     ).then(function(result){
                                        expect(result.data).to.not.be.undefined;
                                        expect(result.data.message).to.not.be.undefined;
                                        expect(result.data.message).to.equal("testGetResponse");
                                        expect(_headers.field1).to.equal("field1Value");
                                        expect(_headers.field2).to.equal("field2Value");
                                        expect(_headers.Authorization).to.equal("Bearer token");
                                        done();
                                     });
        $httpBackend.flush();
     });

     //POST
     it('POST', function(done){
        var HttpDispatcherServiceReal = injector.get('HttpDispatcherServiceReal');
        HttpDispatcherServiceReal.post( "/testPost",
                                        { myData: 'myDataValue' },
                                        {
                                           headers: {
                                              fieldPost: 'fieldPostValue'
                                           }
                                        }
                                     ).then(function(result){
                                        expect(result.data).to.not.be.undefined;
                                        expect(result.data.message).to.not.be.undefined;
                                        expect(result.data.message).to.equal("testPostResponse");
                                        expect(JSON.parse(_data).myData).to.equal("myDataValue");
                                        expect(_headers.fieldPost).to.equal("fieldPostValue");
                                        expect(_headers.Authorization).to.equal("Bearer token");
                                        done();
                                     });
        $httpBackend.flush();
     });

     //PUT
     it('PUT', function(done){
        var HttpDispatcherServiceReal = injector.get('HttpDispatcherServiceReal');
        HttpDispatcherServiceReal.put( "/testPut",
                                        { myDataPut: 'myDataPutValue' }
                                     ).then(function(result){
                                        expect(result.data).to.not.be.undefined;
                                        expect(result.data.message).to.not.be.undefined;
                                        expect(result.data.message).to.equal("testPutResponse");
                                        expect(JSON.parse(_data).myDataPut).to.equal("myDataPutValue");
                                        expect(_headers.Authorization).to.equal("Bearer token");
                                        done();
                                     });
        $httpBackend.flush();
     });

     //DELETE
     it('DELETE', function(done){
        var HttpDispatcherServiceReal = injector.get('HttpDispatcherServiceReal');
        HttpDispatcherServiceReal.delete( "/testDelete",
                                          {
                                              headers: {
                                                 fieldDelete: 'fieldDeleteValue'
                                              }
                                          }
                                        ).then(function(result){
                                           expect(result.data).to.not.be.undefined;
                                           expect(result.data.message).to.not.be.undefined;
                                           expect(result.data.message).to.equal("testDeleteResponse");
                                           expect(_headers.fieldDelete).to.equal("fieldDeleteValue");
                                           expect(_headers.Authorization).to.equal("Bearer token");
                                           done();
                                        });
        $httpBackend.flush();
     });

     //Communication Error
     it('COMMUNICATION ERROR', function(done){
        var HttpDispatcherServiceReal = injector.get('HttpDispatcherServiceReal');
        HttpDispatcherServiceReal.get("/testCommunicationError")
                                 .then(function(result){
                                    assert.isOk(false, "This shouldn't be executed");
                                    done();
                                 })
                                 .catch(function(error){
                                    expect(error.message).to.equal(messages.serverCommunicationError);
                                    done();
                                 });
        $httpBackend.flush();
     });

     //Server Error 500
     it('SERVER ERROR - 500', function(done){
        var HttpDispatcherServiceReal = injector.get('HttpDispatcherServiceReal');
        HttpDispatcherServiceReal.post("/testServerError500", {testData: 'myTestData'})
                                 .then(function(result){
                                    assert.isOk(false, "This shouldn't be executed");
                                    done();
                                 })
                                 .catch(function(error){
                                    expect(error.message).to.equal('errorTestMessage');
                                    done();
                                 });
        $httpBackend.flush();
     });

     it('ACCESS ERROR - 401', function(done){
        var HttpDispatcherServiceReal = injector.get('HttpDispatcherServiceReal');
        HttpDispatcherServiceReal.get("/testAccessError")
                                 .then(function(result){
                                    assert.isOk(false, "This shouldn't be executed");
                                    done();
                                 })
                                 .catch(function(error){
                                    expect(error.message).to.equal(messages.security.accessDenied);
                                    done();
                                 });
        $httpBackend.flush();
     });


 });
