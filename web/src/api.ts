import type {
  ComplianceFramework,
  FrameworkMetadata,
  ExecutiveOverview,
} from './types';

// File configuration for go-comply format
interface FileConfig {
  name: string;
  key: keyof Omit<ComplianceFramework, 'metadata'> | 'metadata';
  required: boolean;
}

const FILES: FileConfig[] = [
  { name: 'framework.json', key: 'metadata', required: false },
  { name: 'jurisdictions.json', key: 'jurisdictions', required: false },
  { name: 'regulations.json', key: 'regulations', required: false },
  { name: 'requirements.json', key: 'requirements', required: false },
  { name: 'entities.json', key: 'regulatedEntities', required: false },
  { name: 'solutions.json', key: 'solutions', required: false },
  { name: 'zone-assignments.json', key: 'zoneAssignments', required: false },
  { name: 'mappings.json', key: 'mappings', required: false },
  { name: 'enforcement.json', key: 'enforcementAssessments', required: false },
];

// Load a single JSON file
async function loadJsonFile<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to load ${url}: ${response.status}`);
      return null;
    }
    return await response.json() as T;
  } catch (error) {
    console.warn(`Error loading ${url}:`, error);
    return null;
  }
}

// Load compliance framework from a directory URL
export async function loadFramework(baseUrl: string): Promise<ComplianceFramework> {
  // Normalize URL (remove trailing slash)
  baseUrl = baseUrl.replace(/\/$/, '');

  console.log('Loading framework from:', baseUrl);

  // Load all files in parallel
  const results = await Promise.all(
    FILES.map(async (file) => {
      const url = `${baseUrl}/${file.name}`;
      console.log('Fetching:', url);

      if (file.key === 'metadata') {
        const data = await loadJsonFile<FrameworkMetadata>(url);
        return { key: file.key, data: data || { name: 'Unknown Framework', version: '0.0.0' } };
      }

      const data = await loadJsonFile<unknown[]>(url);
      return { key: file.key, data: data || [] };
    })
  );

  // Build framework object
  const framework: ComplianceFramework = {
    metadata: { name: '', version: '' },
    jurisdictions: [],
    regulations: [],
    requirements: [],
    regulatedEntities: [],
    solutions: [],
    zoneAssignments: [],
    mappings: [],
    enforcementAssessments: [],
  };

  for (const result of results) {
    if (result.key === 'metadata') {
      framework.metadata = result.data as FrameworkMetadata;
    } else {
      (framework[result.key] as unknown[]) = result.data as unknown[];
    }
  }

  console.log('Framework loaded:', {
    name: framework.metadata.name,
    jurisdictions: framework.jurisdictions.length,
    regulations: framework.regulations.length,
    requirements: framework.requirements.length,
    solutions: framework.solutions.length,
    mappings: framework.mappings.length,
    zoneAssignments: framework.zoneAssignments.length,
  });

  return framework;
}

// Get URL parameter
export function getUrlParameter(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get URL parameter as array (comma-separated)
export function getUrlParameterArray(param: string): string[] {
  const value = getUrlParameter(param);
  if (!value) return [];
  return value.split(',').filter(v => v.length > 0);
}

// Update URL parameter
export function updateUrlParameter(param: string, value: string): void {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.replaceState({}, '', url.toString());
}

// Update URL parameter with array (comma-separated)
export function updateUrlParameterArray(param: string, values: string[]): void {
  const url = new URL(window.location.href);
  if (values.length > 0) {
    url.searchParams.set(param, values.join(','));
  } else {
    url.searchParams.delete(param);
  }
  window.history.replaceState({}, '', url.toString());
}

// Remove URL parameter
export function removeUrlParameter(param: string): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.replaceState({}, '', url.toString());
}

// Load executive overview from a directory URL
export async function loadExecutiveOverview(baseUrl: string): Promise<ExecutiveOverview | null> {
  baseUrl = baseUrl.replace(/\/$/, '');
  const url = `${baseUrl}/executive-overview.json`;
  console.log('Loading executive overview from:', url);
  return loadJsonFile<ExecutiveOverview>(url);
}
