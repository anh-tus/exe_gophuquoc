import { categoryDetailLabel, type Lang, type ServiceCategory, type ServiceDetail } from '../../app/catalog';

type Props = {
  detail: ServiceDetail;
  category: ServiceCategory;
  lang: Lang;
};

/**
 * Category-specific facts shown above the booking form: opening hours and dish
 * lists for restaurants, check-in times for stays, departure points for tours.
 *
 * Rows flagged `illustrative` carry a mark plus a single legend line, because
 * PRODUCT.md requires demo data to be labelled rather than presented as confirmed.
 * The panel uses dividers instead of a bordered box so it does not nest a card
 * inside the booking modal.
 */
export default function ServiceDetailPanel({ detail, category, lang }: Props) {
  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en);

  const facts = detail.facts ?? [];
  const chips = (lang === 'vi' ? detail.chipsVi : detail.chipsEn) ?? [];
  const chipsLabel = lang === 'vi' ? detail.chipsLabelVi : detail.chipsLabelEn;
  const list = (lang === 'vi' ? detail.listVi : detail.listEn) ?? [];
  const listLabel = lang === 'vi' ? detail.listLabelVi : detail.listLabelEn;
  const hasIllustrative = facts.some((fact) => fact.illustrative);

  if (!facts.length && !chips.length && !list.length) return null;

  return (
    <section className="border-t border-gray-100 pt-4 mt-4">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-2.5">
        {categoryDetailLabel[category][lang]}
      </h3>

      {/* Two columns need ~400px before price ranges stop breaking mid-value. */}
      {facts.length > 0 && (
        <dl className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-x-4 gap-y-2.5">
          {facts.map((fact) => (
            <div key={fact.labelVi}>
              <dt className="text-xs text-gray-600">{lang === 'vi' ? fact.labelVi : fact.labelEn}</dt>
              <dd className="text-sm font-semibold text-gray-900 leading-snug">
                {lang === 'vi' ? fact.valueVi : fact.valueEn}
                {fact.illustrative && (
                  <>
                    <span aria-hidden="true" className="text-[#087f78] font-bold">
                      *
                    </span>
                    <span className="sr-only">{t(' (minh họa)', ' (illustrative)')}</span>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {chips.length > 0 && chipsLabel && (
        <div className="mt-3">
          <span className="text-xs text-gray-600">{chipsLabel}</span>
          <ul className="flex flex-wrap gap-1.5 mt-1.5">
            {chips.map((chip) => (
              <li
                key={chip}
                className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-2 py-1"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {list.length > 0 && listLabel && (
        <div className="mt-3">
          <span className="text-xs text-gray-600">{listLabel}</span>
          <ul className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
            {list.map((entry) => (
              <li key={entry} className="text-xs text-gray-700 leading-snug flex gap-1.5">
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasIllustrative && (
        <p className="text-xs text-gray-600 mt-2.5 leading-snug">
          <span aria-hidden="true" className="text-[#087f78] font-bold">
            *
          </span>{' '}
          {t(
            'Thông tin minh họa, chưa xác minh với nhà cung cấp.',
            'Demo data, not yet confirmed with the provider.',
          )}
        </p>
      )}
    </section>
  );
}
