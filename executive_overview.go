package comply

// ExecutiveOverview contains market segment analysis and provider readiness data
type ExecutiveOverview struct {
	Metadata          ExecutiveOverviewMetadata  `json:"metadata"`
	Segments          []MarketSegment            `json:"segments"`
	ProviderReadiness []ProviderReadiness        `json:"providerReadiness,omitempty"`
	RegulatoryContext *OverviewRegulatoryContext `json:"regulatoryContext,omitempty"`
	Outlook           *OverviewOutlook           `json:"outlook,omitempty"`
	KeyTakeaways      []string                   `json:"keyTakeaways,omitempty"`
	Glossary          map[string]string          `json:"glossary,omitempty"`
}

// ExecutiveOverviewMetadata contains metadata about the overview
type ExecutiveOverviewMetadata struct {
	Title       string `json:"title"`
	Version     string `json:"version"`
	LastUpdated string `json:"lastUpdated"`
	Analyst     string `json:"analyst,omitempty"`
	Scope       string `json:"scope,omitempty"`
}

// SegmentType represents the type of market segment
type SegmentType string

const (
	SegmentCommercial  SegmentType = "commercial"
	SegmentRegulated   SegmentType = "regulated"
	SegmentGovernment  SegmentType = "government"
)

// RequirementPriority represents the priority of a requirement
type RequirementPriority string

const (
	PriorityMustHave   RequirementPriority = "must-have"
	PriorityShouldHave RequirementPriority = "should-have"
	PriorityNiceToHave RequirementPriority = "nice-to-have"
)

// RequirementEnforcementStatus represents the enforcement status of a requirement
type RequirementEnforcementStatus string

const (
	EnforcementStatusEnforced RequirementEnforcementStatus = "enforced"
	EnforcementStatusUpcoming RequirementEnforcementStatus = "upcoming"
	EnforcementStatusProposed RequirementEnforcementStatus = "proposed"
	EnforcementStatusGuidance RequirementEnforcementStatus = "guidance"
)

// ProviderStatus represents the overall readiness status of a provider
type ProviderStatus string

const (
	ProviderStatusReady     ProviderStatus = "ready"
	ProviderStatusPartial   ProviderStatus = "partial"
	ProviderStatusPlanned   ProviderStatus = "planned"
	ProviderStatusNotViable ProviderStatus = "not-viable"
)

// RiskLevel represents the risk level for a segment
type RiskLevel string

const (
	RiskCritical RiskLevel = "critical"
	RiskHigh     RiskLevel = "high"
	RiskMedium   RiskLevel = "medium"
	RiskLow      RiskLevel = "low"
)

// MarketSegment represents a market segment for compliance analysis
type MarketSegment struct {
	ID                    string                       `json:"id"`
	Name                  string                       `json:"name"`
	Type                  SegmentType                  `json:"type"`
	Description           string                       `json:"description,omitempty"`
	Industries            []string                     `json:"industries,omitempty"`
	Jurisdictions         []string                     `json:"jurisdictions"`
	ApplicableRegulations []string                     `json:"applicableRegulations,omitempty"`
	RiskLevel             RiskLevel                    `json:"riskLevel,omitempty"`
	Summary               string                       `json:"summary,omitempty"`
	KeyRequirements       []KeyRequirement             `json:"keyRequirements"`
	ProviderAssessments   []SegmentProviderAssessment  `json:"providerAssessments,omitempty"`
}

// KeyRequirement represents a key compliance requirement for a segment
type KeyRequirement struct {
	ID                string                       `json:"id"`
	Name              string                       `json:"name"`
	Description       string                       `json:"description,omitempty"`
	Priority          RequirementPriority          `json:"priority"`
	Status            RequirementEnforcementStatus `json:"status"`
	EffectiveDate     string                       `json:"effectiveDate,omitempty"`
	SourceRegulations []string                     `json:"sourceRegulations,omitempty"`
	ControlIds        []string                     `json:"controlIds,omitempty"`
	Impact            string                       `json:"impact,omitempty"`
}

// SegmentProviderAssessment represents a provider's assessment for a specific segment
type SegmentProviderAssessment struct {
	SolutionID    string         `json:"solutionId"`
	OverallStatus ProviderStatus `json:"overallStatus"`
	Zone          ComplianceZone `json:"zone,omitempty"`
	Gaps          []string       `json:"gaps,omitempty"`
	Strengths     []string       `json:"strengths,omitempty"`
	ETA           string         `json:"eta,omitempty"`
	Notes         string         `json:"notes,omitempty"`
}

// ProviderReadiness represents a provider's overall readiness across segments
type ProviderReadiness struct {
	SolutionID        string                  `json:"solutionId"`
	Provider          string                  `json:"provider"`
	Type              string                  `json:"type,omitempty"`
	SegmentReadiness  *SegmentReadinessStatus `json:"segmentReadiness,omitempty"`
	Certifications    []string                `json:"certifications,omitempty"`
	SovereigntyStatus *SovereigntyStatus      `json:"sovereigntyStatus,omitempty"`
	KeyStrengths      []string                `json:"keyStrengths,omitempty"`
	KeyLimitations    []string                `json:"keyLimitations,omitempty"`
}

// SegmentReadinessStatus represents readiness by segment type
type SegmentReadinessStatus struct {
	Commercial ProviderStatus `json:"commercial,omitempty"`
	Regulated  ProviderStatus `json:"regulated,omitempty"`
	Government ProviderStatus `json:"government,omitempty"`
}

// SovereigntyStatus represents sovereignty-related status of a provider
type SovereigntyStatus struct {
	EUOwned              bool   `json:"euOwned,omitempty"`
	CloudActImmune       bool   `json:"cloudActImmune,omitempty"`
	SecNumCloudCertified bool   `json:"secNumCloudCertified,omitempty"`
	SecNumCloudPlanned   bool   `json:"secNumCloudPlanned,omitempty"`
	SecNumCloudETA       string `json:"secNumCloudEta,omitempty"`
}

// OverviewRegulatoryContext provides background explaining the regulatory landscape
type OverviewRegulatoryContext struct {
	Overview     string                    `json:"overview,omitempty"`
	KeyDrivers   []OverviewRegulatoryDriver `json:"keyDrivers,omitempty"`
	Implications []string                  `json:"implications,omitempty"`
}

// OverviewRegulatoryDriver represents a key regulatory driver for the executive overview
type OverviewRegulatoryDriver struct {
	Name          string `json:"name"`
	Description   string `json:"description"`
	Impact        string `json:"impact,omitempty"`
	EffectiveDate string `json:"effectiveDate,omitempty"`
}

// OverviewOutlook provides future projections and expected developments
type OverviewOutlook struct {
	Summary    string          `json:"summary,omitempty"`
	ShortTerm  *OutlookPeriod  `json:"shortTerm,omitempty"`
	MediumTerm *OutlookPeriod  `json:"mediumTerm,omitempty"`
	LongTerm   *OutlookPeriod  `json:"longTerm,omitempty"`
}

// OutlookPeriod represents developments expected within a time period
type OutlookPeriod struct {
	Timeframe    string   `json:"timeframe,omitempty"`
	Developments []string `json:"developments,omitempty"`
}
