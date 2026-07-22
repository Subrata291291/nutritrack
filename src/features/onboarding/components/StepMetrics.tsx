import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '@hooks/useOnboarding';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Button } from '@components/ui/Button';

const metricsSchema = z.object({
  age: z.coerce.number().min(10, 'Must be at least 10').max(120, 'Must be under 120'),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']),
  heightCm: z.coerce.number().min(50, 'Must be at least 50cm').max(300, 'Must be under 300cm'),
  weightKg: z.coerce.number().min(20, 'Must be at least 20kg').max(500, 'Must be under 500kg'),
});

type MetricsFormData = z.infer<typeof metricsSchema>;

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

interface StepMetricsProps {
  onNext: () => void;
}

export function StepMetrics({ onNext }: StepMetricsProps) {
  const { setMetrics } = useOnboarding();
  const { register, handleSubmit, formState: { errors } } = useForm<MetricsFormData>({
    resolver: zodResolver(metricsSchema),
  });

  const onSubmit = (data: MetricsFormData) => {
    setMetrics(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Age"
          type="number"
          placeholder="e.g. 28"
          error={errors.age?.message}
          {...register('age')}
        />
        <Select
          label="Gender"
          options={genderOptions}
          placeholder="Select gender"
          error={errors.gender?.message}
          {...register('gender')}
        />
        <Input
          label="Height (cm)"
          type="number"
          placeholder="e.g. 175"
          error={errors.heightCm?.message}
          {...register('heightCm')}
        />
        <Input
          label="Weight (kg)"
          type="number"
          placeholder="e.g. 72"
          error={errors.weightKg?.message}
          {...register('weightKg')}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
