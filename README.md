# @etchedjs/url

A model to create some URL templates etched objects. 

## A concrete example

### Generic API URL models

```js
import { etch, model } from '@etchedjs/etched'
import url from '@etchedjs/url'

export const entity = etch(url, {
  segments: model(url.segments, {
    set entity (value) {
      // to be validated
    }
  })
})

export const entityById = etch(entity, {
  segments: model(entity.segments, {
    set id (value) {
      // to be validated
    }
  })
})

export const entityRelated = etch(entityById, {
  segments: model(entityById.segments, {
    set related (value) {
      // to be validated
    }
  })
})
```

### Project-related API URL models, inheriting on the generic ones
```js
export const accounts = etch(entity, {
  segments: model(entity.segments, {
    entity: 'accounts'
  })
})

export const accountById = etch(entityById, accounts, {
  segments: model(entityById.segments, accounts.segments)
})

export const accountFriends = etch(entityRelated, accountById, {
  segments: model(entityRelated.segments, accountById.segments, {
    related: 'friends'
  })
})

export const accountFriendsSearch = etch(accountFriends, {
  search: model(accountFriends.search, {
    set name (value) {
      // to be validated
    }
  })
})
```

### Usages
```js
const href = accountFriendsSearch.parse('https://domain.tld/accounts/1/friends?name=Pierre&name=Paul')

console.log(href.toString()) // 'https://domain.tld/accounts/1/friends?name=Pierre&name=Paul'
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

### parse(url)

A method that returns an instance of the current template but **fulfilled** by the provided string

### toSource(trailingSlash = false)

A method that returns a route based on the current instance

### toString(trailingSlash = false)

A method that returns a string based on the current instance


## Licence

MIT
