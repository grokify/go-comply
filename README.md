# Go-Comply

A Go framework for analyzing compliance regulations with machine-readable data structures. Supports regulation requirements, cloud solution mappings, jurisdiction management, and enforcement assessments.

## Features

- **Executive Overview**: Market segment analysis with provider readiness assessment
- **Regulation Modeling**: Define regulations, sections, and requirements with structured metadata
- **Jurisdiction Hierarchy**: Support for countries, regions, and supranational bodies (EU)
- **Solution Mapping**: Map cloud solutions to requirements with compliance levels
- **Compliance Zones**: Red/Yellow/Green zone classification for data categories
- **Enforcement Assessment**: Track enforcement likelihood and recent actions
- **JSON I/O**: Load and save compliance data in structured JSON format
- **Web Viewer**: Static HTML/JS viewer for browsing compliance data (GitHub Pages compatible)

## Installation

```bash
go get github.com/grokify/go-comply
```

## CLI Usage

Build the CLI tool:

```bash
go build -o comply ./cmd/comply
```

### Commands

**Load a framework:**

```bash
./comply load ./examples/minimal
```

**List items:**

```bash
./comply list -dir ./examples/minimal -type regulations
./comply list -dir ./examples/minimal -type solutions
./comply list -dir ./examples/minimal -type zones
```

**Query mappings:**

```bash
./comply query -dir ./examples/minimal -solution cloud-provider-a
./comply query -dir ./examples/minimal -requirement EXAMPLE-REG-01
./comply query -dir ./examples/minimal -solution cloud-provider-a -jurisdiction EU
```

**Validate files:**

```bash
./comply validate ./examples/minimal
```

**Analyze coverage:**

```bash
./comply coverage -dir ./examples/minimal
```

**Import research:**

```bash
./comply import-research -input research.json -output ./my-framework
```

## Library Usage

```go
package main

import (
    "fmt"
    comply "github.com/grokify/go-comply"
)

func main() {
    // Load a compliance framework from a directory
    cf, err := comply.LoadFrameworkFromDir("./examples/minimal")
    if err != nil {
        panic(err)
    }

    // Query solutions for a requirement
    mappings := cf.GetMappingsForRequirement("EXAMPLE-REG-01")
    for _, m := range mappings {
        fmt.Printf("Solution %s: %s (Zone: %s)\n",
            m.SolutionID, m.ComplianceLevel, m.Zone)
    }

    // Get zone assignments for a jurisdiction
    zones := cf.GetZoneAssignmentsForJurisdiction("EU")
    for _, z := range zones {
        fmt.Printf("Solution %s in EU: Zone %s\n", z.SolutionID, z.Zone)
    }
}
```

## Data Model

### Core Types

| Type | Description |
|------|-------------|
| `Jurisdiction` | Country, region, or supranational body (e.g., EU, FR, UK) |
| `Regulation` | A compliance regulation or directive (e.g., GDPR, NIS2, SecNumCloud) |
| `Requirement` | A specific compliance requirement from a regulation |
| `Solution` | A cloud solution or service offering |
| `RequirementMapping` | Maps a solution to a requirement with compliance level |
| `ZoneAssignment` | Assigns a compliance zone (Red/Yellow/Green) to a solution in a jurisdiction |
| `EnforcementAssessment` | Evaluates enforcement likelihood for a regulation |

### Compliance Zones

| Zone | Meaning | Example Use Cases |
|------|---------|-------------------|
| **Red** | Full sovereignty required, US hyperscalers banned | French government data, Essential Data under SecNumCloud |
| **Yellow** | Trustee/partner model acceptable | German financial services via T-Systems, DORA compliance |
| **Green** | Commercial cloud acceptable with proper controls | General B2B SaaS, non-sensitive data |

### Compliance Levels

| Level | Description |
|-------|-------------|
| `compliant` | Fully meets the requirement |
| `partial` | Partially meets the requirement |
| `conditional` | Meets requirement with additional measures |
| `non-compliant` | Does not meet the requirement |
| `banned` | Explicitly prohibited |

## Examples

### Minimal Example

The `examples/minimal/` directory contains a basic example demonstrating the data structures:

- Jurisdictions (EU, US)
- Regulations (example regulation with requirements)
- Solutions (commercial and sovereign providers)
- Mappings (solution-to-requirement compliance levels)
- Zone assignments (Red/Yellow/Green zones)

### Research Examples

For comprehensive real-world examples including EMEA data sovereignty analysis, see [go-comply-research](https://github.com/grokify/go-comply-research):

- **EMEA Data Residency & Sovereignty**: SecNumCloud, NIS2, DORA, EUCS, Schrems II
- **Regulations**: SecNumCloud 3.2, NIS2, DORA, GDPR, C5, PDPL
- **Solutions**: AWS, Azure, Google Cloud, OVHcloud, T-Systems, Bleu, S3NS

## Web Viewer

The `web/` directory contains a static HTML/JavaScript viewer for browsing compliance data. It can be hosted on GitHub Pages or any static file server.

### Quick Start

```bash
# Start a local server
cd web
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

### URL Parameter (Swagger UI Style)

Load data automatically via URL parameter:

```
http://localhost:8080/?url=./data
http://localhost:8080/?url=https://example.com/my-compliance-data
```

### Features

- Load from any URL (local or remote)
- Filter by jurisdiction, regulation, solution, and zone
- Search across all data
- Click items for detailed view
- Color-coded compliance zones (Red/Yellow/Green)

### GitHub Pages Deployment

1. Copy the `web/` directory to your GitHub Pages repo
2. Add your JSON data files to a `data/` subdirectory
3. Access: `https://username.github.io/repo/?url=./data`

See [web/README.md](web/README.md) for full documentation.

## Executive Overview

The executive overview (`executive-overview.json`) provides a high-level summary for decision makers:

- **Market Segments**: Commercial, Regulated Industries, Government
- **Key Requirements**: Priority requirements per segment with enforcement status
- **Provider Readiness**: Status matrix showing which providers can serve each segment
- **Sovereignty Status**: EU ownership, CLOUD Act immunity, SecNumCloud certification

See the Overview tab in the web viewer for the interactive dashboard.

## Research Input Schema

For research assistants contributing compliance data, use the JSON Schema in `schema/research-input.schema.json`:

```json
{
  "metadata": {
    "researcher": "Your Name",
    "date": "2025-05-15",
    "sources": ["https://..."]
  },
  "findings": [
    {
      "controlId": "CTL-LEGAL-001",
      "solutionId": "aws-commercial",
      "jurisdictionIds": ["EU", "FR"],
      "status": "non-compliant",
      "zone": "red",
      "notes": "Subject to US CLOUD Act",
      "evidenceUrls": ["https://..."]
    }
  ]
}
```

See `schema/control-mapping.json` for the control ID reference.

## Directory Structure

```
go-comply/
├── *.go                            # Core Go types and I/O
├── cmd/comply/                     # CLI tool
├── web/                            # Static web viewer
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── data/                       # Example data
├── schema/                         # JSON Schemas
│   ├── research-input.schema.json  # Research input format
│   └── control-mapping.json        # Control ID reference
├── docs/                           # MkDocs documentation
└── examples/
    └── minimal/                    # Minimal example framework
        ├── jurisdictions.json
        ├── regulations.json
        ├── requirements.json
        ├── solutions.json
        ├── mappings.json
        └── zone-assignments.json
```

## Related Projects

- [go-comply-research](https://github.com/grokify/go-comply-research) - Research projects using go-comply (EMEA sovereignty analysis)

## Documentation

Full documentation is available at: https://grokify.github.io/go-comply/

Documentation covers:

- **Compliance Officers**: Web viewer usage, zone interpretation, reading mappings
- **Research Assistants**: Research workflow, input schema, evidence guidelines
- **Developers**: CLI reference, Go library API, data model
- **Data Maintainers**: JSON schemas, validation, pre-publish checklists

### Building Docs Locally

```bash
pip install mkdocs-material
mkdocs serve
```

## License

MIT License
