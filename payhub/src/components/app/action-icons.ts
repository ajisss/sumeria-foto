/**
 * Icon mapping: one action = one icon across the whole app. Every text button gets its icon from here
 * (children `<Icon />` before the label, shadcn Button sizes the svg automatically).
 *
 *   add/create -> Plus          save -> Save            cancel/close/remove-row -> X
 *   delete -> Trash2            edit -> Pencil          view/open detail -> Eye
 *   export/download -> Download upload/restore -> Upload print -> Printer
 *   whatsapp -> MessageCircle   convert -> ArrowRight   confirm/paid -> Check
 *   prev/next -> ChevronLeft/ChevronRight               search -> Search
 *   login -> LogIn   register -> UserPlus   logout -> LogOut   password show/hide -> Eye / EyeOff
 *   busy -> Loader2 (animate-spin)   fill-from-document -> FileText   customer -> UserRound
 *
 * Kept text-only (not action buttons): calendar day cells, dashboard tiles/overdue rows (card-like
 * navigation surfaces that already carry icons or sibling icon buttons).
 */
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, Download, Eye, EyeOff, FileText, Loader2, LogIn, LogOut,
  MessageCircle, Pencil, Plus, Printer, Save, Search, Trash2, Upload, UserPlus, UserRound, X,
} from 'lucide-react'

export const ACTION_ICONS = {
  add: Plus,
  save: Save,
  cancel: X,
  close: X,
  delete: Trash2,
  edit: Pencil,
  view: Eye,
  export: Download,
  download: Download,
  upload: Upload,
  print: Printer,
  whatsapp: MessageCircle,
  convert: ArrowRight,
  confirm: Check,
  fill: FileText,
  customer: UserRound,
  prev: ChevronLeft,
  next: ChevronRight,
  search: Search,
  login: LogIn,
  register: UserPlus,
  logout: LogOut,
  showPassword: Eye,
  hidePassword: EyeOff,
  busy: Loader2,
} as const
