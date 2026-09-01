import {
  formatClock,
  formatNumber,
  formatToman,
} from '../../../../utils/format'

type RequestStatus = 'incoming' | 'processing' | 'completed'

export interface DepositRequest {
  id: string
  provinceId: string | number
  provinceName: string
  purpose: string
  amount: number
  status: RequestStatus
  origin: string
  recipients: number
  createdAt: number
  startedAt?: number
  duration: number
}

interface FeaturedRequestProps {
  request: DepositRequest | null
  now: number
  concurrent: DepositRequest[]
}

export default function FeaturedRequest({
  request,
  now,
  concurrent,
}: FeaturedRequestProps) {
  if (!request) {
    return (
      <aside className="panel featured-panel is-empty">
        <div className="panel-head">
          <h2>درخواست فعلی</h2>
        </div>

        <p className="empty-copy">
          در انتظار ورود درخواست جدید از استان‌ها…
        </p>
      </aside>
    )
  }

  const started = request.startedAt ?? request.createdAt
  const elapsed = Math.max(0, now - started)

  const progress =
    request.status === 'completed'
      ? 100
      : request.status === 'incoming'
        ? 8
        : Math.min(99, (elapsed / request.duration) * 100)

  return (
    <aside className="panel featured-panel">
      <div className="panel-head">
        <h2>درخواست فعلی</h2>

        <span className={`status-pill ${request.status}`}>
          {request.status === 'processing'
            ? 'در حال واریز گروهی'
            : request.status === 'incoming'
              ? 'ورود درخواست'
              : 'تکمیل'}
        </span>
      </div>

      <div className="featured-hero" key={request.id}>
        <p className="eyebrow">استان مبدأ</p>
        <h3>{request.provinceName}</h3>
        <p className="featured-purpose">{request.purpose}</p>

        <div className="featured-amount">
          <strong>{formatToman(request.amount)}</strong>
          <span>تومان</span>
        </div>
      </div>

      <div className="progress-block">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="progress-meta">
          <span>{request.id}</span>
          <span>{formatNumber(Math.round(progress))}٪</span>
        </div>
      </div>

      <dl className="featured-grid">
        <div>
          <dt>مبدأ سازمانی</dt>
          <dd>{request.origin}</dd>
        </div>

        <div>
          <dt>ذی‌نفعان</dt>
          <dd>{formatNumber(request.recipients)} نفر</dd>
        </div>

        <div>
          <dt>ساعت ورود</dt>
          <dd>{formatClock(request.createdAt)}</dd>
        </div>

        <div>
          <dt>وضعیت صف</dt>
          <dd>
            {concurrent.length > 1
              ? `${formatNumber(concurrent.length)} استان همزمان`
              : 'تک‌جریان'}
          </dd>
        </div>
      </dl>

      {concurrent.length > 1 && (
        <div className="concurrent">
          <h4>واریز همزمان در استان‌های دیگر</h4>

          <ul>
            {concurrent
              .filter((item) => item.id !== request.id)
              .map((item) => (
                <li key={item.id}>
                  <b>{item.provinceName}</b>
                  <span>{formatToman(item.amount)}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </aside>
  )
}