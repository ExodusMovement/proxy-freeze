const proxyIdentifier = Symbol('proxy-freeze-identifier')

const warn = (msg) => {
  // browser?
  if (typeof process === 'undefined') {
    (console.warn.bind(console) || console.error.bind(console) || console.log.bind(console))(msg)
  } else {
    process.emitWarning(msg, 'ProxyFreezeWarning')
  }
}

const proxyHandler = {
  construct: (Target, args) => {
    return new Proxy(new Target(...args), proxyHandler)
  },

  set: (target, prop, val) => {
    warn(`Trying to set value of property (${prop}) of frozen object.`)
  }
}

const identifiableProxyHandler = {
  ...proxyHandler,
  get: (target, key) => {
    if (key === proxyIdentifier) return true
    return target[key]
  }
}

function proxyFreeze (target, { addProxyIdentifier = false, preventRefreeze = false } = {}) {
  if (typeof target !== 'function' && typeof target !== 'object') {
    throw new Error('proxyFreeze only supports constructor functions or objects.')
  }
  if (typeof addProxyIdentifier !== 'boolean') {
    throw new TypeError('addProxyIdentifier needs to be a boolean.')
  }
  if (typeof preventRefreeze !== 'boolean') {
    throw new TypeError('preventRefreeze needs to be a boolean.')
  }
  if (preventRefreeze && !addProxyIdentifier) {
    throw new Error('cannot use preventRefreeze without addProxyIdentifier.')
  }

  if (target && target[proxyIdentifier]) {
    if (preventRefreeze) return target

    warn('Trying to freeze an already frozen object.')
  }

  if (addProxyIdentifier) return new Proxy(target, identifiableProxyHandler)
  return new Proxy(target, proxyHandler)
}

module.exports = proxyFreeze
module.exports.proxyIdentifier = proxyIdentifier
