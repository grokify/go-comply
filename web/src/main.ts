import 'tabulator-tables/dist/css/tabulator.min.css';
import type { TabName, ViewMode } from './types';
import { loadFramework, loadExecutiveOverview, getUrlParameter, getUrlParameterArray, updateUrlParameter, updateUrlParameterArray } from './api';
import {
  state,
  setFramework,
  setExecutiveOverview,
  setBaseUrl,
  setActiveTab,
  setViewMode,
  setFilter,
  clearFilters as clearStateFilters,
  setLoading,
  setError,
  getFilteredRegulations,
  getFilteredRequirements,
  getFilteredSolutions,
  getFilteredMappings,
  getFilteredZoneAssignments,
  getFilteredEnforcement,
} from './state';
import {
  renderRegulationCards,
  renderRequirementCards,
  renderSolutionCards,
  renderEnforcementCards,
} from './views/cards';
import {
  renderRegulationsTable,
  renderRequirementsTable,
  renderSolutionsTable,
  renderMappingsTable,
  renderMappingsHeatmap,
  renderZonesSectioned,
  renderEnforcementTable,
} from './views/tables';
import {
  initModal,
  showRegulationDetail,
  showRequirementDetail,
  showSolutionDetail,
  showEnforcementDetail,
} from './views/modal';
import { renderExecutiveOverview } from './views/overview';

// DOM Elements
let dataUrlInput: HTMLInputElement;
let loadStatusDiv: HTMLElement;
let frameworkInfoSection: HTMLElement;
let navTabsSection: HTMLElement;
let filterPanelSection: HTMLElement;
let contentAreaSection: HTMLElement;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  initElements();
  initModal();
  setupEventListeners();

  // Auto-load from URL parameter or default to ./data
  const dataUrl = getUrlParameter('url') || getUrlParameter('data') || './data';
  dataUrlInput.value = dataUrl;
  handleLoadFramework();
});

// Initialize DOM element references
function initElements(): void {
  dataUrlInput = document.getElementById('data-url') as HTMLInputElement;
  loadStatusDiv = document.getElementById('load-status') as HTMLElement;
  frameworkInfoSection = document.getElementById('framework-info') as HTMLElement;
  navTabsSection = document.getElementById('nav-tabs') as HTMLElement;
  filterPanelSection = document.getElementById('filter-panel') as HTMLElement;
  contentAreaSection = document.getElementById('content-area') as HTMLElement;
}

// Setup event listeners
function setupEventListeners(): void {
  // Load button
  document.getElementById('load-btn')?.addEventListener('click', handleLoadFramework);

  // Enter key on URL input
  dataUrlInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLoadFramework();
  });

  // Tab navigation
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = (tab as HTMLElement).dataset.tab as TabName;
      handleTabChange(tabName);
    });
  });

  // View mode toggle
  document.querySelectorAll('.view-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = (btn as HTMLElement).dataset.mode as ViewMode;
      handleViewModeChange(mode);
    });
  });

  // Filter changes
  document.getElementById('filter-jurisdiction')?.addEventListener('change', (e) => {
    const value = (e.target as HTMLSelectElement).value;
    setFilter('jurisdiction', value);
    updateUrlParameter('jurisdiction', value);
    renderContent();
  });
  document.getElementById('filter-regulation')?.addEventListener('change', (e) => {
    const value = (e.target as HTMLSelectElement).value;
    setFilter('regulation', value);
    updateUrlParameter('regulation', value);
    renderContent();
  });
  document.getElementById('filter-solution')?.addEventListener('change', (e) => {
    const value = (e.target as HTMLSelectElement).value;
    setFilter('solution', value);
    updateUrlParameter('solution', value);
    renderContent();
  });
  document.getElementById('filter-zone')?.addEventListener('change', (e) => {
    const value = (e.target as HTMLSelectElement).value;
    setFilter('zone', value);
    updateUrlParameter('zone', value);
    renderContent();
  });
  document.getElementById('filter-search')?.addEventListener('input', debounce((e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setFilter('search', value);
    updateUrlParameter('search', value);
    renderContent();
  }, 300));

  // Clear filters button
  document.getElementById('clear-filters-btn')?.addEventListener('click', handleClearFilters);
}

// Load framework handler
async function handleLoadFramework(): Promise<void> {
  const baseUrl = dataUrlInput.value.trim();
  if (!baseUrl) {
    showStatus('Please enter a URL', 'error');
    return;
  }

  setBaseUrl(baseUrl);
  setLoading(true);
  showStatus('Loading framework...', 'loading');

  try {
    // Load framework and executive overview in parallel
    const [framework, overview] = await Promise.all([
      loadFramework(baseUrl),
      loadExecutiveOverview(baseUrl)
    ]);
    setFramework(framework);
    setExecutiveOverview(overview);
    updateUrlParameter('url', baseUrl);

    // Show UI sections
    frameworkInfoSection.classList.remove('hidden');
    navTabsSection.classList.remove('hidden');
    filterPanelSection.classList.remove('hidden');
    contentAreaSection.classList.remove('hidden');

    // Update framework info display
    updateFrameworkInfo();
    populateFilters();

    // Restore state from URL after filters are populated
    restoreStateFromUrl();

    renderContent();

    showStatus('Framework loaded successfully!', 'success');
    setTimeout(() => {
      loadStatusDiv.textContent = '';
      loadStatusDiv.className = 'status';
    }, 3000);

  } catch (error) {
    console.error('Error loading framework:', error);
    setError(String(error));
    showStatus(`Error loading framework: ${error}`, 'error');
  } finally {
    setLoading(false);
  }
}

// Show status message
function showStatus(message: string, type: 'loading' | 'success' | 'error'): void {
  loadStatusDiv.textContent = message;
  loadStatusDiv.className = `status ${type}`;
}

// Update framework info display
function updateFrameworkInfo(): void {
  const fw = state.framework;

  const nameEl = document.getElementById('fw-name');
  const versionEl = document.getElementById('fw-version');
  const updatedEl = document.getElementById('fw-updated');
  const descEl = document.getElementById('fw-description');

  if (nameEl) nameEl.textContent = fw.metadata.name || 'Unnamed Framework';
  if (versionEl) versionEl.textContent = fw.metadata.version || '-';
  if (updatedEl) updatedEl.textContent = fw.metadata.lastUpdated || '-';
  if (descEl) descEl.textContent = fw.metadata.description || '';

  // Update stats
  const setStatValue = (id: string, value: number) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value);
  };

  setStatValue('stat-jurisdictions', fw.jurisdictions.length);
  setStatValue('stat-regulations', fw.regulations.length);
  setStatValue('stat-requirements', fw.requirements.length);
  setStatValue('stat-solutions', fw.solutions.length);
  setStatValue('stat-mappings', fw.mappings.length);
  setStatValue('stat-zones', fw.zoneAssignments.length);
}

// Populate filter dropdowns
function populateFilters(): void {
  const fw = state.framework;

  // Jurisdictions dropdown
  const jurisdictionSelect = document.getElementById('filter-jurisdiction') as HTMLSelectElement;
  if (jurisdictionSelect) {
    jurisdictionSelect.innerHTML = '<option value="">All Jurisdictions</option>';
    fw.jurisdictions.forEach(j => {
      const option = document.createElement('option');
      option.value = j.id;
      option.textContent = `${j.id} - ${j.name}`;
      jurisdictionSelect.appendChild(option);
    });
  }

  // Jurisdiction checkboxes for mappings
  const jurisdictionCheckboxes = document.getElementById('jurisdiction-checkboxes');
  if (jurisdictionCheckboxes) {
    // Get unique jurisdictions from mappings
    const mappingJurisdictions = new Set<string>();
    fw.mappings.forEach(m => {
      if (m.jurisdictionIds?.length) {
        m.jurisdictionIds.forEach(j => mappingJurisdictions.add(j));
      }
    });

    // Also add jurisdictions from the framework
    fw.jurisdictions.forEach(j => mappingJurisdictions.add(j.id));

    jurisdictionCheckboxes.innerHTML = '';
    const sortedJurisdictions = [...mappingJurisdictions].sort();
    sortedJurisdictions.forEach(jId => {
      const label = document.createElement('label');
      label.className = 'checkbox-item';
      label.innerHTML = `<input type="checkbox" value="${jId}" checked> ${jId}`;
      jurisdictionCheckboxes.appendChild(label);
    });

    // Add change listeners - auto-check parent jurisdiction when child is checked
    jurisdictionCheckboxes.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const checkbox = e.target as HTMLInputElement;
        // If checking a jurisdiction, also check its parent (e.g., DE → EU)
        if (checkbox.checked) {
          const jurisdiction = fw.jurisdictions.find(j => j.id === checkbox.value);
          if (jurisdiction?.parentId) {
            const parentCheckbox = jurisdictionCheckboxes.querySelector(
              `input[type="checkbox"][value="${jurisdiction.parentId}"]`
            ) as HTMLInputElement | null;
            if (parentCheckbox && !parentCheckbox.checked) {
              parentCheckbox.checked = true;
            }
          }
        }
        updateUrlParameterArray('mapJurisdictions', getSelectedJurisdictions());
        renderMappingsContent();
      });
    });

    // Select all / deselect all buttons
    document.getElementById('select-all-jurisdictions')?.addEventListener('click', () => {
      jurisdictionCheckboxes.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        (cb as HTMLInputElement).checked = true;
      });
      updateUrlParameterArray('mapJurisdictions', getSelectedJurisdictions());
      renderMappingsContent();
    });

    document.getElementById('deselect-all-jurisdictions')?.addEventListener('click', () => {
      jurisdictionCheckboxes.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        (cb as HTMLInputElement).checked = false;
      });
      updateUrlParameterArray('mapJurisdictions', []);
      renderMappingsContent();
    });
  }

  // Zone checkboxes change listeners
  const zoneCheckboxes = document.getElementById('zone-checkboxes');
  if (zoneCheckboxes) {
    zoneCheckboxes.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        updateUrlParameterArray('mapZones', getSelectedZones());
        renderMappingsContent();
      });
    });
  }

  // Regulations dropdown
  const regulationSelect = document.getElementById('filter-regulation') as HTMLSelectElement;
  if (regulationSelect) {
    regulationSelect.innerHTML = '<option value="">All Regulations</option>';
    fw.regulations.forEach(r => {
      const option = document.createElement('option');
      option.value = r.id;
      option.textContent = r.shortName || r.id;
      regulationSelect.appendChild(option);
    });
  }

  // Solutions dropdown
  const solutionSelect = document.getElementById('filter-solution') as HTMLSelectElement;
  if (solutionSelect) {
    solutionSelect.innerHTML = '<option value="">All Solutions</option>';
    fw.solutions.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.name || s.id;
      solutionSelect.appendChild(option);
    });
  }
}

// Handle tab change
function handleTabChange(tabName: TabName): void {
  setActiveTab(tabName);
  updateUrlParameter('tab', tabName);

  // Update tab buttons
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', (t as HTMLElement).dataset.tab === tabName);
  });

  // Update content panels
  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });

  renderContent();
}

// Handle view mode change
function handleViewModeChange(mode: ViewMode): void {
  setViewMode(mode);
  updateUrlParameter('view', mode);

  // Update toggle buttons
  document.querySelectorAll('.view-toggle').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.mode === mode);
  });

  renderContent();
}

// Handle clear filters
function handleClearFilters(): void {
  clearStateFilters();

  // Reset dropdown filters UI
  (document.getElementById('filter-jurisdiction') as HTMLSelectElement).value = '';
  (document.getElementById('filter-regulation') as HTMLSelectElement).value = '';
  (document.getElementById('filter-solution') as HTMLSelectElement).value = '';
  (document.getElementById('filter-zone') as HTMLSelectElement).value = '';
  (document.getElementById('filter-search') as HTMLInputElement).value = '';

  // Reset checkbox filters UI (check all)
  document.querySelectorAll('#jurisdiction-checkboxes input[type="checkbox"]').forEach(cb => {
    (cb as HTMLInputElement).checked = true;
  });
  document.querySelectorAll('#zone-checkboxes input[type="checkbox"]').forEach(cb => {
    (cb as HTMLInputElement).checked = true;
  });

  // Clear URL filter params
  updateUrlParameter('jurisdiction', '');
  updateUrlParameter('regulation', '');
  updateUrlParameter('solution', '');
  updateUrlParameter('zone', '');
  updateUrlParameter('search', '');
  updateUrlParameterArray('mapJurisdictions', []);
  updateUrlParameterArray('mapZones', []);
  updateUrlParameterArray('expanded', []);

  renderContent();
}

// Restore state from URL parameters
function restoreStateFromUrl(): void {
  // Restore tab
  const tab = getUrlParameter('tab') as TabName | null;
  if (tab && ['overview', 'regulations', 'requirements', 'solutions', 'mappings', 'zones', 'enforcement'].includes(tab)) {
    setActiveTab(tab);
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', (t as HTMLElement).dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tab}`);
    });
  }

  // Restore view mode
  const view = getUrlParameter('view') as ViewMode | null;
  if (view && ['cards', 'table'].includes(view)) {
    setViewMode(view);
    document.querySelectorAll('.view-toggle').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.mode === view);
    });
  }

  // Restore dropdown filters
  const jurisdiction = getUrlParameter('jurisdiction');
  if (jurisdiction) {
    setFilter('jurisdiction', jurisdiction);
    (document.getElementById('filter-jurisdiction') as HTMLSelectElement).value = jurisdiction;
  }

  const regulation = getUrlParameter('regulation');
  if (regulation) {
    setFilter('regulation', regulation);
    (document.getElementById('filter-regulation') as HTMLSelectElement).value = regulation;
  }

  const solution = getUrlParameter('solution');
  if (solution) {
    setFilter('solution', solution);
    (document.getElementById('filter-solution') as HTMLSelectElement).value = solution;
  }

  const zone = getUrlParameter('zone');
  if (zone) {
    setFilter('zone', zone);
    (document.getElementById('filter-zone') as HTMLSelectElement).value = zone;
  }

  const search = getUrlParameter('search');
  if (search) {
    setFilter('search', search);
    (document.getElementById('filter-search') as HTMLInputElement).value = search;
  }

  // Restore mappings jurisdiction checkboxes
  const mapJurisdictions = getUrlParameterArray('mapJurisdictions');
  if (mapJurisdictions.length > 0) {
    document.querySelectorAll('#jurisdiction-checkboxes input[type="checkbox"]').forEach(cb => {
      const checkbox = cb as HTMLInputElement;
      checkbox.checked = mapJurisdictions.includes(checkbox.value);
    });
  }

  // Restore mappings zone checkboxes
  const mapZones = getUrlParameterArray('mapZones');
  if (mapZones.length > 0) {
    document.querySelectorAll('#zone-checkboxes input[type="checkbox"]').forEach(cb => {
      const checkbox = cb as HTMLInputElement;
      checkbox.checked = mapZones.includes(checkbox.value);
    });
  }
}

// Render content based on active tab and view mode
function renderContent(): void {
  const { activeTab, viewMode } = state;

  switch (activeTab) {
    case 'overview':
      renderOverviewContent();
      break;
    case 'regulations':
      renderRegulationsContent(viewMode);
      break;
    case 'requirements':
      renderRequirementsContent(viewMode);
      break;
    case 'solutions':
      renderSolutionsContent(viewMode);
      break;
    case 'mappings':
      renderMappingsContent();
      break;
    case 'zones':
      renderZonesContent();
      break;
    case 'enforcement':
      renderEnforcementContent(viewMode);
      break;
  }
}

// Render overview
function renderOverviewContent(): void {
  renderExecutiveOverview('overview-content', state.executiveOverview);
}

// Render regulations
function renderRegulationsContent(viewMode: ViewMode): void {
  const regulations = getFilteredRegulations();
  const cardsContainer = document.getElementById('regulations-cards');
  const tableContainer = document.getElementById('regulations-table');

  if (viewMode === 'cards' && cardsContainer) {
    cardsContainer.classList.remove('hidden');
    tableContainer?.classList.add('hidden');
    renderRegulationCards(cardsContainer, regulations, showRegulationDetail);
  } else if (tableContainer) {
    cardsContainer?.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    renderRegulationsTable('regulations-table', regulations, showRegulationDetail);
  }
}

// Render requirements
function renderRequirementsContent(viewMode: ViewMode): void {
  const requirements = getFilteredRequirements();
  const cardsContainer = document.getElementById('requirements-cards');
  const tableContainer = document.getElementById('requirements-table');

  if (viewMode === 'cards' && cardsContainer) {
    cardsContainer.classList.remove('hidden');
    tableContainer?.classList.add('hidden');
    renderRequirementCards(cardsContainer, requirements, showRequirementDetail);
  } else if (tableContainer) {
    cardsContainer?.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    renderRequirementsTable('requirements-table', requirements, showRequirementDetail);
  }
}

// Render solutions
function renderSolutionsContent(viewMode: ViewMode): void {
  const solutions = getFilteredSolutions();
  const cardsContainer = document.getElementById('solutions-cards');
  const tableContainer = document.getElementById('solutions-table');

  if (viewMode === 'cards' && cardsContainer) {
    cardsContainer.classList.remove('hidden');
    tableContainer?.classList.add('hidden');
    renderSolutionCards(cardsContainer, solutions, showSolutionDetail);
  } else if (tableContainer) {
    cardsContainer?.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    renderSolutionsTable('solutions-table', solutions, showSolutionDetail);
  }
}

// Get selected jurisdictions from checkboxes
function getSelectedJurisdictions(): string[] {
  const checkboxes = document.querySelectorAll('#jurisdiction-checkboxes input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => (cb as HTMLInputElement).value);
}

// Get selected zones from checkboxes
function getSelectedZones(): string[] {
  const checkboxes = document.querySelectorAll('#zone-checkboxes input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => (cb as HTMLInputElement).value);
}

// Get expanded requirement IDs from URL
function getExpandedReqIds(): Set<string> {
  const expanded = getUrlParameterArray('expanded');
  return new Set(expanded);
}

// Handle row expand/collapse toggle
function handleRowToggle(reqId: string, isExpanded: boolean): void {
  const expanded = getExpandedReqIds();
  if (isExpanded) {
    expanded.add(reqId);
  } else {
    expanded.delete(reqId);
  }
  updateUrlParameterArray('expanded', [...expanded]);
}

// Render mappings as heatmap grid
function renderMappingsContent(): void {
  let mappings = getFilteredMappings();

  // Filter by selected jurisdictions
  const selectedJurisdictions = getSelectedJurisdictions();
  if (selectedJurisdictions.length > 0) {
    mappings = mappings.filter(m => {
      // If mapping has no jurisdiction specified, include it (applies to all)
      if (!m.jurisdictionIds?.length) return true;
      // Otherwise, check if any of the mapping's jurisdictions are selected
      return m.jurisdictionIds.some(j => selectedJurisdictions.includes(j));
    });
  }

  // Filter by selected zones
  const selectedZones = getSelectedZones();
  if (selectedZones.length > 0) {
    mappings = mappings.filter(m => m.zone && selectedZones.includes(m.zone));
  } else {
    // If no zones selected, show nothing
    mappings = [];
  }

  const heatmapContainer = document.getElementById('mappings-heatmap');
  const tableContainer = document.getElementById('mappings-table');

  // Use heatmap view by default, fall back to table if many mappings
  if (heatmapContainer) {
    renderMappingsHeatmap(
      'mappings-heatmap',
      mappings,
      state.framework.requirements,
      state.framework.solutions,
      state.framework.regulations,
      getExpandedReqIds(),
      handleRowToggle
    );
    heatmapContainer.classList.remove('hidden');
    tableContainer?.classList.add('hidden');
  } else if (tableContainer) {
    renderMappingsTable('mappings-table', mappings);
  }
}

// Render zones as stacked sections by zone color
function renderZonesContent(): void {
  const zones = getFilteredZoneAssignments();
  const mappings = getFilteredMappings();
  const sectionedContainer = document.getElementById('zones-sectioned');

  if (sectionedContainer) {
    renderZonesSectioned(
      'zones-sectioned',
      zones,
      mappings,
      state.framework.solutions
    );
  }
}

// Render enforcement
function renderEnforcementContent(viewMode: ViewMode): void {
  const assessments = getFilteredEnforcement();
  const cardsContainer = document.getElementById('enforcement-cards');
  const tableContainer = document.getElementById('enforcement-table');

  if (viewMode === 'cards' && cardsContainer) {
    cardsContainer.classList.remove('hidden');
    tableContainer?.classList.add('hidden');
    renderEnforcementCards(cardsContainer, assessments, showEnforcementDetail);
  } else if (tableContainer) {
    cardsContainer?.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    renderEnforcementTable('enforcement-table', assessments, showEnforcementDetail);
  }
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Export for global access (if needed)
(window as any).clearFilters = handleClearFilters;
