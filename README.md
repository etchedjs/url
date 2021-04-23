# @etchedjs/url

A model to create some URL templates etched objects. 

## A concrete example

### Generic API URL models

```js
import url from '@etchedjs/url'

export const entity = url.extend({
  segments: {
    set entity (value) {
      // to be validated
    }
  }
})

export const entityById = entity.extend({
  segments: {
    set id (value) {
      // to be validated
    }
  }
})

export const entityRelated = entityById.extend({
  segments: {
    set related (value) {
      // to be validated
    }
  }
})
```

### Project-related API URL models, inheriting on the generic ones
```js
export const home = url.extend({
  origin: 'https://domain.tld'
})

export const accounts = entity.extend(home, {
  segments: {
    entity: 'accounts'
  }
})

export const accountById = entityById.extend(accounts)

export const accountFriends = entityRelated.extend(accountById, {
  segments: {
    related: 'friends'
  }
})

export const accountFriendsSearch = accountFriends.extend({
  search: {
    set name (value) {
      // to be validated
    }
  }
})
```

### Usages
```js
const href = 'https://domain.tld/accounts/1/friends?name=Pierre&name=Paul'

console.log(accountFriendsSearch.fill({
  search: {
    name: ['Pierre', 'Paul']
  },
  segments: {
    id: 1
  }
}).toString())
/*
 'https://domain.tld/accounts/1/friends?name=Pierre&name=Paul'
 */

console.log(accountFriendsSearch.parse(href).toString())
/*
 'https://domain.tld/accounts/1/friends?name=Pierre&name=Paul'
 */

console.log(href)
/*
{
  hash: '',
  origin: 'https://domain.tld',
  search: {
    name: [ 'Pierre', 'Paul' ],
    [Symbol(Symbol.iterator)]: [GeneratorFunction: [Symbol.iterator]]
  },
  segments: {
    entity: 'accounts',
    id: '1',
    related: 'friends',
    [Symbol(Symbol.iterator)]: [GeneratorFunction: [Symbol.iterator]]
  },
  parse: [Function: parse],
  toString: [Function: toString]
}
 */
```

## API

The `url` is an **etched model** that can be inherited with the following properties

### hash

Must be a string as described on https://developer.mozilla.org/en-US/docs/Web/API/URL/hash

### Origin

Must be a string as described on https://developer.mozilla.org/en-US/docs/Web/API/URL/origin

### search

Must be an **etched instance** of the default **iterable** `url.search`

### segments

Must be an **etched instance** of the default **iterable** `url.segments`

### extend(...models)

A method that returns a new **model** based on the current one, and the provided models

### fill(...mixins)

A method that returns a new **instance** based on the current one, and the provided mixins

### parse(url)

A method that returns an instance of the current template but **fulfilled** by the provided string

### toSource(trailingSlash = false)

A method that returns a route based on the current instance

### toString(trailingSlash = false)

A method that returns a string based on the current instance


## Licence

MIT
