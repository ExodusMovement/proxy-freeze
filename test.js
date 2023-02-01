const test = require('tape')
const proxyFreeze = require('./')

test('should freze a regular object', t => {
  t.plan(2)

  const obj = {
    name: 'jp'
  }

  const obj2 = proxyFreeze(obj)
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

  const obj = {
    name: 'jp'
  }

  const obj2 = proxyFreeze(obj)
  t.is(obj2[proxyFreeze.proxyIdentifier], undefined, 'Proxy is not identified')

  const obj3 = proxyFreeze(obj, { addProxyIdentifier: false })
  t.is(obj3[proxyFreeze.proxyIdentifier], undefined, 'Proxy is not identified')
  t.end()
})

test('should identify proxy if addProxyIdentifier is true', t => {
  t.plan(1)

  const obj = {
    name: 'jp'
  }

  const obj2 = proxyFreeze(obj, { addProxyIdentifier: true })

  t.is(obj2[proxyFreeze.proxyIdentifier], true, 'Proxy is identified')
  t.end()
})

test('cannot use preventRefreeze without addProxyIdentifier', t => {
  t.plan(2)

  const obj = {
    name: 'jp'
  }

  t.throws(() => proxyFreeze(obj, { preventRefreeze: true }), 'cannot use preventRefreeze without addProxyIdentifier.')
  const obj2 = proxyFreeze(obj, { preventRefreeze: true, addProxyIdentifier: true })
  t.is(obj2[proxyFreeze.proxyIdentifier], true, 'can use preventRefreeze with addProxyIdentifier.')

  t.end()
})

test('shoud not re-freeze if preventRefreeze is true', t => {
  t.plan(1)

  const obj = {
    name: 'jp'
  }

  const obj2 = proxyFreeze(obj, { preventRefreeze: true, addProxyIdentifier: true })
  const obj3 = proxyFreeze(obj2, { preventRefreeze: true, addProxyIdentifier: true })
  t.is(obj2, obj3, 'we don\'t re-freeze.')

  t.end()
})

test('shoud re-freeze if preventRefreeze is false', t => {
  t.plan(1)

  const obj = {
    name: 'jp'
  }

  const obj2 = proxyFreeze(obj)
  const obj3 = proxyFreeze(obj2)
  t.isNot(obj2, obj3, 'we re-freeze.')

  t.end()
})
