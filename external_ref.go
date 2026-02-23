package comply

// ExternalRefType defines the type of external reference.
type ExternalRefType string

const (
	RefTypeURL        ExternalRefType = "url"
	RefTypeCitation   ExternalRefType = "citation"
	RefTypeRegulation ExternalRefType = "regulation"
	RefTypeStandard   ExternalRefType = "standard"
)

// ExternalRef represents a reference to an external resource.
type ExternalRef struct {
	Type  ExternalRefType `json:"type"`
	Value string          `json:"value"`
	Name  string          `json:"name,omitempty"`
	Notes string          `json:"notes,omitempty"`
}
