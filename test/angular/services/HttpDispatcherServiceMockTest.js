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
var _httpDispatcherServiceMockData = [
    {path: '/testget', method: 'GET', data: function(dataIn) { return { message: "testgetmessage" } } } ,
    {path: '/testpost', method: 'POST', data: function(dataIn) { return { message: "testpostmessage" } } },
    {path: '/testput', method: 'PUT', data: function(dataIn) { return { message: "testputmessage" } } },
    {path: '/testgeneric', method: 'ALL', data: function(dataIn) { return { message: "testgenericmessage" } } },
    {path: '/testdelete', method: 'DELETE', data: function(dataIn) { return { message: "testdeletemessage" } } }
];

/*****************************************************************************
******************************* GLOBAL CONFIG*********************************
/*****************************************************************************/
// Loads the module we want to test
angular.module('SiteCamaraAdminApp', [])
require('../../../public/js/camara/services/HttpDispatcherServiceMock.js');

/*****************************************************************************
********************************* TEST SUITE**********************************
/*****************************************************************************/
describe('HttpDispatcherServiceMock', function() {

      /*****************************************************************************
      ********************************* TEST CONFIG*********************************
      /*****************************************************************************/
     beforeEach(ngModule('SiteCamaraAdminApp'));
     beforeEach(inject(function(HttpDispatcherServiceMock) {
        HttpDispatcherServiceMock._setHttpDispatcherServiceMockData(_httpDispatcherServiceMockData);
     }));

     /*****************************************************************************
     ********************************* TEST CASES *********************************
     /*****************************************************************************/
     //get
     it('GET', function(done){
        inject(function(HttpDispatcherServiceMock) {
           var requestPromiseMock = HttpDispatcherServiceMock
              .get("http://182.11.12.1:2021/testget", {})
              .then(function(result){
                  expect(result.data).to.not.be.undefined;
                  expect(result.data.message).to.equal("testgetmessage");
                  done();
              }).catch(function(result){
                  console.log(result);
                  assert.isNotOk(true, "This should not be executed");
                  done();
              });
              requestPromiseMock.flushErrors()
        })();
     });

     //post
     it('POST', function(done){
        inject(function(HttpDispatcherServiceMock) {
           var requestPromiseMock = HttpDispatcherServiceMock
              .post("http://182.11.12.1/testpost", {})
              .then(function(result){
                  expect(result.data).to.not.be.undefined;
                  expect(result.data.message).to.equal("testpostmessage");
                  done();
              }).catch(function(result){
                  console.log(result);
                  assert.isNotOk(true, "This should not be executed");
                  done();
              });
              requestPromiseMock.flushErrors()
        })();
     });

    //put
    it('PUT', function(done){
       inject(function(HttpDispatcherServiceMock) {
          var requestPromiseMock = HttpDispatcherServiceMock
             .put("http://localhost:2021/testput", {})
             .then(function(result){
                 expect(result.data).to.not.be.undefined;
                 expect(result.data.message).to.equal("testputmessage");
                 done();
             }).catch(function(result){
                 console.log(result);
                 assert.isNotOk(true, "This should not be executed");
                 done();
             });
             requestPromiseMock.flushErrors()
       })();
    });

    //delete
    it('DELETE', function(done){
       inject(function(HttpDispatcherServiceMock) {
          var requestPromiseMock = HttpDispatcherServiceMock
             .delete("http://localhost/testdelete", {})
             .then(function(result){
                 expect(result.data).to.not.be.undefined;
                 expect(result.data.message).to.equal("testdeletemessage");
                 done();
             }).catch(function(result){
                 console.log(result);
                 assert.isNotOk(true, "This should not be executed");
                 done();
             });
             requestPromiseMock.flushErrors()
       })();
    });

    //generic - get
    it('genericWithGet', function(done){
       inject(function(HttpDispatcherServiceMock) {

          var requestPromiseMock = HttpDispatcherServiceMock
             .get("http://182.11.12.1:2021/testgeneric", {})
             .then(function(result){
                 expect(result.data).to.not.be.undefined;
                 expect(result.data.message).to.equal("testgenericmessage");
                 done();
             }).catch(function(result){
                 console.log(result);
                 assert.isNotOk(true, "This should not be executed");
                 done();
             });
             requestPromiseMock.flushErrors();
       })();
    });

    //generic - put
    it('genericWithPut', function(done){
       inject(function(HttpDispatcherServiceMock) {

          var requestPromiseMock = HttpDispatcherServiceMock
             .put("http://182.11.12.1:2021/testgeneric", {})
             .then(function(result){
                 expect(result.data).to.not.be.undefined;
                 expect(result.data.message).to.equal("testgenericmessage");
                 done();
             }).catch(function(result){
                 console.log(result);
                 assert.isNotOk(true, "This should not be executed");
                 done();
             });
             requestPromiseMock.flushErrors();
       })();
    });

 });
