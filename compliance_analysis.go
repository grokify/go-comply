package comply

// ComplianceAnalysis is the top-level container for strategic compliance analysis
type ComplianceAnalysis struct {
	Metadata          AnalysisMetadata        `json:"metadata"`
	RegulatoryContext RegulatoryContext       `json:"regulatoryContext"`
	MarketSegments    []MarketSegmentAnalysis `json:"marketSegments"`
	SolutionLandscape *SolutionLandscape      `json:"solutionLandscape,omitempty"`
	Recommendations   []Recommendation        `json:"recommendations,omitempty"`
	Glossary          map[string]string       `json:"glossary,omitempty"`
}

// AnalysisMetadata contains metadata about the analysis
type AnalysisMetadata struct {
	Title       string       `json:"title"`
	Version     string       `json:"version"`
	LastUpdated string       `json:"lastUpdated"`
	Analyst     string       `json:"analyst,omitempty"`
	Scope       AnalysisScope `json:"scope,omitempty"`
}

// AnalysisScope defines the geographic and regulatory scope
type AnalysisScope struct {
	Jurisdictions []string `json:"jurisdictions,omitempty"`
	Regulations   []string `json:"regulations,omitempty"`
	Timeframe     string   `json:"timeframe,omitempty"`
}

// RegulatoryContext explains WHY the compliance landscape exists
type RegulatoryContext struct {
	Overview         string              `json:"overview"`
	KeyDrivers       []RegulatoryDriver  `json:"keyDrivers"`
	Timeline         []TimelineEvent     `json:"timeline,omitempty"`
	ThreatLandscape  *ThreatLandscape    `json:"threatLandscape,omitempty"`
}

// RegulatoryDriverType represents the type of regulatory driver
type RegulatoryDriverType string

const (
	DriverLegislation  RegulatoryDriverType = "legislation"
	DriverCourtRuling  RegulatoryDriverType = "court-ruling"
	DriverPolicy       RegulatoryDriverType = "policy"
	DriverGeopolitical RegulatoryDriverType = "geopolitical"
	DriverStandard     RegulatoryDriverType = "standard"
)

// RegulatoryDriver represents a key driver of the compliance landscape
type RegulatoryDriver struct {
	ID                   string               `json:"id"`
	Name                 string               `json:"name"`
	Type                 RegulatoryDriverType `json:"type"`
	Jurisdiction         string               `json:"jurisdiction,omitempty"`
	Description          string               `json:"description,omitempty"`
	Impact               string               `json:"impact,omitempty"`
	EffectiveDate        string               `json:"effectiveDate,omitempty"`
	RelatedRegulationIDs []string             `json:"relatedRegulationIds,omitempty"`
}

// TimelineEventType represents the type of timeline event
type TimelineEventType string

const (
	EventLegislation   TimelineEventType = "legislation"
	EventCourtRuling   TimelineEventType = "court-ruling"
	EventEnforcement   TimelineEventType = "enforcement"
	EventCertification TimelineEventType = "certification"
	EventMarket        TimelineEventType = "market"
)

// TimelineEvent represents a key event in the compliance timeline
type TimelineEvent struct {
	Date   string            `json:"date"`
	Event  string            `json:"event"`
	Impact string            `json:"impact,omitempty"`
	Type   TimelineEventType `json:"type,omitempty"`
}

// ThreatLandscape describes the threats driving compliance requirements
type ThreatLandscape struct {
	ExtraterritorialLaws    []ExtraterritorialLaw `json:"extraterritorialLaws,omitempty"`
	DataSovereigntyConcerns []string              `json:"dataSovereigntyConcerns,omitempty"`
	GeopoliticalRisks       []string              `json:"geopoliticalRisks,omitempty"`
}

// ExtraterritorialLaw represents a foreign law with extraterritorial reach
type ExtraterritorialLaw struct {
	ID               string `json:"id"`
	Name             string `json:"name"`
	Jurisdiction     string `json:"jurisdiction"`
	Description      string `json:"description,omitempty"`
	Scope            string `json:"scope,omitempty"`
	DataAccessPowers string `json:"dataAccessPowers,omitempty"`
	ConflictWithEU   string `json:"conflictWithEu,omitempty"`
}

// MarketSegmentAnalysis contains analysis for a market segment
type MarketSegmentAnalysis struct {
	ID                     string                 `json:"id"`
	Name                   string                 `json:"name"`
	Type                   SegmentType            `json:"type"`
	Description            string                 `json:"description,omitempty"`
	Industries             []string               `json:"industries,omitempty"`
	Jurisdictions          []string               `json:"jurisdictions,omitempty"`
	RiskLevel              RiskLevel              `json:"riskLevel,omitempty"`
	ComplianceRequirements *ComplianceRequirements `json:"complianceRequirements,omitempty"`
	CurrentSolutions       *CurrentSolutions      `json:"currentSolutions,omitempty"`
	FutureSolutions        []FutureSolution       `json:"futureSolutions,omitempty"`
	StrategicOutlook       *StrategicOutlook      `json:"strategicOutlook,omitempty"`
	KeyInsights            []string               `json:"keyInsights,omitempty"`
}

// ComplianceRequirements groups requirements by priority
type ComplianceRequirements struct {
	MustHave   []SegmentRequirement `json:"mustHave,omitempty"`
	ShouldHave []SegmentRequirement `json:"shouldHave,omitempty"`
	NiceToHave []SegmentRequirement `json:"niceToHave,omitempty"`
}

// EnforcementStatus represents the enforcement status of a requirement
type EnforcementStatus string

const (
	EnforcementEnforced  EnforcementStatus = "enforced"
	EnforcementUpcoming  EnforcementStatus = "upcoming"
	EnforcementProposed  EnforcementStatus = "proposed"
	EnforcementGuidance  EnforcementStatus = "guidance"
)

// SegmentRequirement represents a requirement for a market segment
type SegmentRequirement struct {
	ID                string            `json:"id"`
	Name              string            `json:"name"`
	Description       string            `json:"description,omitempty"`
	ControlIDs        []string          `json:"controlIds,omitempty"`
	RegulationIDs     []string          `json:"regulationIds,omitempty"`
	EnforcementStatus EnforcementStatus `json:"enforcementStatus,omitempty"`
	EnforcementDate   string            `json:"enforcementDate,omitempty"`
	WhyItMatters      string            `json:"whyItMatters,omitempty"`
}

// CurrentSolutions groups solutions by viability
type CurrentSolutions struct {
	Viable    []SolutionAssessment `json:"viable,omitempty"`
	Partial   []SolutionAssessment `json:"partial,omitempty"`
	NotViable []SolutionAssessment `json:"notViable,omitempty"`
}

// SolutionAssessment evaluates a solution for a market segment
type SolutionAssessment struct {
	SolutionID      string          `json:"solutionId"`
	Zone            ComplianceZone  `json:"zone,omitempty"`
	ComplianceLevel ComplianceLevel `json:"complianceLevel,omitempty"`
	Strengths       []string        `json:"strengths,omitempty"`
	Gaps            []string        `json:"gaps,omitempty"`
	Notes           string          `json:"notes,omitempty"`
}

// FutureSolutionStatus represents the expected future status
type FutureSolutionStatus string

const (
	FutureViable    FutureSolutionStatus = "viable"
	FuturePartial   FutureSolutionStatus = "partial"
	FutureUncertain FutureSolutionStatus = "uncertain"
)

// FutureSolution represents a solution planned for the future
type FutureSolution struct {
	SolutionID     string               `json:"solutionId"`
	ExpectedStatus FutureSolutionStatus `json:"expectedStatus"`
	ETA            string               `json:"eta,omitempty"`
	Dependencies   []string             `json:"dependencies,omitempty"`
	Confidence     ConfidenceLevel      `json:"confidence,omitempty"`
	Notes          string               `json:"notes,omitempty"`
}

// StrategicOutlook provides outlook by timeframe
type StrategicOutlook struct {
	ShortTerm  string `json:"shortTerm,omitempty"`
	MediumTerm string `json:"mediumTerm,omitempty"`
	LongTerm   string `json:"longTerm,omitempty"`
}

// SolutionLandscape describes the overall solution landscape
type SolutionLandscape struct {
	Overview       string             `json:"overview,omitempty"`
	Categories     []SolutionCategory `json:"categories,omitempty"`
	EmergingTrends []string           `json:"emergingTrends,omitempty"`
}

// SegmentViability represents viability by segment type
type SegmentViability string

const (
	ViabilityViable    SegmentViability = "viable"
	ViabilityPartial   SegmentViability = "partial"
	ViabilityNotViable SegmentViability = "not-viable"
)

// SolutionCategory groups solutions by type
type SolutionCategory struct {
	ID                string                      `json:"id"`
	Name              string                      `json:"name"`
	Description       string                      `json:"description,omitempty"`
	Characteristics   []string                    `json:"characteristics,omitempty"`
	Solutions         []string                    `json:"solutions,omitempty"`
	SegmentViability  map[string]SegmentViability `json:"segmentViability,omitempty"`
}

// RecommendationPriority represents the priority of a recommendation
type RecommendationPriority string

const (
	PriorityCritical RecommendationPriority = "critical"
	PriorityHigh     RecommendationPriority = "high"
	PriorityMedium   RecommendationPriority = "medium"
	PriorityLow      RecommendationPriority = "low"
)

// Recommendation represents a strategic recommendation
type Recommendation struct {
	ID             string                 `json:"id"`
	Segment        string                 `json:"segment"`
	Priority       RecommendationPriority `json:"priority,omitempty"`
	Recommendation string                 `json:"recommendation"`
	Rationale      string                 `json:"rationale,omitempty"`
	Actions        []string               `json:"actions,omitempty"`
	Timeframe      string                 `json:"timeframe,omitempty"`
}
