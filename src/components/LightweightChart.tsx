import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

export function LightweightChart({ tone = '#14B8A6' }: { tone?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const chart = createChart(ref.current, {
      layout: { background: { type: ColorType.Solid, color: '#13262F' }, textColor: '#8FA6AD' },
      grid: { vertLines: { color: '#1F3942' }, horzLines: { color: '#1F3942' } },
      rightPriceScale: { borderColor: '#1F3942' },
      timeScale: { borderColor: '#1F3942' },
      crosshair: { vertLine: { color: '#3b5965' }, horzLine: { color: '#3b5965' } },
    })
    const series = chart.addAreaSeries({ lineColor: tone, topColor: `${tone}55`, bottomColor: `${tone}08` })
    series.setData(Array.from({ length: 40 }, (_, i) => ({ time: 1710000000 + i * 3600, value: 100 + i * 2 + (i > 24 ? -(i - 24) * 1.4 : 0) })))
    const ro = new ResizeObserver(() => chart.applyOptions({ width: ref.current?.clientWidth ?? 300, height: ref.current?.clientHeight ?? 180 }))
    ro.observe(ref.current)
    return () => { ro.disconnect(); chart.remove() }
  }, [tone])
  return <div ref={ref} className="h-40 w-full" />
}
