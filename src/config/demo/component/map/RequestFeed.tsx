import {
  formatClock,
  formatNumber,
  formatToman,
} from '../../../../utils/format'

type RequestStatus = 'incoming' | 'processing' | 'completed'

export interface FeedRequest {
  id: string
  provinceId: string | number
  provinceName: string
  status: RequestStatus
  createdAt: number
  purpose: string
  origin: string
  amount: number
  recipients: number
}

interface RequestFeedProps {
  requests: FeedRequest[]
  featuredId: string | null
  onHover: (provinceId: string | number | null) => void
}

const STATUS: Record<RequestStatus, string> = {
  incoming: 'ورود',
  processing: 'در حال واریز',
  completed: 'انجام شد',
}

export default function RequestFeed({
  requests,
  featuredId,
  onHover,
}: RequestFeedProps) {
  const items = [...requests].reverse().slice(0, 16)

  return (
    <aside className="panel feed-panel">
      <div className="panel-head">
        <h2>جریان درخواست‌ها</h2>
        <span>لحظه‌ای از سراسر کشور</span>
      </div>

      <ul className="feed-list">
        {items.map((request) => (
          <li
            key={request.id}
            className={[
              'feed-item',
              request.status,
              featuredId === request.id && 'is-featured',
            ]
              .filter(Boolean)
              .join(' ')}
            onMouseEnter={() => onHover(request.provinceId)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="feed-top">
              <b>{request.provinceName}</b>
              <time>{formatClock(request.createdAt)}</time>
            </div>

            <p className="feed-purpose">{request.purpose}</p>

            <div className="feed-meta">
              <span>{request.origin}</span>
              <strong>{formatToman(request.amount)}</strong>
            </div>

            <div className="feed-foot">
              <code>{request.id}</code>

              <em className={`status-pill ${request.status}`}>
                {STATUS[request.status]}
              </em>

              <small>{formatNumber(request.recipients)} نفر</small>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}