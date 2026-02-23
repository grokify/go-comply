import { TabulatorFull as Tabulator, CellComponent, RowComponent } from 'tabulator-tables';
import type {
  Regulation,
  Requirement,
  Solution,
  RequirementMapping,
  ZoneAssignment,
  EnforcementAssessment,
  ComplianceLevel,
  ComplianceZone,
} from '../types';

// Store table instances for cleanup
const tableInstances: Map<string, Tabulator> = new Map();

// Truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '-';
  return text.substring(0, maxLength) + '...';
}

// Zone badge formatter
function zoneBadgeFormatter(cell: CellComponent): string {
  const zone = cell.getValue() as ComplianceZone | undefined;
  if (!zone) return '-';
  return `<span class="badge zone-${zone}">${zone}</span>`;
}

// Compliance level badge formatter
function complianceBadgeFormatter(cell: CellComponent): string {
  const level = cell.getValue() as ComplianceLevel | undefined;
  if (!level) return '-';
  return `<span class="badge compliance-${level}">${level}</span>`;
}

// Array formatter (join with commas)
function arrayFormatter(cell: CellComponent): string {
  const arr = cell.getValue() as string[] | undefined;
  return arr?.join(', ') || '-';
}

// Destroy existing table if it exists
function destroyTable(containerId: string): void {
  const existing = tableInstances.get(containerId);
  if (existing) {
    existing.destroy();
    tableInstances.delete(containerId);
  }
}

// Create or update regulations table
export function renderRegulationsTable(
  containerId: string,
  regulations: Regulation[],
  onRowClick: (id: string) => void
): Tabulator {
  destroyTable(containerId);

  const table = new Tabulator(`#${containerId}`, {
    data: regulations,
    layout: 'fitDataFill',
    responsiveLayout: 'collapse',
    pagination: true,
    paginationSize: 20,
    placeholder: 'No regulations found matching your filters.',
    columns: [
      { title: 'ID', field: 'id', sorter: 'string', width: 180 },
      { title: 'Short Name', field: 'shortName', sorter: 'string', width: 150 },
      { title: 'Jurisdiction', field: 'jurisdictionId', sorter: 'string', width: 100 },
      { title: 'Status', field: 'status', sorter: 'string', width: 120,
        formatter: (cell: CellComponent) => {
          const status = cell.getValue() as string;
          const cls = status === 'enforceable' ? 'badge-success' :
                      status === 'adopted' ? 'badge-warning' :
                      status === 'draft' ? 'badge-secondary' : 'badge-danger';
          return `<span class="badge ${cls}">${status || '-'}</span>`;
        }
      },
      { title: 'Effective Date', field: 'effectiveDate', sorter: 'string', width: 130 },
      { title: 'Description', field: 'description', sorter: 'string', formatter: 'textarea' },
    ],
  });

  table.on('rowClick', (_e: UIEvent, row: RowComponent) => {
    const data = row.getData() as Regulation;
    onRowClick(data.id);
  });

  tableInstances.set(containerId, table);
  return table;
}

// Create or update requirements table with truncated description
export function renderRequirementsTable(
  containerId: string,
  requirements: Requirement[],
  onRowClick: (id: string) => void
): Tabulator {
  destroyTable(containerId);

  const table = new Tabulator(`#${containerId}`, {
    data: requirements,
    layout: 'fitDataFill',
    responsiveLayout: 'collapse',
    pagination: true,
    paginationSize: 20,
    placeholder: 'No requirements found matching your filters.',
    columns: [
      { title: 'ID', field: 'id', sorter: 'string', width: 180 },
      { title: 'Name', field: 'name', sorter: 'string', width: 220 },
      { title: 'Category', field: 'category', sorter: 'string', width: 130 },
      { title: 'Severity', field: 'severity', sorter: 'string', width: 90,
        formatter: (cell: CellComponent) => {
          const severity = cell.getValue() as string;
          const cls = severity === 'critical' ? 'badge-danger' :
                      severity === 'high' ? 'badge-warning' :
                      severity === 'medium' ? 'badge-primary' : 'badge-secondary';
          return `<span class="badge ${cls}">${severity || '-'}</span>`;
        }
      },
      { title: 'Regulation', field: 'regulationId', sorter: 'string', width: 160 },
      {
        title: 'Description',
        field: 'description',
        sorter: 'string',
        formatter: (cell: CellComponent) => {
          const desc = cell.getValue() as string;
          const truncated = truncateText(desc, 80);
          if (desc && desc.length > 80) {
            return `<span class="truncated-text" title="${desc.replace(/"/g, '&quot;')}">${truncated}</span>`;
          }
          return truncated;
        },
        tooltip: (_e: UIEvent, cell: CellComponent) => {
          const desc = cell.getValue() as string;
          return desc || '';
        },
      },
    ],
  });

  table.on('rowClick', (_e: UIEvent, row: RowComponent) => {
    const data = row.getData() as Requirement;
    onRowClick(data.id);
  });

  tableInstances.set(containerId, table);
  return table;
}

// Create or update solutions table
export function renderSolutionsTable(
  containerId: string,
  solutions: Solution[],
  onRowClick: (id: string) => void
): Tabulator {
  destroyTable(containerId);

  const table = new Tabulator(`#${containerId}`, {
    data: solutions,
    layout: 'fitDataFill',
    responsiveLayout: 'collapse',
    pagination: true,
    paginationSize: 20,
    placeholder: 'No solutions found matching your filters.',
    columns: [
      { title: 'ID', field: 'id', sorter: 'string', width: 180 },
      { title: 'Name', field: 'name', sorter: 'string', width: 200 },
      { title: 'Provider', field: 'provider', sorter: 'string', width: 120 },
      { title: 'Type', field: 'type', sorter: 'string', width: 130,
        formatter: (cell: CellComponent) => {
          const type = cell.getValue() as string;
          const cls = (type === 'sovereign' || type === 'national-partner') ? 'badge-success' :
                      type === 'govcloud' ? 'badge-warning' :
                      type === 'private' ? 'badge-primary' : 'badge-secondary';
          return `<span class="badge ${cls}">${type || '-'}</span>`;
        }
      },
      { title: 'EU Ownership %', field: 'ownershipStructure.euOwnershipPercent', sorter: 'number', width: 130,
        formatter: (cell: CellComponent) => {
          const val = cell.getValue() as number | undefined;
          return val !== undefined ? `${val}%` : '-';
        }
      },
      { title: 'CLOUD Act', field: 'ownershipStructure.subjectToExtraTerritorialLaw', sorter: 'boolean', width: 110,
        formatter: (cell: CellComponent) => {
          const val = cell.getValue() as boolean | undefined;
          return val ? '<span class="badge badge-danger">Yes</span>' : '<span class="badge badge-success">No</span>';
        }
      },
      { title: 'Certifications', field: 'certifications', formatter: arrayFormatter },
    ],
  });

  table.on('rowClick', (_e: UIEvent, row: RowComponent) => {
    const data = row.getData() as Solution;
    onRowClick(data.id);
  });

  tableInstances.set(containerId, table);
  return table;
}

// Create or update mappings table (legacy flat view)
export function renderMappingsTable(
  containerId: string,
  mappings: RequirementMapping[],
  onRowClick?: (id: string) => void
): Tabulator {
  destroyTable(containerId);

  const table = new Tabulator(`#${containerId}`, {
    data: mappings,
    layout: 'fitDataFill',
    responsiveLayout: 'collapse',
    pagination: true,
    paginationSize: 25,
    placeholder: 'No mappings found matching your filters.',
    columns: [
      { title: 'Requirement', field: 'requirementId', sorter: 'string', width: 220 },
      { title: 'Solution', field: 'solutionId', sorter: 'string', width: 180 },
      { title: 'Compliance', field: 'complianceLevel', sorter: 'string', width: 130,
        formatter: complianceBadgeFormatter as any
      },
      { title: 'Zone', field: 'zone', sorter: 'string', width: 100,
        formatter: zoneBadgeFormatter as any
      },
      { title: 'Jurisdictions', field: 'jurisdictionIds', width: 140,
        formatter: (cell: CellComponent) => {
          const arr = cell.getValue() as string[] | undefined;
          return arr?.length ? arr.join(', ') : 'All';
        }
      },
      { title: 'Notes', field: 'notes', sorter: 'string', formatter: 'textarea' },
    ],
  });

  if (onRowClick) {
    table.on('rowClick', (_e: UIEvent, row: RowComponent) => {
      const data = row.getData() as RequirementMapping;
      onRowClick(data.id);
    });
  }

  tableInstances.set(containerId, table);
  return table;
}

// Render mappings as a heatmap grid (requirements × solutions)
export function renderMappingsHeatmap(
  containerId: string,
  mappings: RequirementMapping[],
  requirements: Requirement[],
  solutions: Solution[],
  regulations: Regulation[],
  expandedReqIds: Set<string> = new Set(),
  onToggleExpand?: (reqId: string, expanded: boolean) => void
): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Build a map of requirement -> solution -> mapping
  const mappingMap = new Map<string, Map<string, RequirementMapping>>();
  for (const mapping of mappings) {
    if (!mappingMap.has(mapping.requirementId)) {
      mappingMap.set(mapping.requirementId, new Map());
    }
    mappingMap.get(mapping.requirementId)!.set(mapping.solutionId, mapping);
  }

  // Get unique requirements and solutions from mappings
  const reqIds = [...new Set(mappings.map(m => m.requirementId))];
  const solIds = [...new Set(mappings.map(m => m.solutionId))];

  // Sort by regulationId first, then category, then ID
  const sortedReqs = reqIds.sort((a, b) => {
    const reqA = requirements.find(r => r.id === a);
    const reqB = requirements.find(r => r.id === b);
    const regA = reqA?.regulationId || '';
    const regB = reqB?.regulationId || '';
    if (regA !== regB) return regA.localeCompare(regB);
    const catA = reqA?.category || '';
    const catB = reqB?.category || '';
    if (catA !== catB) return catA.localeCompare(catB);
    return a.localeCompare(b);
  });


  // Sort solutions by type (sovereign first) then name
  const sortedSols = solIds.sort((a, b) => {
    const solA = solutions.find(s => s.id === a);
    const solB = solutions.find(s => s.id === b);
    const typeOrder = { sovereign: 0, 'national-partner': 1, govcloud: 2, commercial: 3, private: 4 };
    const orderA = typeOrder[(solA?.type as keyof typeof typeOrder) || 'commercial'] ?? 3;
    const orderB = typeOrder[(solB?.type as keyof typeof typeOrder) || 'commercial'] ?? 3;
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b);
  });

  // Build a map of requirement -> jurisdictions (aggregate from all mappings)
  const reqJurisdictions = new Map<string, Set<string>>();
  for (const mapping of mappings) {
    if (!reqJurisdictions.has(mapping.requirementId)) {
      reqJurisdictions.set(mapping.requirementId, new Set());
    }
    mapping.jurisdictionIds?.forEach(j => reqJurisdictions.get(mapping.requirementId)!.add(j));
  }

  // Build HTML
  let html = '<div class="heatmap-wrapper"><table class="heatmap-table"><thead><tr><th class="heatmap-header-cell regulation-header">Regulation</th><th class="heatmap-header-cell">Control</th><th class="heatmap-header-cell jurisdictions-header">Jurisdictions</th>';

  // Solution headers
  for (const solId of sortedSols) {
    const sol = solutions.find(s => s.id === solId);
    const shortName = sol?.name?.split(' ')[0] || solId.split('-').slice(-1)[0];
    html += `<th class="heatmap-header-cell solution-header" title="${sol?.name || solId}">${shortName}</th>`;
  }
  html += '</tr></thead><tbody>';

  // Requirement rows
  for (const reqId of sortedReqs) {
    const req = requirements.find(r => r.id === reqId);
    const regId = req?.regulationId || 'unknown';
    const regulation = regulations.find(r => r.id === regId);
    const regShortName = regulation?.shortName || regId;

    // Get official section/article reference if available
    const sectionId = req?.sectionId;
    const controlDisplay = sectionId
      ? sectionId.replace(/-/g, ' ').replace(/ART/i, 'Art.')
      : req?.name || reqId;

    const jurisdictions = reqJurisdictions.get(reqId);
    const jurisdictionStr = jurisdictions ? [...jurisdictions].sort().join(', ') : '-';
    const isExpanded = expandedReqIds.has(reqId);

    // Main row (clickable to expand)
    html += `<tr class="heatmap-data-row" data-req-id="${reqId}">`;
    html += `<td class="heatmap-regulation-cell" title="${regulation?.name || regId}">${regShortName}</td>`;
    html += `<td class="heatmap-row-header expandable" title="Click to expand: ${req?.name || reqId}"><span class="expand-icon">${isExpanded ? '▼' : '▶'}</span> ${controlDisplay}</td>`;
    html += `<td class="heatmap-jurisdictions-cell">${jurisdictionStr}</td>`;

    for (const solId of sortedSols) {
      const mapping = mappingMap.get(reqId)?.get(solId);
      if (mapping) {
        const level = mapping.complianceLevel;
        const zone = mapping.zone || '';
        const eta = mapping.eta || '';
        const etaTooltip = eta ? `\nETA: ${eta}` : '';
        const tooltip = `${req?.name || reqId}\n${solutions.find(s => s.id === solId)?.name || solId}\n\nCompliance: ${level}\nZone: ${zone}${etaTooltip}\n${mapping.notes || ''}`;
        const etaHtml = eta ? `<span class="cell-eta">${eta}</span>` : '';
        html += `<td class="heatmap-cell compliance-cell-${level} zone-cell-${zone}${eta ? ' has-eta' : ''}" title="${tooltip.replace(/"/g, '&quot;')}">
          <span class="compliance-indicator">${getComplianceIcon(level)}</span>${etaHtml}
        </td>`;
      } else {
        const tooltip = `${req?.name || reqId}\n${solutions.find(s => s.id === solId)?.name || solId}\n\nNo assessment data available`;
        html += `<td class="heatmap-cell heatmap-unknown" title="${tooltip.replace(/"/g, '&quot;')}">
          <span class="compliance-indicator">?</span>
        </td>`;
      }
    }
    html += '</tr>';

    // Detail row (hidden if not expanded)
    const reqMappings = mappings.filter(m => m.requirementId === reqId);
    html += buildDetailRow(reqId, req, reqMappings, solutions, sortedSols.length + 3, isExpanded);
  }

  html += '</tbody></table></div>';

  // Legend
  html += `
    <div class="heatmap-legend">
      <span class="legend-title">Compliance:</span>
      <span class="legend-item"><span class="compliance-indicator compliance-cell-compliant">${getComplianceIcon('compliant')}</span> Compliant</span>
      <span class="legend-item"><span class="compliance-indicator compliance-cell-partial">${getComplianceIcon('partial')}</span> Partial</span>
      <span class="legend-item"><span class="compliance-indicator compliance-cell-conditional">${getComplianceIcon('conditional')}</span> Conditional</span>
      <span class="legend-item"><span class="compliance-indicator compliance-cell-non-compliant">${getComplianceIcon('non-compliant')}</span> Non-Compliant</span>
      <span class="legend-item"><span class="compliance-indicator compliance-cell-banned">${getComplianceIcon('banned')}</span> Banned</span>
      <span class="legend-item"><span class="compliance-indicator heatmap-unknown">?</span> Unknown</span>
    </div>
  `;

  container.innerHTML = html;

  // Add click handlers for expandable rows
  container.querySelectorAll('.heatmap-data-row').forEach(row => {
    row.addEventListener('click', () => {
      const reqId = (row as HTMLElement).dataset.reqId;
      if (!reqId) return;
      const detailRow = container.querySelector(`.heatmap-detail-row[data-req-id="${reqId}"]`);
      const expandIcon = row.querySelector('.expand-icon');
      if (detailRow) {
        const isNowHidden = !detailRow.classList.contains('hidden');
        detailRow.classList.toggle('hidden');
        if (expandIcon) {
          expandIcon.textContent = isNowHidden ? '▶' : '▼';
        }
        // Call the callback to update URL state
        if (onToggleExpand) {
          onToggleExpand(reqId, !isNowHidden);
        }
      }
    });
  });
}

// Build the expandable detail row for a requirement
function buildDetailRow(
  reqId: string,
  req: Requirement | undefined,
  reqMappings: RequirementMapping[],
  solutions: Solution[],
  colspan: number,
  isExpanded: boolean
): string {
  // Group mappings by compliance level
  const compliantLevels = ['compliant'];
  const conditionalLevels = ['partial', 'conditional'];
  const bannedLevels = ['non-compliant', 'banned'];

  const groupMappings = (levels: string[]) => {
    return reqMappings
      .filter(m => levels.includes(m.complianceLevel))
      .sort((a, b) => {
        const solA = solutions.find(s => s.id === a.solutionId)?.name || a.solutionId;
        const solB = solutions.find(s => s.id === b.solutionId)?.name || b.solutionId;
        return solA.localeCompare(solB);
      });
  };

  const compliant = groupMappings(compliantLevels);
  const conditional = groupMappings(conditionalLevels);
  const banned = groupMappings(bannedLevels);

  let html = `<tr class="heatmap-detail-row${isExpanded ? '' : ' hidden'}" data-req-id="${reqId}">`;
  html += `<td colspan="${colspan}" class="heatmap-detail-cell">`;

  // Requirement info
  html += `<div class="detail-section">`;
  html += `<div class="detail-header">${reqId}: ${req?.name || 'Unknown Requirement'}</div>`;
  if (req?.description) {
    html += `<div class="detail-description">${req.description}</div>`;
  }
  html += `</div>`;

  // Provider groups
  html += `<div class="detail-providers">`;

  // Helper to render evidence links
  const renderEvidence = (evidence: string[] | undefined): string => {
    if (!evidence || evidence.length === 0) return '';
    const links = evidence.map((url, i) => {
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        return `<a href="${url}" target="_blank" rel="noopener" class="evidence-link">[${i + 1}] ${domain}</a>`;
      } catch {
        // If URL parsing fails, just show the link
        return `<a href="${url}" target="_blank" rel="noopener" class="evidence-link">[${i + 1}]</a>`;
      }
    }).join(' ');
    return `<span class="provider-evidence">Sources: ${links}</span>`;
  };

  // Helper to render ETA badge
  const renderEta = (eta: string | undefined): string => {
    if (!eta) return '';
    return `<span class="provider-eta">ETA: ${eta}</span>`;
  };

  // Compliant providers
  if (compliant.length > 0) {
    html += `<div class="provider-group provider-group-compliant">`;
    html += `<div class="provider-group-header">✓ Compliant (${compliant.length})</div>`;
    html += `<div class="provider-list">`;
    for (const m of compliant) {
      const sol = solutions.find(s => s.id === m.solutionId);
      html += `<div class="provider-item">`;
      html += `<span class="provider-name">${sol?.name || m.solutionId}</span>`;
      html += renderEta(m.eta);
      if (m.notes) html += `<span class="provider-notes">${m.notes}</span>`;
      html += renderEvidence(m.evidence);
      html += `</div>`;
    }
    html += `</div></div>`;
  }

  // Conditional providers
  if (conditional.length > 0) {
    html += `<div class="provider-group provider-group-conditional">`;
    html += `<div class="provider-group-header">◐ Conditional (${conditional.length})</div>`;
    html += `<div class="provider-list">`;
    for (const m of conditional) {
      const sol = solutions.find(s => s.id === m.solutionId);
      html += `<div class="provider-item">`;
      html += `<span class="provider-name">${sol?.name || m.solutionId}</span>`;
      html += `<span class="provider-status">${m.complianceLevel}</span>`;
      html += renderEta(m.eta);
      if (m.notes) html += `<span class="provider-notes">${m.notes}</span>`;
      html += renderEvidence(m.evidence);
      html += `</div>`;
    }
    html += `</div></div>`;
  }

  // Banned providers
  if (banned.length > 0) {
    html += `<div class="provider-group provider-group-banned">`;
    html += `<div class="provider-group-header">⊘ Banned (${banned.length})</div>`;
    html += `<div class="provider-list">`;
    for (const m of banned) {
      const sol = solutions.find(s => s.id === m.solutionId);
      html += `<div class="provider-item">`;
      html += `<span class="provider-name">${sol?.name || m.solutionId}</span>`;
      html += `<span class="provider-status">${m.complianceLevel}</span>`;
      html += renderEta(m.eta);
      if (m.notes) html += `<span class="provider-notes">${m.notes}</span>`;
      html += renderEvidence(m.evidence);
      html += `</div>`;
    }
    html += `</div></div>`;
  }

  html += `</div>`; // detail-providers
  html += `</td></tr>`;

  return html;
}

function getComplianceIcon(level: string): string {
  switch (level) {
    case 'compliant': return '✓';
    case 'partial': return '◐';
    case 'conditional': return '?';
    case 'non-compliant': return '✗';
    case 'banned': return '⊘';
    default: return '-';
  }
}

// Render zone assignments as stacked sections by zone color
export function renderZonesSectioned(
  containerId: string,
  _zones: ZoneAssignment[],
  mappings: RequirementMapping[],
  _solutions: Solution[]
): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Group mappings by zone
  const greenMappings = mappings.filter(m => m.zone === 'green');
  const yellowMappings = mappings.filter(m => m.zone === 'yellow');
  const redMappings = mappings.filter(m => m.zone === 'red');

  let html = '';

  // Green Zone Section
  html += `
    <div class="zone-section zone-section-green">
      <h3 class="zone-section-header">
        <span class="zone-indicator zone-green"></span>
        Green Zone - Compliant Solutions (${greenMappings.length} mappings)
      </h3>
      <p class="zone-description">Solutions that meet requirements with standard controls. Acceptable for general B2B use.</p>
      <div id="zone-green-table" class="zone-table-container"></div>
    </div>
  `;

  // Yellow Zone Section
  html += `
    <div class="zone-section zone-section-yellow">
      <h3 class="zone-section-header">
        <span class="zone-indicator zone-yellow"></span>
        Yellow Zone - Conditional Compliance (${yellowMappings.length} mappings)
      </h3>
      <p class="zone-description">Solutions require additional controls (CMK, TIAs, contractual terms). Use with enhanced measures.</p>
      <div id="zone-yellow-table" class="zone-table-container"></div>
    </div>
  `;

  // Red Zone Section
  html += `
    <div class="zone-section zone-section-red">
      <h3 class="zone-section-header">
        <span class="zone-indicator zone-red"></span>
        Red Zone - Non-Compliant/Banned (${redMappings.length} mappings)
      </h3>
      <p class="zone-description">Solutions cannot meet requirements. US hyperscalers banned for sovereignty workloads.</p>
      <div id="zone-red-table" class="zone-table-container"></div>
    </div>
  `;

  container.innerHTML = html;

  // Render individual tables
  if (greenMappings.length > 0) {
    renderZoneMappingsTable('zone-green-table', greenMappings);
  }
  if (yellowMappings.length > 0) {
    renderZoneMappingsTable('zone-yellow-table', yellowMappings);
  }
  if (redMappings.length > 0) {
    renderZoneMappingsTable('zone-red-table', redMappings);
  }
}

// Helper to render zone-specific mapping table
function renderZoneMappingsTable(containerId: string, mappings: RequirementMapping[]): Tabulator {
  destroyTable(containerId);

  const table = new Tabulator(`#${containerId}`, {
    data: mappings,
    layout: 'fitDataFill',
    height: 'auto',
    pagination: false,
    placeholder: 'No mappings in this zone.',
    columns: [
      { title: 'Solution', field: 'solutionId', sorter: 'string', width: 180 },
      { title: 'Requirement', field: 'requirementId', sorter: 'string', width: 200 },
      { title: 'Compliance', field: 'complianceLevel', sorter: 'string', width: 120,
        formatter: complianceBadgeFormatter as any
      },
      { title: 'Jurisdictions', field: 'jurisdictionIds', width: 120,
        formatter: (cell: CellComponent) => {
          const arr = cell.getValue() as string[] | undefined;
          return arr?.length ? arr.join(', ') : 'All';
        }
      },
      { title: 'Notes', field: 'notes', sorter: 'string',
        formatter: (cell: CellComponent) => {
          const notes = cell.getValue() as string;
          return truncateText(notes, 60);
        },
        tooltip: true,
      },
    ],
  });

  tableInstances.set(containerId, table);
  return table;
}

// Create or update zone assignments table (legacy)
export function renderZoneAssignmentsTable(
  containerId: string,
  zones: ZoneAssignment[],
  onRowClick?: (id: string) => void
): Tabulator {
  destroyTable(containerId);

  const table = new Tabulator(`#${containerId}`, {
    data: zones,
    layout: 'fitDataFill',
    responsiveLayout: 'collapse',
    pagination: true,
    paginationSize: 25,
    placeholder: 'No zone assignments found matching your filters.',
    columns: [
      { title: 'Solution', field: 'solutionId', sorter: 'string', width: 180 },
      { title: 'Jurisdiction', field: 'jurisdictionId', sorter: 'string', width: 120 },
      { title: 'Zone', field: 'zone', sorter: 'string', width: 100,
        formatter: zoneBadgeFormatter as any
      },
      { title: 'Data Category', field: 'dataCategory', sorter: 'string', width: 150 },
      { title: 'Entity Type', field: 'entityType', sorter: 'string', width: 150 },
      { title: 'Rationale', field: 'rationale', sorter: 'string', formatter: 'textarea' },
    ],
  });

  if (onRowClick) {
    table.on('rowClick', (_e: UIEvent, row: RowComponent) => {
      const data = row.getData() as ZoneAssignment;
      onRowClick(data.id);
    });
  }

  tableInstances.set(containerId, table);
  return table;
}

// Create or update enforcement table
export function renderEnforcementTable(
  containerId: string,
  assessments: EnforcementAssessment[],
  onRowClick: (id: string) => void
): Tabulator {
  destroyTable(containerId);

  const table = new Tabulator(`#${containerId}`, {
    data: assessments,
    layout: 'fitDataFill',
    responsiveLayout: 'collapse',
    pagination: true,
    paginationSize: 20,
    placeholder: 'No enforcement assessments found matching your filters.',
    columns: [
      { title: 'Jurisdiction', field: 'jurisdictionId', sorter: 'string', width: 120 },
      { title: 'Regulation', field: 'regulationId', sorter: 'string', width: 180 },
      { title: 'Likelihood', field: 'likelihood', sorter: 'string', width: 120,
        formatter: (cell: CellComponent) => {
          const likelihood = cell.getValue() as string;
          const cls = likelihood === 'high' ? 'badge-danger' :
                      likelihood === 'medium' ? 'badge-warning' :
                      likelihood === 'low' ? 'badge-success' : 'badge-secondary';
          return `<span class="badge ${cls}">${likelihood || '-'}</span>`;
        }
      },
      { title: 'Assessment Date', field: 'assessmentDate', sorter: 'string', width: 140 },
      { title: 'Rationale', field: 'rationale', sorter: 'string', formatter: 'textarea' },
    ],
  });

  table.on('rowClick', (_e: UIEvent, row: RowComponent) => {
    const data = row.getData() as EnforcementAssessment;
    onRowClick(data.id);
  });

  tableInstances.set(containerId, table);
  return table;
}

// Cleanup all tables
export function destroyAllTables(): void {
  tableInstances.forEach((table) => {
    table.destroy();
  });
  tableInstances.clear();
}
