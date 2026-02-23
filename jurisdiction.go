package comply

// JurisdictionType defines the type of jurisdiction.
type JurisdictionType string

const (
	JurisdictionCountry       JurisdictionType = "country"
	JurisdictionRegion        JurisdictionType = "region"
	JurisdictionSupranational JurisdictionType = "supranational"
)

// Jurisdiction represents a legal jurisdiction (country, region, or supranational body).
type Jurisdiction struct {
	ID          string           `json:"id"`                    // e.g., "EU", "UK", "KSA", "FR"
	Name        string           `json:"name"`                  // e.g., "European Union"
	Type        JurisdictionType `json:"type"`
	ISO3166     string           `json:"iso3166,omitempty"`     // ISO country code
	ParentID    string           `json:"parentId,omitempty"`    // e.g., "DE" -> "EU"
	MemberIDs   []string         `json:"memberIds,omitempty"`   // for regions: member country IDs
	Description string           `json:"description,omitempty"`
}
