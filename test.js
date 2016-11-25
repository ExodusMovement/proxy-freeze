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
