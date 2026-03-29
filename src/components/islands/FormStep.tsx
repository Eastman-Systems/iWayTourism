import type { ComponentChildren } from 'preact';

interface FormStepProps {
  heading: string;
  step: number;
  totalSteps: number;
  children: ComponentChildren;
}

export default function FormStep({ heading, step, totalSteps, children }: FormStepProps) {
  return (
    <div>
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-heading text-lg font-semibold text-slate-900">{heading}</h3>
        <span class="text-sm text-slate-500">
          Step {step} of {totalSteps}
        </span>
      </div>
      <div class="mb-6 flex gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div class={`h-1 flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-slate-200'}`} />
        ))}
      </div>
      {children}
    </div>
  );
}
