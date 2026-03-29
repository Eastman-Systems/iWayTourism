export default function FormSuccess() {
  return (
    <div class="py-8 text-center">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <svg
          class="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h3 class="font-heading text-lg font-semibold text-slate-900">Thank You!</h3>
      <p class="mt-2 text-sm text-slate-600">
        We've received your enquiry and will get back to you within 2 hours during business hours.
      </p>
      <a href="/" class="mt-4 inline-block text-sm font-medium text-primary hover:underline">
        Back to Home
      </a>
    </div>
  );
}
