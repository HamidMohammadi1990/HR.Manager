import { getApiErrorMessage, isForbiddenError } from '@/services/api';

export type SectionState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'forbidden' }
  | { status: 'error'; message: string };

export const loadingSection = { status: 'loading' } as const;

export async function runSectionLoad<T>(
  loader: () => Promise<T>,
): Promise<SectionState<T>> {
  try {
    const data = await loader();
    return { status: 'success', data };
  } catch (error) {
    if (isForbiddenError(error)) return { status: 'forbidden' };
    return { status: 'error', message: getApiErrorMessage(error) };
  }
}

export function isSectionForbidden<T>(state: SectionState<T>): boolean {
  return state.status === 'forbidden';
}

export function isSectionLoading<T>(state: SectionState<T>): boolean {
  return state.status === 'loading';
}

export function hasSectionAccess<T>(state: SectionState<T>): boolean {
  return state.status !== 'forbidden';
}

export function areAllSectionsSettled(states: readonly SectionState<unknown>[]): boolean {
  return states.every((state) => state.status !== 'loading');
}
