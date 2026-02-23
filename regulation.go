package comply

// RegulationStatus defines the current status of a regulation.
type RegulationStatus string

const (
	RegulationDraft       RegulationStatus = "draft"
	RegulationAdopted     RegulationStatus = "adopted"
	RegulationEnforceable RegulationStatus = "enforceable"
	RegulationSuperseded  RegulationStatus = "superseded"
)

// Regulation represents a compliance regulation or directive.
type Regulation struct {
	ID                string            `json:"id"`                          // e.g., "EU-NIS2"
	Name              string            `json:"name"`                        // Full name
	ShortName         string            `json:"shortName"`                   // e.g., "NIS2", "GDPR", "DORA"
	Description       string            `json:"description"`
	JurisdictionID    string            `json:"jurisdictionId"`
	Status            RegulationStatus  `json:"status"`
	AdoptedDate       string            `json:"adoptedDate,omitempty"`
	EffectiveDate     string            `json:"effectiveDate,omitempty"`
	EnforcementDate   string            `json:"enforcementDate,omitempty"`
	OfficialURL       string            `json:"officialUrl,omitempty"`
	Sections          []Section         `json:"sections,omitempty"`
	RegulatedEntities []RegulatedEntity `json:"regulatedEntities,omitempty"`
	ExternalRefs      []ExternalRef     `json:"externalRefs,omitempty"`
	Tags              []string          `json:"tags,omitempty"`              // e.g., ["data-sovereignty", "cybersecurity"]
}

// Section represents a section or article within a regulation.
type Section struct {
	ID             string   `json:"id"`                        // e.g., "NIS2-ART21"
	RegulationID   string   `json:"regulationId"`
	Number         string   `json:"number"`                    // e.g., "Article 21"
	Name           string   `json:"name"`
	Description    string   `json:"description,omitempty"`
	ParentID       string   `json:"parentId,omitempty"`
	RequirementIDs []string `json:"requirementIds,omitempty"`
}
