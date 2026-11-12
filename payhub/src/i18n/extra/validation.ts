// Kunci terjemahan untuk validasi backup. Parity id/en dijaga oleh tipe.
export const id = {
  val_backup_issues: 'File cadangan tidak valid: {issues}',
  val_backup_dropped: '{count} data tidak sesuai format, tetap dipertahankan apa adanya.',
} as const

export const en: Record<keyof typeof id, string> = {
  val_backup_issues: 'Invalid backup file: {issues}',
  val_backup_dropped: '{count} records do not match the expected format and were kept as-is.',
}
