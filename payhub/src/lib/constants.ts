import type { ExpenseCategory, PlanKey } from './types'

export const PROJECT_ITEMS = [
  'Photographer Half Day',
  'Photographer Full Day',
  'Videographer Half Day',
  'Videographer Full Day',
  'Drone',
  'Canvas 40x60 Frameless',
  'Canvas 60x90 Frameless',
  'Mini Studio up to 6x6 Meter',
  'Same Day Edit',
  'Album 20x30 cm (22 Pages)',
  'Full Documentation 2 Hours (2 Crew)',
  'Full Clip Video Max 15 Minutes',
  'Highlight Video 3 Minutes',
  'Teaser Video 1 Minute',
  'Studio Partner',
  'Others',
] as const

export const MARKETING_ITEMS = [
  'Endorsement',
  'KOL / Influencer',
  'Meta Ads',
  'Google Ads',
  'TikTok Ads',
  'Subscription',
  'Monthly Salary',
  'Others',
] as const

export const PACKAGE_ITEMS_LIST = [
  'Wedding Gold Halfday',
  'Wedding Diamond Halfday',
  'Wedding Exclusive Halfday',
  'Wedding Gold Fullday',
  'Wedding Diamond Fullday',
  'Wedding Exclusive Fullday',
  'Candid Wedding Halfday',
  'Candid Wedding Fullday',
  'Couple Session Gold',
  'Couple Session Diamond',
  'Couple Session Exclusive',
  'Special Event Gold',
  'Special Event Diamond',
  'Special Event Exclusive',
  'Additional',
] as const

/** Sentinel value lama; dipertahankan agar data lama tetap cocok. */
export const PACKAGE_ITEM_OTHER = 'Lainnya - (isi sendiri)'

export const DESC_ITEMS_LIST = [
  'Photographer',
  'Videographer',
  'Assistant',
  'Drone',
  'Same Day Edit',
  'Canvas 40 x 60 frameless',
  'Canvas 60 x 90 frameless',
  'Mini Studio up to 6 x 6 meter',
  'Album 20 x 30 cm - 22 pages',
  'Full Doc. 2 Hour (2 Crew)',
  'Full Clip Video max. 15 min',
  'Extra Revision Video',
  'Revision Video Backsound',
  'Add Photo Edit /15 Photos',
  'Wedding Content Creator',
  'Studio Partner',
  'Charge Extra Time',
] as const

export const DESC_ITEM_OTHER = 'Lainnya - (isi sendiri)'

export const PLAN_STAGES: Record<PlanKey, string[]> = {
  '2x': ['Down Payment', 'Paid Full'],
  '3x': ['Down Payment', 'Second Payment', 'Paid Full'],
  '4x': ['Down Payment', 'Second Payment', 'Third Payment', 'Paid Full'],
  '5x': ['Down Payment', 'Second Payment', 'Third Payment', 'Fourth Payment', 'Paid Full'],
}

export const PLAN_PERCENTS: Record<PlanKey, number[]> = {
  '2x': [30, 70],
  '3x': [30, 35, 35],
  '4x': [30, 23.333, 23.333, 23.334],
  '5x': [30, 17.5, 17.5, 17.5, 17.5],
}

export const CATEGORIES: ExpenseCategory[] = ['Project', 'Marketing', 'Asset', 'Salary', 'Other']

export const NAV_KEYS = [
  'home',
  'customers',
  'quotations',
  'invoices',
  'orders',
  'orderDetails',
  'calendar',
  'expenses',
  'ledger',
  'margin',
  'bestsellers',
  'masterDashboard',
] as const

export type TabKey = (typeof NAV_KEYS)[number]

/** Info rekening yang dipakai di pesan WhatsApp & PDF (dari versi lama). */
export const BANK_INFO = 'BCA 8761141988 an. Mochamad Annas Afan'
