import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useT } from '@/i18n'

/** Password field with a show/hide (eye) toggle as trailing addon. Pass `id`, `aria-invalid`, etc. as for an input. */
export function PasswordInput({ ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  const t = useT()
  const [visible, setVisible] = useState(false)
  const label = visible ? t('auth_hide_password') : t('auth_show_password')
  return (
    <InputGroup>
      <InputGroupInput {...props} type={visible ? 'text' : 'password'} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label={label} title={label} aria-pressed={visible} onClick={() => setVisible((v) => !v)}>
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
