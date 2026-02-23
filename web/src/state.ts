import type {
  ComplianceFramework,
  ExecutiveOverview,
  FilterState,
  TabName,
  ViewMode,
  Jurisdiction,
  Regulation,
  Requirement,
  Solution,
  RequirementMapping,
  ZoneAssignment,
  EnforcementAssessment,
} from './types';

// Application State
export interface AppState {
  baseUrl: string;
  framework: ComplianceFramework;
  executiveOverview: ExecutiveOverview | null;
  activeTab: TabName;
  viewMode: ViewMode;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}

// Initial empty framework
const emptyFramework: ComplianceFramework = {
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

// Initial state
export const state: AppState = {
  baseUrl: '',
  framework: emptyFramework,
  executiveOverview: null,
  activeTab: 'overview',
  viewMode: 'cards',
  filters: {
    jurisdiction: '',
    regulation: '',
    solution: '',
    zone: '',
    search: '',
  },
  isLoading: false,
  error: null,
};

// State update functions
export function setFramework(framework: ComplianceFramework): void {
  state.framework = framework;
}

export function setExecutiveOverview(overview: ExecutiveOverview | null): void {
  state.executiveOverview = overview;
}

export function setBaseUrl(url: string): void {
  state.baseUrl = url;
}

export function setActiveTab(tab: TabName): void {
  state.activeTab = tab;
}

export function setViewMode(mode: ViewMode): void {
  state.viewMode = mode;
}

export function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
  state.filters[key] = value;
}

export function clearFilters(): void {
  state.filters = {
    jurisdiction: '',
    regulation: '',
    solution: '',
    zone: '',
    search: '',
  };
}

export function setLoading(loading: boolean): void {
  state.isLoading = loading;
}

export function setError(error: string | null): void {
  state.error = error;
}

// Getter functions with filtering
export function getFilteredRegulations(): Regulation[] {
  let regulations = [...state.framework.regulations];

  if (state.filters.jurisdiction) {
    regulations = regulations.filter(r => r.jurisdictionId === state.filters.jurisdiction);
  }
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    regulations = regulations.filter(r =>
      r.name?.toLowerCase().includes(search) ||
      r.shortName?.toLowerCase().includes(search) ||
      r.id?.toLowerCase().includes(search) ||
      r.description?.toLowerCase().includes(search)
    );
  }

  return regulations;
}

export function getFilteredRequirements(): Requirement[] {
  let requirements = [...state.framework.requirements];

  if (state.filters.regulation) {
    requirements = requirements.filter(r => r.regulationId === state.filters.regulation);
  }
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    requirements = requirements.filter(r =>
      r.name?.toLowerCase().includes(search) ||
      r.id?.toLowerCase().includes(search) ||
      r.description?.toLowerCase().includes(search) ||
      r.category?.toLowerCase().includes(search)
    );
  }

  return requirements;
}

export function getFilteredSolutions(): Solution[] {
  let solutions = [...state.framework.solutions];

  if (state.filters.jurisdiction) {
    solutions = solutions.filter(s =>
      s.jurisdictionIds?.includes(state.filters.jurisdiction)
    );
  }
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    solutions = solutions.filter(s =>
      s.name?.toLowerCase().includes(search) ||
      s.id?.toLowerCase().includes(search) ||
      s.provider?.toLowerCase().includes(search) ||
      s.description?.toLowerCase().includes(search)
    );
  }

  return solutions;
}

export function getFilteredMappings(): RequirementMapping[] {
  let mappings = [...state.framework.mappings];

  if (state.filters.jurisdiction) {
    mappings = mappings.filter(m =>
      !m.jurisdictionIds?.length ||
      m.jurisdictionIds.includes(state.filters.jurisdiction)
    );
  }
  if (state.filters.regulation) {
    const regRequirements = state.framework.requirements
      .filter(r => r.regulationId === state.filters.regulation)
      .map(r => r.id);
    mappings = mappings.filter(m => regRequirements.includes(m.requirementId));
  }
  if (state.filters.solution) {
    mappings = mappings.filter(m => m.solutionId === state.filters.solution);
  }
  if (state.filters.zone) {
    mappings = mappings.filter(m => m.zone === state.filters.zone);
  }
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    mappings = mappings.filter(m =>
      m.requirementId?.toLowerCase().includes(search) ||
      m.solutionId?.toLowerCase().includes(search) ||
      m.notes?.toLowerCase().includes(search)
    );
  }

  return mappings;
}

export function getFilteredZoneAssignments(): ZoneAssignment[] {
  let zones = [...state.framework.zoneAssignments];

  if (state.filters.jurisdiction) {
    zones = zones.filter(z => z.jurisdictionId === state.filters.jurisdiction);
  }
  if (state.filters.solution) {
    zones = zones.filter(z => z.solutionId === state.filters.solution);
  }
  if (state.filters.zone) {
    zones = zones.filter(z => z.zone === state.filters.zone);
  }
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    zones = zones.filter(z =>
      z.solutionId?.toLowerCase().includes(search) ||
      z.dataCategory?.toLowerCase().includes(search) ||
      z.rationale?.toLowerCase().includes(search)
    );
  }

  return zones;
}

export function getFilteredEnforcement(): EnforcementAssessment[] {
  let assessments = [...state.framework.enforcementAssessments];

  if (state.filters.jurisdiction) {
    assessments = assessments.filter(e => e.jurisdictionId === state.filters.jurisdiction);
  }
  if (state.filters.regulation) {
    assessments = assessments.filter(e => e.regulationId === state.filters.regulation);
  }
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    assessments = assessments.filter(e =>
      e.regulationId?.toLowerCase().includes(search) ||
      e.rationale?.toLowerCase().includes(search)
    );
  }

  return assessments;
}

// Lookup functions
export function getJurisdiction(id: string): Jurisdiction | undefined {
  return state.framework.jurisdictions.find(j => j.id === id);
}

export function getRegulation(id: string): Regulation | undefined {
  return state.framework.regulations.find(r => r.id === id);
}

export function getRequirement(id: string): Requirement | undefined {
  return state.framework.requirements.find(r => r.id === id);
}

export function getSolution(id: string): Solution | undefined {
  return state.framework.solutions.find(s => s.id === id);
}

export function getMappingsForRequirement(requirementId: string): RequirementMapping[] {
  return state.framework.mappings.filter(m => m.requirementId === requirementId);
}

export function getMappingsForSolution(solutionId: string): RequirementMapping[] {
  return state.framework.mappings.filter(m => m.solutionId === solutionId);
}

export function getZonesForSolution(solutionId: string): ZoneAssignment[] {
  return state.framework.zoneAssignments.filter(z => z.solutionId === solutionId);
}

export function getRequirementsByRegulation(regulationId: string): Requirement[] {
  return state.framework.requirements.filter(r => r.regulationId === regulationId);
}
