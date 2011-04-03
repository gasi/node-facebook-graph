var fs = require('fs');
var assert = require('assert');
var facebook = require('../lib/facebook');

var SIGNED_REQUEST = 'vlXgu64BQGFSQrY0ZcJBZASMvYvTHu9GQ0YM9rjPSso.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsIjAiOiJwYXlsb2FkIn0';
// var SIGNED_REQUEST = 'WGvK-mUKB_Utg0l8gSPvf6smzacp46977pTtcRx0puE.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImV4cGlyZXMiOjEyOTI4MjEyMDAsImlzc3VlZF9hdCI6MTI5MjgxNDgyMCwib2F1dGhfdG9rZW4iOiIxNTI1NDk2ODQ3NzczMDJ8Mi5ZV2NxV2k2T0k0U0h4Y2JwTWJRaDdBX18uMzYwMC4xMjkyODIxMjAwLTcyMTU5OTQ3NnxQaDRmb2t6S1IyamozQWlxVldqNXp2cTBmeFEiLCJ1c2VyIjp7ImxvY2FsZSI6ImVuX0dCIiwiY291bnRyeSI6ImF1In0sInVzZXJfaWQiOiI3MjE1OTk0NzYifQ';
var APP_SECRET = 'secret';
var EXPECTED_DATA = {
    'algorithm': 'HMAC-SHA256',
    '0': 'payload'
};

facebook.decodeSignedRequest(SIGNED_REQUEST, APP_SECRET);
// assert.deepEqual(facebook.decodeSignedRequest(SIGNED_REQUEST, APP_SECRET),
                 // EXPECTED_DATA);

var tests = fs.readFileSync(__dirname + '/data.txt').toString().split('\n');

tests.forEach(function (test) {
    if (!test || test[0] == '#') { return; }
    var line = test.split(' ');
    name = line[0];
    input = line[1];
    output = line[2];
    var data = facebook.decodeBase64URL(input);
    assert.strictEqual(data, output);
});