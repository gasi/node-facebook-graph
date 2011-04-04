# Changelog: Facebook Node.js SDK

## Version 0.0.6 – April 4, 2011

  - Fixed bug in `getUserFromSignedRequest`: Missed `this` qualifier for call
    to `decodeSignedRequest` and `data` qualifier for `oauth_token`.

## Version 0.0.5 – April 3, 2011

  - Added `getUserFromSignedRequest` function.
  - Added tests for `decodeSignedRequest` and `base64URLDecode`.

## Version 0.0.4 – March 26, 2011

  - Implemented MD5 hashing using `crypto` module.
  - Removed dependency on `hashlib`.

## Version 0.0.3 – March 21, 2011

  - Initial release.
