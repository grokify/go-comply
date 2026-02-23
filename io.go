package comply

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// ReadJSON reads a JSON file and unmarshals it into the provided interface.
func ReadJSON(path string, v any) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("reading file %s: %w", path, err)
	}
	if err := json.Unmarshal(data, v); err != nil {
		return fmt.Errorf("unmarshaling JSON from %s: %w", path, err)
	}
	return nil
}

// WriteJSON marshals the provided interface and writes it to a JSON file.
func WriteJSON(path string, v any, indent bool) error {
	var data []byte
	var err error
	if indent {
		data, err = json.MarshalIndent(v, "", "  ")
	} else {
		data, err = json.Marshal(v)
	}
	if err != nil {
		return fmt.Errorf("marshaling JSON: %w", err)
	}
	data = append(data, '\n')
	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("writing file %s: %w", path, err)
	}
	return nil
}

// LoadFrameworkFromDir loads a ComplianceFramework from a directory of JSON files.
func LoadFrameworkFromDir(dir string) (*ComplianceFramework, error) {
	cf := &ComplianceFramework{}

	files := map[string]any{
		"jurisdictions.json":    &cf.Jurisdictions,
		"regulations.json":      &cf.Regulations,
		"requirements.json":     &cf.Requirements,
		"entities.json":         &cf.RegulatedEntities,
		"solutions.json":        &cf.Solutions,
		"zone-assignments.json": &cf.ZoneAssignments,
		"mappings.json":         &cf.Mappings,
		"enforcement.json":      &cf.EnforcementAssessments,
	}

	for filename, dest := range files {
		path := filepath.Join(dir, filename)
		if _, err := os.Stat(path); os.IsNotExist(err) {
			continue // File doesn't exist, skip
		}
		if err := ReadJSON(path, dest); err != nil {
			return nil, fmt.Errorf("loading %s: %w", filename, err)
		}
	}

	// Try to load framework metadata from framework.json
	metaPath := filepath.Join(dir, "framework.json")
	if _, err := os.Stat(metaPath); err == nil {
		var meta struct {
			Name        string `json:"name"`
			Version     string `json:"version"`
			Description string `json:"description"`
			LastUpdated string `json:"lastUpdated"`
		}
		if err := ReadJSON(metaPath, &meta); err == nil {
			cf.Name = meta.Name
			cf.Version = meta.Version
			cf.Description = meta.Description
			cf.LastUpdated = meta.LastUpdated
		}
	}

	return cf, nil
}

// SaveFrameworkToDir saves a ComplianceFramework to a directory of JSON files.
func SaveFrameworkToDir(cf *ComplianceFramework, dir string) error {
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("creating directory %s: %w", dir, err)
	}

	files := map[string]any{
		"jurisdictions.json":    cf.Jurisdictions,
		"regulations.json":      cf.Regulations,
		"requirements.json":     cf.Requirements,
		"entities.json":         cf.RegulatedEntities,
		"solutions.json":        cf.Solutions,
		"zone-assignments.json": cf.ZoneAssignments,
		"mappings.json":         cf.Mappings,
		"enforcement.json":      cf.EnforcementAssessments,
	}

	for filename, data := range files {
		path := filepath.Join(dir, filename)
		if err := WriteJSON(path, data, true); err != nil {
			return fmt.Errorf("saving %s: %w", filename, err)
		}
	}

	// Save framework metadata
	meta := struct {
		Name        string `json:"name"`
		Version     string `json:"version"`
		Description string `json:"description,omitempty"`
		LastUpdated string `json:"lastUpdated,omitempty"`
	}{
		Name:        cf.Name,
		Version:     cf.Version,
		Description: cf.Description,
		LastUpdated: cf.LastUpdated,
	}
	metaPath := filepath.Join(dir, "framework.json")
	if err := WriteJSON(metaPath, meta, true); err != nil {
		return fmt.Errorf("saving framework.json: %w", err)
	}

	return nil
}

// LoadJurisdictions loads jurisdictions from a JSON file.
func LoadJurisdictions(path string) ([]Jurisdiction, error) {
	var jurisdictions []Jurisdiction
	if err := ReadJSON(path, &jurisdictions); err != nil {
		return nil, err
	}
	return jurisdictions, nil
}

// LoadRegulations loads regulations from a JSON file.
func LoadRegulations(path string) ([]Regulation, error) {
	var regulations []Regulation
	if err := ReadJSON(path, &regulations); err != nil {
		return nil, err
	}
	return regulations, nil
}

// LoadRequirements loads requirements from a JSON file.
func LoadRequirements(path string) ([]Requirement, error) {
	var requirements []Requirement
	if err := ReadJSON(path, &requirements); err != nil {
		return nil, err
	}
	return requirements, nil
}

// LoadSolutions loads solutions from a JSON file.
func LoadSolutions(path string) ([]Solution, error) {
	var solutions []Solution
	if err := ReadJSON(path, &solutions); err != nil {
		return nil, err
	}
	return solutions, nil
}

// LoadMappings loads requirement mappings from a JSON file.
func LoadMappings(path string) ([]RequirementMapping, error) {
	var mappings []RequirementMapping
	if err := ReadJSON(path, &mappings); err != nil {
		return nil, err
	}
	return mappings, nil
}

// LoadZoneAssignments loads zone assignments from a JSON file.
func LoadZoneAssignments(path string) ([]ZoneAssignment, error) {
	var assignments []ZoneAssignment
	if err := ReadJSON(path, &assignments); err != nil {
		return nil, err
	}
	return assignments, nil
}

// LoadEnforcementAssessments loads enforcement assessments from a JSON file.
func LoadEnforcementAssessments(path string) ([]EnforcementAssessment, error) {
	var assessments []EnforcementAssessment
	if err := ReadJSON(path, &assessments); err != nil {
		return nil, err
	}
	return assessments, nil
}

// LoadComplianceAnalysis loads a compliance analysis from a JSON file.
func LoadComplianceAnalysis(path string) (*ComplianceAnalysis, error) {
	var analysis ComplianceAnalysis
	if err := ReadJSON(path, &analysis); err != nil {
		return nil, err
	}
	return &analysis, nil
}

// LoadExecutiveOverview loads an executive overview from a JSON file.
func LoadExecutiveOverview(path string) (*ExecutiveOverview, error) {
	var overview ExecutiveOverview
	if err := ReadJSON(path, &overview); err != nil {
		return nil, err
	}
	return &overview, nil
}
