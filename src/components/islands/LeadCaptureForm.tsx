import { useState, useCallback } from 'preact/hooks';
import FormStep from './FormStep';
import FormField from './FormField';
import FormSuccess from './FormSuccess';

interface FormData {
  tripType: string;
  vehicleType: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  destination: string;
  groupSize: string;
  budgetRange: string;
  travelDates: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  website: string;
}

const INITIAL: FormData = {
  tripType: '',
  vehicleType: '',
  pickupLocation: '',
  pickupDate: '',
  returnDate: '',
  destination: '',
  groupSize: '',
  budgetRange: '',
  travelDates: '',
  name: '',
  phone: '',
  email: '',
  message: '',
  website: '',
};

const TRIP_TYPES = [
  { value: 'fleet', label: 'Fleet Rental', desc: 'Innova, Tempo Traveller, or mini bus' },
  { value: 'local-tour', label: 'Local Tour', desc: 'Curated circuits in Kanyakumari & Trivandrum' },
  { value: 'international', label: 'International Package', desc: 'Holiday packages from Trivandrum' },
];

const VEHICLES = [
  'Innova Crysta',
  '12-Seater Tempo Traveller',
  '14-Seater Tempo Traveller',
  '17-Seater Tempo Traveller',
  '26-Seater Mini Bus',
];

const LOCAL_TOURS = [
  'Trivandrum–Kanyakumari 3-Day Circuit',
  'Kanyakumari Sightseeing',
  'Trivandrum Heritage',
  'Hidden Gems',
  'Temple Pilgrimages',
  'Eco-Tourism & Nature Trails',
];

const INTL_DESTINATIONS = [
  'Singapore & Malaysia',
  'Bali',
  'Vietnam',
  'Sri Lanka',
  'Dubai',
  'Thailand',
  'Other',
];

const BUDGETS = [
  'Under ₹50,000/person',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹1,50,000',
  'Above ₹1,50,000',
];

export default function LeadCaptureForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<FormData>(INITIAL);

  const update = useCallback((field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validate = (): string | null => {
    if (!data.name.trim()) return 'Name is required';
    if (!/^[6-9]\d{9}$/.test(data.phone)) return 'Enter a valid 10-digit Indian mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Enter a valid email address';
    return null;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (data.website) return; // honeypot

    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripType: data.tripType,
          ...(data.vehicleType && { vehicleType: data.vehicleType }),
          ...(data.pickupLocation && { pickupLocation: data.pickupLocation }),
          ...(data.pickupDate && { pickupDate: data.pickupDate }),
          ...(data.returnDate && { returnDate: data.returnDate }),
          ...(data.destination && { destination: data.destination }),
          ...(data.groupSize && { groupSize: Number(data.groupSize) }),
          ...(data.budgetRange && { budgetRange: data.budgetRange }),
          ...(data.travelDates && { travelDates: data.travelDates }),
          name: data.name,
          phone: data.phone,
          email: data.email,
          ...(data.message && { message: data.message }),
        }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const body = await res.json().catch(() => null);
        setErrorMsg(body?.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') return <FormSuccess />;

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onInput={(e) => update('website', (e.target as HTMLInputElement).value)}
        />
      </div>

      {/* Step 1: Trip type */}
      {step === 1 && (
        <FormStep heading="What are you looking for?" step={1} totalSteps={3}>
          <fieldset>
            <legend class="sr-only">Trip type</legend>
            <div class="flex flex-col gap-3">
              {TRIP_TYPES.map((opt) => (
                <label
                  key={opt.value}
                  class={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                    data.tripType === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tripType"
                    value={opt.value}
                    checked={data.tripType === opt.value}
                    onChange={() => update('tripType', opt.value)}
                    class="sr-only"
                  />
                  <span class="font-medium text-slate-900">{opt.label}</span>
                  <span class="mt-0.5 block text-sm text-slate-500">{opt.desc}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div class="mt-6 flex justify-end">
            <button
              type="button"
              onClick={next}
              disabled={!data.tripType}
              class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </FormStep>
      )}

      {/* Step 2: Trip details (conditional on trip type) */}
      {step === 2 && (
        <FormStep heading="Trip Details" step={2} totalSteps={3}>
          {data.tripType === 'fleet' && (
            <div class="flex flex-col gap-4">
              <FormField label="Vehicle Type" type="select" value={data.vehicleType} onChange={(v) => update('vehicleType', v)} options={VEHICLES} />
              <FormField label="Pickup Location" value={data.pickupLocation} onChange={(v) => update('pickupLocation', v)} placeholder="e.g., Trivandrum Airport, Marthandam" />
              <div class="grid grid-cols-2 gap-4">
                <FormField label="Pickup Date" type="date" value={data.pickupDate} onChange={(v) => update('pickupDate', v)} />
                <FormField label="Return Date" type="date" value={data.returnDate} onChange={(v) => update('returnDate', v)} />
              </div>
            </div>
          )}
          {data.tripType === 'local-tour' && (
            <div class="flex flex-col gap-4">
              <FormField label="Destination" type="select" value={data.destination} onChange={(v) => update('destination', v)} options={LOCAL_TOURS} />
              <FormField label="Travel Dates" value={data.travelDates} onChange={(v) => update('travelDates', v)} placeholder="e.g., March 15–17, 2026" />
              <FormField label="Group Size" type="number" value={data.groupSize} onChange={(v) => update('groupSize', v)} placeholder="Number of travellers" />
            </div>
          )}
          {data.tripType === 'international' && (
            <div class="flex flex-col gap-4">
              <FormField label="Destination" type="select" value={data.destination} onChange={(v) => update('destination', v)} options={INTL_DESTINATIONS} />
              <FormField label="Travel Dates" value={data.travelDates} onChange={(v) => update('travelDates', v)} placeholder="e.g., April 2026, flexible" />
              <div class="grid grid-cols-2 gap-4">
                <FormField label="Group Size" type="number" value={data.groupSize} onChange={(v) => update('groupSize', v)} placeholder="Travellers" />
                <FormField label="Budget Range" type="select" value={data.budgetRange} onChange={(v) => update('budgetRange', v)} options={BUDGETS} />
              </div>
            </div>
          )}
          <div class="mt-6 flex justify-between">
            <button type="button" onClick={prev} class="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              Back
            </button>
            <button type="button" onClick={next} class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
              Next
            </button>
          </div>
        </FormStep>
      )}

      {/* Step 3: Contact info */}
      {step === 3 && (
        <FormStep heading="Your Contact Details" step={3} totalSteps={3}>
          <div class="flex flex-col gap-4">
            <FormField label="Full Name" value={data.name} onChange={(v) => update('name', v)} required placeholder="Your name" />
            <FormField label="Phone" type="tel" value={data.phone} onChange={(v) => update('phone', v)} required placeholder="10-digit mobile number" />
            <FormField label="Email" type="email" value={data.email} onChange={(v) => update('email', v)} required placeholder="your@email.com" />
            <FormField label="Additional Notes" type="textarea" value={data.message} onChange={(v) => update('message', v)} placeholder="Any specific requirements?" />
          </div>
          {errorMsg && (
            <p class="mt-4 text-sm text-red-600" role="alert">
              {errorMsg}
            </p>
          )}
          <div class="mt-6 flex justify-between">
            <button type="button" onClick={prev} class="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              Back
            </button>
            <button
              type="submit"
              disabled={status === 'submitting'}
              class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending…' : 'Get Free Quote'}
            </button>
          </div>
        </FormStep>
      )}
    </form>
  );
}
