Facebook Node.js SDK
====================

_This is a port of the official Facebook Python SDK to Node.js.
Why did I choose the Python SDK? Because it's simple, clean and beautiful code.
Besides, I only needed support for the Graph API._

This client library is designed to support the
[Facebook Graph API][fb-graph-api-docs] and the official
[Facebook JavaScript SDK][fb-js-sdk], which is the canonical way to implement
Facebook authentication. You can read more about the Graph API at
[http://developers.facebook.com/docs/api][fb-graph-api-docs].

Installation
------------

    npm install facebook-graph

Development
-----------

    git clone https://github.com/gasi/node-facebook-graph.git facebook-graph
    npm link ./facebook-graph


Running Tests
-------------

    node test

Basic usage
-----------

    var facebook = require('facebook-graph');
    var accessToken = '<Your OAuth Access Token>';
    var graph = new facebook.GraphAPI(accessToken);

    function print(error, data) {
        console.log(error ? error : data);
    }

    graph.getObject('me', print);
    graph.getConnections('me', 'friends', print);
    graph.putObject('me', 'feed', {
        message: 'The computerz iz writing on my wallz!1'
    }, print);

Express JS
----------

If you are using the module within a web application with the
[JavaScript SDK][fb-js-sdk], you can also use the module to use Facebook for
login, parsing the cookie set by the JavaScript SDK for logged in users.
For example, in in the [Express web framework][express-js], you could get the
profile of the logged in user with:


    // This snippet assumes that you're using the
    // connect.cookieParser (http://senchalabs.github.com/connect/middleware-cookieParser.html)
    // middleware.
    var facebook = require('facebook-graph');
    var user = facebook.getUserFromCookie(req.cookies, appId, appSecret);
    if (user) {
        var graph = new facebook.GraphAPI(user['access_token']);
        function print(error, data) {
            console.log(error ? error : data);
        }
        graph.getObject('me', print);
        graph.getConnections('me', 'friends', print);
        graph.putObject('me', 'feed', {message: 'The computerz iz writing on my wallz!1'}, print);
    }


Acknowledgements
----------------

Implementation and documentation ported from the official
[Facebook Python SDK][fb-python-sdk] and [Facebook PHP SDK][fb-php-sdk].

_Thanks for supporting open source, Facebook._

Reporting Issues
----------------

Please file bugs or other issues in our [issues tracker][issues].

[fb-js-sdk]: https://github.com/facebook/connect-js
[fb-graph-api-docs]: http://developers.facebook.com/docs/api
[fb-php-sdk]: https://github.com/facebook/php-sdk
[fb-python-sdk]: https://github.com/facebook/python-sdk
[express-js]: http://expressjs.com
[issues]: https://github.com/gasi/node-facebook/issues
