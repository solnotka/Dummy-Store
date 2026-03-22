import type { ReactNode } from 'react'
import './Panel.css'

type PanelProps = {
  children: ReactNode
  className?: string
}

export function Panel({ children, className }: PanelProps) {
  return <div className={['goods-panel', className].filter(Boolean).join(' ')}>{children}</div>
}
