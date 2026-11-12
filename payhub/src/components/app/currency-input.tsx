import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value: number | string
  onChange: (value: number) => void
}

/** Input angka dengan pemisah ribuan (id-ID). Value yang dikembalikan selalu number. */
export function CurrencyInput({ value, onChange, className, ...rest }: Props) {
  const n = Number(value) || 0
  return (
    <Input
      {...rest}
      inputMode="numeric"
      className={cn('tabular-nums', className)}
      value={n ? n.toLocaleString('id-ID') : ''}
      onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
    />
  )
}
