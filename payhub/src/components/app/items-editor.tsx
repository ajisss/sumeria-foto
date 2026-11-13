import { useState } from 'react'
import { ChevronsUpDown, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CurrencyInput } from '@/components/app/currency-input'
import { lineTotal } from '@/lib/calc'
import { DESC_ITEMS_LIST, PACKAGE_ITEMS_LIST, PACKAGE_ITEM_OTHER } from '@/lib/constants'
import { fmtRp, uid } from '@/lib/format'
import type { DocItem } from '@/lib/types'
import { useT } from '@/i18n'

const descList: readonly string[] = DESC_ITEMS_LIST
const packageList: readonly string[] = PACKAGE_ITEMS_LIST

export function parseDescValue(value?: string) {
  if (!value) return { selected: [] as string[], custom: '' }
  const parts = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return {
    selected: parts.filter((p) => descList.includes(p)),
    custom: parts.filter((p) => !descList.includes(p)).join(', '),
  }
}

export function buildDescValue(selected: string[], custom: string) {
  const out = [...selected]
  if (custom && custom.trim()) out.push(custom.trim())
  return out.join(', ')
}

export function splitDescLines(value?: string) {
  return (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

interface RowProps {
  item: DocItem
  index: number
  onChange: (patch: Partial<DocItem>) => void
  onRemove: () => void
}

function DescriptionPicker({ item, onChange }: { item: DocItem; onChange: (patch: Partial<DocItem>) => void }) {
  const t = useT()
  const { selected, custom } = parseDescValue(item.description)
  const [customOn, setCustomOn] = useState(!!custom)
  const lines = splitDescLines(item.description)

  const toggle = (name: string) => {
    const next = selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]
    onChange({ description: buildDescValue(next, custom) })
  }
  const toggleCustom = (on: boolean) => {
    setCustomOn(on)
    if (!on) onChange({ description: buildDescValue(selected, '') })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={t('item_desc')}
          className="h-auto min-h-8 w-full min-w-44 justify-between whitespace-normal py-1.5 text-left font-normal"
        >
          {lines.length ? (
            <span className="flex flex-col gap-0.5">
              {lines.map((l, i) => (
                <span key={i}>• {l}</span>
              ))}
            </span>
          ) : (
            <span className="text-muted-foreground">{t('item_pick_desc')}</span>
          )}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(22rem,90vw)] p-0">
        <div className="border-b px-3 py-2 text-sm font-medium">{t('item_pick_desc_title')}</div>
        <Command>
          <CommandInput placeholder={t('search_placeholder')} />
          <CommandList>
            <CommandEmpty>{t('sales_no_match')}</CommandEmpty>
            <CommandGroup>
              {descList.map((name) => (
                <CommandItem key={name} value={name} onSelect={() => toggle(name)}>
                  <Checkbox checked={selected.includes(name)} tabIndex={-1} aria-hidden className="pointer-events-none" />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex flex-col gap-2 border-t p-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={customOn} onCheckedChange={(v) => toggleCustom(v === true)} />
            {t('item_custom')}
          </label>
          {customOn && (
            <Input
              autoFocus
              aria-label={t('item_desc_custom_placeholder')}
              placeholder={t('item_desc_custom_placeholder')}
              value={custom}
              onChange={(e) => onChange({ description: buildDescValue(selected, e.target.value) })}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ItemRow({ item, index, onChange, onRemove }: RowProps) {
  const t = useT()
  const [customPkg, setCustomPkg] = useState(!!item.packageItem && !packageList.includes(item.packageItem))

  const pickPackage = (value: string) => {
    if (value === PACKAGE_ITEM_OTHER) {
      setCustomPkg(true)
      onChange({ packageItem: '' })
    } else {
      setCustomPkg(false)
      onChange({ packageItem: value })
    }
  }

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
      <TableCell>
        <Input
          type="date"
          aria-label={t('item_eventdate')}
          value={item.eventDate ?? ''}
          onChange={(e) => onChange({ eventDate: e.target.value })}
        />
      </TableCell>
      <TableCell className="space-y-1.5">
        <Select value={customPkg ? PACKAGE_ITEM_OTHER : (item.packageItem ?? '')} onValueChange={pickPackage}>
          <SelectTrigger className="w-full min-w-44" aria-label={t('item_package')}>
            <SelectValue placeholder={t('item_pick')} />
          </SelectTrigger>
          <SelectContent>
            {PACKAGE_ITEMS_LIST.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
            <SelectItem value={PACKAGE_ITEM_OTHER}>{t('item_custom')}</SelectItem>
          </SelectContent>
        </Select>
        {customPkg && (
          <Input
            aria-label={t('item_pkg_custom_placeholder')}
            placeholder={t('item_pkg_custom_placeholder')}
            value={item.packageItem ?? ''}
            onChange={(e) => onChange({ packageItem: e.target.value })}
          />
        )}
      </TableCell>
      <TableCell>
        <DescriptionPicker item={item} onChange={onChange} />
      </TableCell>
      <TableCell>
        <Input type="number" min={0} aria-label={t('item_qty')} value={item.qty} onChange={(e) => onChange({ qty: e.target.value })} />
      </TableCell>
      <TableCell>
        <CurrencyInput aria-label={t('item_unitprice')} value={item.unitPrice} onChange={(v) => onChange({ unitPrice: v })} />
      </TableCell>
      <TableCell>
        <CurrencyInput aria-label={t('item_discount')} value={item.discount ?? 0} onChange={(v) => onChange({ discount: v })} />
      </TableCell>
      <TableCell className="whitespace-nowrap font-semibold tabular-nums">{fmtRp(lineTotal(item))}</TableCell>
      <TableCell>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={t('delete')} title={t('delete')} onClick={onRemove}>
          <Trash2 className="text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function ItemsEditor({ items, setItems }: { items: DocItem[]; setItems: (items: DocItem[]) => void }) {
  const t = useT()

  const patch = (index: number, p: Partial<DocItem>) => setItems(items.map((it, i) => (i === index ? { ...it, ...p } : it)))
  const add = () =>
    setItems([...items, { id: uid(), eventDate: '', packageItem: '', description: '', qty: 1, unitPrice: 0, discount: 0 }])

  return (
    <div className="space-y-2.5">
      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-9">{t('item_no')}</TableHead>
              <TableHead className="w-36">{t('item_eventdate')}</TableHead>
              <TableHead className="min-w-48">{t('item_package')}</TableHead>
              <TableHead className="min-w-52">{t('item_desc')}</TableHead>
              <TableHead className="w-20">{t('item_qty')}</TableHead>
              <TableHead className="w-32">{t('item_unitprice')}</TableHead>
              <TableHead className="w-28">{t('item_discount')}</TableHead>
              <TableHead className="w-32">{t('item_subtotal')}</TableHead>
              <TableHead className="w-10">
                <span className="sr-only">{t('sales_actions')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-6 text-center text-muted-foreground">
                  {t('item_empty')}
                </TableCell>
              </TableRow>
            )}
            {items.map((item, i) => (
              <ItemRow
                key={item.id}
                item={item}
                index={i}
                onChange={(p) => patch(i, p)}
                onRemove={() => setItems(items.filter((_, idx) => idx !== i))}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <Button type="button" size="sm" variant="secondary" onClick={add}>
        <Plus /> {t('item_add')}
      </Button>
    </div>
  )
}
