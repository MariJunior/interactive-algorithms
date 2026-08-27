/**
 * Генерация входного массива для визуализатора.
 * Чистая утилита без React — можно переиспользовать в Sandbox и тестах.
 */
export function createRandomArray(
  length = 12,
  min = 8,
  max = 96,
): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
