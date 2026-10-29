'use client';

import { useState } from 'react';
import AssistantChat from './assistant-chat';
import { estimateServiceCost, priceUnitLabel, services, type Lang, type Service } from './catalog';
import { getDayPeriod, type AssistantActivity, type AssistantReply, type AssistantPlan, type ServiceRecommendation, type TripPreferences } from './api/assistant/logic';

export type Trip = { days: number; interest: string; budget: number; guests?: number; ids: string[]; slots?: string[]; planTitle?: string; planDays?: AssistantPlan['days'] };

type Props = {
  lang: Lang;
  initialPrompt?: string;
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

  return <div className="assistant-workspace">
    <div className="assistant-workspace-chat">
      <AssistantChat lang={props.lang} initialPrompt={props.initialPrompt} onInitialPromptConsumed={props.onInitialPromptConsumed} onPlan={acceptPlan} onSearch={setSearchResults} onUseTemplate={props.onUseTemplate} />
    </div>

    <section className="assistant-plan-panel" aria-labelledby="assistant-plan-heading">
      <header className="assistant-plan-header">
        <div><span className="eyebrow">GOPU / {props.lang === 'vi' ? 'DỮ LIỆU MINH HỌA' : 'DEMO DATA'}</span><h2 id="assistant-plan-heading">{searchResults?.title || props.trip?.planTitle || t.plan}</h2></div>
        {!searchResults && props.trip && <div className="assistant-plan-total"><span>{t.estimated}</span><strong>{new Intl.NumberFormat(props.lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(total)}</strong></div>}
      </header>

      {!searchResults && <div className="assistant-plan-controls">
        <label>{props.lang === 'vi' ? 'Số ngày' : 'Days'}<select value={props.days} onChange={(event) => props.onDaysChange(Number(event.target.value))}>{[1, 2, 3, 4, 5].map((day) => <option key={day} value={day}>{day}</option>)}</select></label>
        <label>{props.lang === 'vi' ? 'Số khách' : 'Guests'}<select value={props.guests} onChange={(event) => props.onGuestsChange(Number(event.target.value))}>{![1, 2, 3, 4, 5, 6, 8, 10].includes(props.guests) && <option value={props.guests}>{props.guests}</option>}{[1, 2, 3, 4, 5, 6, 8, 10].map((count) => <option key={count} value={count}>{count}</option>)}</select></label>
        <label>{props.lang === 'vi' ? 'Sở thích' : 'Interests'}<select value={props.interest} onChange={(event) => props.onInterestChange(event.target.value)}><option value="mixed">{props.lang === 'vi' ? 'Khám phá tổng hợp' : 'A bit of everything'}</option><option value="beach">{props.lang === 'vi' ? 'Biển & đảo' : 'Sea & islands'}</option><option value="calm">{props.lang === 'vi' ? 'Nghỉ dưỡng' : 'Rest & wellness'}</option></select></label>
        <label>{props.lang === 'vi' ? 'Ngân sách tổng' : 'Total budget'}<select value={props.budget} onChange={(event) => props.onBudgetChange(Number(event.target.value))}>{![1000000, 3000000, 5000000, 10000000, 20000000, 30000000].includes(props.budget) && <option value={props.budget}>{new Intl.NumberFormat(props.lang === 'vi' ? 'vi-VN' : 'en-US').format(props.budget)} ₫</option>}{[1000000, 3000000, 5000000, 10000000, 20000000, 30000000].map((amount) => <option key={amount} value={amount}>{new Intl.NumberFormat(props.lang === 'vi' ? 'vi-VN' : 'en-US').format(amount)} ₫</option>)}</select></label>
        <button className="button outline assistant-sample-button" onClick={props.onGenerate}>{props.lang === 'vi' ? 'Tạo lịch trình mẫu' : 'Create sample plan'}</button>
      </div>}

      {searchResults ? <ServiceSearchResults message={searchResults.message} recommendations={searchResults.recommendations} lang={props.lang} /> : props.trip ? <>
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
                return <PlanActivity key={`${flatIndex}-${service.id}`} service={service} activity={activity} periodLabel={dayPeriodLabel(activity.time, props.lang)} lang={props.lang} onUpdateTrip={props.onUpdateTrip} trip={props.trip!} itemIndex={flatIndex} dayIndex={dayIndex} activityIndex={itemIndex} guests={props.guests} categoryName={categoryName(service)} name={name(service)} description={description(service)} />;
              }) : <p className="muted">{props.lang === 'vi' ? 'Chưa có hoạt động. Hãy tạo hoặc chỉnh lịch trình.' : 'No activities yet. Create or edit your plan.'}</p>}
            </section>;
          })}
        </div>
        <div className="assistant-plan-actions">
          <button className="button primary" onClick={props.onSave}>{props.lang === 'vi' ? 'Lưu lịch trình' : 'Save itinerary'}</button>
          <button className="button outline" onClick={props.onShare}>{props.lang === 'vi' ? 'Sao chép liên kết' : 'Copy link'}</button>
          <span role="status">{props.tripMessage}</span>
        </div>
      </> : <div className="assistant-plan-empty"><span aria-hidden="true">✦</span><p>{t.empty}</p></div>}
    </section>
  </div>;
}

function ServiceSearchResults({ message, recommendations, lang }: { message: string; recommendations: ServiceRecommendation[]; lang: Lang }) {
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
        <div className="service-photo" style={{ backgroundImage: `url(${service.image})` }} />
        <div className="assistant-search-result-content">
          <span className="chip">{categoryLabels[service.category]} · {service.area} · Demo</span>
          <h3>{lang === 'vi' ? service.vi : service.en}</h3>
          <div className="review-summary">★ {service.rating.toFixed(1)} <span>· {service.reviewCount} {lang === 'vi' ? 'đánh giá mẫu' : 'sample reviews'}</span></div>
          <p>{recommendation.reason}</p>
          <p className="muted">{lang === 'vi' ? service.descriptionVi : service.descriptionEn}</p>
          <strong>{text.from} {new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(service.price)} {priceUnitLabel(service.priceUnit, lang)}</strong>
          <button className="button subtle" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : service.id)}>{expanded ? text.hide : text.detail}</button>
          {expanded && <section className="review-list"><h4>{text.reviews} · ★ {service.rating.toFixed(1)} ({service.reviewCount})</h4><p>{lang === 'vi' ? service.area : service.area} · {lang === 'vi' ? service.descriptionVi : service.descriptionEn}</p>{service.reviews.map((review, index) => <blockquote key={index}><strong>★ {review.rating}</strong><p>{lang === 'vi' ? review.commentVi : review.commentEn}</p></blockquote>)}<small>{lang === 'vi' ? 'Thông tin và đánh giá chỉ là minh họa, chưa xác minh.' : 'Details and reviews are illustrative and unverified.'}</small></section>}
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

function PlanActivity({ service, activity, periodLabel, lang, onUpdateTrip, trip, itemIndex, dayIndex, activityIndex, guests, categoryName, name, description }: {
  service: Service; activity: AssistantActivity; periodLabel: string; lang: Lang; onUpdateTrip: (trip: Trip) => void; trip: Trip; itemIndex: number;
  dayIndex: number; activityIndex: number; guests: number; categoryName: string; name: string; description: string;
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
      <button onClick={replaceActivity}>{text.replace}</button>
      <button onClick={removeActivity}>{text.remove}</button>
    </div>
    {expanded && <section className="assistant-inline-detail" aria-label={`${name} ${text.detail}`}>
      <div className="assistant-inline-detail-photo" style={{ backgroundImage: `url(${service.image})` }} />
      <div className="assistant-inline-detail-content"><div className="assistant-inline-detail-heading"><span className="chip">{categoryName} · {lang === 'vi' ? 'Dữ liệu demo' : 'Demo data'}</span><strong>★ {service.rating.toFixed(1)} <small>· {service.reviewCount} {lang === 'vi' ? 'lượt đánh giá mẫu' : 'sample reviews'}</small></strong></div>
        <p>{description}</p><p className="muted">{service.area} · {text.from} {new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(service.price)} {priceUnitLabel(service.priceUnit, lang)}</p>
        <p><strong>{text.duration}:</strong> {activity.durationMinutes} {lang === 'vi' ? 'phút' : 'minutes'}{activity.logistics && <> · <strong>{text.logistics}:</strong> {activity.logistics}</>}{activity.tips && <> · <strong>{text.tips}:</strong> {activity.tips}</>}</p>
        <h5>{text.reviews}</h5>{service.reviews.map((review, index) => <blockquote key={index}><strong>★ {review.rating}</strong><p>{lang === 'vi' ? review.commentVi : review.commentEn}</p></blockquote>)}
        <p className="assistant-inline-disclaimer">{lang === 'vi' ? 'Giá và đánh giá chỉ là minh họa, chưa xác minh.' : 'Prices and reviews are illustrative and unverified.'}</p>
      </div>
    </section>}
  </article>;
}

