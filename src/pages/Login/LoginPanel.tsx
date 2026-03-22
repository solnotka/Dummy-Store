import type { ReactNode } from 'react'
import './LoginPanel.css'

export type LoginPanelProps = {
  children: ReactNode
}

export function LoginPanel({ children }: LoginPanelProps) {
  return (
    <div className="login-panel">
      <div className="login-panel-shell">{children}</div>
    </div>
  )
}
