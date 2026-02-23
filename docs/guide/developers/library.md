# Go Library Reference

The Go library provides types and functions for working with compliance data.

## Installation

```bash
go get github.com/grokify/go-comply
```

## Basic Usage

```go
package main

import (
    "fmt"
    comply "github.com/grokify/go-comply"
)

func main() {
    // Load a compliance framework from a directory
    cf, err := comply.LoadFrameworkFromDir("./examples/data-residency-sovereignty")
    if err != nil {
        panic(err)
    }

    fmt.Printf("Framework: %s v%s\n", cf.Name, cf.Version)
    fmt.Printf("Regulations: %d\n", len(cf.Regulations))
    fmt.Printf("Requirements: %d\n", len(cf.Requirements))
}
```

## Loading Data

### LoadFrameworkFromDir

Load all JSON files from a directory:

```go
cf, err := comply.LoadFrameworkFromDir("./path/to/data")
```

Expected files:

- `framework.json` - Metadata
- `jurisdictions.json` - Jurisdictions
- `regulations.json` - Regulations
- `requirements.json` - Requirements
- `solutions.json` - Solutions
- `mappings.json` - Requirement mappings
- `zone-assignments.json` - Zone assignments (optional)
- `entities.json` - Regulated entities (optional)
- `enforcement.json` - Enforcement assessments (optional)

## Query Methods

### GetMappingsForSolution

```go
mappings := cf.GetMappingsForSolution("aws-commercial")
for _, m := range mappings {
    fmt.Printf("%s: %s\n", m.RequirementID, m.ComplianceLevel)
}
```

### GetMappingsForRequirement

```go
mappings := cf.GetMappingsForRequirement("CTL-LEGAL-001")
for _, m := range mappings {
    fmt.Printf("%s: %s (%s)\n", m.SolutionID, m.ComplianceLevel, m.Zone)
}
```

### GetZoneAssignmentsForJurisdiction

```go
zones := cf.GetZoneAssignmentsForJurisdiction("FR")
for _, z := range zones {
    fmt.Printf("%s: Zone %s\n", z.SolutionID, z.Zone)
}
```

## Core Types

### ComplianceFramework

```go
type ComplianceFramework struct {
    Name                   string
    Version                string
    Description            string
    Jurisdictions          []Jurisdiction
    Regulations            []Regulation
    Requirements           []Requirement
    Solutions              []Solution
    Mappings               []RequirementMapping
    ZoneAssignments        []ZoneAssignment
    EnforcementAssessments []EnforcementAssessment
}
```

### RequirementMapping

```go
type RequirementMapping struct {
    ID              string
    RequirementID   string
    SolutionID      string
    JurisdictionIDs []string
    ComplianceLevel ComplianceLevel
    Zone            ComplianceZone
    Notes           string
    Evidence        []string
    ETA             string
    AssessmentDate  string
}
```

### ComplianceLevel

```go
const (
    ComplianceFull        ComplianceLevel = "compliant"
    CompliancePartial     ComplianceLevel = "partial"
    ComplianceConditional ComplianceLevel = "conditional"
    ComplianceNone        ComplianceLevel = "non-compliant"
    ComplianceBanned      ComplianceLevel = "banned"
)
```

### ComplianceZone

```go
const (
    ZoneRed    ComplianceZone = "red"
    ZoneYellow ComplianceZone = "yellow"
    ZoneGreen  ComplianceZone = "green"
)
```

## Writing Data

### SaveFrameworkToDir

```go
err := comply.SaveFrameworkToDir(cf, "./output")
```

This creates individual JSON files for each data type.
