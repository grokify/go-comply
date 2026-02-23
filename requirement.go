package comply

// RequirementSeverity defines the severity level of a requirement.
type RequirementSeverity string

const (
	SeverityCritical RequirementSeverity = "critical"
	SeverityHigh     RequirementSeverity = "high"
	SeverityMedium   RequirementSeverity = "medium"
	SeverityLow      RequirementSeverity = "low"
)

// Requirement represents a specific compliance requirement from a regulation.
type Requirement struct {
	ID            string              `json:"id"`                       // e.g., "NIS2-ART21-SEC-01"
	Name          string              `json:"name"`
	Description   string              `json:"description"`
	RegulationID  string              `json:"regulationId"`
	SectionID     string              `json:"sectionId,omitempty"`
	Category      string              `json:"category,omitempty"`       // e.g., "data-residency", "encryption"
	Subcategory   string              `json:"subcategory,omitempty"`
	Severity      RequirementSeverity `json:"severity,omitempty"`
	Keywords      []string            `json:"keywords,omitempty"`
	RelatedIDs    []string            `json:"relatedIds,omitempty"`     // related requirement IDs
	ExternalRefs  []ExternalRef       `json:"externalRefs,omitempty"`
	EffectiveDate string              `json:"effectiveDate,omitempty"`
	Applicability *Applicability      `json:"applicability,omitempty"`
}

// Applicability defines when a requirement applies.
type Applicability struct {
	EntityTypes []string `json:"entityTypes,omitempty"` // e.g., ["essential-entity", "important-entity"]
	Sectors     []string `json:"sectors,omitempty"`     // e.g., ["energy", "transport", "banking"]
	DataTypes   []string `json:"dataTypes,omitempty"`   // e.g., ["personal-data", "essential-data"]
	Conditions  string   `json:"conditions,omitempty"`  // free-form conditions
}
