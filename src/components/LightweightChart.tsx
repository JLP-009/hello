import { useEffect, useRef } from 'react'
import { AreaSeries, ColorType, createChart } from 'lightweight-charts'

export function LightweightChart({ tone = '#14B8A6' }: { tone?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const container = ref.current
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#13262F' },
        textColor: '#8FA6AD',
      },
      grid: {
        vertLines: { color: '#1F3942' },
        horzLines: { color: '#1F3942' },
      },
      rightPriceScale: { borderColor: '#1F3942' },
      timeScale: { borderColor: '#1F3942' },
      crosshair: {
        vertLine: { color: '#3b5965' },
        horzLine: { color: '#3b5965' },
      },
    })

    const areaSeries = 'addAreaSeries' in chart
      ? chart.addAreaSeries({ lineColor: tone, topColor: `${tone}55`, bottomColor: `${tone}08` })
      : chart.addSeries(AreaSeries, { lineColor: tone, topColor: `${tone}55`, bottomColor: `${tone}08` })

    areaSeries.setData(
      Array.from({ length: 40 }, (_, i) => ({
        time: (1710000000 + i * 3600) as never,
        value: 100 + i * 2 + (i > 24 ? -(i - 24) * 1.4 : 0),
      })),
    )

    const onResize = () => {
      chart.applyOptions({ width: container.clientWidth, height: container.clientHeight })
    }

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onResize)
      observer.observe(container)
    } else {
      window.addEventListener('resize', onResize)
    }

    onResize()

    return () => {
      if (observer) observer.disconnect()
      else window.removeEventListener('resize', onResize)
      chart.remove()
    }
  }, [tone])

  return <div ref={ref} className="h-40 w-full" />
}
