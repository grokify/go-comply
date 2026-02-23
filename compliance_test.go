package comply

import (
	"testing"
)

func TestNewComplianceFramework(t *testing.T) {
	cf := NewComplianceFramework("Test Framework", "1.0.0")
	if cf.Name != "Test Framework" {
		t.Errorf("expected name 'Test Framework', got %q", cf.Name)
	}
	if cf.Version != "1.0.0" {
		t.Errorf("expected version '1.0.0', got %q", cf.Version)
	}
}

func TestGetJurisdiction(t *testing.T) {
	cf := &ComplianceFramework{
		Jurisdictions: []Jurisdiction{
			{ID: "EU", Name: "European Union", Type: JurisdictionSupranational},
			{ID: "FR", Name: "France", Type: JurisdictionCountry, ParentID: "EU"},
		},
	}

	j := cf.GetJurisdiction("EU")
	if j == nil {
		t.Fatal("expected to find EU jurisdiction")
	}
	if j.Name != "European Union" {
		t.Errorf("expected name 'European Union', got %q", j.Name)
	}

	j = cf.GetJurisdiction("FR")
	if j == nil {
		t.Fatal("expected to find FR jurisdiction")
	}
	if j.ParentID != "EU" {
		t.Errorf("expected parentId 'EU', got %q", j.ParentID)
	}

	j = cf.GetJurisdiction("XX")
	if j != nil {
		t.Error("expected nil for unknown jurisdiction")
	}
}

func TestGetRegulation(t *testing.T) {
	cf := &ComplianceFramework{
		Regulations: []Regulation{
			{ID: "EU-GDPR", ShortName: "GDPR", Status: RegulationEnforceable},
			{ID: "EU-NIS2", ShortName: "NIS2", Status: RegulationEnforceable},
		},
	}

	r := cf.GetRegulation("EU-GDPR")
	if r == nil {
		t.Fatal("expected to find EU-GDPR regulation")
	}
	if r.ShortName != "GDPR" {
		t.Errorf("expected shortName 'GDPR', got %q", r.ShortName)
	}

	r = cf.GetRegulation("UNKNOWN")
	if r != nil {
		t.Error("expected nil for unknown regulation")
	}
}

func TestGetRequirement(t *testing.T) {
	cf := &ComplianceFramework{
		Requirements: []Requirement{
			{ID: "REQ-001", Name: "Data Localization", Severity: SeverityCritical},
			{ID: "REQ-002", Name: "Encryption", Severity: SeverityHigh},
		},
	}

	r := cf.GetRequirement("REQ-001")
	if r == nil {
		t.Fatal("expected to find REQ-001 requirement")
	}
	if r.Severity != SeverityCritical {
		t.Errorf("expected severity 'critical', got %q", r.Severity)
	}

	r = cf.GetRequirement("REQ-999")
	if r != nil {
		t.Error("expected nil for unknown requirement")
	}
}

func TestGetSolution(t *testing.T) {
	cf := &ComplianceFramework{
		Solutions: []Solution{
			{ID: "aws-commercial", Provider: "AWS", Type: SolutionCommercial},
			{ID: "ovhcloud", Provider: "OVHcloud", Type: SolutionSovereign},
		},
	}

	s := cf.GetSolution("ovhcloud")
	if s == nil {
		t.Fatal("expected to find ovhcloud solution")
	}
	if s.Type != SolutionSovereign {
		t.Errorf("expected type 'sovereign', got %q", s.Type)
	}

	s = cf.GetSolution("unknown")
	if s != nil {
		t.Error("expected nil for unknown solution")
	}
}

func TestGetMappingsForRequirement(t *testing.T) {
	cf := &ComplianceFramework{
		Mappings: []RequirementMapping{
			{ID: "M1", RequirementID: "REQ-001", SolutionID: "aws", ComplianceLevel: ComplianceBanned},
			{ID: "M2", RequirementID: "REQ-001", SolutionID: "ovh", ComplianceLevel: ComplianceFull},
			{ID: "M3", RequirementID: "REQ-002", SolutionID: "aws", ComplianceLevel: ComplianceFull},
		},
	}

	mappings := cf.GetMappingsForRequirement("REQ-001")
	if len(mappings) != 2 {
		t.Errorf("expected 2 mappings for REQ-001, got %d", len(mappings))
	}

	mappings = cf.GetMappingsForRequirement("REQ-002")
	if len(mappings) != 1 {
		t.Errorf("expected 1 mapping for REQ-002, got %d", len(mappings))
	}

	mappings = cf.GetMappingsForRequirement("REQ-999")
	if len(mappings) != 0 {
		t.Errorf("expected 0 mappings for REQ-999, got %d", len(mappings))
	}
}

func TestGetMappingsForSolution(t *testing.T) {
	cf := &ComplianceFramework{
		Mappings: []RequirementMapping{
			{ID: "M1", RequirementID: "REQ-001", SolutionID: "aws", ComplianceLevel: ComplianceBanned},
			{ID: "M2", RequirementID: "REQ-001", SolutionID: "ovh", ComplianceLevel: ComplianceFull},
			{ID: "M3", RequirementID: "REQ-002", SolutionID: "aws", ComplianceLevel: ComplianceFull},
		},
	}

	mappings := cf.GetMappingsForSolution("aws")
	if len(mappings) != 2 {
		t.Errorf("expected 2 mappings for aws, got %d", len(mappings))
	}

	mappings = cf.GetMappingsForSolution("ovh")
	if len(mappings) != 1 {
		t.Errorf("expected 1 mapping for ovh, got %d", len(mappings))
	}
}

func TestGetZoneAssignmentsForSolution(t *testing.T) {
	cf := &ComplianceFramework{
		ZoneAssignments: []ZoneAssignment{
			{ID: "Z1", SolutionID: "aws", JurisdictionID: "FR", Zone: ZoneRed},
			{ID: "Z2", SolutionID: "aws", JurisdictionID: "DE", Zone: ZoneYellow},
			{ID: "Z3", SolutionID: "ovh", JurisdictionID: "FR", Zone: ZoneGreen},
		},
	}

	zones := cf.GetZoneAssignmentsForSolution("aws")
	if len(zones) != 2 {
		t.Errorf("expected 2 zone assignments for aws, got %d", len(zones))
	}

	zones = cf.GetZoneAssignmentsForSolution("ovh")
	if len(zones) != 1 {
		t.Errorf("expected 1 zone assignment for ovh, got %d", len(zones))
	}
}

func TestGetZoneAssignmentsForJurisdiction(t *testing.T) {
	cf := &ComplianceFramework{
		ZoneAssignments: []ZoneAssignment{
			{ID: "Z1", SolutionID: "aws", JurisdictionID: "FR", Zone: ZoneRed},
			{ID: "Z2", SolutionID: "azure", JurisdictionID: "FR", Zone: ZoneRed},
			{ID: "Z3", SolutionID: "ovh", JurisdictionID: "FR", Zone: ZoneGreen},
			{ID: "Z4", SolutionID: "aws", JurisdictionID: "DE", Zone: ZoneYellow},
		},
	}

	zones := cf.GetZoneAssignmentsForJurisdiction("FR")
	if len(zones) != 3 {
		t.Errorf("expected 3 zone assignments for FR, got %d", len(zones))
	}

	zones = cf.GetZoneAssignmentsForJurisdiction("DE")
	if len(zones) != 1 {
		t.Errorf("expected 1 zone assignment for DE, got %d", len(zones))
	}
}

func TestGetRequirementsByRegulation(t *testing.T) {
	cf := &ComplianceFramework{
		Requirements: []Requirement{
			{ID: "REQ-001", RegulationID: "EU-GDPR"},
			{ID: "REQ-002", RegulationID: "EU-GDPR"},
			{ID: "REQ-003", RegulationID: "EU-NIS2"},
		},
	}

	reqs := cf.GetRequirementsByRegulation("EU-GDPR")
	if len(reqs) != 2 {
		t.Errorf("expected 2 requirements for EU-GDPR, got %d", len(reqs))
	}

	reqs = cf.GetRequirementsByRegulation("EU-NIS2")
	if len(reqs) != 1 {
		t.Errorf("expected 1 requirement for EU-NIS2, got %d", len(reqs))
	}
}

func TestGetEnforcementAssessmentsForJurisdiction(t *testing.T) {
	cf := &ComplianceFramework{
		EnforcementAssessments: []EnforcementAssessment{
			{ID: "E1", JurisdictionID: "FR", Likelihood: LikelihoodHigh},
			{ID: "E2", JurisdictionID: "FR", Likelihood: LikelihoodMedium},
			{ID: "E3", JurisdictionID: "DE", Likelihood: LikelihoodLow},
		},
	}

	assessments := cf.GetEnforcementAssessmentsForJurisdiction("FR")
	if len(assessments) != 2 {
		t.Errorf("expected 2 assessments for FR, got %d", len(assessments))
	}

	assessments = cf.GetEnforcementAssessmentsForJurisdiction("DE")
	if len(assessments) != 1 {
		t.Errorf("expected 1 assessment for DE, got %d", len(assessments))
	}
}
