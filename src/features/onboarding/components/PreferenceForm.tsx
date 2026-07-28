import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '@hooks/useOnboarding';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Button } from '@components/ui/Button';
import { cn } from '@utils/cn';
import type { AllergyType } from 'types/onboarding';

const preferencesSchema = z.object({
  diet: z.enum(['none', 'vegetarian', 'vegan', 'keto', 'paleo'], { required_error: 'Please select a diet' }),
  cuisine: z.enum(['indian', 'chinese', 'italian', 'mediterranean', 'mexican'], { required_error: 'Please select a cuisine' }),
  cookingSkill: z.enum(['beginner', 'intermediate', 'advanced'], { required_error: 'Please select your cooking skill' }),
  budget: z.coerce.number().min(0).optional(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

const dietOptions = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
];

const cuisineOptions = [
  { value: 'indian', label: 'Indian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'italian', label: 'Italian' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'mexican', label: 'Mexican' },
];

const skillOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const allergyOptions: { value: AllergyType; label: string }[] = [
  { value: 'milk', label: 'Milk' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'soy', label: 'Soy' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'tree-nuts', label: 'Tree Nuts' },
];

interface PreferenceFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function PreferenceForm({ onNext, onBack }: PreferenceFormProps) {
  const { setPreferences } = useOnboarding();
  const { register, handleSubmit, formState: { errors } } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
  });

  const [selectedAllergies, setSelectedAllergies] = useState<AllergyType[]>([]);

  const toggleAllergy = (value: AllergyType) => {
    setSelectedAllergies((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    );
  };

  const onSubmit = (data: PreferencesFormData) => {
    setPreferences({ ...data, allergies: selectedAllergies });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Diet"
          options={dietOptions}
          placeholder="Select diet"
          error={errors.diet?.message}
          {...register('diet')}
        />
        <Select
          label="Preferred Cuisine"
          options={cuisineOptions}
          placeholder="Select cuisine"
          error={errors.cuisine?.message}
          {...register('cuisine')}
        />
        <Select
          label="Cooking Skill"
          options={skillOptions}
          placeholder="Select skill level"
          error={errors.cookingSkill?.message}
          {...register('cookingSkill')}
        />
        <Input
          label="Daily Budget"
          type="number"
          placeholder="Optional"
          suffix="USD"
          error={errors.budget?.message}
          {...register('budget')}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-on-surface mb-3">Allergies</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allergyOptions.map((allergy) => (
            <label
              key={allergy.value}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 border-2 rounded-xl text-sm cursor-pointer transition-colors',
                selectedAllergies.includes(allergy.value)
                  ? 'border-primary bg-primary/5'
                  : 'border-outline hover:border-on-surface-variant/50'
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedAllergies.includes(allergy.value)}
                onChange={() => toggleAllergy(allergy.value)}
              />
              <div
                className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                  selectedAllergies.includes(allergy.value)
                    ? 'border-primary bg-primary'
                    : 'border-outline'
                )}
              >
                {selectedAllergies.includes(allergy.value) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-on-surface">{allergy.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
        <Button variant="ghost" onClick={onBack}>
          <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}