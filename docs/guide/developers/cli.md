# CLI Reference

The `comply` CLI provides commands for loading, querying, validating, and analyzing compliance data.

## Installation

```bash
go install github.com/grokify/go-comply/cmd/comply@latest
```

## Commands

### load

Load and display a compliance framework summary.

```bash
comply load <directory>
```

**Example:**

```bash
$ comply load ./examples/data-residency-sovereignty

Compliance Framework: Data Residency & Sovereignty (v1.0.0)
Description: Cloud compliance requirements for EU/UK/KSA jurisdictions

Statistics:
  Jurisdictions:    9
  Regulations:      11
  Requirements:     44
  Solutions:        13
  Zone Assignments: 20
  Mappings:         87
  Enforcement:      5
```

---

### list

List items of a specific type.

```bash
comply list -dir <directory> -type <type> [-format table|json]
```

**Types:** `jurisdictions`, `regulations`, `requirements`, `solutions`, `mappings`, `zones`, `enforcement`

**Examples:**

```bash
# List regulations as table
comply list -dir ./examples/data-residency-sovereignty -type regulations

# List solutions as JSON
comply list -dir ./examples/data-residency-sovereignty -type solutions -format json
```

---

### query

Query mappings for a solution or requirement.

```bash
comply query -dir <directory> -solution <id> [-jurisdiction <id>]
comply query -dir <directory> -requirement <id> [-jurisdiction <id>]
```

**Examples:**

```bash
# All mappings for AWS
comply query -dir ./examples/data-residency-sovereignty -solution aws-commercial

# AWS mappings in France only
comply query -dir ./examples/data-residency-sovereignty -solution aws-commercial -jurisdiction FR

# All solutions for a requirement
comply query -dir ./examples/data-residency-sovereignty -requirement CTL-LEGAL-001
```

---

### validate

Validate JSON files for referential integrity.

```bash
comply validate <directory>
```

Checks:

- Requirements reference valid regulations
- Mappings reference valid solutions and requirements
- Zone assignments reference valid solutions and jurisdictions

**Example:**

```bash
$ comply validate ./examples/data-residency-sovereignty
Validation passed!
```

---

### coverage

Analyze mapping coverage and data completeness.

```bash
comply coverage -dir <directory> [-format table|json]
```

**Example:**

```bash
$ comply coverage -dir ./examples/data-residency-sovereignty

=== Compliance Framework Coverage Report ===

Summary:
  Requirements:        44
  Solutions:           13
  Total Mappings:      87
  With Evidence:       32 (36.8%)

Coverage by Jurisdiction:

JUR          SOLS      MAX  COVERED  COVERAGE%   EVIDENCE  EVIDENCE%
------------------------------------------------------------------------
EU             11      484       70      14.5%         29      41.4%
FR              6      264       35      13.3%         14      40.0%
DE              2       88       10      11.4%          7      70.0%
UK              4      176        5       2.8%          3      60.0%
KSA             2       88        4       4.5%          3      75.0%
------------------------------------------------------------------------
TOTAL           -     1100      124      11.3%         56      45.2%

Gap Analysis:
  EU: 414 cells missing (85.5% gap)
  FR: 229 cells missing (86.7% gap)
  DE: 78 cells missing (88.6% gap)
  UK: 171 cells missing (97.2% gap)
  KSA: 84 cells missing (95.5% gap)
```

**JSON output:**

```bash
comply coverage -dir ./examples/data-residency-sovereignty -format json
```

---

### import-research

Convert research findings JSON to mappings format.

```bash
comply import-research -input <file> [-output <file>] [-start-id <number>]
```

**Options:**

| Flag | Default | Description |
|------|---------|-------------|
| `-input` | (required) | Input research JSON file |
| `-output` | stdout | Output mappings JSON file |
| `-start-id` | 100 | Starting ID number (e.g., 100 → MAP-100) |

**Example:**

```bash
# Preview conversion to stdout
comply import-research -input research.json

# Save to file starting at MAP-200
comply import-research -input research.json -output new-mappings.json -start-id 200
```

**Output:**

```
[
  {
    "id": "MAP-100",
    "requirementId": "CTL-AUDIT-002",
    "solutionId": "aws-commercial",
    ...
  }
]

Import Summary:
  Research Date: 2025-05-01
  Researcher:    compliance-team
  Findings:      5
  Mappings:      5

By Status:
  compliant       2
  non-compliant   2
  conditional     1
```

## Global Options

All commands support:

| Flag | Description |
|------|-------------|
| `-format` | Output format: `table` (default) or `json` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (invalid input, validation failure, etc.) |
