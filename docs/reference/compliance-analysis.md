# Compliance Analysis Schema

The Compliance Analysis schema provides a structured format for strategic compliance analysis, including regulatory context, market segment requirements, and solution landscape assessment.

## Purpose

While the Executive Overview provides a quick summary, the Compliance Analysis answers deeper questions:

- **Why** is this compliance landscape the way it is?
- **What** are the key regulatory drivers and geopolitical factors?
- **How** do requirements differ across market segments?
- **What** solutions are viable now and in the future?

## Schema Structure

### Metadata

```json
{
  "metadata": {
    "title": "EU Data Sovereignty Analysis",
    "version": "1.0.0",
    "lastUpdated": "2026-02-18",
    "analyst": "Research Team",
    "scope": {
      "jurisdictions": ["EU", "FR", "DE", "UK"],
      "regulations": ["FR-SECNUMCLOUD-3.2", "EU-NIS2", "EU-DORA"],
      "timeframe": "2024-2027"
    }
  }
}
```

### Regulatory Context

Explains **why** the compliance landscape exists:

```json
{
  "regulatoryContext": {
    "overview": "The European cloud compliance landscape has transformed...",
    "keyDrivers": [
      {
        "id": "CLOUD-ACT",
        "name": "US CLOUD Act (2018)",
        "type": "legislation",
        "jurisdiction": "US",
        "description": "Requires US companies to provide data regardless of location",
        "impact": "Creates conflict with EU data protection requirements"
      }
    ],
    "timeline": [...],
    "threatLandscape": {
      "extraterritorialLaws": [...],
      "dataSovereigntyConcerns": [...],
      "geopoliticalRisks": [...]
    }
  }
}
```

### Market Segments

For each segment (Commercial, Regulated, Government):

```json
{
  "marketSegments": [
    {
      "id": "regulated",
      "name": "Highly Regulated Industries",
      "type": "regulated",
      "industries": ["banking", "insurance", "healthcare"],
      "riskLevel": "high",
      "complianceRequirements": {
        "mustHave": [...],
        "shouldHave": [...],
        "niceToHave": [...]
      },
      "currentSolutions": {
        "viable": [...],
        "partial": [...],
        "notViable": [...]
      },
      "futureSolutions": [...],
      "strategicOutlook": {
        "shortTerm": "...",
        "mediumTerm": "...",
        "longTerm": "..."
      },
      "keyInsights": [...]
    }
  ]
}
```

### Solution Landscape

Overview of provider categories:

```json
{
  "solutionLandscape": {
    "overview": "The EU cloud market has stratified...",
    "categories": [
      {
        "id": "us-hyperscalers",
        "name": "US Hyperscalers",
        "characteristics": ["Global scale", "Subject to CLOUD Act"],
        "solutions": ["aws-commercial", "azure-commercial", "google-cloud"],
        "segmentViability": {
          "commercial": "viable",
          "regulated": "partial",
          "government": "not-viable"
        }
      }
    ],
    "emergingTrends": [...]
  }
}
```

### Recommendations

Strategic recommendations by segment:

```json
{
  "recommendations": [
    {
      "id": "REC-001",
      "segment": "regulated",
      "priority": "critical",
      "recommendation": "Establish DORA-compliant ICT Third-Party Risk Management",
      "rationale": "DORA is enforceable from January 2025",
      "actions": ["Complete risk assessment", "Address concentration risk"],
      "timeframe": "Immediate"
    }
  ]
}
```

## Key Concepts

### Regulatory Drivers

| Type | Description |
|------|-------------|
| `legislation` | Laws and regulations (CLOUD Act, GDPR, DORA) |
| `court-ruling` | Court decisions (Schrems II) |
| `policy` | Government policy decisions |
| `geopolitical` | Geopolitical factors |
| `standard` | Certification standards (SecNumCloud, C5) |

### Requirement Priority

| Priority | Description |
|----------|-------------|
| `mustHave` | Required for compliance; mandatory |
| `shouldHave` | Strongly recommended; expected by regulators |
| `niceToHave` | Best practice; competitive advantage |

### Enforcement Status

| Status | Description |
|--------|-------------|
| `enforced` | Currently being enforced |
| `upcoming` | Will be enforced soon (has effective date) |
| `proposed` | Under consideration |
| `guidance` | Recommended but not mandatory |

### Solution Viability

| Status | Description |
|--------|-------------|
| `viable` | Can fully serve this segment today |
| `partial` | Can serve with limitations or gaps |
| `not-viable` | Cannot serve due to structural barriers |

## Example: EU Data Sovereignty Context

The example in `examples/data-residency-sovereignty/compliance-analysis.json` explains:

1. **Why CLOUD Act matters**: US law enables government access to data held by US companies anywhere in the world, conflicting with EU data protection

2. **Why Schrems II changed everything**: The CJEU ruling invalidated Privacy Shield and requires supplementary measures for US transfers

3. **Why SecNumCloud excludes US providers**: The 24/39 ownership rule and extraterritorial immunity requirements structurally exclude US-headquartered companies

4. **How joint ventures attempt to bridge the gap**: Bleu (Microsoft+Orange/Capgemini) and S3NS (Google+Thales) create EU-owned entities using hyperscaler technology

## Using the Analysis

### For Executives

- Start with `regulatoryContext.overview` for the big picture
- Review `marketSegments[].keyInsights` for your segment
- Check `recommendations` for prioritized actions

### For Compliance Teams

- Use `complianceRequirements` to build requirement checklists
- Reference `currentSolutions.viable` for approved provider list
- Track `futureSolutions` for roadmap planning

### For Procurement

- Use `solutionLandscape.categories` to understand provider types
- Check segment viability before engaging vendors
- Review provider `gaps` for contract negotiation points

## Go API

```go
// Load compliance analysis
analysis, err := comply.LoadComplianceAnalysis("path/to/compliance-analysis.json")
if err != nil {
    log.Fatal(err)
}

// Access regulatory context
fmt.Println("Overview:", analysis.RegulatoryContext.Overview)

// Iterate market segments
for _, segment := range analysis.MarketSegments {
    fmt.Printf("Segment: %s (%s risk)\n", segment.Name, segment.RiskLevel)

    // Check viable solutions
    if segment.CurrentSolutions != nil {
        for _, sol := range segment.CurrentSolutions.Viable {
            fmt.Printf("  Viable: %s (zone: %s)\n", sol.SolutionID, sol.Zone)
        }
    }
}
```

## JSON Schema

The full JSON Schema is available at: `schema/compliance-analysis.schema.json`

Validate your analysis files:

```bash
# Using jsonschema CLI
jsonschema -i your-analysis.json schema/compliance-analysis.schema.json
```
