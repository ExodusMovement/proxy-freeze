
const proxyHandler = {
  construct: (Target, args) => {
    return new Proxy(new Target(...args), proxyHandler)
  },

  set: (target, prop, val) => {
    const msg = `Trying to set value of property (${prop}) of frozen object.`
    // browser?
    if (typeof process === 'undefined') {
      (console.warn || console.error || console.log).bind(console)(msg);
    } else {
      process.emitWarning(msg, 'ProxyFreezeWarning')
    }
  }
}

function proxyFreeze (target) {
  if (typeof target !== 'function' && typeof target !== 'object') {
    throw new Error('proxyFreeze only supports constructor functions or objects.')
  }

  return new Proxy(target, proxyHandler)
}

module.exports = proxyFreeze
