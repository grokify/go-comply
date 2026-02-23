package comply

import (
	"testing"
)

func TestLoadExampleFramework(t *testing.T) {
	cf, err := LoadFrameworkFromDir("./examples/minimal")
	if err != nil {
		t.Fatalf("Failed to load example framework: %v", err)
	}

	// Verify data was loaded
	if len(cf.Jurisdictions) == 0 {
		t.Error("expected jurisdictions to be loaded")
	}
	if len(cf.Regulations) == 0 {
		t.Error("expected regulations to be loaded")
	}
	if len(cf.Requirements) == 0 {
		t.Error("expected requirements to be loaded")
	}
	if len(cf.Solutions) == 0 {
		t.Error("expected solutions to be loaded")
	}
	if len(cf.Mappings) == 0 {
		t.Error("expected mappings to be loaded")
	}
	if len(cf.ZoneAssignments) == 0 {
		t.Error("expected zone assignments to be loaded")
	}

	// Verify specific data from minimal example
	eu := cf.GetJurisdiction("EU")
	if eu == nil {
		t.Fatal("expected to find EU jurisdiction")
	}
	if eu.Type != JurisdictionSupranational {
		t.Errorf("expected EU type 'supranational', got %q", eu.Type)
	}

	reg := cf.GetRegulation("EXAMPLE-REG")
	if reg == nil {
		t.Fatal("expected to find EXAMPLE-REG regulation")
	}
	if reg.Status != RegulationEnforceable {
		t.Errorf("expected EXAMPLE-REG status 'enforceable', got %q", reg.Status)
	}

	sol := cf.GetSolution("cloud-provider-a")
	if sol == nil {
		t.Fatal("expected to find cloud-provider-a solution")
	}
	if sol.Type != SolutionCommercial {
		t.Errorf("expected cloud-provider-a type 'commercial', got %q", sol.Type)
	}
}

func TestQueryZoneAssignments(t *testing.T) {
	cf, err := LoadFrameworkFromDir("./examples/minimal")
	if err != nil {
		t.Fatalf("Failed to load example framework: %v", err)
	}

	// Get zone assignments for provider a
	zones := cf.GetZoneAssignmentsForSolution("cloud-provider-a")
	if len(zones) == 0 {
		t.Fatal("expected to find zone assignments for cloud-provider-a")
	}

	// Verify zone assignment exists for EU
	var foundEU bool
	for _, z := range zones {
		if z.JurisdictionID == "EU" {
			foundEU = true
			if z.Zone != ZoneYellow {
				t.Errorf("expected cloud-provider-a in EU to be yellow zone, got %q", z.Zone)
			}
			break
		}
	}
	if !foundEU {
		t.Error("expected to find EU zone assignment for cloud-provider-a")
	}
}

func TestQuerySovereignProvider(t *testing.T) {
	cf, err := LoadFrameworkFromDir("./examples/minimal")
	if err != nil {
		t.Fatalf("Failed to load example framework: %v", err)
	}

	// Get mappings for sovereign provider
	mappings := cf.GetMappingsForSolution("cloud-provider-b-sovereign")
	if len(mappings) == 0 {
		t.Fatal("expected to find mappings for cloud-provider-b-sovereign")
	}

	// Verify sovereign provider is compliant
	var foundCompliant bool
	for _, m := range mappings {
		if m.ComplianceLevel == ComplianceFull && m.Zone == ZoneGreen {
			foundCompliant = true
			break
		}
	}
	if !foundCompliant {
		t.Error("expected cloud-provider-b-sovereign to have green zone compliant mappings")
	}
}
