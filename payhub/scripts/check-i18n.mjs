#!/usr/bin/env node
// i18n consistency check (no dependencies).
// Fails when: id/en key sets differ, {placeholders} differ, or a t('literal') call references a missing key.
// Also reports unused keys (warning only; use --strict-unused to fail on them).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const strictUnused = process.argv.includes('--strict-unused')

function parseDict(text) {
  const out = {}
  const re = /^\s*["']?([A-Za-z0-9_]+)["']?\s*:\s*("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')\s*,?\s*$/gm
  let m
  while ((m = re.exec(text))) out[m[1]] = new Function(`return ${m[2]}`)()
  return out
}

const read = (p) => readFileSync(join(src, p), 'utf8')
const idBase = parseDict(read('i18n/id.ts'))
const enBase = parseDict(read('i18n/en.ts'))
const dicts = { id: { ...idBase }, en: { ...enBase } }
const errors = []
const warnings = []

for (const name of readdirSync(join(src, 'i18n/extra')).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  const text = read(`i18n/extra/${name}`)
  const cut = text.indexOf('export const en')
  if (cut < 0) { errors.push(`extra/${name}: missing "export const en"`); continue }
  const id = parseDict(text.slice(0, cut))
  const en = parseDict(text.slice(cut))
  for (const k of Object.keys(id)) if (k in dicts.id) errors.push(`duplicate key across dictionaries: ${k} (extra/${name})`)
  Object.assign(dicts.id, id)
  Object.assign(dicts.en, en)
}

// 1. key parity
const idKeys = new Set(Object.keys(dicts.id))
const enKeys = new Set(Object.keys(dicts.en))
for (const k of idKeys) if (!enKeys.has(k)) errors.push(`key missing in en: ${k}`)
for (const k of enKeys) if (!idKeys.has(k)) errors.push(`key missing in id: ${k}`)

// 2. placeholder parity
const ph = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',')
for (const k of idKeys) {
  if (!enKeys.has(k)) continue
  if (ph(dicts.id[k]) !== ph(dicts.en[k])) errors.push(`placeholder mismatch in ${k}: id{${ph(dicts.id[k])}} en{${ph(dicts.en[k])}}`)
  if (dicts.id[k].trim() === '' || dicts.en[k].trim() === '') errors.push(`empty value: ${k}`)
}

// 3. source scan
function walk(dir, acc = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (/\.(ts|tsx)$/.test(f)) acc.push(p)
  }
  return acc
}
const files = walk(src).filter((p) => !p.startsWith(join(src, 'i18n')))
const used = new Set()
const prefixes = new Set()

/** first argument text of a call starting at index of "(" */
function firstArg(text, open) {
  let depth = 0, quote = null, i = open + 1, start = i
  for (; i < text.length; i++) {
    const c = text[i]
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue }
    if ('([{'.includes(c)) depth++
    else if (')]}'.includes(c)) { if (depth === 0) break; depth-- }
    else if (c === ',' && depth === 0) break
  }
  return text.slice(start, i)
}

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const rel = relative(root, file)
  // any string literal equal to a key counts as usage
  for (const m of text.matchAll(/(["'`])([A-Za-z][A-Za-z0-9_]*)\1/g)) if (idKeys.has(m[2])) used.add(m[2])
  // template prefixes, e.g. `nav_${x}`
  for (const m of text.matchAll(/`([A-Za-z0-9_]*_)\$\{/g)) prefixes.add(m[1])
  // t(...) / docT(...) call arguments
  for (const m of text.matchAll(/(?<![\w.])t\(/g)) {
    const arg = firstArg(text, m.index + m[0].length - 1)
    const line = text.slice(0, m.index).split('\n').length
    for (const lit of arg.matchAll(/(["'])([^"'\n]*)\1/g)) {
      const v = lit[2]
      if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(v)) continue
      if (!idKeys.has(v)) errors.push(`${rel}:${line}: t('${v}') references a missing key`)
    }
    for (const tpl of arg.matchAll(/`([A-Za-z0-9_]*)\$\{/g)) {
      if (![...idKeys].some((k) => k.startsWith(tpl[1]))) errors.push(`${rel}:${line}: dynamic key prefix "${tpl[1]}" matches no key`)
    }
  }
}
for (const p of prefixes) for (const k of idKeys) if (k.startsWith(p)) used.add(k)

const unused = [...idKeys].filter((k) => !used.has(k))
if (unused.length) (strictUnused ? errors : warnings).push(`unused keys (${unused.length}): ${unused.join(', ')}`)

for (const w of warnings) console.warn('WARN  ' + w)
if (errors.length) {
  for (const e of errors) console.error('ERROR ' + e)
  console.error(`\ni18n check FAILED (${errors.length} problem${errors.length > 1 ? 's' : ''})`)
  process.exit(1)
}
console.log(`i18n check OK: ${idKeys.size} keys, id/en parity, placeholders match, all t() literals resolve.`)
