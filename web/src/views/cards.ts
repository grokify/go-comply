import type {
  Regulation,
  Requirement,
  Solution,
  EnforcementAssessment,
  RegulationStatus,
  RequirementSeverity,
  SolutionType,
  EnforcementLikelihood,
} from '../types';

// Badge class helpers
export function getStatusBadgeClass(status?: RegulationStatus): string {
  switch (status) {
    case 'enforceable': return 'badge-success';
    case 'adopted': return 'badge-warning';
    case 'draft': return 'badge-secondary';
    case 'superseded': return 'badge-danger';
    default: return 'badge-secondary';
  }
}

export function getSeverityBadgeClass(severity?: RequirementSeverity): string {
  switch (severity) {
    case 'critical': return 'badge-danger';
    case 'high': return 'badge-warning';
    case 'medium': return 'badge-primary';
    case 'low': return 'badge-secondary';
    default: return 'badge-secondary';
  }
}

export function getSolutionTypeBadgeClass(type?: SolutionType): string {
  switch (type) {
    case 'sovereign': return 'badge-success';
    case 'national-partner': return 'badge-success';
    case 'govcloud': return 'badge-warning';
    case 'private': return 'badge-primary';
    case 'commercial': return 'badge-secondary';
    default: return 'badge-secondary';
  }
}

export function getLikelihoodBadgeClass(likelihood?: EnforcementLikelihood): string {
  switch (likelihood) {
    case 'high': return 'badge-danger';
    case 'medium': return 'badge-warning';
    case 'low': return 'badge-success';
    case 'uncertain': return 'badge-secondary';
    default: return 'badge-secondary';
  }
}

// Render regulation cards
export function renderRegulationCards(
  container: HTMLElement,
  regulations: Regulation[],
  onCardClick: (id: string) => void
): void {
  if (regulations.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No regulations found matching your filters.</p></div>';
    return;
  }

  container.innerHTML = regulations.map(r => `
    <div class="data-card" data-id="${r.id}">
      <div class="card-id">${r.id}</div>
      <h3>${r.shortName || r.name}</h3>
      <div class="card-meta">
        <span class="badge badge-primary">${r.jurisdictionId || 'N/A'}</span>
        <span class="badge ${getStatusBadgeClass(r.status)}">${r.status || 'N/A'}</span>
      </div>
      <p class="card-description">${r.description || ''}</p>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.data-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) onCardClick(id);
    });
  });
}

// Render requirement cards
export function renderRequirementCards(
  container: HTMLElement,
  requirements: Requirement[],
  onCardClick: (id: string) => void
): void {
  if (requirements.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No requirements found matching your filters.</p></div>';
    return;
  }

  container.innerHTML = requirements.map(r => `
    <div class="data-card" data-id="${r.id}">
      <div class="card-id">${r.id}</div>
      <h3>${r.name}</h3>
      <div class="card-meta">
        <span class="badge badge-primary">${r.regulationId || 'N/A'}</span>
        ${r.category ? `<span class="badge badge-secondary">${r.category}</span>` : ''}
        ${r.severity ? `<span class="badge ${getSeverityBadgeClass(r.severity)}">${r.severity}</span>` : ''}
      </div>
      <p class="card-description">${r.description || ''}</p>
    </div>
  `).join('');

  container.querySelectorAll('.data-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) onCardClick(id);
    });
  });
}

// Render solution cards
export function renderSolutionCards(
  container: HTMLElement,
  solutions: Solution[],
  onCardClick: (id: string) => void
): void {
  if (solutions.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No solutions found matching your filters.</p></div>';
    return;
  }

  container.innerHTML = solutions.map(s => `
    <div class="data-card" data-id="${s.id}">
      <div class="card-id">${s.id}</div>
      <h3>${s.name}</h3>
      <div class="card-meta">
        <span class="badge badge-primary">${s.provider || 'N/A'}</span>
        <span class="badge ${getSolutionTypeBadgeClass(s.type)}">${s.type || 'N/A'}</span>
        ${s.ownershipStructure?.subjectToExtraTerritorialLaw ?
          '<span class="badge badge-danger">CLOUD Act</span>' : ''}
      </div>
      <p class="card-description">${s.description || ''}</p>
    </div>
  `).join('');

  container.querySelectorAll('.data-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) onCardClick(id);
    });
  });
}

// Render enforcement cards
export function renderEnforcementCards(
  container: HTMLElement,
  assessments: EnforcementAssessment[],
  onCardClick: (id: string) => void
): void {
  if (assessments.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No enforcement assessments found matching your filters.</p></div>';
    return;
  }

  container.innerHTML = assessments.map(e => `
    <div class="data-card" data-id="${e.id}">
      <div class="card-id">${e.id}</div>
      <h3>${e.regulationId || 'General Assessment'}</h3>
      <div class="card-meta">
        <span class="badge badge-primary">${e.jurisdictionId}</span>
        <span class="badge ${getLikelihoodBadgeClass(e.likelihood)}">${e.likelihood}</span>
        ${e.assessmentDate ? `<span class="badge badge-secondary">${e.assessmentDate}</span>` : ''}
      </div>
      <p class="card-description">${e.rationale || ''}</p>
    </div>
  `).join('');

  container.querySelectorAll('.data-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) onCardClick(id);
    });
  });
}
