import { useState, useMemo } from 'preact/hooks';

interface Tier {
  name: string;
  duration: string;
  nights: number;
  basePricePerPerson: number;
  maxPricePerPerson: number;
  hotelStars: number;
  mealsIncluded: string;
  highlights: string;
}

interface Destination {
  id: string;
  name: string;
  flag: string;
  slug: string;
  flightHours: number;
  visaType: string;
  visaCost: number;
  tiers: Tier[];
  estimatedDailySpend: {
    budget: number;
    moderate: number;
    premium: number;
    note: string;
  };
}

interface Props {
  destinations: Destination[];
}

type SpendLevel = 'budget' | 'moderate' | 'premium';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function BudgetCalculator({ destinations }: Props) {
  const [destId, setDestId] = useState('');
  const [tierIdx, setTierIdx] = useState(0);
  const [groupSize, setGroupSize] = useState(2);
  const [spendLevel, setSpendLevel] = useState<SpendLevel>('moderate');

  const dest = useMemo(() => destinations.find((d) => d.id === destId), [destId, destinations]);
  const tier = dest?.tiers[tierIdx];

  const estimate = useMemo(() => {
    if (!dest || !tier) return null;
    const packagePerPerson = tier.basePricePerPerson;
    const packageTotal = packagePerPerson * groupSize;
    const dailySpend = dest.estimatedDailySpend[spendLevel] * tier.nights * groupSize;
    const visaTotal = dest.visaCost * groupSize;
    const total = packageTotal + dailySpend + visaTotal;
    return { packagePerPerson, packageTotal, dailySpend, visaTotal, total };
  }, [dest, tier, groupSize, spendLevel]);

  return (
    <div class="flex flex-col gap-6">
      {/* Destination selector */}
      <div>
        <label htmlFor="calc-dest" class="block text-sm font-medium text-slate-700">
          Destination
        </label>
        <select
          id="calc-dest"
          value={destId}
          onChange={(e) => {
            setDestId((e.target as HTMLSelectElement).value);
            setTierIdx(0);
          }}
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select a destination…</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.flag} {d.name}
            </option>
          ))}
        </select>
      </div>

      {dest && (
        <>
          {/* Tier selector */}
          <div>
            <label class="block text-sm font-medium text-slate-700">Package Tier</label>
            <div class="mt-2 flex flex-col gap-2">
              {dest.tiers.map((t, i) => (
                <label
                  key={t.name}
                  class={`cursor-pointer rounded-lg border-2 p-3 text-sm transition-colors ${
                    tierIdx === i ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    checked={tierIdx === i}
                    onChange={() => setTierIdx(i)}
                    class="sr-only"
                  />
                  <span class="font-medium text-slate-900">{t.name}</span>
                  <span class="ml-2 text-slate-500">
                    {t.duration} · from {fmt(t.basePricePerPerson)}/person
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Group size */}
          <div>
            <label htmlFor="calc-group" class="block text-sm font-medium text-slate-700">
              Group Size
            </label>
            <input
              id="calc-group"
              type="number"
              min={1}
              max={30}
              value={groupSize}
              onInput={(e) => setGroupSize(Math.max(1, Number((e.target as HTMLInputElement).value) || 1))}
              class="mt-1 w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span class="ml-2 text-sm text-slate-500">travellers</span>
          </div>

          {/* Daily spend level */}
          <div>
            <label class="block text-sm font-medium text-slate-700">Daily Spending Level</label>
            <div class="mt-2 flex gap-2">
              {(['budget', 'moderate', 'premium'] as SpendLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpendLevel(level)}
                  class={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    spendLevel === level
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p class="mt-1 text-xs text-slate-500">{dest.estimatedDailySpend.note}</p>
          </div>

          {/* Estimate output */}
          {estimate && tier && (
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 class="font-heading text-base font-semibold text-slate-900">Estimated Cost Breakdown</h3>
              <dl class="mt-4 flex flex-col gap-3 text-sm">
                <div class="flex justify-between">
                  <dt class="text-slate-600">
                    Package ({tier.name}) × {groupSize}
                  </dt>
                  <dd class="font-medium text-slate-900">{fmt(estimate.packageTotal)}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-slate-600">
                    Daily spend ({spendLevel}, {tier.nights} nights × {groupSize})
                  </dt>
                  <dd class="font-medium text-slate-900">{fmt(estimate.dailySpend)}</dd>
                </div>
                {dest.visaCost > 0 && (
                  <div class="flex justify-between">
                    <dt class="text-slate-600">
                      Visa ({dest.visaType}) × {groupSize}
                    </dt>
                    <dd class="font-medium text-slate-900">{fmt(estimate.visaTotal)}</dd>
                  </div>
                )}
                <div class="flex justify-between border-t border-slate-200 pt-3">
                  <dt class="font-semibold text-slate-900">Total Estimate</dt>
                  <dd class="text-lg font-bold text-primary">{fmt(estimate.total)}</dd>
                </div>
                <div class="flex justify-between text-xs text-slate-500">
                  <dt>Per person</dt>
                  <dd>{fmt(estimate.total / groupSize)}</dd>
                </div>
              </dl>
              <a
                href={`/contact?destination=${encodeURIComponent(dest.name)}`}
                class="mt-6 block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Get a Custom Quote for {dest.name}
              </a>
            </div>
          )}

          {/* Destination quick info */}
          <div class="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>Flight: ~{dest.flightHours}h from TRV</span>
            <span>Visa: {dest.visaType}{dest.visaCost > 0 ? ` (${fmt(dest.visaCost)})` : ''}</span>
          </div>
        </>
      )}
    </div>
  );
}
