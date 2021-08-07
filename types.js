import { model } from '@etchedjs/etched'
import type, * as types from '@etchedjs/type'
export * from '@etchedjs/type'
export default type

export const nonEmptyString = model(types.string, {
  set value (value) {
    if (!value.length) {
      throw new TypeError('Must be non-empty')
    }
  }
})
