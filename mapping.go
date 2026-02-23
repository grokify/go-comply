package comply

// ComplianceLevel defines the level of compliance for a requirement-solution mapping.
type ComplianceLevel string

const (
	ComplianceFull        ComplianceLevel = "compliant"
	CompliancePartial     ComplianceLevel = "partial"
	ComplianceNone        ComplianceLevel = "non-compliant"
	ComplianceConditional ComplianceLevel = "conditional"
	ComplianceBanned      ComplianceLevel = "banned" // Explicitly prohibited
)

// RequirementMapping maps a solution to a requirement with compliance status.
type RequirementMapping struct {
	ID              string          `json:"id"`
	RequirementID   string          `json:"requirementId"`
	SolutionID      string          `json:"solutionId"`
	JurisdictionIDs []string        `json:"jurisdictionIds,omitempty"` // Specific jurisdictions this applies to
	ComplianceLevel ComplianceLevel `json:"complianceLevel"`
	Zone            ComplianceZone  `json:"zone,omitempty"`            // Red/Yellow/Green zone
	Notes           string          `json:"notes,omitempty"`
	Evidence        []string        `json:"evidence,omitempty"`
	Conditions      string          `json:"conditions,omitempty"`      // What's needed for compliance
	ETA             string          `json:"eta,omitempty"`             // Expected availability date (e.g., "2026", "Q4 2026")
	AssessmentDate  string          `json:"assessmentDate,omitempty"`
}
