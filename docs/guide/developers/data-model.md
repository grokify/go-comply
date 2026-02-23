# Data Model

Go-Comply uses a structured data model to represent compliance regulations, requirements, and solution mappings.

## Entity Relationship

```
Jurisdiction
    └── Regulation
           └── Requirement
                  └── RequirementMapping ──► Solution
                                              │
                                              └── ZoneAssignment
```

## Core Types

### Jurisdiction

Represents a country, region, or supranational body.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., "EU", "FR") |
| `name` | string | Full name |
| `type` | enum | country, region, supranational |
| `iso3166` | string | ISO country code (optional) |
| `parentId` | string | Parent jurisdiction (e.g., FR → EU) |
| `memberIds` | []string | Member jurisdictions (for supranational) |

### Regulation

A compliance regulation or directive.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Full name |
| `shortName` | string | Abbreviated name (e.g., "NIS2") |
| `jurisdictionId` | string | Issuing jurisdiction |
| `status` | enum | draft, adopted, enforceable, superseded |
| `effectiveDate` | date | When it becomes effective |
| `officialUrl` | string | Link to official text |

### Requirement

A specific compliance requirement from a regulation.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Control ID (e.g., "CTL-LEGAL-001") |
| `name` | string | Requirement name |
| `description` | string | Detailed description |
| `regulationId` | string | Parent regulation |
| `sectionId` | string | Section reference (e.g., "DORA-ART28") |
| `category` | string | Category (e.g., "data-residency") |
| `severity` | enum | critical, high, medium, low |
| `keywords` | []string | Searchable keywords |

### Solution

A cloud solution or service offering.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Full name |
| `provider` | string | Provider name |
| `type` | enum | commercial, govcloud, sovereign, national-partner |
| `certifications` | []string | Certifications held |
| `jurisdictionIds` | []string | Where available |
| `ownershipStructure` | object | Ownership details |

### RequirementMapping

Maps a solution to a requirement with compliance status.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Mapping ID |
| `requirementId` | string | Requirement being mapped |
| `solutionId` | string | Solution being assessed |
| `jurisdictionIds` | []string | Applicable jurisdictions |
| `complianceLevel` | enum | compliant, partial, conditional, non-compliant, banned |
| `zone` | enum | red, yellow, green |
| `notes` | string | Explanation |
| `evidence` | []string | Source URLs |
| `eta` | string | Expected availability |

### ZoneAssignment

Assigns a compliance zone to a solution in a jurisdiction.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Assignment ID |
| `solutionId` | string | Solution |
| `jurisdictionId` | string | Jurisdiction |
| `zone` | enum | red, yellow, green |
| `dataCategory` | string | Data category (e.g., "essential") |
| `rationale` | string | Explanation |

## JSON File Structure

Each type is stored in a separate JSON file:

```
data/
├── framework.json       # Metadata
├── jurisdictions.json   # []Jurisdiction
├── regulations.json     # []Regulation
├── requirements.json    # []Requirement
├── solutions.json       # []Solution
├── mappings.json        # []RequirementMapping
├── zone-assignments.json # []ZoneAssignment
├── entities.json        # []RegulatedEntity
└── enforcement.json     # []EnforcementAssessment
```

## Categories

Requirements are organized by category:

| Category | Description |
|----------|-------------|
| `data-residency` | Where data is stored/processed |
| `access-control` | Who can access data |
| `encryption` | Data protection |
| `personnel` | Staff requirements |
| `ownership` | Corporate ownership |
| `legal-immunity` | Extraterritorial law protection |
| `data-transfers` | Cross-border transfer rules |
| `incident-response` | Breach notification |
| `audit` | Certification requirements |
| `contract` | Contractual obligations |
| `third-party-risk` | Vendor management |
