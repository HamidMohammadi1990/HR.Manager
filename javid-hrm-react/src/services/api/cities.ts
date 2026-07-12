import { apiRequest } from './client';
import type { CityDto, PagedResult, SearchCitiesRequest } from './types';

export async function searchCities(request: SearchCitiesRequest): Promise<PagedResult<CityDto>> {
  const result = await apiRequest<PagedResult<CityDto>>('/api/v1/city/search', {
    method: 'POST',
    body: request,
  });

  if (!result.Data) {
    throw new Error('پاسخ جستجوی شهر نامعتبر است');
  }

  return result.Data;
}
