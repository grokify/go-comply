// Go-Comply Type Definitions
// These types mirror the Go structs in the go-comply package

// Jurisdiction Types
export type JurisdictionType = 'country' | 'region' | 'supranational';

export interface Jurisdiction {
  id: string;
  name: string;
  type: JurisdictionType;
  iso3166?: string;
  parentId?: string;
  memberIds?: string[];
  description?: string;
}

// Regulation Types
export type RegulationStatus = 'draft' | 'adopted' | 'enforceable' | 'superseded';

export interface Regulation {
  id: string;
  name: string;
  shortName: string;
  description: string;
  jurisdictionId: string;
  status: RegulationStatus;
  adoptedDate?: string;
  effectiveDate?: string;
  enforcementDate?: string;
  officialUrl?: string;
  sections?: Section[];
  regulatedEntities?: RegulatedEntity[];
  externalRefs?: ExternalRef[];
  tags?: string[];
}

export interface Section {
  id: string;
  regulationId: string;
  number: string;
  name: string;
  description?: string;
  parentId?: string;
  requirementIds?: string[];
}

// Requirement Types
export type RequirementSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Requirement {
  id: string;
  name: string;
  description: string;
  regulationId: string;
  sectionId?: string;
  category?: string;
  subcategory?: string;
  severity?: RequirementSeverity;
  keywords?: string[];
  relatedIds?: string[];
  externalRefs?: ExternalRef[];
  effectiveDate?: string;
  applicability?: Applicability;
}

export interface Applicability {
  entityTypes?: string[];
  sectors?: string[];
  dataTypes?: string[];
  conditions?: string;
}

// Regulated Entity Types
export interface RegulatedEntity {
  id: string;
  name: string;
  description: string;
  regulationId: string;
  sectors?: string[];
  criteria?: string;
  examples?: string[];
}

// Solution Types
export type SolutionType = 'commercial' | 'govcloud' | 'sovereign' | 'national-partner' | 'private';

export interface Solution {
  id: string;
  name: string;
  provider: string;
  type: SolutionType;
  description?: string;
  availableRegions?: string[];
  certifications?: string[];
  ownershipStructure?: OwnershipStructure;
  jurisdictionIds?: string[];
  externalRefs?: ExternalRef[];
}

export interface OwnershipStructure {
  euOwnershipPercent: number;
  largestNonEuPercent: number;
  subjectToExtraTerritorialLaw: boolean;
  controllingEntity?: string;
  notes?: string;
}

// Compliance Zone Types
export type ComplianceZone = 'red' | 'yellow' | 'green';

export interface ZoneAssignment {
  id: string;
  solutionId: string;
  jurisdictionId: string;
  zone: ComplianceZone;
  dataCategory?: string;
  entityType?: string;
  rationale?: string;
  regulationIds?: string[];
}

// Mapping Types
export type ComplianceLevel = 'compliant' | 'partial' | 'non-compliant' | 'conditional' | 'banned';

export interface RequirementMapping {
  id: string;
  requirementId: string;
  solutionId: string;
  jurisdictionIds?: string[];
  complianceLevel: ComplianceLevel;
  zone?: ComplianceZone;
  notes?: string;
  evidence?: string[];
  conditions?: string;
  eta?: string;  // Expected availability date (e.g., "Q4 2026")
  assessmentDate?: string;
}

// Enforcement Types
export type EnforcementLikelihood = 'high' | 'medium' | 'low' | 'uncertain';

export interface EnforcementAssessment {
  id: string;
  requirementId?: string;
  regulationId?: string;
  jurisdictionId: string;
  likelihood: EnforcementLikelihood;
  rationale: string;
  recentActions?: EnforcementAction[];
  regulatoryTrends?: string;
  assessmentDate: string;
  assessor?: string;
}

export interface EnforcementAction {
  date: string;
  entity: string;
  description: string;
  penalty?: string;
  source?: string;
}

// External Reference Types
export type ExternalRefType = 'url' | 'citation' | 'regulation' | 'standard';

export interface ExternalRef {
  type: ExternalRefType;
  value: string;
  name?: string;
  notes?: string;
}

// Framework Container
export interface FrameworkMetadata {
  name: string;
  version: string;
  description?: string;
  lastUpdated?: string;
}

export interface ComplianceFramework {
  metadata: FrameworkMetadata;
  jurisdictions: Jurisdiction[];
  regulations: Regulation[];
  requirements: Requirement[];
  regulatedEntities: RegulatedEntity[];
  solutions: Solution[];
  zoneAssignments: ZoneAssignment[];
  mappings: RequirementMapping[];
  enforcementAssessments: EnforcementAssessment[];
}

// Executive Overview Types
export interface ExecutiveOverview {
  metadata: ExecutiveOverviewMetadata;
  segments: MarketSegment[];
  providerReadiness?: ProviderReadiness[];
  regulatoryContext?: RegulatoryContext;
  outlook?: Outlook;
  keyTakeaways?: string[];
  glossary?: Record<string, string>;
}

export interface RegulatoryContext {
  overview?: string;
  keyDrivers?: RegulatoryDriver[];
  implications?: string[];
}

export interface RegulatoryDriver {
  name: string;
  description: string;
  impact?: string;
  effectiveDate?: string;
}

export interface Outlook {
  summary?: string;
  shortTerm?: OutlookPeriod;
  mediumTerm?: OutlookPeriod;
  longTerm?: OutlookPeriod;
}

export interface OutlookPeriod {
  timeframe?: string;
  developments?: string[];
}

export interface ExecutiveOverviewMetadata {
  title: string;
  version: string;
  lastUpdated: string;
  analyst?: string;
  scope?: string;
}

export type SegmentType = 'commercial' | 'regulated' | 'government';
export type RequirementPriority = 'must-have' | 'should-have' | 'nice-to-have';
export type RequirementStatus = 'enforced' | 'upcoming' | 'proposed' | 'guidance';
export type ProviderStatus = 'ready' | 'partial' | 'planned' | 'not-viable';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface MarketSegment {
  id: string;
  name: string;
  type: SegmentType;
  description?: string;
  industries?: string[];
  jurisdictions: string[];
  applicableRegulations?: string[];
  riskLevel?: RiskLevel;
  summary?: string;
  keyRequirements: KeyRequirement[];
  providerAssessments?: SegmentProviderAssessment[];
}

export interface KeyRequirement {
  id: string;
  name: string;
  description?: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  effectiveDate?: string;
  sourceRegulations?: string[];
  controlIds?: string[];
  impact?: string;
}

export interface SegmentProviderAssessment {
  solutionId: string;
  overallStatus: ProviderStatus;
  zone?: ComplianceZone;
  gaps?: string[];
  strengths?: string[];
  eta?: string;
  notes?: string;
}

export interface ProviderReadiness {
  solutionId: string;
  provider: string;
  type?: string;
  segmentReadiness?: {
    commercial?: ProviderStatus;
    regulated?: ProviderStatus;
    government?: ProviderStatus;
  };
  certifications?: string[];
  sovereigntyStatus?: {
    euOwned?: boolean;
    cloudActImmune?: boolean;
    secNumCloudCertified?: boolean;
    secNumCloudPlanned?: boolean;
    secNumCloudEta?: string;
  };
  keyStrengths?: string[];
  keyLimitations?: string[];
}

// View Types
export type ViewMode = 'cards' | 'table';
export type TabName = 'overview' | 'regulations' | 'requirements' | 'solutions' | 'mappings' | 'zones' | 'enforcement';

// Filter State
export interface FilterState {
  jurisdiction: string;
  regulation: string;
  solution: string;
  zone: string;
  search: string;
}
