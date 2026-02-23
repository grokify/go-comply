package comply

import (
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strings"
	"time"
)

// ResearchInput represents the research input file format
type ResearchInput struct {
	Metadata ResearchMetadata  `json:"metadata"`
	Findings []ResearchFinding `json:"findings"`
}

// ResearchMetadata contains metadata about the research submission
type ResearchMetadata struct {
	ResearchDate string `json:"researchDate"`
	Researcher   string `json:"researcher,omitempty"`
	Version      string `json:"version,omitempty"`
}

// ConfidenceLevel represents confidence in a research finding
type ConfidenceLevel string

const (
	ConfidenceHigh   ConfidenceLevel = "high"
	ConfidenceMedium ConfidenceLevel = "medium"
	ConfidenceLow    ConfidenceLevel = "low"
)

// ResearchFinding represents a single compliance finding from research
type ResearchFinding struct {
	RegulationID    string          `json:"regulationId,omitempty"`
	ControlID       string          `json:"controlId"`
	ControlName     string          `json:"controlName,omitempty"`
	SolutionID      string          `json:"solutionId"`
	JurisdictionIDs []string        `json:"jurisdictionIds"`
	Status          string          `json:"status"`
	Zone            ComplianceZone  `json:"zone,omitempty"`
	Notes           string          `json:"notes"`
	Evidence        []string        `json:"evidence,omitempty"`
	ETA             string          `json:"eta,omitempty"`
	Confidence      ConfidenceLevel `json:"confidence,omitempty"`
}

// ResearchAnalysis contains analysis results of research findings
type ResearchAnalysis struct {
	TotalFindings     int                       `json:"totalFindings"`
	UniqueControls    int                       `json:"uniqueControls"`
	UniqueSolutions   int                       `json:"uniqueSolutions"`
	StatusBreakdown   map[string]int            `json:"statusBreakdown"`
	ZoneBreakdown     map[string]int            `json:"zoneBreakdown"`
	ConfidenceBreakdown map[string]int          `json:"confidenceBreakdown"`
	ControlIDs        []string                  `json:"controlIds"`
	SolutionIDs       []string                  `json:"solutionIds"`
	JurisdictionIDs   []string                  `json:"jurisdictionIds"`
	FindingsBySolution map[string]int           `json:"findingsBySolution"`
	FindingsByControl  map[string]int           `json:"findingsByControl"`
	MissingEvidence   int                       `json:"missingEvidence"`
	WithEvidence      int                       `json:"withEvidence"`
}

// ValidationError represents a validation error in research data
type ValidationError struct {
	Index   int    `json:"index"`
	Field   string `json:"field"`
	Value   string `json:"value"`
	Message string `json:"message"`
}

// ValidationResult contains the results of validating research input
type ValidationResult struct {
	Valid        bool              `json:"valid"`
	Errors       []ValidationError `json:"errors,omitempty"`
	Warnings     []ValidationError `json:"warnings,omitempty"`
	TotalChecked int               `json:"totalChecked"`
}

// LoadResearchInput loads a research input file from disk
func LoadResearchInput(path string) (*ResearchInput, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read research file: %w", err)
	}

	var input ResearchInput
	if err := json.Unmarshal(data, &input); err != nil {
		return nil, fmt.Errorf("failed to parse research JSON: %w", err)
	}

	return &input, nil
}

// Analyze performs analysis on research findings
func (ri *ResearchInput) Analyze() *ResearchAnalysis {
	analysis := &ResearchAnalysis{
		TotalFindings:       len(ri.Findings),
		StatusBreakdown:     make(map[string]int),
		ZoneBreakdown:       make(map[string]int),
		ConfidenceBreakdown: make(map[string]int),
		FindingsBySolution:  make(map[string]int),
		FindingsByControl:   make(map[string]int),
	}

	controlSet := make(map[string]struct{})
	solutionSet := make(map[string]struct{})
	jurisdictionSet := make(map[string]struct{})

	for _, f := range ri.Findings {
		// Count by status
		analysis.StatusBreakdown[f.Status]++

		// Count by zone
		if f.Zone != "" {
			analysis.ZoneBreakdown[string(f.Zone)]++
		}

		// Count by confidence
		if f.Confidence != "" {
			analysis.ConfidenceBreakdown[string(f.Confidence)]++
		} else {
			analysis.ConfidenceBreakdown["unspecified"]++
		}

		// Track unique values
		controlSet[f.ControlID] = struct{}{}
		solutionSet[f.SolutionID] = struct{}{}
		for _, j := range f.JurisdictionIDs {
			jurisdictionSet[j] = struct{}{}
		}

		// Count by solution and control
		analysis.FindingsBySolution[f.SolutionID]++
		analysis.FindingsByControl[f.ControlID]++

		// Evidence tracking
		if len(f.Evidence) > 0 {
			analysis.WithEvidence++
		} else {
			analysis.MissingEvidence++
		}
	}

	// Convert sets to sorted slices
	analysis.UniqueControls = len(controlSet)
	analysis.UniqueSolutions = len(solutionSet)

	for k := range controlSet {
		analysis.ControlIDs = append(analysis.ControlIDs, k)
	}
	sort.Strings(analysis.ControlIDs)

	for k := range solutionSet {
		analysis.SolutionIDs = append(analysis.SolutionIDs, k)
	}
	sort.Strings(analysis.SolutionIDs)

	for k := range jurisdictionSet {
		analysis.JurisdictionIDs = append(analysis.JurisdictionIDs, k)
	}
	sort.Strings(analysis.JurisdictionIDs)

	return analysis
}

// Validate validates research input against known solutions, controls, etc.
func (ri *ResearchInput) Validate(framework *ComplianceFramework) *ValidationResult {
	result := &ValidationResult{
		Valid:        true,
		TotalChecked: len(ri.Findings),
	}

	// Build lookup maps from framework
	solutionIDs := make(map[string]struct{})
	for _, s := range framework.Solutions {
		solutionIDs[s.ID] = struct{}{}
	}

	requirementIDs := make(map[string]struct{})
	for _, r := range framework.Requirements {
		requirementIDs[r.ID] = struct{}{}
	}

	jurisdictionIDs := make(map[string]struct{})
	for _, j := range framework.Jurisdictions {
		jurisdictionIDs[j.ID] = struct{}{}
	}

	validStatuses := map[string]struct{}{
		"compliant": {}, "partial": {}, "conditional": {},
		"non-compliant": {}, "banned": {}, "unknown": {},
	}

	validZones := map[string]struct{}{
		"red": {}, "yellow": {}, "green": {},
	}

	for i, f := range ri.Findings {
		// Check required fields
		if f.ControlID == "" {
			result.Errors = append(result.Errors, ValidationError{
				Index:   i,
				Field:   "controlId",
				Message: "controlId is required",
			})
			result.Valid = false
		}

		if f.SolutionID == "" {
			result.Errors = append(result.Errors, ValidationError{
				Index:   i,
				Field:   "solutionId",
				Message: "solutionId is required",
			})
			result.Valid = false
		}

		if len(f.JurisdictionIDs) == 0 {
			result.Errors = append(result.Errors, ValidationError{
				Index:   i,
				Field:   "jurisdictionIds",
				Message: "at least one jurisdictionId is required",
			})
			result.Valid = false
		}

		// Validate solution exists
		if _, ok := solutionIDs[f.SolutionID]; !ok && f.SolutionID != "" {
			result.Warnings = append(result.Warnings, ValidationError{
				Index:   i,
				Field:   "solutionId",
				Value:   f.SolutionID,
				Message: "solution not found in framework (may need to add it)",
			})
		}

		// Validate control exists (warning only - may be new control)
		if _, ok := requirementIDs[f.ControlID]; !ok && f.ControlID != "" {
			result.Warnings = append(result.Warnings, ValidationError{
				Index:   i,
				Field:   "controlId",
				Value:   f.ControlID,
				Message: "control not found in requirements (may need to add it)",
			})
		}

		// Validate jurisdictions
		for _, j := range f.JurisdictionIDs {
			if _, ok := jurisdictionIDs[j]; !ok {
				result.Warnings = append(result.Warnings, ValidationError{
					Index:   i,
					Field:   "jurisdictionIds",
					Value:   j,
					Message: "jurisdiction not found in framework",
				})
			}
		}

		// Validate status
		if _, ok := validStatuses[f.Status]; !ok {
			result.Errors = append(result.Errors, ValidationError{
				Index:   i,
				Field:   "status",
				Value:   f.Status,
				Message: "invalid status value",
			})
			result.Valid = false
		}

		// Validate zone
		if f.Zone != "" {
			if _, ok := validZones[string(f.Zone)]; !ok {
				result.Errors = append(result.Errors, ValidationError{
					Index:   i,
					Field:   "zone",
					Value:   string(f.Zone),
					Message: "invalid zone value",
				})
				result.Valid = false
			}
		}

		// Warn about missing evidence
		if len(f.Evidence) == 0 {
			result.Warnings = append(result.Warnings, ValidationError{
				Index:   i,
				Field:   "evidence",
				Message: "no evidence URLs provided",
			})
		}
	}

	return result
}

// ToMappings converts research findings to RequirementMapping format
func (ri *ResearchInput) ToMappings() []RequirementMapping {
	mappings := make([]RequirementMapping, 0, len(ri.Findings))

	for i, f := range ri.Findings {
		// Convert status to ComplianceLevel
		var level ComplianceLevel
		switch f.Status {
		case "compliant":
			level = ComplianceFull
		case "partial":
			level = CompliancePartial
		case "conditional":
			level = ComplianceConditional
		case "non-compliant":
			level = ComplianceNone
		case "banned":
			level = ComplianceBanned
		default:
			level = ComplianceLevel(f.Status)
		}

		mapping := RequirementMapping{
			ID:              fmt.Sprintf("MAP-RESEARCH-%04d", i+1),
			RequirementID:   f.ControlID,
			SolutionID:      f.SolutionID,
			JurisdictionIDs: f.JurisdictionIDs,
			ComplianceLevel: level,
			Zone:            f.Zone,
			Notes:           f.Notes,
			Evidence:        f.Evidence,
			ETA:             f.ETA,
			AssessmentDate:  ri.Metadata.ResearchDate,
		}

		mappings = append(mappings, mapping)
	}

	return mappings
}

// MergeWithMappings merges research findings with existing mappings
// Returns new mappings, updated mappings, and unchanged mappings
func (ri *ResearchInput) MergeWithMappings(existing []RequirementMapping) (new, updated, unchanged []RequirementMapping) {
	// Build lookup of existing mappings by requirement+solution+jurisdiction key
	existingMap := make(map[string]*RequirementMapping)
	for i := range existing {
		m := &existing[i]
		for _, j := range m.JurisdictionIDs {
			key := fmt.Sprintf("%s|%s|%s", m.RequirementID, m.SolutionID, j)
			existingMap[key] = m
		}
		// Also key without jurisdiction for general mappings
		if len(m.JurisdictionIDs) == 0 {
			key := fmt.Sprintf("%s|%s|*", m.RequirementID, m.SolutionID)
			existingMap[key] = m
		}
	}

	seenExisting := make(map[string]bool)

	for _, f := range ri.Findings {
		var level ComplianceLevel
		switch f.Status {
		case "compliant":
			level = ComplianceFull
		case "partial":
			level = CompliancePartial
		case "conditional":
			level = ComplianceConditional
		case "non-compliant":
			level = ComplianceNone
		case "banned":
			level = ComplianceBanned
		default:
			level = ComplianceLevel(f.Status)
		}

		// Check if this finding matches an existing mapping
		var foundExisting *RequirementMapping
		for _, j := range f.JurisdictionIDs {
			key := fmt.Sprintf("%s|%s|%s", f.ControlID, f.SolutionID, j)
			if m, ok := existingMap[key]; ok {
				foundExisting = m
				seenExisting[m.ID] = true
				break
			}
		}
		// Check wildcard
		if foundExisting == nil {
			key := fmt.Sprintf("%s|%s|*", f.ControlID, f.SolutionID)
			if m, ok := existingMap[key]; ok {
				foundExisting = m
				seenExisting[m.ID] = true
			}
		}

		if foundExisting != nil {
			// Update existing mapping
			updatedMapping := *foundExisting
			updatedMapping.ComplianceLevel = level
			updatedMapping.Zone = f.Zone
			updatedMapping.Notes = f.Notes
			updatedMapping.Evidence = f.Evidence
			updatedMapping.ETA = f.ETA
			updatedMapping.AssessmentDate = ri.Metadata.ResearchDate
			updated = append(updated, updatedMapping)
		} else {
			// New mapping
			newMapping := RequirementMapping{
				ID:              fmt.Sprintf("MAP-NEW-%s-%s", f.ControlID, f.SolutionID),
				RequirementID:   f.ControlID,
				SolutionID:      f.SolutionID,
				JurisdictionIDs: f.JurisdictionIDs,
				ComplianceLevel: level,
				Zone:            f.Zone,
				Notes:           f.Notes,
				Evidence:        f.Evidence,
				ETA:             f.ETA,
				AssessmentDate:  ri.Metadata.ResearchDate,
			}
			new = append(new, newMapping)
		}
	}

	// Find unchanged mappings
	for i := range existing {
		if !seenExisting[existing[i].ID] {
			unchanged = append(unchanged, existing[i])
		}
	}

	return new, updated, unchanged
}

// PrintAnalysis prints a formatted analysis report
func (a *ResearchAnalysis) PrintReport() string {
	var sb strings.Builder

	sb.WriteString("Research Analysis Report\n")
	sb.WriteString("========================\n\n")

	fmt.Fprintf(&sb, "Total Findings: %d\n", a.TotalFindings)
	fmt.Fprintf(&sb, "Unique Controls: %d\n", a.UniqueControls)
	fmt.Fprintf(&sb, "Unique Solutions: %d\n", a.UniqueSolutions)
	fmt.Fprintf(&sb, "Jurisdictions: %s\n", strings.Join(a.JurisdictionIDs, ", "))
	sb.WriteString("\n")

	sb.WriteString("Status Breakdown:\n")
	for status, count := range a.StatusBreakdown {
		fmt.Fprintf(&sb, "  %-15s %d (%.1f%%)\n", status, count, float64(count)/float64(a.TotalFindings)*100)
	}
	sb.WriteString("\n")

	sb.WriteString("Zone Breakdown:\n")
	for zone, count := range a.ZoneBreakdown {
		fmt.Fprintf(&sb, "  %-10s %d (%.1f%%)\n", zone, count, float64(count)/float64(a.TotalFindings)*100)
	}
	sb.WriteString("\n")

	sb.WriteString("Evidence Coverage:\n")
	fmt.Fprintf(&sb, "  With Evidence:    %d (%.1f%%)\n", a.WithEvidence, float64(a.WithEvidence)/float64(a.TotalFindings)*100)
	fmt.Fprintf(&sb, "  Missing Evidence: %d (%.1f%%)\n", a.MissingEvidence, float64(a.MissingEvidence)/float64(a.TotalFindings)*100)
	sb.WriteString("\n")

	sb.WriteString("Findings by Solution:\n")
	for sol, count := range a.FindingsBySolution {
		fmt.Fprintf(&sb, "  %-25s %d\n", sol, count)
	}
	sb.WriteString("\n")

	fmt.Fprintf(&sb, "Control IDs (%d):\n", len(a.ControlIDs))
	for _, c := range a.ControlIDs {
		fmt.Fprintf(&sb, "  %s\n", c)
	}

	return sb.String()
}

// GenerateMappingID generates a unique mapping ID
func GenerateMappingID(prefix string, index int) string {
	timestamp := time.Now().Format("20060102")
	return fmt.Sprintf("MAP-%s-%s-%04d", prefix, timestamp, index)
}
