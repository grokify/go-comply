package comply

// RegulatedEntity represents a type of organization subject to regulation.
type RegulatedEntity struct {
	ID           string   `json:"id"`           // e.g., "NIS2-ESSENTIAL"
	Name         string   `json:"name"`         // e.g., "Essential Entity"
	Description  string   `json:"description"`
	RegulationID string   `json:"regulationId"`
	Sectors      []string `json:"sectors,omitempty"`  // e.g., ["energy", "transport", "health"]
	Criteria     string   `json:"criteria,omitempty"` // Criteria for classification
	Examples     []string `json:"examples,omitempty"` // Example organizations
}
