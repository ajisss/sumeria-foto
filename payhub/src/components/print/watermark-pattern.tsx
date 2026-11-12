import { LOGO_SRC } from '@/lib/brand-assets'

// Kelas ditulis literal supaya terdeteksi Tailwind (grid 5 kolom x 7 baris, titik tengah tiap sel).
const LEFT = ['left-[10%]', 'left-[30%]', 'left-[50%]', 'left-[70%]', 'left-[90%]']
const TOP = ['top-[7.142857%]', 'top-[21.428571%]', 'top-[35.714286%]', 'top-[50%]', 'top-[64.285714%]', 'top-[78.571429%]', 'top-[92.857143%]']

/** Logo berulang miring (-25deg) dengan opacity sangat rendah di belakang dokumen. */
export function WatermarkPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {TOP.flatMap((top) =>
        LEFT.map((left) => (
          <img
            key={`${top}-${left}`}
            src={LOGO_SRC}
            alt=""
            className={`absolute ${top} ${left} h-auto w-[95px] -translate-x-1/2 -translate-y-1/2 -rotate-25 opacity-[0.045]`}
          />
        )),
      )}
    </div>
  )
}
