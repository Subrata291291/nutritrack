import { describe, it, expect } from 'vitest';
import { parseLocalDate, toLocalDateString, formatKcal, formatDate } from '@utils/format';
import { calculateBMR, calculateTDEE, getNutritionTargets } from '@utils/tdee';

describe('format utils', () => {
  it('parseLocalDate returns correct date', () => {
    const d = parseLocalDate('2026-07-27');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(27);
  });

  it('toLocalDateString formats correctly', () => {
    const d = new Date(2026, 6, 27);
    expect(toLocalDateString(d)).toBe('2026-07-27');
  });

  it('toLocalDateString pads single digit month/day', () => {
    const d = new Date(2026, 0, 5);
    expect(toLocalDateString(d)).toBe('2026-01-05');
  });

  it('formatKcal formats large numbers', () => {
    expect(formatKcal(1234)).toBe('1,234');
  });

  it('formatKcal formats zero', () => {
    expect(formatKcal(0)).toBe('0');
  });

  it('formatDate formats date string', () => {
    const result = formatDate('2026-07-27');
    expect(result).toContain('Mon');
    expect(result).toContain('Jul');
    expect(result).toContain('27');
  });

  it('formatDate formats Date object', () => {
    const result = formatDate(new Date(2026, 6, 27));
    expect(result).toContain('Mon');
    expect(result).toContain('Jul');
    expect(result).toContain('27');
  });

  it('formatDate respects custom options', () => {
    const result = formatDate('2026-07-27', { year: 'numeric' });
    expect(result).toContain('2026');
  });
});

describe('tdee utils', () => {
  it('calculateBMR for male', () => {
    const bmr = calculateBMR({ age: 30, gender: 'male', heightCm: 175, weightKg: 80 });
    expect(bmr).toBe(1748.75);
  });

  it('calculateBMR for female', () => {
    const bmr = calculateBMR({ age: 30, gender: 'female', heightCm: 165, weightKg: 65 });
    expect(bmr).toBe(1370.25);
  });

  it('calculateTDEE returns all fields', () => {
    const result = calculateTDEE(
      { age: 30, gender: 'male', heightCm: 175, weightKg: 80 },
      'moderately-active',
      'maintain',
    );
    expect(result).toHaveProperty('tdee');
    expect(result).toHaveProperty('bmr');
    expect(result).toHaveProperty('targetCalories');
    expect(result).toHaveProperty('proteinGrams');
    expect(result).toHaveProperty('carbsGrams');
    expect(result).toHaveProperty('fatsGrams');
    expect(result.targetCalories).toBeGreaterThan(0);
  });

  it('calculateTDEE with lose-weight goal adjusts calories', () => {
    const maintain = calculateTDEE(
      { age: 30, gender: 'male', heightCm: 175, weightKg: 80 },
      'moderately-active',
      'maintain',
    );
    const lose = calculateTDEE(
      { age: 30, gender: 'male', heightCm: 175, weightKg: 80 },
      'moderately-active',
      'lose-weight',
    );
    expect(lose.targetCalories).toBe(maintain.targetCalories - 500);
  });

  it('calculateTDEE with gain-muscle goal adds calories', () => {
    const maintain = calculateTDEE(
      { age: 30, gender: 'male', heightCm: 175, weightKg: 80 },
      'moderately-active',
      'maintain',
    );
    const gain = calculateTDEE(
      { age: 30, gender: 'male', heightCm: 175, weightKg: 80 },
      'moderately-active',
      'gain-muscle',
    );
    expect(gain.targetCalories).toBe(maintain.targetCalories + 300);
  });

  it('calculateTDEE includes projectedGoalDate for weight loss', () => {
    const result = calculateTDEE(
      { age: 30, gender: 'male', heightCm: 175, weightKg: 100 },
      'sedentary',
      'lose-weight',
      80,
    );
    expect(result.projectedGoalDate).toBeDefined();
    expect(result.projectedGoalDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('calculateTDEE excludes projectedGoalDate for non-loss goals', () => {
    const result = calculateTDEE(
      { age: 30, gender: 'male', heightCm: 175, weightKg: 80 },
      'moderately-active',
      'maintain',
    );
    expect(result.projectedGoalDate).toBeUndefined();
  });

  it('getNutritionTargets computes targets from profile', () => {
    const targets = getNutritionTargets({
      displayName: 'Test',
      age: 30,
      gender: 'male',
      heightCm: 175,
      weightKg: 80,
      activityLevel: 'moderately-active',
      goal: 'maintain',
      targetWeightKg: 75,
    });
    expect(targets.calories).toBeGreaterThan(0);
    expect(targets.proteinGrams).toBeGreaterThan(0);
    expect(targets.carbsGrams).toBeGreaterThan(0);
    expect(targets.fatsGrams).toBeGreaterThan(0);
    expect(targets.waterMl).toBe(2500);
  });
});
