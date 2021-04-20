import { etch, etches, fulfill, iterable, model } from '@etchedjs/etched'

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

function route (name) {
  return this[name] ?? `:${name}`
}

function validate ({ origin }, parsed, paths) {
  return parsed.origin === origin &&
    new URL(parsed).pathname === ['', ...paths].join('/')
}

export default etch(model({
  set hash (value) {
    if (typeof value !== 'string') {
      throw new TypeError('Must be a string')
    }
  },
  set origin (value) {
    if (typeof value !== 'string') {
      throw new TypeError('Must be a string')
    }

    if (!value.length) {
      throw new TypeError('Must be non-empty')
    }
  },
  set search (value) {
    if (!etches(search, value)) {
      throw new TypeError('Must be a search')
    }
  },
  set segments (value) {
    if (!etches(segments, value)) {
      throw new TypeError('Must be a segments')
    }
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
    const { origin, segments } = this
    const paths = keys(getPrototypeOf(segments)).map(route, segments)
    const url = new URL(`/${paths.join('/')}${trailingSlash ? '/' : ''}`, origin)

    return url.pathname
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
