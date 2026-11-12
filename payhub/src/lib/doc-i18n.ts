// Terjemahan untuk dokumen non-React (PDF & WhatsApp). Di komponen React pakai useT().
import baseEn from '@/i18n/en'
import { extraEn, extraId } from '@/i18n/extra'
import baseId from '@/i18n/id'
import type { Lang, MessageKey } from '@/i18n'
import { CATEGORIES } from './constants'
import type { ExpenseCategory, Payment } from './types'

type DocKey = MessageKey
type Params = Record<string, string | number>

export type DocT = (key: DocKey, params?: Params) => string

export function docT(lang: Lang): DocT {
  const dict: Record<string, string> = lang === 'en' ? { ...baseEn, ...extraEn } : { ...baseId, ...extraId }
  return (key, params) =>
    (dict[key] ?? key).replace(/\{(\w+)\}/g, (_, k: string) => String(params?.[k] ?? `{${k}}`))
}

const STAGE_KEYS: Record<string, DocKey> = {
  'Down Payment': 'print_stage_down',
  'Second Payment': 'print_stage_second',
  'Third Payment': 'print_stage_third',
  'Fourth Payment': 'print_stage_fourth',
  'Paid Full': 'print_stage_full',
}

/** Label termin tersimpan dalam bahasa Inggris; tampilkan sesuai bahasa dokumen. */
export function stageLabel(label: Payment['label'] | null | undefined, t: DocT): string {
  if (!label) return t('print_status_none')
  const key = STAGE_KEYS[label]
  return key ? t(key) : label
}

/** Status tagihan: label termin terakhir yang lunas, atau "belum dibayar" bila belum ada. */
export function statusLabel(status: string | null | undefined, t: DocT): string {
  return status ? stageLabel(status, t) : t('status_unpaid')
}

/** Kategori pengeluaran tersimpan dalam bahasa Inggris ('Project', 'Asset', ...); tampilkan sesuai bahasa. */
export function categoryLabel(category: string | null | undefined, t: DocT): string {
  if (!category || !CATEGORIES.includes(category as ExpenseCategory)) return category ?? ''
  return t(`fin_cat_${category as ExpenseCategory}`)
}

const EXPENSE_ITEM_KEYS: Record<string, DocKey> = {
  'Photographer Half Day': 'i18n_expitem_photographer_half_day',
  'Photographer Full Day': 'i18n_expitem_photographer_full_day',
  'Videographer Half Day': 'i18n_expitem_videographer_half_day',
  'Videographer Full Day': 'i18n_expitem_videographer_full_day',
  'Drone': 'i18n_expitem_drone',
  'Canvas 40x60 Frameless': 'i18n_expitem_canvas_40x60_frameless',
  'Canvas 60x90 Frameless': 'i18n_expitem_canvas_60x90_frameless',
  'Mini Studio up to 6x6 Meter': 'i18n_expitem_mini_studio_up_to_6x6_meter',
  'Same Day Edit': 'i18n_expitem_same_day_edit',
  'Album 20x30 cm (22 Pages)': 'i18n_expitem_album_20x30_cm_22_pages',
  'Full Documentation 2 Hours (2 Crew)': 'i18n_expitem_full_documentation_2_hours_2_crew',
  'Full Clip Video Max 15 Minutes': 'i18n_expitem_full_clip_video_max_15_minutes',
  'Highlight Video 3 Minutes': 'i18n_expitem_highlight_video_3_minutes',
  'Teaser Video 1 Minute': 'i18n_expitem_teaser_video_1_minute',
  'Studio Partner': 'i18n_expitem_studio_partner',
  'Others': 'i18n_expitem_others',
  'Endorsement': 'i18n_expitem_endorsement',
  'KOL / Influencer': 'i18n_expitem_kol_influencer',
  'Meta Ads': 'i18n_expitem_meta_ads',
  'Google Ads': 'i18n_expitem_google_ads',
  'TikTok Ads': 'i18n_expitem_tiktok_ads',
  'Subscription': 'i18n_expitem_subscription',
  'Monthly Salary': 'i18n_expitem_monthly_salary',
}

/** Nama item pengeluaran preset tersimpan dalam bahasa Inggris; item bebas (ketikan user) tampil apa adanya. */
export function expenseItemLabel(name: string | null | undefined, t: DocT): string {
  if (!name) return ''
  const key = EXPENSE_ITEM_KEYS[name]
  return key ? t(key) : name
}

/** Gender tersimpan sebagai 'Female' / 'Male'. */
export function genderLabel(gender: string | null | undefined, t: DocT): string {
  if (gender === 'Female') return t('cust2_gender_female')
  if (gender === 'Male') return t('cust2_gender_male')
  return gender ?? ''
}

export function splitDescLines(desc?: string) {
  return (desc || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
