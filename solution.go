package comply

// SolutionType defines the type of cloud solution.
type SolutionType string

const (
	SolutionCommercial      SolutionType = "commercial"
	SolutionGovCloud        SolutionType = "govcloud"
	SolutionSovereign       SolutionType = "sovereign"
	SolutionNationalPartner SolutionType = "national-partner"
	SolutionPrivate         SolutionType = "private"
)

// Solution represents a cloud solution or service offering.
type Solution struct {
	ID                 string              `json:"id"`                            // e.g., "aws-commercial"
	Name               string              `json:"name"`
	Provider           string              `json:"provider"`                      // AWS, Azure, Google, OVHcloud, etc.
	Type               SolutionType        `json:"type"`
	Description        string              `json:"description,omitempty"`
	AvailableRegions   []string            `json:"availableRegions,omitempty"`
	Certifications     []string            `json:"certifications,omitempty"`      // SecNumCloud, C5, ISO27001
	OwnershipStructure *OwnershipStructure `json:"ownershipStructure,omitempty"`
	JurisdictionIDs    []string            `json:"jurisdictionIds,omitempty"`     // Where available
	ExternalRefs       []ExternalRef       `json:"externalRefs,omitempty"`
}

// OwnershipStructure captures ownership details for sovereignty compliance.
// Supports SecNumCloud 24/39 rule: 24% max non-EU ownership, 39% max single non-EU shareholder.
type OwnershipStructure struct {
	EUOwnershipPercent           float64 `json:"euOwnershipPercent"`
	LargestNonEUPercent          float64 `json:"largestNonEuPercent"`
	SubjectToExtraTerritorialLaw bool    `json:"subjectToExtraTerritorialLaw"` // CLOUD Act, etc.
	ControllingEntity            string  `json:"controllingEntity,omitempty"`
	Notes                        string  `json:"notes,omitempty"`
}
