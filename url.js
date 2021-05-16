import { etch, etched, etches, fulfill, iterable, model } from '@etchedjs/etched'
import type, * as types from './type.js'

const { entries, freeze, fromEntries, getPrototypeOf, keys } = Object

const append = ({ name, url }, value) => {
  if (value ?? null) {
    url.searchParams.append(name, value)
  }

  return { name, url }
}

const fill = (url, [name, values]) =>
  [values].flat().reduce(append, { name, url }).url

const search = model(iterable)

const segments = model(iterable)

function param ([name]) {
  return [name, freeze(this.getAll(name))]
}

function segment (name, key) {
  return [name, this[key]]
}

function path (name) {
  return this[name]
}

function reduce (url, extensions, method) {
  return extensions.reduce((url, extension) =>
    etch(url, etches(etched, extension) ? extension : {}, {
      ...extension,
      ...extension.search && {
        search: method(url.search, extension.search)
      },
      ...extension.segments && {
        segments: method(url.segments, extension.segments)
      }
    }), etch(url))
}

function route (name) {
  return this[name] ?? `:${name}`
}

function validate ({ origin }, parsed, paths) {
  return parsed.origin === origin &&
    new URL(parsed).pathname === `/${paths.join('/')}`
}

export default etch(model(
  type('hash', types.string, e => e(), true),
  type('origin', types.nonEmptyString, e => e()),
  type('search', types.etched(search), e => e()),
  type('segments', types.etched(segments), e => e()),
  {
    extend (...models) {
      return reduce(this, models, model)
    },
    fill (...mixins) {
      return reduce(this, mixins, etch)
    },
    parse (url) {
      const { hash, origin, pathname, searchParams } = new URL(url, this.origin)
      const params = [...searchParams]
      const { search, segments } = this
      const paths = pathname.split('/').filter(Boolean)
      const names = keys(getPrototypeOf(segments))

      const parsed = fulfill(this, {
        hash,
        origin,
        segments: fulfill(segments, fromEntries(names.map(segment, paths))),
        search: fulfill(search, fromEntries(params.map(param, searchParams)))
      })

      if (!validate(this, parsed, paths)) {
        throw new Error('Mismatching url')
      }

      return parsed
    },
    toRoute (trailingSlash = false) {
      const { segments } = this
      const paths = keys(getPrototypeOf(segments)).map(route, segments)

      return `/${paths.join('/')}${trailingSlash ? '/' : ''}`
    },
    toString (trailingSlash = false) {
      const { hash = '', origin, segments, search } = this
      const paths = keys(getPrototypeOf(segments)).map(path, segments)
      const url = new URL(`/${paths.join('/')}${trailingSlash ? '/' : ''}`, origin)

      entries(search).reduce(fill, url)
      url.hash = hash

      return `${url}`
    }
  }), { search, segments })
