(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('DigestAuthUtils', DigestAuthUtils);

   DigestAuthUtils.$inject = ['md5', '$http'];
   function DigestAuthUtils(md5, $http) {
      var DigestAuthUtils = this;

      /************************************************************************
      ************************* PRIVATE METHODS *******************************
      ************************************************************************/
      function genNonce(b) {
         var c = [],
            e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            a = e.length;

         for (var i = 0; i < b; ++i) {
            c.push(e[Math.random() * a |0]);
         }

         return c.join('');
      }

      function unq(value) {
         var quotedString = getRHSValue(value);
         return quotedString.substr(1, quotedString.length - 2).replace(/(?:(?:\r\n)?[ \t])+/g, ' ');
      }

      function stringifyReturn(map) {
         var intermediateArray = [];
         for (var key in map) {
            if (!map.hasOwnProperty(key)) return;
            var valueArray = map[key];

            var value = valueArray[0];
            if (valueArray[1] === true) {
               value = '"' + value + '"';
            }

            value = key + '=' + value;
            intermediateArray.push(value);
         }
         return intermediateArray.join(', ');
      }

      function getRHSValue(someString) {
         return someString.substr(someString.indexOf('=') + 1);
      }

      function createAuthorizationHeader(url, method, authenticationHeaderContent, username, password) {
         if (!authenticationHeaderContent) {
            return null;
         }
         var HA1,
             nonce,
             realm,
             qop,
             algorithm,
             reg = /[^:]+\:\/\/[^\/]+(\/[^\?]*)?(\?.*)?/,
             ws = '(?:(?:\\r\\n)?[ \\t])+',
             token = '(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2E\\x30-\\x39\\x3F\\x41-\\x5A\\x5E-\\x7A\\x7C\\x7E]+)',
             quotedString = '"(?:[\\x00-\\x0B\\x0D-\\x21\\x23-\\x5B\\\\x5D-\\x7F]|' + ws + '|\\\\[\\x00-\\x7F])*"',
             tokenizer = new RegExp(token + '(?:=(?:' + quotedString + '|' + token + '))?', 'g'),
             tokens = authenticationHeaderContent.match(tokenizer),
             uri = reg.exec(url),
             cnonce = genNonce(16),
             nc = '00000001';

             if (uri === null) {
               uri = url;
             } else {
               if (uri.length > 1) {
                  uri = uri[1];
               } else {
                  uri = url;
               }
             }

             for (var tokenKey in tokens) {
               if (!tokens.hasOwnProperty(tokenKey)) return;
               var value = tokens[tokenKey];

               if (value.match('nonce')) nonce = unq(value);
               if (value.match('realm')) realm = unq(value);
               if (value.match('qop')) qop = unq(value);
               if (value.match('algorithm')) algorithm = unq(value);
             }

             // http://en.wikipedia.org/wiki/Digest_access_authentication
             if (!HA1) {
                 HA1 = md5.createHash([username, realm, password].join(':'));
                 if (algorithm === 'MD5-sess') {
                     HA1 = md5.createHash([HA1, nonce, cnonce].join(':'));
                 }
             }
             var HA2 = md5.createHash([method, uri].join(':'));
             var response = md5.createHash([HA1, nonce, HA2].join(':'));
             if (qop === 'auth' || qop === 'auth-int') {
                 response = md5.createHash([HA1, nonce, nc, cnonce, qop, HA2].join(':'));
             }

             var map = {
                  username:    [username, true],
                  realm:        [realm, true],
                  nonce:        [nonce, true],
                  uri:        [uri, true],
                  response:    [response, true],
                  qop:        [qop, false],
                  nc:            [nc, true],
                  cnonce:        [cnonce, true]
             };

             return 'Digest ' + stringifyReturn(map);
       }

       DigestAuthUtils.login = function (url, username, password) {
          return $http.get(url)
                      .then(function(httpResult) {
                        return httpResult;
                      }).catch(function(error) {
                         if (error.status === 401) {
                            var authorizationHeader = createAuthorizationHeader(url, "GET", error.headers("WWW-Authenticate"), username, password);
                            return $http.get( url, { headers: { Authorization: authorizationHeader} });
                         } else {
                            throw error;
                         }
                      });
       }
   }
})();
