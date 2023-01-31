const test = require('tape')
const proxyFreeze = require('./')

test('should freze a regular object', t => {
  t.plan(2)

  let obj = {
    name: 'jp'
  }

  let obj2 = proxyFreeze(obj)
  obj2.name = 'bob'

  process.once('warning', ({ name }) => {
    t.is(name, 'ProxyFreezeWarning', 'proper warning type')
    t.end()
  })

  t.is(obj2.name, 'jp', 'name didnt change')
})

test('should freeze objects from constructor', t => {
  t.plan(2)

  class Person {
    constructor (name) {
      this.name = name
    }
  }

  const FrozenPerson = proxyFreeze(Person)
  const p = new FrozenPerson('jp')
  p.name = 'bob'

  process.once('warning', ({ name }) => {
    t.is(name, 'ProxyFreezeWarning', 'proper warning type')
    t.end()
  })

  t.is(p.name, 'jp', 'name didnt change')
})

test('should not identify proxy if addProxyIdentifier not set or false', t => {
  t.plan(2)

  let obj = {
    name: 'jp'
  }

  let obj2 = proxyFreeze(obj)
  t.is(obj2[proxyFreeze.proxyIdentifier], undefined, 'Proxy is not identified')

  let obj3 = proxyFreeze(obj, { addProxyIdentifier: false })
  t.is(obj3[proxyFreeze.proxyIdentifier], undefined, 'Proxy is not identified')
  t.end()
})

test('should identify proxy if addProxyIdentifier is true', t => {
  t.plan(1)

  let obj = {
    name: 'jp'
  }

  let obj2 = proxyFreeze(obj, { addProxyIdentifier: true })

  t.is(obj2[proxyFreeze.proxyIdentifier], true, 'Proxy is identified')
  t.end()
})
