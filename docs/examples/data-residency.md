# Data Residency & Sovereignty Example

The `examples/data-residency-sovereignty/` directory contains a complete compliance framework covering EU data sovereignty requirements.

## Overview

This example focuses on:

- **SecNumCloud 3.2** (France) - The strictest EU cloud sovereignty standard
- **NIS2** - EU cybersecurity directive for essential entities
- **DORA** - Digital operational resilience for financial services
- **GDPR/Schrems II** - Data protection and transfer restrictions

## Use Cases

### 1. French Government Cloud Selection

For French government workloads requiring SecNumCloud:

```bash
# Find compliant solutions
comply query -dir ./examples/data-residency-sovereignty \
  -jurisdiction FR -zone green

# Check specific provider
comply query -dir ./examples/data-residency-sovereignty \
  -solution ovhcloud -jurisdiction FR
```

**Result:** Only SecNumCloud-certified providers (OVHcloud, Cloud Temple, Outscale) are compliant.

### 2. EU Financial Services (DORA)

For financial entities under DORA:

```bash
# Check DORA compliance for AWS
comply query -dir ./examples/data-residency-sovereignty \
  -solution aws-commercial -regulation EU-DORA

# Compare all solutions for DORA
comply query -dir ./examples/data-residency-sovereignty \
  -regulation EU-DORA
```

**Result:** Commercial clouds can be used with proper risk management, but concentration risk rules apply.

### 3. German Healthcare

For German healthcare requiring C5 attestation:

```bash
# Find C5-certified providers
comply query -dir ./examples/data-residency-sovereignty \
  -jurisdiction DE -certification C5
```

**Result:** AWS, Azure, Google, OVHcloud, and T-Systems all have C5 attestation.

## Data Files

### jurisdictions.json

Defines the jurisdiction hierarchy:

```
EU (supranational)
├── FR (France)
├── DE (Germany)
├── IT (Italy)
└── ...

UK (country, post-Brexit)

KSA (Saudi Arabia)
```

### regulations.json

12 regulations covering:

| Jurisdiction | Regulations |
|--------------|-------------|
| France | SecNumCloud 3.2 |
| EU | NIS2, DORA, GDPR, Schrems II, Data Act, AI Act, EUCS |
| Germany | C5 |
| UK | UK DPA 2018 |
| Saudi Arabia | PDPL, CITC Cloud |

### requirements.json

44 requirements organized by category:

| Category | Count | Examples |
|----------|-------|----------|
| legal-immunity | 5 | CLOUD Act immunity, FISA 702 |
| ownership | 4 | 24/39 rule, EU headquarters |
| data-residency | 8 | EU/France/KSA data location |
| access-control | 6 | EU personnel, clearances |
| encryption | 4 | BYOK, EU key management |
| supply-chain | 3 | NIS2 Art 21, DORA Art 28 |
| incident-response | 3 | 24h/72h notification |
| certification | 4 | SecNumCloud, C5, ISO 27001 |

### solutions.json

13 cloud solutions:

| Type | Solutions |
|------|-----------|
| Commercial | AWS, Azure, Google Cloud |
| GovCloud | AWS GovCloud, Azure Government |
| Sovereign (US-owned) | AWS EU Sovereign |
| Sovereign (EU JV) | Bleu, S3NS |
| Sovereign (EU-native) | OVHcloud, Cloud Temple, Outscale, Scaleway |
| National Partner | T-Systems |

### mappings.json

87 requirement-solution mappings with:

- Compliance level (compliant/partial/conditional/non-compliant/banned)
- Zone assignment (red/yellow/green)
- Evidence URLs
- Assessment dates

### zone-assignments.json

Zone assignments by jurisdiction:

| Zone | Meaning | French Example |
|------|---------|----------------|
| Red | Banned | US hyperscalers for government data |
| Yellow | Conditional | EU JV solutions (Bleu, S3NS) |
| Green | Compliant | SecNumCloud-certified (OVHcloud) |

## Coverage Analysis

Check mapping coverage:

```bash
comply coverage -dir ./examples/data-residency-sovereignty
```

Example output:

```
Coverage Analysis
=================
Total Requirements: 44
Total Solutions: 13
Total Mappings: 87

By Jurisdiction:
  EU:  87/572 cells covered (15.2%)
  FR:  87/572 cells covered (15.2%)
  DE:  45/572 cells covered (7.9%)
  UK:  32/572 cells covered (5.6%)
  KSA: 24/572 cells covered (4.2%)
```

## Research Workflow

To add new mappings:

1. Create research input file following schema:

```json
{
  "metadata": {
    "researcher": "Your Name",
    "date": "2025-05-15"
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

2. Import the research:

```bash
comply import-research -input research.json -output ./examples/data-residency-sovereignty
```

3. Validate the results:

```bash
comply validate ./examples/data-residency-sovereignty
```

## Web Viewer

View the data in the web interface:

```bash
cd web
python3 -m http.server 8080
open "http://localhost:8080/?url=../examples/data-residency-sovereignty"
```

Features:

- Filter by jurisdiction, regulation, solution
- Color-coded compliance zones
- Click cells for detailed mapping info
- Export filtered views
