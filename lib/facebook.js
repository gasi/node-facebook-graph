    //////////////////////////////////////////////////////////////////////////////
//
//  Facebook Node.js SDK
//
//  Copyright 2011 Daniel Gasienica <daniel@gasienica.ch>
//  Copyright 2010 Facebook
//
//  Licensed under the Apache License, Version 2.0 (the "License"); you may
//  not use this file except in compliance with the License. You may obtain
//  a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
//  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
//  License for the specific language governing permissions and limitations
//  under the License.
//
//////////////////////////////////////////////////////////////////////////////

var crypto = require('crypto');
var https = require('https');
var qs = require('querystring');
var OAuth = require("oauth").OAuth2;


var GraphAPI = exports.GraphAPI = module.exports.GraphAPI = function (accessToken) {
    this.accessToken = accessToken;
};

GraphAPI.prototype.getObject = function (id, args, callback) {
    if (typeof args == 'function') {
        return this.request('/' + id, 'GET', null, null, args);
    }
    return this.request('/' + id, 'GET', args, null, callback);
};

GraphAPI.prototype.getObjects = function (ids, args, callback) {
    args['ids'] = ids.join(',');
    return this.request('/', 'GET', args, null, callback);
};

GraphAPI.prototype.getConnections = function (id, connectionName, args, callback) {
    if (typeof args == 'function') {
        return this.request('/' + id + '/' + connectionName, 'GET', null, null, args);
    }
    return this.request('/' + id + '/' + connectionName, 'GET', args, null, callback);
};

GraphAPI.prototype.putObject = function (parentObject, connectionName, data, callback) {
    return this.request(parentObject + '/' + connectionName, 'POST', null, data, callback);
};

GraphAPI.prototype.putWallPost = function (message, attachment, profileId, callback) {
    var attachment = attachment || {};
    var profileId = profileId || 'me';
    var data = {
        message: message,
        attachment: attachment
    };
    return this.putObject(profileId, 'feed', data, callback);
};

GraphAPI.prototype.putLike = function (objectId, callback) {
    return this.putObject(objectId, 'likes', callback);
};

GraphAPI.prototype.putComment = function (objectId, message, callback) {
    return this.putObject(objectId, 'comments', {message: message}, 'likes', callback);
};

GraphAPI.prototype.deleteObject = function (id, callback) {
    return this.request('/' + id, 'DELETE', null, null, callback);
};

GraphAPI.prototype.request = function (path, method, args, postArgs, callback) {
    var method = method || 'GET';
    var args = args || {};

    if (this.accessToken) {
        if (postArgs) {
            postArgs['access_token'] = this.accessToken;
        } else {
            args['access_token'] = this.accessToken;
        }
    }

    if (path.charAt(0) !== '/') {
        path = '/' + path;
    }

    var path = path + '?' + qs.stringify(args);
    var postData = postArgs ? qs.stringify(postArgs) : null;

    if (postData) {
        method = 'POST';
    }

    var options = {
        host: 'graph.facebook.com',
        port: 443,
        method: method,
        path: path,
        headers: {
            'Accept': 'application/json'
        }
    };

    var request = https.request(options, function (res) {
        res.setEncoding('utf8');
        var body = [];
        res.on('data', function (chunk) {
            body.push(chunk);
        });
        res.on('end', function () {
            var data;
            var error;
            try {
                data = JSON.parse(body.join(''));
            } catch(e) {
                data = null;
                error = e;
            }
            if (data && data.error) {
                // Graph API error
                callback(data.error, null);
            } else if (data) {
                // success
                callback(null, data);
            } else {
                // error
                callback(error, null);
            }
        });
    });

    request.on('error', function (error) {
        callback(error, null);
    });

    if (postData) {
        request.write(postData);
    }

    request.end();
};

exports.decodeSignedRequest = function (signedRequest, appSecret) {
    var parts = signedRequest.split('.', 2);
    var encodedSignature = parts[0];
    var payload = parts[1];

    var data = JSON.parse(base64URLDecode(payload));

    var isDataValid = data && data.algorithm &&
            data.algorithm.toUpperCase() === 'HMAC-SHA256';
    if (!isDataValid) {
        return null;
    }

    var hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(payload);
    var base64Digest = hmac.digest('base64');
    // remove Base64 padding
    var base64URLDigest = base64Digest.replace(/={1,3}$/, '');
    // Replace illegal characters
    base64URLDigest = base64URLDigest.replace(/\+/g, '-').replace(/\//g, '_');
    var expectedSignature = base64URLDigest;

    if (encodedSignature !== expectedSignature) {
        return null;
    }

    return data;
};

function base64URLDecode(str) {
    // Convert from Base64 URL to Base64
    // http://en.wikipedia.org/wiki/Base64#URL_applications
    var base64String = str.replace(/\-/g, '+').replace(/_/g, '/');
    var buffer = new Buffer(base64String, 'base64');
    // Use 'utf8' encoding because 'binary' will be deprecated
    // http://nodejs.org/docs/v0.4.5/api/all.html#buffer.toString
    var result = buffer.toString('utf8');
    return result;
}

exports.base64URLDecode = base64URLDecode;

/*--------------------------/*
The below are additions to this module to comply with Facebook's switch to OAuth2.
They are based on the Official Facebook PHP SDK and Facebook-JS https://github.com/masylum/facebook-js
/*--------------------------*/

  /**
   * Determines and returns the user access token and the time that it was issued, first using
   * the signed request if present, and then falling back on
   * the authorization code if present.  The intent is to
   * return a valid user access token, or false if one is determined
   * to not be available.
   *
   * @return string A valid user access token, or false if one
   *                could not be determined; 
   *         integer The unix timestamp in seconds of when the token was issued
   */
exports.getUserAccessToken = function (cookies, appId, appSecret, callback) {
    var signed_request = this.getSignedRequest(cookies, appId, appSecret);
    if(signed_request) {
        console.log("signed request: "+JSON.stringify(signed_request));
        if(signed_request.oauth_token) {
            callback(null, signed_request.oauth_token, this.returnCookie(cookies, appId, signed_request));
        } else if(signed_request.code) {
            this.getAccessTokenFromCode(appId, appSecret, signed_request.code, function(error, accessToken) {
                if(error) { callback(error, false); }
                else {
                    callback(null, accessToken, signed_request.issued_at);
                }
            });
        } else {
            callback(null, false);
        }
    } else {
        callback(null, false);
    }
    
}

  /**
   * Retrieve the signed request from a cookie.
   *
   * @return string the signed request, if available, or null otherwise.
   */

exports.getSignedRequest = function(cookies, appId, appSecret) {
    var cookie = cookies['fbsr_'+appId];
    if(cookie) {
        return this.decodeSignedRequest(cookie, appSecret);
    }
    return null;
}

 /**
   * Retrieves an access token for the given authorization code
   * (previously generated from www.facebook.com on behalf of
   * a specific user).  The authorization code is sent to graph.facebook.com
   * and a legitimate access token is generated provided the access token
   * and the user for which it was generated all match, and the user is
   * either logged in to Facebook or has granted an offline access permission.
   *
   * @param string $code An authorization code.
   * @return mixed An access token exchanged for the authorization code, or
   *               false if an access token could not be generated.
   */

exports.getAccessTokenFromCode = function(appId, appSecret, code, callback) {
    var oAuth = new OAuth(appId, appSecret, 'https://graph.facebook.com');
    oAuth.getOAuthAccessToken(code, {redirect_uri: ''}, callback);
}