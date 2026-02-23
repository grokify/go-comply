package comply

// ComplianceZone represents the compliance zone classification.
type ComplianceZone string

const (
	// ZoneRed - Full sovereignty required, US hyperscalers banned.
	// Examples: French government data under SecNumCloud, Essential Data.
	ZoneRed ComplianceZone = "red"

	// ZoneYellow - Trustee/partner model acceptable.
	// Examples: German energy sector via T-Systems, financial services via DORA.
	ZoneYellow ComplianceZone = "yellow"

	// ZoneGreen - Commercial cloud acceptable with proper controls.
	// Examples: General B2B SaaS, non-essential data.
	ZoneGreen ComplianceZone = "green"
)

// ZoneAssignment assigns a compliance zone to a solution in a jurisdiction.
type ZoneAssignment struct {
	ID             string         `json:"id"`
	SolutionID     string         `json:"solutionId"`
	JurisdictionID string         `json:"jurisdictionId"`
	Zone           ComplianceZone `json:"zone"`
	DataCategory   string         `json:"dataCategory,omitempty"`  // e.g., "essential", "personal", "general"
	EntityType     string         `json:"entityType,omitempty"`    // e.g., "essential-entity", "financial-services"
	Rationale      string         `json:"rationale,omitempty"`
	RegulationIDs  []string       `json:"regulationIds,omitempty"` // Regulations driving this zone
}
