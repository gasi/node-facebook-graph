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
var assert = require('assert');
var facebook = require('../lib/facebook');
var fs = require('fs');

// Test: decodeSignedRequest
var tests = loadTests('signed-requests-data.json');
tests.forEach(function (test) {
    var actual = facebook.decodeSignedRequest(test.signedRequest, test.appSecret);
    var expected = test.expected;
    assert.deepEqual(actual, expected);
});

// Test: Base64 URL decode
var tests = loadTests('base64-url-decode-data.json');
tests.forEach(function (test) {
    var actual = facebook.base64URLDecode(test.input);
    var expected = test.output;
    assert[test['test']](actual, expected, test.name);
});

// Helpers
function loadTests(filename) {
    return JSON.parse(fs.readFileSync(__dirname + '/' + filename).toString());
}
