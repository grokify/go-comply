# Release Notes: v0.1.0

**Release Date:** 2026-02-23

## Overview

Go-Comply v0.1.0 is the initial release of the Go framework for analyzing compliance regulations with machine-readable data structures. This release provides a complete toolkit for managing regulatory requirements, cloud solution mappings, jurisdiction hierarchies, and compliance assessments.

## Highlights

- **Go Framework**: Core data model for compliance regulations with JSON serialization
- **CLI Tool**: Command-line interface for loading, querying, and validating compliance frameworks
- **Web Viewer**: Static HTML/JS viewer for browsing compliance data (GitHub Pages compatible)

## Features

### Core Framework

- **Data Model Types**: Jurisdiction, Regulation, Requirement, Solution, Mapping, ZoneAssignment, EnforcementAssessment
- **ComplianceFramework Container**: Query methods for requirements, solutions, mappings, and zones
- **Analysis Types**: ComplianceAnalysis and ExecutiveOverview for strategic reporting
- **Research Input**: Processing with validation and analysis capabilities
- **JSON I/O**: Load and save compliance frameworks from/to directories

### CLI Commands

```bash
comply load <dir>              # Load and display framework statistics
comply list -type <type>       # List jurisdictions, regulations, requirements, solutions
comply query -solution <id>    # Query mappings by solution or requirement
comply validate <dir>          # Validate JSON data files
comply coverage -dir <dir>     # Analyze mapping coverage
comply import-research         # Convert research findings to mappings
```

### Web Viewer

- Executive overview dashboard
- Interactive tables with filtering and search
- Modal dialogs for detailed views
- Color-coded compliance zones (Red/Yellow/Green)
- URL parameter support for loading remote data

### Compliance Zones

| Zone | Meaning | Example Use Cases |
|------|---------|-------------------|
| **Red** | Full sovereignty required | French government data, Essential Data under SecNumCloud |
| **Yellow** | Trustee/partner model acceptable | German financial services via T-Systems, DORA compliance |
| **Green** | Commercial cloud acceptable | General B2B SaaS, non-sensitive data |

## Installation

```bash
go get github.com/grokify/go-comply
```

Or build the CLI:

```bash
go build -o comply ./cmd/comply
```

## Documentation

- [README](README.md) - Installation, CLI usage, library API
- [MkDocs Site](https://grokify.github.io/go-comply/) - Full documentation
- [Examples](examples/minimal/) - Minimal example framework

## Related Projects

- [go-comply-research](https://github.com/grokify/go-comply-research) - Research projects using go-comply (EMEA sovereignty analysis)

## License

MIT License
