import * as auth from './auth'
import * as customers from './customers'
import * as finance from './finance'
import * as overview from './overview'
import * as print from './print'
import * as sales from './sales'
import * as validation from './validation'

export const extraId = { ...customers.id, ...sales.id, ...overview.id, ...finance.id, ...print.id, ...auth.id, ...validation.id }
export const extraEn: Record<keyof typeof extraId, string> = { ...customers.en, ...sales.en, ...overview.en, ...finance.en, ...print.en, ...auth.en, ...validation.en }
