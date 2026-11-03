'use client';

import { Sparkle, Star } from '@phosphor-icons/react';

import { useState } from 'react';
import AssistantChat from './assistant-chat';
import { estimateServiceCost, priceUnitLabel, services, type Lang, type Service } from './catalog';
import { getDayPeriod, type AssistantActivity, type AssistantReply, type AssistantPlan, type ChatMessage, type ServiceRecommendation, type TripPreferences } from './api/assistant/logic';

export type Trip = { days: number; interest: string; budget: number; guests?: number; ids: string[]; slots?: string[]; planTitle?: string; planDays?: AssistantPlan['days'] };

type Props = {
  lang: Lang;
  initialPrompt?: string;
  initialMessages?: ChatMessage[];
  initialChoices?: string[];
  onMessagesChange?: (messages: ChatMessage[]) => void;
  onChoicesChange?: (choices: string[]) => void;
  onInitialPromptConsumed: () => void;
  onPlan: (reply: Extract<AssistantReply, { kind: 'itinerary' }>) => void;
  onUseTemplate: (text: string, preferences: TripPreferences) => void;
  trip: Trip | null;
  days: number;
  guests: number;
  interest: string;
  budget: number;
  onDaysChange: (value: number) => void;
  onGuestsChange: (value: number) => void;
  onInterestChange: (value: string) => void;
  onBudgetChange: (value: number) => void;
  onGenerate: () => void;
  onUpdateTrip: (trip: Trip) => void;
  onSave: () => void;
  onShare: () => void;
  tripMessage: string;
  chatOnly?: boolean;
  onSelectService?: (service: Service) => void;
  onBookFullTrip?: () => void;
};

const copy = {
  vi: {
    plan: 'Kế hoạch chuyến đi', empty: 'Kế hoạch sẽ xuất hiện ở đây sau khi GOPU AI trả lời. Bạn cũng có thể tạo lịch trình mẫu.',
    group: 'khách · tổng ngân sách', details: 'Xem chi tiết', close: 'Đóng chi tiết', demoReviews: 'Đánh giá minh họa',
    estimated: 'Chi phí ước tính', notVerified: 'Giá tham khảo · giờ hoạt động cần xác minh',
    noAvailability: 'Thông tin này chỉ để tham khảo, không thể hiện tình trạng còn chỗ.',
  },
  en: {
    plan: 'Your trip plan', empty: 'Your plan will appear here after GOPU AI replies. You can also create a sample itinerary.',
    group: 'guests · total budget', details: 'View details', close: 'Close details', demoReviews: 'Illustrative reviews',
    estimated: 'Estimated cost', notVerified: 'Reference prices · operating hours need confirmation',
    noAvailability: 'For reference only; availability is not shown.',
  },
};

export default function AssistantWorkspace(props: Props) {
  const [searchResults, setSearchResults] = useState<Extract<AssistantReply, { kind: 'service_search' }> | null>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const t = copy[props.lang];
  const name = (service: Service) => props.lang === 'vi' ? service.vi : service.en;
  const description = (service: Service) => props.lang === 'vi' ? service.descriptionVi : service.descriptionEn;
  const categoryName = (service: Service) => ({
    tour: props.lang === 'vi' ? 'Tour & trải nghiệm' : 'Tours & experiences',
    restaurant: props.lang === 'vi' ? 'Nhà hàng' : 'Restaurant',
    transport: props.lang === 'vi' ? 'Di chuyển' : 'Transport',
    stay: props.lang === 'vi' ? 'Lưu trú' : 'Stay',
    wellness: props.lang === 'vi' ? 'Chăm sóc sức khỏe' : 'Wellness',
    laundry: props.lang === 'vi' ? 'Giặt là' : 'Laundry',
  })[service.category];
  const total = props.trip?.ids.reduce((sum, id, index, allIds) => {
    const service = services.find((item) => item.id === id);
    if (!service || (service.priceUnit === 'per-night' && allIds.indexOf(id) !== index)) return sum;
    return sum + estimateServiceCost(service, props.trip?.guests || props.guests, props.trip?.days || props.days);
  }, 0) || 0;

  const acceptPlan = (reply: Extract<AssistantReply, { kind: 'itinerary' }>) => {
    setSearchResults(null);
    props.onPlan(reply);
  };

  return <div className={props.chatOnly ? 'assistant-workspace assistant-workspace-chat-only' : 'assistant-workspace'}>
    <div className="assistant-workspace-chat">
      <AssistantChat lang={props.lang} initialPrompt={props.initialPrompt} initialMessages={props.initialMessages} initialChoices={props.initialChoices} onMessagesChange={props.onMessagesChange} onChoicesChange={props.onChoicesChange} currentPlan={props.trip?.planDays ? { title: props.trip.planTitle || '', days: props.trip.planDays } : null} onInitialPromptConsumed={props.onInitialPromptConsumed} onConversationStarted={() => setChatStarted(true)} onPlan={acceptPlan} onSearch={setSearchResults} onUseTemplate={props.onUseTemplate} />
      {props.chatOnly && searchResults && <ServiceSearchResults message={searchResults.message} recommendations={searchResults.recommendations} lang={props.lang} onSelectService={props.onSelectService} />}
    </div>

    {!props.chatOnly && <section className="assistant-plan-panel" aria-labelledby="assistant-plan-heading">
      <header className="assistant-plan-header">
        <div><span className="eyebrow">GOPU / {props.lang === 'vi' ? 'DỮ LIỆU MINH HỌA' : 'DEMO DATA'}</span><h2 id="assistant-plan-heading">{searchResults?.title || props.trip?.planTitle || t.plan}</h2></div>
        {!searchResults && props.trip && <div className="assistant-plan-total"><span>{t.estimated}</span><strong>{new Intl.NumberFormat(props.lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(total)}</strong></div>}
      </header>

      {!searchResults && (chatStarted || props.trip) && <div className="assistant-plan-controls">
        <label>{props.lang === 'vi' ? 'Số ngày' : 'Days'}<select value={props.days} onChange={(event) => props.onDaysChange(Number(event.target.value))}>{[1, 2, 3, 4, 5].map((day) => <option key={day} value={day}>{day}</option>)}</select></label>
        <label>{props.lang === 'vi' ? 'Số khách' : 'Guests'}<select value={props.guests} onChange={(event) => props.onGuestsChange(Number(event.target.value))}>{![1, 2, 3, 4, 5, 6, 8, 10].includes(props.guests) && <option value={props.guests}>{props.guests}</option>}{[1, 2, 3, 4, 5, 6, 8, 10].map((count) => <option key={count} value={count}>{count}</option>)}</select></label>
        <label>{props.lang === 'vi' ? 'Sở thích' : 'Interests'}<select value={props.interest} onChange={(event) => props.onInterestChange(event.target.value)}><option value="mixed">{props.lang === 'vi' ? 'Khám phá tổng hợp' : 'A bit of everything'}</option><option value="beach">{props.lang === 'vi' ? 'Biển & đảo' : 'Sea & islands'}</option><option value="calm">{props.lang === 'vi' ? 'Nghỉ dưỡng' : 'Rest & wellness'}</option></select></label>
        <label>{props.lang === 'vi' ? 'Ngân sách tổng' : 'Total budget'}<select value={props.budget} onChange={(event) => props.onBudgetChange(Number(event.target.value))}>{![1000000, 3000000, 5000000, 10000000, 20000000, 30000000].includes(props.budget) && <option value={props.budget}>{new Intl.NumberFormat(props.lang === 'vi' ? 'vi-VN' : 'en-US').format(props.budget)} ₫</option>}{[1000000, 3000000, 5000000, 10000000, 20000000, 30000000].map((amount) => <option key={amount} value={amount}>{new Intl.NumberFormat(props.lang === 'vi' ? 'vi-VN' : 'en-US').format(amount)} ₫</option>)}</select></label>
        <button className="button outline assistant-sample-button" onClick={props.onGenerate}>{props.lang === 'vi' ? 'Tạo lịch trình mẫu' : 'Create sample plan'}</button>
      </div>}

      {searchResults ? <ServiceSearchResults message={searchResults.message} recommendations={searchResults.recommendations} lang={props.lang} onSelectService={props.onSelectService} /> : props.trip ? <>
        {/* Full Tour Package Booking Callout */}
        <div style={{
          background: 'linear-gradient(135deg, #065f57 0%, #087f78 60%, #0e9f8f 100%)',
          color: '#ffffff',
          borderRadius: '1rem',
          padding: '1.25rem',
          margin: '0.75rem 0 1rem 0',
          boxShadow: '0 8px 24px -4px rgba(8, 127, 120, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.22)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {props.lang === 'vi' ? '🎯 Đặt trọn gói toàn bộ tour' : '🎯 Full Package Booking'}
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  {props.trip.days} {props.lang === 'vi' ? 'ngày' : 'days'} · {props.trip.guests || props.guests} {props.lang === 'vi' ? 'khách' : 'guests'} · {props.trip.ids.length} {props.lang === 'vi' ? 'dịch vụ' : 'activities'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#ffffff' }}>
                {props.trip.planTitle || (props.lang === 'vi' ? 'Lịch trình Phú Quốc trọn gói' : 'Phu Quoc Full Itinerary')}
              </h3>
              <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.92, lineHeight: 1.45 }}>
                {props.lang === 'vi'
                  ? 'Giữ chỗ toàn bộ tour biển, khách sạn, nhà hàng & xe di chuyển theo đúng lịch trình đã lên chỉ với 1 bước.'
                  : 'Hold all tours, hotels, restaurants & transfers in your itinerary at once in a single step.'}
              </p>
            </div>
            <div style={{ textAlign: 'right', alignSelf: 'center' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{t.estimated}</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900 }}>
                {new Intl.NumberFormat(props.lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(total)}
              </div>
            </div>
          </div>
          {props.onBookFullTrip && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={props.onBookFullTrip}
                className="button primary"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#111827',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  padding: '0.65rem 1.25rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                  cursor: 'pointer'
                }}
              >
                {props.lang === 'vi' ? '🚀 Đặt tổng quát toàn bộ lịch trình này' : '🚀 Book entire itinerary package'}
              </button>
            </div>
          )}
        </div>

        <p className="assistant-plan-note">{props.trip.guests || props.guests} {t.group} · {t.notVerified} · {t.noAvailability}</p>
        <div className="assistant-plan-days">
          {Array.from({ length: props.trip.days }, (_, dayIndex) => {
            const dayPlan = props.trip?.planDays?.[dayIndex];
            const dayItems: AssistantActivity[] = dayPlan?.activities || (props.trip?.ids.slice(dayIndex * 2, dayIndex * 2 + 2) || []).map((id, itemIndex) => ({
              serviceId: id,
              time: props.trip?.slots?.[dayIndex * 2 + itemIndex] || '09:00',
              endTime: '10:00',
              durationMinutes: 60,
              note: '',
              logistics: '',
              tips: '',
            }));
            const dayOffset = props.trip?.planDays?.slice(0, dayIndex).reduce((sum, day) => sum + day.activities.length, 0) ?? dayIndex * 2;
            return <section className="trip-day assistant-plan-day" key={dayIndex}>
              <h3><span>{String(dayIndex + 1).padStart(2, '0')}</span>{props.lang === 'vi' ? 'Ngày' : 'Day'} {dayIndex + 1}</h3>
              {dayItems.length ? dayItems.map((activity, itemIndex) => {
                const flatIndex = dayOffset + itemIndex;
                const service = services.find((item) => item.id === activity.serviceId);
                if (!service) return null;
                return <PlanActivity key={`${flatIndex}-${service.id}`} service={service} activity={activity} periodLabel={dayPeriodLabel(activity.time, props.lang)} lang={props.lang} onUpdateTrip={props.onUpdateTrip} trip={props.trip!} itemIndex={flatIndex} dayIndex={dayIndex} activityIndex={itemIndex} guests={props.guests} categoryName={categoryName(service)} name={name(service)} description={description(service)} onSelectService={props.onSelectService} />;
              }) : <p className="muted">{props.lang === 'vi' ? 'Chưa có hoạt động. Hãy tạo hoặc chỉnh lịch trình.' : 'No activities yet. Create or edit your plan.'}</p>}
            </section>;
          })}
        </div>
        <div className="assistant-plan-actions">
          {props.onBookFullTrip && (
            <button
              className="button primary"
              style={{ backgroundColor: '#087f78', fontWeight: 800 }}
              onClick={props.onBookFullTrip}
            >
              {props.lang === 'vi' ? '🎯 Đặt trọn gói lịch trình' : '🎯 Book full package'}
            </button>
          )}
          <button className="button primary" onClick={props.onSave}>{props.lang === 'vi' ? 'Lưu lịch trình' : 'Save itinerary'}</button>
          <button className="button outline" onClick={props.onShare}>{props.lang === 'vi' ? 'Sao chép liên kết' : 'Copy link'}</button>
          <span role="status">{props.tripMessage}</span>
        </div>
      </> : <div className="assistant-plan-empty"><Sparkle size={24} aria-hidden="true" /><p>{t.empty}</p></div>}
    </section>}
  </div>;
}

function ServiceSearchResults({ message, recommendations, lang, onSelectService }: { message: string; recommendations: ServiceRecommendation[]; lang: Lang; onSelectService?: (service: Service) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const text = lang === 'vi'
    ? { count: 'dịch vụ phù hợp trong danh mục demo', detail: 'Xem chi tiết', hide: 'Thu gọn', reviews: 'Đánh giá minh họa', from: 'Giá tham khảo từ', unknown: 'Không tìm thấy dịch vụ trong danh mục.' }
    : { count: 'matching services in the demo catalog', detail: 'View details', hide: 'Hide details', reviews: 'Illustrative reviews', from: 'Reference price from', unknown: 'No service found in the catalog.' };
  const categoryLabels: Record<Service['category'], string> = lang === 'vi'
    ? { tour: 'Tour & trải nghiệm', restaurant: 'Nhà hàng', transport: 'Di chuyển', stay: 'Lưu trú', wellness: 'Chăm sóc sức khỏe', laundry: 'Giặt là' }
    : { tour: 'Tours & experiences', restaurant: 'Restaurant', transport: 'Transport', stay: 'Stay', wellness: 'Wellness', laundry: 'Laundry' };
  const matches = recommendations.flatMap((recommendation) => {
    const service = services.find((item) => item.id === recommendation.serviceId);
    return service ? [{ recommendation, service }] : [];
  });

  if (!matches.length) return <div className="assistant-plan-empty"><p>{message || text.unknown}</p><p>{text.unknown}</p></div>;
  return <div className="assistant-search-results">
    <p className="assistant-plan-note">{matches.length} {text.count} · {lang === 'vi' ? 'Giá và đánh giá chưa xác minh; tình trạng còn chỗ không được hiển thị.' : 'Prices and reviews are unverified; availability is not shown.'}</p>
    {matches.map(({ recommendation, service }) => {
      const expanded = expandedId === service.id;
      return <article className="trip-item assistant-search-result" key={service.id}>
        <div className="service-photo" style={{ backgroundImage: `url(${service.image})` }}>{service.imageIsIllustrative && <span className="gopu-image-note">{lang === 'vi' ? 'Ảnh minh họa' : 'Illustrative image'}</span>}</div>
        <div className="assistant-search-result-content">
          <span className="chip">{categoryLabels[service.category]} · {service.area} · Demo</span>
          <h3>{lang === 'vi' ? service.vi : service.en}</h3>
          {service.reviewCount > 0 && <div className="review-summary"><Star size={14} weight="fill" aria-hidden="true" /> {service.rating.toFixed(1)} <span>· {service.reviewCount} {lang === 'vi' ? 'đánh giá mẫu' : 'sample reviews'}</span></div>}
          <p>{recommendation.reason}</p>
          <p className="muted">{lang === 'vi' ? service.descriptionVi : service.descriptionEn}</p>
          <strong>{text.from} {new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(service.price)} {priceUnitLabel(service.priceUnit, lang)}</strong>
          <div className="flex items-center gap-2 mt-2">
            <button className="button subtle" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : service.id)}>{expanded ? text.hide : text.detail}</button>
            {onSelectService && (
              <button
                className="button primary"
                style={{ backgroundColor: '#087f78', color: '#ffffff', fontWeight: 700 }}
                onClick={() => onSelectService(service)}
              >
                {service.category === 'restaurant'
                  ? (lang === 'vi' ? 'Đặt bàn' : 'Book table')
                  : service.category === 'tour'
                  ? (lang === 'vi' ? 'Đặt tour' : 'Book tour')
                  : service.category === 'stay'
                  ? (lang === 'vi' ? 'Đặt phòng' : 'Book stay')
                  : (lang === 'vi' ? 'Đặt dịch vụ' : 'Book service')}
              </button>
            )}
          </div>
          {expanded && <section className="review-list">{service.reviewCount > 0 && <><h4>{text.reviews} · {service.rating.toFixed(1)} ({service.reviewCount})</h4>{service.reviews.map((review, index) => <blockquote key={index}><strong><Star size={14} weight="fill" aria-hidden="true" /> {review.rating}</strong><p>{lang === 'vi' ? review.commentVi : review.commentEn}</p></blockquote>)}</>}<p>{service.area} · {lang === 'vi' ? service.descriptionVi : service.descriptionEn}</p><small>{lang === 'vi' ? 'Thông tin và đánh giá chỉ là minh họa, chưa xác minh.' : 'Details and reviews are illustrative and unverified.'}</small></section>}
        </div>
      </article>;
    })}
  </div>;
}

function dayPeriodLabel(time: string, lang: Lang): string {
  const period = getDayPeriod(time);
  const labels = lang === 'vi'
    ? { morning: 'Buổi sáng', lunch: 'Buổi trưa', afternoon: 'Buổi chiều', evening: 'Buổi tối' }
    : { morning: 'Morning', lunch: 'Lunch', afternoon: 'Afternoon', evening: 'Evening' };
  return labels[period];
}

function PlanActivity({ service, activity, periodLabel, lang, onUpdateTrip, trip, itemIndex, dayIndex, activityIndex, guests, categoryName, name, description, onSelectService }: {
  service: Service; activity: AssistantActivity; periodLabel: string; lang: Lang; onUpdateTrip: (trip: Trip) => void; trip: Trip; itemIndex: number;
  dayIndex: number; activityIndex: number; guests: number; categoryName: string; name: string; description: string; onSelectService?: (service: Service) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const text = lang === 'vi' ? { detail: 'Xem chi tiết', hide: 'Thu gọn', replace: 'Đổi', remove: 'Xóa', reviews: 'Đánh giá minh họa', from: 'Từ', duration: 'Thời lượng', logistics: 'Di chuyển', tips: 'Mẹo chuẩn bị' } : { detail: 'View details', hide: 'Hide details', replace: 'Replace', remove: 'Remove', reviews: 'Illustrative reviews', from: 'From', duration: 'Duration', logistics: 'Getting there', tips: 'Helpful tips' };
  const activityCost = service.priceUnit === 'per-night' ? service.price : estimateServiceCost(service, trip.guests || guests, 1);

  const replaceActivity = () => {
    const replacementId = services[(services.findIndex((item) => item.id === service.id) + 1) % services.length].id;
    const ids = [...trip.ids];
    ids[itemIndex] = replacementId;
    const planDays = trip.planDays?.map((day, index) => index !== dayIndex ? day : ({
      ...day,
      activities: day.activities.map((item, index) => index === activityIndex ? { ...item, serviceId: replacementId } : item),
    }));
    onUpdateTrip({ ...trip, ids, planDays });
  };

  const removeActivity = () => {
    const planDays = trip.planDays?.map((day, index) => index !== dayIndex ? day : ({ ...day, activities: day.activities.filter((_, indexInDay) => indexInDay !== activityIndex) }));
    onUpdateTrip({ ...trip, ids: trip.ids.filter((_, index) => index !== itemIndex), slots: trip.slots?.filter((_, index) => index !== itemIndex), planDays });
  };

  return <article className="trip-item assistant-plan-item">
    <div className="assistant-plan-activity-main"><span className="chip assistant-plan-period">{periodLabel}</span> <span className="chip">{categoryName} · {service.area}</span><h4>{name}</h4><p><strong className="trip-time">{activity.time}–{activity.endTime} · {activity.durationMinutes} {lang === 'vi' ? 'phút' : 'min'} · </strong>{activity.note || description}</p><strong>{new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(activityCost)} <small>{priceUnitLabel(service.priceUnit, lang)}</small></strong></div>
    <div className="trip-actions assistant-plan-item-actions">
      <button aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? text.hide : text.detail}</button>
      {onSelectService && (
        <button
          className="button primary"
          style={{ backgroundColor: '#087f78', color: '#ffffff', fontWeight: 700 }}
          onClick={() => onSelectService(service)}
        >
          {service.category === 'restaurant'
            ? (lang === 'vi' ? 'Đặt bàn' : 'Book table')
            : service.category === 'tour'
            ? (lang === 'vi' ? 'Đặt tour' : 'Book tour')
            : service.category === 'stay'
            ? (lang === 'vi' ? 'Đặt phòng' : 'Book stay')
            : service.category === 'transport'
            ? (lang === 'vi' ? 'Đặt xe' : 'Book ride')
            : (lang === 'vi' ? 'Đặt dịch vụ' : 'Book')}
        </button>
      )}
      <button onClick={replaceActivity}>{text.replace}</button>
      <button onClick={removeActivity}>{text.remove}</button>
    </div>
    {expanded && <section className="assistant-inline-detail" aria-label={`${name} ${text.detail}`}>
      <div className="assistant-inline-detail-photo" style={{ backgroundImage: `url(${service.image})` }}>{service.imageIsIllustrative && <span className="gopu-image-note">{lang === 'vi' ? 'Ảnh minh họa' : 'Illustrative image'}</span>}</div>
      <div className="assistant-inline-detail-content"><div className="assistant-inline-detail-heading"><span className="chip">{categoryName} · {lang === 'vi' ? 'Dữ liệu demo' : 'Demo data'}</span>{service.reviewCount > 0 && <strong>{service.rating.toFixed(1)} <small>· {service.reviewCount} {lang === 'vi' ? 'lượt đánh giá mẫu' : 'sample reviews'}</small></strong>}</div>
        <p>{description}</p><p className="muted">{service.area} · {text.from} {new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(service.price)} {priceUnitLabel(service.priceUnit, lang)}</p>
        <p><strong>{text.duration}:</strong> {activity.durationMinutes} {lang === 'vi' ? 'phút' : 'minutes'}{activity.logistics && <> · <strong>{text.logistics}:</strong> {activity.logistics}</>}{activity.tips && <> · <strong>{text.tips}:</strong> {activity.tips}</>}</p>
        {service.reviews.length > 0 && <><h5>{text.reviews}</h5>{service.reviews.map((review, index) => <blockquote key={index}><strong>{review.rating}</strong><p>{lang === 'vi' ? review.commentVi : review.commentEn}</p></blockquote>)}</>}
        {onSelectService && (
          <div style={{ marginTop: '0.75rem' }}>
            <button
              className="button primary"
              style={{ backgroundColor: '#087f78', color: '#ffffff', fontWeight: 700, width: '100%', padding: '0.6rem 1rem' }}
              onClick={() => onSelectService(service)}
            >
              {service.category === 'restaurant'
                ? (lang === 'vi' ? 'Xác nhận đặt bàn (Demo)' : 'Confirm table booking (Demo)')
                : service.category === 'tour'
                ? (lang === 'vi' ? 'Xác nhận đặt tour (Demo)' : 'Confirm tour booking (Demo)')
                : service.category === 'stay'
                ? (lang === 'vi' ? 'Xác nhận đặt phòng (Demo)' : 'Confirm stay booking (Demo)')
                : (lang === 'vi' ? 'Xác nhận đặt dịch vụ (Demo)' : 'Confirm booking (Demo)')}
            </button>
          </div>
        )}
        <p className="assistant-inline-disclaimer" style={{ marginTop: '0.5rem' }}>{lang === 'vi' ? 'Giá và đánh giá chỉ là minh họa, chưa xác minh.' : 'Prices and reviews are illustrative and unverified.'}</p>
      </div>
    </section>}
  </article>;
}
