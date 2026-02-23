# Go-Comply

A Go framework for analyzing compliance regulations with machine-readable data structures. Supports regulation requirements, cloud solution mappings, jurisdiction management, and enforcement assessments.

## Overview

Go-Comply helps organizations track and analyze cloud provider compliance with regulations like:

- **SecNumCloud 3.2** (France) - Cloud security certification with 24/39 ownership rule
- **NIS2** (EU) - Cybersecurity for essential and important entities
- **DORA** (EU) - Digital operational resilience for financial services
- **GDPR** (EU) - Data protection regulation
- **BSI C5** (Germany) - Cloud security criteria catalog

## Key Features

- **Regulation Modeling**: Define regulations, sections, and requirements with structured metadata
- **Jurisdiction Hierarchy**: Support for countries, regions, and supranational bodies (EU)
- **Solution Mapping**: Map cloud solutions to requirements with compliance levels
- **Compliance Zones**: Red/Yellow/Green zone classification for data categories
- **Evidence Tracking**: Link compliance claims to authoritative sources
- **Coverage Analysis**: Identify gaps in compliance documentation
- **Web Viewer**: Interactive browser for compliance data

## Who Is This For?

<div class="grid cards" markdown>

-   :material-shield-check:{ .lg .middle } **Compliance Officers**

    ---

    Browse compliance mappings, understand zone classifications, and assess provider suitability.

    [:octicons-arrow-right-24: Web Viewer Guide](guide/compliance-officers/web-viewer.md)

-   :material-magnify:{ .lg .middle } **Research Assistants**

    ---

    Document compliance findings with structured data and evidence URLs.

    [:octicons-arrow-right-24: Research Workflow](guide/research/workflow.md)

-   :material-code-braces:{ .lg .middle } **Developers**

    ---

    Use the Go library and CLI to build compliance tooling.

    [:octicons-arrow-right-24: CLI Reference](guide/developers/cli.md)

-   :material-database:{ .lg .middle } **Data Maintainers**

    ---

    Manage and validate compliance data in JSON format.

    [:octicons-arrow-right-24: JSON Schemas](guide/maintainers/schemas.md)

</div>

## Quick Start

```bash
# Install CLI
go install github.com/grokify/go-comply/cmd/comply@latest

# Analyze coverage
comply coverage -dir ./examples/data-residency-sovereignty

# Start web viewer
cd web && python3 -m http.server 8080
```

## Compliance Zones

| Zone | Meaning | Example |
|------|---------|---------|
| 🔴 **Red** | Full sovereignty required, US hyperscalers banned | French government data under SecNumCloud |
| 🟡 **Yellow** | Trustee/partner model acceptable | German financial services via T-Systems |
| 🟢 **Green** | Commercial cloud acceptable with controls | General B2B SaaS, non-sensitive data |

## Current Coverage

The framework currently tracks:

- **44** compliance requirements
- **13** cloud solutions
- **87** requirement-solution mappings
- **5** jurisdictions (EU, FR, DE, UK, KSA)

Run `comply coverage` to see detailed statistics.
