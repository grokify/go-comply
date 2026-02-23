import type {
  ExecutiveOverview,
  MarketSegment,
  ProviderReadiness,
  ProviderStatus,
  RiskLevel,
  RegulatoryContext,
  Outlook,
} from '../types';

// Get status color class
function getStatusColor(status: ProviderStatus): string {
  switch (status) {
    case 'ready': return 'status-green';
    case 'partial': return 'status-yellow';
    case 'planned': return 'status-yellow';
    case 'not-viable': return 'status-red';
    default: return 'status-unknown';
  }
}

// Get status display text
function getStatusText(status: ProviderStatus): string {
  switch (status) {
    case 'ready': return 'Ready';
    case 'partial': return 'Partial';
    case 'planned': return 'Planned';
    case 'not-viable': return 'Not Viable';
    default: return 'Unknown';
  }
}

// Get zone color class
function getZoneColor(zone: string | undefined): string {
  switch (zone) {
    case 'green': return 'zone-green';
    case 'yellow': return 'zone-yellow';
    case 'red': return 'zone-red';
    default: return '';
  }
}

// Get risk level color
function getRiskColor(risk: RiskLevel | undefined): string {
  switch (risk) {
    case 'critical': return 'risk-critical';
    case 'high': return 'risk-high';
    case 'medium': return 'risk-medium';
    case 'low': return 'risk-low';
    default: return '';
  }
}

// Get priority badge
function getPriorityBadge(priority: string): string {
  switch (priority) {
    case 'must-have': return '<span class="badge badge-critical">Must Have</span>';
    case 'should-have': return '<span class="badge badge-high">Should Have</span>';
    case 'nice-to-have': return '<span class="badge badge-low">Nice to Have</span>';
    default: return '';
  }
}

// Render a single market segment
function renderSegment(segment: MarketSegment): string {
  const riskClass = getRiskColor(segment.riskLevel);

  // Requirements table
  const reqRows = segment.keyRequirements.map(req => `
    <tr>
      <td><code>${req.id}</code></td>
      <td>${req.name}</td>
      <td>${getPriorityBadge(req.priority)}</td>
      <td><span class="badge badge-${req.status === 'enforced' ? 'enforced' : 'upcoming'}">${req.status}</span></td>
      <td>${req.effectiveDate || '-'}</td>
    </tr>
  `).join('');

  // Provider assessments table
  const providerRows = segment.providerAssessments?.map(pa => {
    const statusClass = getStatusColor(pa.overallStatus);
    const zoneClass = getZoneColor(pa.zone);
    const gapsCount = pa.gaps?.length || 0;

    return `
      <tr class="${statusClass}">
        <td><strong>${pa.solutionId}</strong></td>
        <td><span class="status-badge ${statusClass}">${getStatusText(pa.overallStatus)}</span></td>
        <td><span class="zone-indicator ${zoneClass}">${pa.zone || '-'}</span></td>
        <td class="gaps-cell">${gapsCount > 0 ? `<span class="count-badge count-red">${gapsCount} gaps</span>` : '<span class="count-badge count-green">0 gaps</span>'}</td>
        <td>${pa.eta || '-'}</td>
        <td class="notes-cell">${pa.notes || '-'}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="6">No provider assessments available</td></tr>';

  return `
    <div class="segment-card">
      <div class="segment-header">
        <div class="segment-title-row">
          <h3 class="segment-title">${segment.name}</h3>
          <span class="segment-type badge badge-${segment.type}">${segment.type}</span>
          ${segment.riskLevel ? `<span class="risk-badge ${riskClass}">Risk: ${segment.riskLevel}</span>` : ''}
        </div>
        <p class="segment-description">${segment.description || ''}</p>
        ${segment.industries?.length ? `<div class="segment-industries"><strong>Industries:</strong> ${segment.industries.join(', ')}</div>` : ''}
        ${segment.jurisdictions?.length ? `<div class="segment-jurisdictions"><strong>Jurisdictions:</strong> ${segment.jurisdictions.join(', ')}</div>` : ''}
      </div>

      ${segment.summary ? `<div class="segment-summary"><strong>Summary:</strong> ${segment.summary}</div>` : ''}

      <div class="segment-section">
        <h4>Key Requirements</h4>
        <table class="requirements-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Requirement</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Effective</th>
            </tr>
          </thead>
          <tbody>
            ${reqRows}
          </tbody>
        </table>
      </div>

      <div class="segment-section">
        <h4>Provider Readiness</h4>
        <table class="provider-table">
          <thead>
            <tr>
              <th>Solution</th>
              <th>Status</th>
              <th>Zone</th>
              <th>Gaps</th>
              <th>ETA</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${providerRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Render regulatory context section
function renderRegulatoryContext(context: RegulatoryContext): string {
  const driversHtml = context.keyDrivers?.map(driver => `
    <div class="driver-card">
      <h4 class="driver-name">${driver.name}</h4>
      <p class="driver-description">${driver.description}</p>
      ${driver.impact ? `<div class="driver-impact"><strong>Impact:</strong> ${driver.impact}</div>` : ''}
      ${driver.effectiveDate ? `<div class="driver-date"><strong>Effective:</strong> ${driver.effectiveDate}</div>` : ''}
    </div>
  `).join('') || '';

  const implicationsHtml = context.implications?.length ? `
    <div class="implications-section">
      <h4>Key Implications</h4>
      <ul class="implications-list">
        ${context.implications.map(imp => `<li>${imp}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return `
    <div class="regulatory-context-card">
      <h3>Regulatory Context</h3>
      ${context.overview ? `<div class="context-overview">${context.overview}</div>` : ''}
      ${driversHtml ? `<div class="drivers-container"><h4>Key Regulatory Drivers</h4><div class="drivers-grid">${driversHtml}</div></div>` : ''}
      ${implicationsHtml}
    </div>
  `;
}

// Render outlook section
function renderOutlook(outlook: Outlook): string {
  const renderPeriod = (period: { timeframe?: string; developments?: string[] } | undefined, title: string) => {
    if (!period || !period.developments?.length) return '';
    return `
      <div class="outlook-period">
        <h4>${title}${period.timeframe ? ` (${period.timeframe})` : ''}</h4>
        <ul class="outlook-developments">
          ${period.developments.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    `;
  };

  return `
    <div class="outlook-card">
      <h3>Regulatory Outlook</h3>
      ${outlook.summary ? `<div class="outlook-summary">${outlook.summary}</div>` : ''}
      <div class="outlook-periods">
        ${renderPeriod(outlook.shortTerm, 'Short Term')}
        ${renderPeriod(outlook.mediumTerm, 'Medium Term')}
        ${renderPeriod(outlook.longTerm, 'Long Term')}
      </div>
    </div>
  `;
}

// Render key takeaways
function renderKeyTakeaways(takeaways: string[]): string {
  return `
    <div class="takeaways-card">
      <h3>Key Takeaways</h3>
      <ul class="takeaways-list">
        ${takeaways.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>
  `;
}

// Render glossary
function renderGlossary(glossary: Record<string, string>): string {
  const entries = Object.entries(glossary).sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return '';

  return `
    <div class="glossary-card">
      <h3>Glossary</h3>
      <dl class="glossary-list">
        ${entries.map(([term, definition]) => `
          <dt>${term}</dt>
          <dd>${definition}</dd>
        `).join('')}
      </dl>
    </div>
  `;
}

// Render provider readiness summary
function renderProviderSummary(providers: ProviderReadiness[]): string {
  const rows = providers.map(p => {
    const comm = p.segmentReadiness?.commercial || '-';
    const reg = p.segmentReadiness?.regulated || '-';
    const gov = p.segmentReadiness?.government || '-';

    const commClass = comm !== '-' ? getStatusColor(comm as ProviderStatus) : '';
    const regClass = reg !== '-' ? getStatusColor(reg as ProviderStatus) : '';
    const govClass = gov !== '-' ? getStatusColor(gov as ProviderStatus) : '';

    const euOwned = p.sovereigntyStatus?.euOwned ? '✓' : '✗';
    const cloudActImmune = p.sovereigntyStatus?.cloudActImmune ? '✓' : '✗';
    const secNumCloud = p.sovereigntyStatus?.secNumCloudCertified ? '✓ Certified' :
                        (p.sovereigntyStatus?.secNumCloudPlanned ? `Planned (${p.sovereigntyStatus.secNumCloudEta || 'TBD'})` : '✗');

    return `
      <tr>
        <td><strong>${p.provider}</strong><br><small>${p.solutionId}</small></td>
        <td><span class="badge badge-${p.type || 'commercial'}">${p.type || 'commercial'}</span></td>
        <td><span class="status-badge ${commClass}">${comm}</span></td>
        <td><span class="status-badge ${regClass}">${reg}</span></td>
        <td><span class="status-badge ${govClass}">${gov}</span></td>
        <td class="${p.sovereigntyStatus?.euOwned ? 'text-green' : 'text-red'}">${euOwned}</td>
        <td class="${p.sovereigntyStatus?.cloudActImmune ? 'text-green' : 'text-red'}">${cloudActImmune}</td>
        <td>${secNumCloud}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="provider-summary-card">
      <h3>Provider Readiness Summary</h3>
      <p class="summary-description">Overview of provider readiness across all market segments.</p>
      <div class="table-scroll">
        <table class="provider-summary-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Type</th>
              <th>Commercial</th>
              <th>Regulated</th>
              <th>Government</th>
              <th>EU Owned</th>
              <th>CLOUD Act Immune</th>
              <th>SecNumCloud</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Main render function
export function renderExecutiveOverview(
  containerId: string,
  overview: ExecutiveOverview | null
): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!overview) {
    container.innerHTML = `
      <div class="overview-empty">
        <p>No executive overview data available.</p>
        <p class="hint">Add an <code>executive-overview.json</code> file to your data directory.</p>
      </div>
    `;
    return;
  }

  const metadata = overview.metadata;
  const segments = overview.segments || [];
  const providers = overview.providerReadiness || [];
  const regulatoryContext = overview.regulatoryContext;
  const outlook = overview.outlook;
  const keyTakeaways = overview.keyTakeaways || [];
  const glossary = overview.glossary || {};

  const segmentHtml = segments.map(s => renderSegment(s)).join('');
  const providerSummaryHtml = providers.length > 0 ? renderProviderSummary(providers) : '';
  const regulatoryContextHtml = regulatoryContext ? renderRegulatoryContext(regulatoryContext) : '';
  const outlookHtml = outlook ? renderOutlook(outlook) : '';
  const keyTakeawaysHtml = keyTakeaways.length > 0 ? renderKeyTakeaways(keyTakeaways) : '';
  const glossaryHtml = Object.keys(glossary).length > 0 ? renderGlossary(glossary) : '';

  container.innerHTML = `
    <div class="overview-header">
      <div class="overview-meta">
        <h2 class="overview-title">${metadata.title}</h2>
        <div class="overview-info">
          <span><strong>Version:</strong> ${metadata.version}</span>
          <span><strong>Updated:</strong> ${metadata.lastUpdated}</span>
          ${metadata.analyst ? `<span><strong>Analyst:</strong> ${metadata.analyst}</span>` : ''}
          ${metadata.scope ? `<span><strong>Scope:</strong> ${metadata.scope}</span>` : ''}
        </div>
      </div>
    </div>

    ${regulatoryContextHtml}

    ${keyTakeawaysHtml}

    <div class="overview-legend">
      <div class="legend-section">
        <strong>Status:</strong>
        <span class="status-badge status-green">Ready</span>
        <span class="status-badge status-yellow">Partial/Planned</span>
        <span class="status-badge status-red">Not Viable</span>
      </div>
      <div class="legend-section">
        <strong>Zone:</strong>
        <span class="zone-indicator zone-green">Green (Compliant)</span>
        <span class="zone-indicator zone-yellow">Yellow (Conditional)</span>
        <span class="zone-indicator zone-red">Red (Banned)</span>
      </div>
    </div>

    ${providerSummaryHtml}

    ${outlookHtml}

    <h2 class="segments-heading">Market Segments</h2>
    <div class="segments-container">
      ${segmentHtml}
    </div>

    ${glossaryHtml}
  `;
}
