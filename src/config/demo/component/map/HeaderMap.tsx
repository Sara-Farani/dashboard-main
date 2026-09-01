import type { FC } from 'react'

import { formatClock, formatDateFa } from '../../../../utils/format'

import mellatLogo from '../../../../assets/images/mellat-logo-02.png'

import '../../../../styles/iran.map.card.css'

interface HeaderProps {
  now: Date | number
  paused: boolean
  onToggle: () => void
  onBurst: () => void
}

const HeaderMap: FC<HeaderProps> = ({
  now,
  paused,
  onToggle,
  onBurst,
}) => {
  return (
    <header className="hud-header">
      <div className="brand">
        <img
          src={mellatLogo}
          alt="لوگوی بانک ملت"
          className="h-10 w-10 shrink-0 object-contain"
        />
        <div>
          <p className="brand-kicker">Bank Mellat</p>
          <h1>مانیتورینگ واریز/برداشت گروهی</h1>
        </div>
      </div>

      <div className="header-meta">
        {/* <div className="live-chip">
          <i className={paused ? 'is-paused' : ''} />
          <span>{paused ? 'متوقف' : 'زنده'}</span>
        </div> */}

        <div className="clock-block">
          <strong>{formatClock(now)}</strong>
          <small>{formatDateFa(now)}</small>
        </div>

        <div className="header-actions">
          {/* <button type="button" className="ghost-btn" onClick={onToggle}>
            {paused ? 'ادامه جریان' : 'مکث شبیه‌سازی'}
          </button> */}

          {/* <button
            type="button"
            className="ghost-btn accent"
            onClick={onBurst}
          >
            ورود همزمان
          </button> */}
        </div>
        <div className="brand-mark" aria-hidden="true">          
          <span />
          <span />
          <span />
        </div>        
      </div>
    </header>
  )
}

export default HeaderMap