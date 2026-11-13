import { MessageCircle, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useT } from '@/i18n'

/** Menu cetak / kirim: Export PDF dan (opsional) WhatsApp. */
export function PrintMenu({ onExportPdf, onWhatsApp }: { onExportPdf: () => void; onWhatsApp?: () => void }) {
  const t = useT()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={t('print_menu_title')} title={t('print_menu_title')}>
          <Printer />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onExportPdf}>
          <Printer /> {t('print_menu_export')}
        </DropdownMenuItem>
        {onWhatsApp && (
          <DropdownMenuItem onSelect={onWhatsApp}>
            <MessageCircle /> {t('print_menu_whatsapp')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
