package comply

// EnforcementLikelihood defines the likelihood of enforcement action.
type EnforcementLikelihood string

const (
	LikelihoodHigh      EnforcementLikelihood = "high"
	LikelihoodMedium    EnforcementLikelihood = "medium"
	LikelihoodLow       EnforcementLikelihood = "low"
	LikelihoodUncertain EnforcementLikelihood = "uncertain"
)

// EnforcementAssessment evaluates the likelihood and nature of enforcement.
type EnforcementAssessment struct {
	ID               string                `json:"id"`
	RequirementID    string                `json:"requirementId,omitempty"`
	RegulationID     string                `json:"regulationId,omitempty"`
	JurisdictionID   string                `json:"jurisdictionId"`
	Likelihood       EnforcementLikelihood `json:"likelihood"`
	Rationale        string                `json:"rationale"`
	RecentActions    []EnforcementAction   `json:"recentActions,omitempty"`
	RegulatoryTrends string                `json:"regulatoryTrends,omitempty"`
	AssessmentDate   string                `json:"assessmentDate"`
	Assessor         string                `json:"assessor,omitempty"`
}

// EnforcementAction represents a specific enforcement action that has occurred.
type EnforcementAction struct {
	Date        string `json:"date"`
	Entity      string `json:"entity"`
	Description string `json:"description"`
	Penalty     string `json:"penalty,omitempty"`
	Source      string `json:"source,omitempty"`
}
