import type id from './id'
import type { extraId } from './extra'

export type MessageKey = keyof typeof id | keyof typeof extraId
