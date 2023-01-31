proxy-freeze
=============

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/proxy-freeze.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/proxy-freeze
[travis-image]: https://img.shields.io/travis/jprichardson/proxy-freeze.svg?style=flat-square
[travis-url]: https://travis-ci.org/jprichardson/proxy-freeze
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

A simple way to freeze JavaScript objects and know of attempted modifications.

Why?
----

Why not just use [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) and [Object.isFrozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)?

If you use `Object.freeze` and later set a property on that object, it silently fails unless in `strict` mode. Also, using this technique gives you the ability to listen for warnings on the `warning` event.


Install
-------

    npm install --save proxy-freeze


Usage
-----

### proxyFreeze(target, options)

- **target**: can be either an `object` or constructor `function`
- **options**
   - **addProxyIdentifier**: `boolean`, adds a symbol getter that detects Proxies created via this method. Defaults to `false`.
   - **preventRefreeze**: `boolean`, uses symbol added via `addProxyIdentifier` to identify frozen Proxies and doesn't re-freeze them. Defaults to `false`.

```js
let obj = {
  name: 'jp'
}

let obj2 = proxyFreeze(obj)
obj2.name = 'bob'

process.once('warning', (warning) => {
  console.warn(warning.name) // => ProxyFreezeWarning
  console.warn(warning.message) // => Trying to set value of property (name) of frozen object.
  console.warn(warning.stack)
})
```


License
-------

[MIT](LICENSE.md)
