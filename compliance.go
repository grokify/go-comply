package comply

// ComplianceFramework is the top-level container for all compliance data.
type ComplianceFramework struct {
	Name                   string                  `json:"name"`
	Version                string                  `json:"version"`
	Description            string                  `json:"description,omitempty"`
	LastUpdated            string                  `json:"lastUpdated,omitempty"`
	Jurisdictions          []Jurisdiction          `json:"jurisdictions,omitempty"`
	Regulations            []Regulation            `json:"regulations,omitempty"`
	Requirements           []Requirement           `json:"requirements,omitempty"`
	RegulatedEntities      []RegulatedEntity       `json:"regulatedEntities,omitempty"`
	Solutions              []Solution              `json:"solutions,omitempty"`
	ZoneAssignments        []ZoneAssignment        `json:"zoneAssignments,omitempty"`
	Mappings               []RequirementMapping    `json:"mappings,omitempty"`
	EnforcementAssessments []EnforcementAssessment `json:"enforcementAssessments,omitempty"`
}

// NewComplianceFramework creates a new empty ComplianceFramework.
func NewComplianceFramework(name, version string) *ComplianceFramework {
	return &ComplianceFramework{
		Name:    name,
		Version: version,
	}
}

// GetJurisdiction returns a jurisdiction by ID, or nil if not found.
func (cf *ComplianceFramework) GetJurisdiction(id string) *Jurisdiction {
	for i := range cf.Jurisdictions {
		if cf.Jurisdictions[i].ID == id {
			return &cf.Jurisdictions[i]
		}
	}
	return nil
}

// GetRegulation returns a regulation by ID, or nil if not found.
func (cf *ComplianceFramework) GetRegulation(id string) *Regulation {
	for i := range cf.Regulations {
		if cf.Regulations[i].ID == id {
			return &cf.Regulations[i]
		}
	}
	return nil
}

// GetRequirement returns a requirement by ID, or nil if not found.
func (cf *ComplianceFramework) GetRequirement(id string) *Requirement {
	for i := range cf.Requirements {
		if cf.Requirements[i].ID == id {
			return &cf.Requirements[i]
		}
	}
	return nil
}

// GetSolution returns a solution by ID, or nil if not found.
func (cf *ComplianceFramework) GetSolution(id string) *Solution {
	for i := range cf.Solutions {
		if cf.Solutions[i].ID == id {
			return &cf.Solutions[i]
		}
	}
	return nil
}

// GetMappingsForRequirement returns all mappings for a given requirement ID.
func (cf *ComplianceFramework) GetMappingsForRequirement(requirementID string) []RequirementMapping {
	var result []RequirementMapping
	for _, m := range cf.Mappings {
		if m.RequirementID == requirementID {
			result = append(result, m)
		}
	}
	return result
}

// GetMappingsForSolution returns all mappings for a given solution ID.
func (cf *ComplianceFramework) GetMappingsForSolution(solutionID string) []RequirementMapping {
	var result []RequirementMapping
	for _, m := range cf.Mappings {
		if m.SolutionID == solutionID {
			result = append(result, m)
		}
	}
	return result
}

// GetZoneAssignmentsForSolution returns all zone assignments for a given solution ID.
func (cf *ComplianceFramework) GetZoneAssignmentsForSolution(solutionID string) []ZoneAssignment {
	var result []ZoneAssignment
	for _, za := range cf.ZoneAssignments {
		if za.SolutionID == solutionID {
			result = append(result, za)
		}
	}
	return result
}

// GetZoneAssignmentsForJurisdiction returns all zone assignments for a given jurisdiction ID.
func (cf *ComplianceFramework) GetZoneAssignmentsForJurisdiction(jurisdictionID string) []ZoneAssignment {
	var result []ZoneAssignment
	for _, za := range cf.ZoneAssignments {
		if za.JurisdictionID == jurisdictionID {
			result = append(result, za)
		}
	}
	return result
}

// GetRequirementsByRegulation returns all requirements for a given regulation ID.
func (cf *ComplianceFramework) GetRequirementsByRegulation(regulationID string) []Requirement {
	var result []Requirement
	for _, r := range cf.Requirements {
		if r.RegulationID == regulationID {
			result = append(result, r)
		}
	}
	return result
}

// GetEnforcementAssessmentsForJurisdiction returns all enforcement assessments for a given jurisdiction.
func (cf *ComplianceFramework) GetEnforcementAssessmentsForJurisdiction(jurisdictionID string) []EnforcementAssessment {
	var result []EnforcementAssessment
	for _, ea := range cf.EnforcementAssessments {
		if ea.JurisdictionID == jurisdictionID {
			result = append(result, ea)
		}
	}
	return result
}
