package comply

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestReadWriteJSON(t *testing.T) {
	tmpDir := t.TempDir()
	testFile := filepath.Join(tmpDir, "test.json")

	original := []Jurisdiction{
		{ID: "EU", Name: "European Union", Type: JurisdictionSupranational},
		{ID: "FR", Name: "France", Type: JurisdictionCountry, ParentID: "EU"},
	}

	// Write
	if err := WriteJSON(testFile, original, true); err != nil {
		t.Fatalf("WriteJSON failed: %v", err)
	}

	// Read
	var loaded []Jurisdiction
	if err := ReadJSON(testFile, &loaded); err != nil {
		t.Fatalf("ReadJSON failed: %v", err)
	}

	if len(loaded) != len(original) {
		t.Errorf("expected %d jurisdictions, got %d", len(original), len(loaded))
	}
	if loaded[0].ID != "EU" {
		t.Errorf("expected first ID 'EU', got %q", loaded[0].ID)
	}
	if loaded[1].ParentID != "EU" {
		t.Errorf("expected second parentId 'EU', got %q", loaded[1].ParentID)
	}
}

func TestLoadFrameworkFromDir(t *testing.T) {
	tmpDir := t.TempDir()

	// Create test files
	jurisdictions := []Jurisdiction{
		{ID: "EU", Name: "European Union", Type: JurisdictionSupranational},
	}
	regulations := []Regulation{
		{ID: "EU-GDPR", ShortName: "GDPR", JurisdictionID: "EU", Status: RegulationEnforceable},
	}
	solutions := []Solution{
		{ID: "aws-commercial", Provider: "AWS", Type: SolutionCommercial},
	}
	framework := struct {
		Name        string `json:"name"`
		Version     string `json:"version"`
		Description string `json:"description"`
	}{
		Name:        "Test Framework",
		Version:     "1.0.0",
		Description: "Test description",
	}

	writeTestJSON(t, tmpDir, "jurisdictions.json", jurisdictions)
	writeTestJSON(t, tmpDir, "regulations.json", regulations)
	writeTestJSON(t, tmpDir, "solutions.json", solutions)
	writeTestJSON(t, tmpDir, "framework.json", framework)

	cf, err := LoadFrameworkFromDir(tmpDir)
	if err != nil {
		t.Fatalf("LoadFrameworkFromDir failed: %v", err)
	}

	if cf.Name != "Test Framework" {
		t.Errorf("expected name 'Test Framework', got %q", cf.Name)
	}
	if cf.Version != "1.0.0" {
		t.Errorf("expected version '1.0.0', got %q", cf.Version)
	}
	if len(cf.Jurisdictions) != 1 {
		t.Errorf("expected 1 jurisdiction, got %d", len(cf.Jurisdictions))
	}
	if len(cf.Regulations) != 1 {
		t.Errorf("expected 1 regulation, got %d", len(cf.Regulations))
	}
	if len(cf.Solutions) != 1 {
		t.Errorf("expected 1 solution, got %d", len(cf.Solutions))
	}
}

func TestSaveFrameworkToDir(t *testing.T) {
	tmpDir := t.TempDir()

	cf := &ComplianceFramework{
		Name:    "Test Framework",
		Version: "2.0.0",
		Jurisdictions: []Jurisdiction{
			{ID: "UK", Name: "United Kingdom", Type: JurisdictionCountry},
		},
		Regulations: []Regulation{
			{ID: "UK-DPA", ShortName: "UK DPA", JurisdictionID: "UK"},
		},
	}

	if err := SaveFrameworkToDir(cf, tmpDir); err != nil {
		t.Fatalf("SaveFrameworkToDir failed: %v", err)
	}

	// Verify files exist
	expectedFiles := []string{
		"framework.json",
		"jurisdictions.json",
		"regulations.json",
		"solutions.json",
	}
	for _, f := range expectedFiles {
		path := filepath.Join(tmpDir, f)
		if _, err := os.Stat(path); os.IsNotExist(err) {
			t.Errorf("expected file %s to exist", f)
		}
	}

	// Reload and verify
	loaded, err := LoadFrameworkFromDir(tmpDir)
	if err != nil {
		t.Fatalf("failed to reload framework: %v", err)
	}
	if loaded.Name != "Test Framework" {
		t.Errorf("expected name 'Test Framework', got %q", loaded.Name)
	}
	if len(loaded.Jurisdictions) != 1 {
		t.Errorf("expected 1 jurisdiction, got %d", len(loaded.Jurisdictions))
	}
}

func TestLoadJurisdictions(t *testing.T) {
	tmpDir := t.TempDir()
	testFile := filepath.Join(tmpDir, "jurisdictions.json")

	data := []Jurisdiction{
		{ID: "EU", Name: "European Union", Type: JurisdictionSupranational},
		{ID: "FR", Name: "France", Type: JurisdictionCountry, ParentID: "EU"},
	}
	writeTestJSON(t, tmpDir, "jurisdictions.json", data)

	loaded, err := LoadJurisdictions(testFile)
	if err != nil {
		t.Fatalf("LoadJurisdictions failed: %v", err)
	}
	if len(loaded) != 2 {
		t.Errorf("expected 2 jurisdictions, got %d", len(loaded))
	}
}

func TestLoadSolutions(t *testing.T) {
	tmpDir := t.TempDir()
	testFile := filepath.Join(tmpDir, "solutions.json")

	data := []Solution{
		{ID: "aws", Provider: "AWS", Type: SolutionCommercial},
		{ID: "ovh", Provider: "OVHcloud", Type: SolutionSovereign},
	}
	writeTestJSON(t, tmpDir, "solutions.json", data)

	loaded, err := LoadSolutions(testFile)
	if err != nil {
		t.Fatalf("LoadSolutions failed: %v", err)
	}
	if len(loaded) != 2 {
		t.Errorf("expected 2 solutions, got %d", len(loaded))
	}
	if loaded[1].Type != SolutionSovereign {
		t.Errorf("expected second solution type 'sovereign', got %q", loaded[1].Type)
	}
}

func writeTestJSON(t *testing.T, dir, filename string, data any) {
	t.Helper()
	path := filepath.Join(dir, filename)
	content, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		t.Fatalf("failed to marshal test data: %v", err)
	}
	if err := os.WriteFile(path, content, 0644); err != nil {
		t.Fatalf("failed to write test file %s: %v", filename, err)
	}
}
