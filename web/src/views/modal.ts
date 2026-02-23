// Types are used via state imports
import {
  getRegulation,
  getRequirement,
  getSolution,
  getJurisdiction,
  getMappingsForRequirement,
  getMappingsForSolution,
  getZonesForSolution,
  getRequirementsByRegulation,
  state,
} from '../state';
import {
  getStatusBadgeClass,
  getSeverityBadgeClass,
  getSolutionTypeBadgeClass,
  getLikelihoodBadgeClass,
} from './cards';

// Modal elements
let modalElement: HTMLElement | null = null;
let modalBodyElement: HTMLElement | null = null;

// Initialize modal
export function initModal(): void {
  modalElement = document.getElementById('detail-modal');
  modalBodyElement = document.getElementById('modal-body');

  // Close on outside click
  modalElement?.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeModal();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Close button
  document.querySelector('.close-btn')?.addEventListener('click', closeModal);
}

// Show modal with content
export function showModal(html: string): void {
  if (modalBodyElement) {
    modalBodyElement.innerHTML = html;
  }
  modalElement?.classList.remove('hidden');
}

// Close modal
export function closeModal(): void {
  modalElement?.classList.add('hidden');
}

// Show regulation detail
export function showRegulationDetail(id: string): void {
  const regulation = getRegulation(id);
  if (!regulation) return;

  const requirements = getRequirementsByRegulation(id);

  const html = `
    <h2>${regulation.name}</h2>
    <div class="detail-grid">
      <span class="detail-label">ID:</span>
      <span class="detail-value"><code>${regulation.id}</code></span>
      <span class="detail-label">Short Name:</span>
      <span class="detail-value">${regulation.shortName || '-'}</span>
      <span class="detail-label">Jurisdiction:</span>
      <span class="detail-value">${regulation.jurisdictionId || '-'}</span>
      <span class="detail-label">Status:</span>
      <span class="detail-value"><span class="badge ${getStatusBadgeClass(regulation.status)}">${regulation.status || '-'}</span></span>
      <span class="detail-label">Adopted:</span>
      <span class="detail-value">${regulation.adoptedDate || '-'}</span>
      <span class="detail-label">Effective:</span>
      <span class="detail-value">${regulation.effectiveDate || '-'}</span>
      <span class="detail-label">Enforcement:</span>
      <span class="detail-value">${regulation.enforcementDate || '-'}</span>
    </div>
    ${regulation.description ? `<p>${regulation.description}</p>` : ''}
    ${regulation.officialUrl ? `<p><a href="${regulation.officialUrl}" target="_blank">Official Documentation</a></p>` : ''}
    ${regulation.tags?.length ? `
      <h3>Tags</h3>
      <div class="tag-list">
        ${regulation.tags.map(t => `<span class="badge badge-secondary">${t}</span>`).join(' ')}
      </div>
    ` : ''}
    ${requirements.length ? `
      <h3>Requirements (${requirements.length})</h3>
      <ul>
        ${requirements.map(r => `<li><strong>${r.id}</strong>: ${r.name}</li>`).join('')}
      </ul>
    ` : ''}
  `;

  showModal(html);
}

// Show requirement detail
export function showRequirementDetail(id: string): void {
  const requirement = getRequirement(id);
  if (!requirement) return;

  const mappings = getMappingsForRequirement(id);
  const regulation = getRegulation(requirement.regulationId);

  const html = `
    <h2>${requirement.name}</h2>
    <div class="detail-grid">
      <span class="detail-label">ID:</span>
      <span class="detail-value"><code>${requirement.id}</code></span>
      <span class="detail-label">Regulation:</span>
      <span class="detail-value">${regulation?.shortName || requirement.regulationId || '-'}</span>
      <span class="detail-label">Category:</span>
      <span class="detail-value">${requirement.category || '-'}</span>
      <span class="detail-label">Subcategory:</span>
      <span class="detail-value">${requirement.subcategory || '-'}</span>
      <span class="detail-label">Severity:</span>
      <span class="detail-value"><span class="badge ${getSeverityBadgeClass(requirement.severity)}">${requirement.severity || '-'}</span></span>
      <span class="detail-label">Effective Date:</span>
      <span class="detail-value">${requirement.effectiveDate || '-'}</span>
    </div>
    ${requirement.description ? `<p>${requirement.description}</p>` : ''}
    ${requirement.applicability ? `
      <h3>Applicability</h3>
      <div class="detail-grid">
        ${requirement.applicability.entityTypes?.length ? `
          <span class="detail-label">Entity Types:</span>
          <span class="detail-value">${requirement.applicability.entityTypes.join(', ')}</span>
        ` : ''}
        ${requirement.applicability.sectors?.length ? `
          <span class="detail-label">Sectors:</span>
          <span class="detail-value">${requirement.applicability.sectors.join(', ')}</span>
        ` : ''}
        ${requirement.applicability.dataTypes?.length ? `
          <span class="detail-label">Data Types:</span>
          <span class="detail-value">${requirement.applicability.dataTypes.join(', ')}</span>
        ` : ''}
        ${requirement.applicability.conditions ? `
          <span class="detail-label">Conditions:</span>
          <span class="detail-value">${requirement.applicability.conditions}</span>
        ` : ''}
      </div>
    ` : ''}
    ${requirement.keywords?.length ? `
      <h3>Keywords</h3>
      <div class="tag-list">
        ${requirement.keywords.map(k => `<span class="badge badge-secondary">${k}</span>`).join(' ')}
      </div>
    ` : ''}
    ${mappings.length ? `
      <h3>Solution Mappings (${mappings.length})</h3>
      <table class="data-table">
        <thead>
          <tr><th>Solution</th><th>Compliance</th><th>Zone</th><th>Notes</th></tr>
        </thead>
        <tbody>
          ${mappings.map(m => `
            <tr>
              <td>${m.solutionId}</td>
              <td><span class="badge compliance-${m.complianceLevel}">${m.complianceLevel}</span></td>
              <td>${m.zone ? `<span class="badge zone-${m.zone}">${m.zone}</span>` : '-'}</td>
              <td>${m.notes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
  `;

  showModal(html);
}

// Show solution detail
export function showSolutionDetail(id: string): void {
  const solution = getSolution(id);
  if (!solution) return;

  const mappings = getMappingsForSolution(id);
  const zones = getZonesForSolution(id);

  const html = `
    <h2>${solution.name}</h2>
    <div class="detail-grid">
      <span class="detail-label">ID:</span>
      <span class="detail-value"><code>${solution.id}</code></span>
      <span class="detail-label">Provider:</span>
      <span class="detail-value">${solution.provider || '-'}</span>
      <span class="detail-label">Type:</span>
      <span class="detail-value"><span class="badge ${getSolutionTypeBadgeClass(solution.type)}">${solution.type || '-'}</span></span>
      <span class="detail-label">Jurisdictions:</span>
      <span class="detail-value">${solution.jurisdictionIds?.join(', ') || '-'}</span>
    </div>
    ${solution.description ? `<p>${solution.description}</p>` : ''}
    ${solution.ownershipStructure ? `
      <h3>Ownership Structure</h3>
      <div class="detail-grid">
        <span class="detail-label">EU Ownership:</span>
        <span class="detail-value">${solution.ownershipStructure.euOwnershipPercent}%</span>
        <span class="detail-label">Largest Non-EU:</span>
        <span class="detail-value">${solution.ownershipStructure.largestNonEuPercent}%</span>
        <span class="detail-label">Extraterritorial Law:</span>
        <span class="detail-value">
          <span class="badge ${solution.ownershipStructure.subjectToExtraTerritorialLaw ? 'badge-danger' : 'badge-success'}">
            ${solution.ownershipStructure.subjectToExtraTerritorialLaw ? 'Yes (CLOUD Act)' : 'No'}
          </span>
        </span>
        ${solution.ownershipStructure.controllingEntity ? `
          <span class="detail-label">Controlling Entity:</span>
          <span class="detail-value">${solution.ownershipStructure.controllingEntity}</span>
        ` : ''}
        ${solution.ownershipStructure.notes ? `
          <span class="detail-label">Notes:</span>
          <span class="detail-value">${solution.ownershipStructure.notes}</span>
        ` : ''}
      </div>
    ` : ''}
    ${solution.certifications?.length ? `
      <h3>Certifications</h3>
      <div class="tag-list">
        ${solution.certifications.map(c => `<span class="badge badge-success">${c}</span>`).join(' ')}
      </div>
    ` : ''}
    ${solution.availableRegions?.length ? `
      <h3>Available Regions</h3>
      <div class="tag-list">
        ${solution.availableRegions.map(r => `<span class="badge badge-secondary">${r}</span>`).join(' ')}
      </div>
    ` : ''}
    ${zones.length ? `
      <h3>Zone Assignments (${zones.length})</h3>
      <table class="data-table">
        <thead>
          <tr><th>Jurisdiction</th><th>Zone</th><th>Data Category</th><th>Rationale</th></tr>
        </thead>
        <tbody>
          ${zones.map(z => `
            <tr>
              <td>${z.jurisdictionId}</td>
              <td><span class="badge zone-${z.zone}">${z.zone}</span></td>
              <td>${z.dataCategory || '-'}</td>
              <td>${z.rationale || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
    ${mappings.length ? `
      <h3>Requirement Mappings (${mappings.length})</h3>
      <table class="data-table">
        <thead>
          <tr><th>Requirement</th><th>Compliance</th><th>Zone</th></tr>
        </thead>
        <tbody>
          ${mappings.map(m => `
            <tr>
              <td><code>${m.requirementId}</code></td>
              <td><span class="badge compliance-${m.complianceLevel}">${m.complianceLevel}</span></td>
              <td>${m.zone ? `<span class="badge zone-${m.zone}">${m.zone}</span>` : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
  `;

  showModal(html);
}

// Show enforcement detail
export function showEnforcementDetail(id: string): void {
  const assessment = state.framework.enforcementAssessments.find(e => e.id === id);
  if (!assessment) return;

  const regulation = getRegulation(assessment.regulationId || '');
  const jurisdiction = getJurisdiction(assessment.jurisdictionId);

  const html = `
    <h2>Enforcement Assessment</h2>
    <div class="detail-grid">
      <span class="detail-label">ID:</span>
      <span class="detail-value"><code>${assessment.id}</code></span>
      <span class="detail-label">Regulation:</span>
      <span class="detail-value">${regulation?.shortName || assessment.regulationId || 'General'}</span>
      <span class="detail-label">Jurisdiction:</span>
      <span class="detail-value">${jurisdiction?.name || assessment.jurisdictionId}</span>
      <span class="detail-label">Likelihood:</span>
      <span class="detail-value"><span class="badge ${getLikelihoodBadgeClass(assessment.likelihood)}">${assessment.likelihood}</span></span>
      <span class="detail-label">Assessment Date:</span>
      <span class="detail-value">${assessment.assessmentDate || '-'}</span>
      <span class="detail-label">Assessor:</span>
      <span class="detail-value">${assessment.assessor || '-'}</span>
    </div>
    ${assessment.rationale ? `
      <h3>Rationale</h3>
      <p>${assessment.rationale}</p>
    ` : ''}
    ${assessment.regulatoryTrends ? `
      <h3>Regulatory Trends</h3>
      <p>${assessment.regulatoryTrends}</p>
    ` : ''}
    ${assessment.recentActions?.length ? `
      <h3>Recent Actions</h3>
      <table class="data-table">
        <thead>
          <tr><th>Date</th><th>Entity</th><th>Description</th><th>Penalty</th></tr>
        </thead>
        <tbody>
          ${assessment.recentActions.map(a => `
            <tr>
              <td>${a.date || '-'}</td>
              <td>${a.entity || '-'}</td>
              <td>${a.description || '-'}</td>
              <td>${a.penalty || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
  `;

  showModal(html);
}
