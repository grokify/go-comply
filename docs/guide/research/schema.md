# Research Input Schema

The research input schema defines the format for submitting compliance findings.

## Schema Location

```
schema/research-input.schema.json
```

## Full Schema

```json
{
  "metadata": {
    "researchDate": "YYYY-MM-DD",
    "researcher": "string",
    "version": "string"
  },
  "findings": [
    {
      "regulationId": "string (optional)",
      "controlId": "CTL-xxx-nnn (required)",
      "controlName": "string (optional)",
      "solutionId": "string (required)",
      "jurisdictionIds": ["string"] (required),
      "status": "enum (required)",
      "zone": "enum (optional)",
      "notes": "string (required)",
      "evidence": ["url"] (optional),
      "eta": "string (optional)",
      "confidence": "enum (optional)"
    }
  ]
}
```

## Field Reference

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `researchDate` | date | Yes | Date research was conducted (YYYY-MM-DD) |
| `researcher` | string | No | Name or ID of researcher |
| `version` | string | No | Version of this submission |

### Finding Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `regulationId` | string | No | Regulation ID (e.g., `FR-SECNUMCLOUD-3.2`) |
| `controlId` | string | Yes | Control ID from requirements (e.g., `CTL-AUDIT-002`) |
| `controlName` | string | No | Human-readable control name |
| `solutionId` | string | Yes | Solution ID (see below) |
| `jurisdictionIds` | array | Yes | Jurisdiction IDs this applies to |
| `status` | enum | Yes | Compliance status |
| `zone` | enum | No | Compliance zone color |
| `notes` | string | Yes | Explanation of compliance status |
| `evidence` | array | No | URLs to authoritative sources |
| `eta` | string | No | Expected availability (e.g., "2026", "Q4 2026") |
| `confidence` | enum | No | Confidence level (high/medium/low) |

## Valid Values

### Solution IDs

```
aws-commercial
aws-govcloud
aws-eu-sovereign
azure-commercial
azure-government
bleu-cloud
google-cloud
s3ns
t-systems-sovereign
ovhcloud
cloud-temple
outscale
scaleway
```

### Jurisdiction IDs

```
EU, FR, DE, UK, KSA, NL, IT, ES, IE, SE
```

### Status Values

| Value | Description |
|-------|-------------|
| `compliant` | Fully meets requirement |
| `partial` | Partially meets requirement |
| `conditional` | Meets with additional measures |
| `non-compliant` | Does not meet requirement |
| `banned` | Explicitly prohibited |
| `unknown` | No information available |

### Zone Values

| Value | Color | Meaning |
|-------|-------|---------|
| `green` | 🟢 | Compliant, acceptable |
| `yellow` | 🟡 | Conditional, trustee model |
| `red` | 🔴 | Banned, non-compliant |

## Example

```json
{
  "metadata": {
    "researchDate": "2025-05-01",
    "researcher": "compliance-team"
  },
  "findings": [
    {
      "regulationId": "DE-C5",
      "controlId": "CTL-AUDIT-002",
      "controlName": "Independent Security Certification",
      "solutionId": "aws-commercial",
      "jurisdictionIds": ["EU", "DE", "UK"],
      "status": "compliant",
      "zone": "green",
      "notes": "BSI C5 Type 2 attestation (2025) with 183 services in scope.",
      "evidence": [
        "https://aws.amazon.com/compliance/bsi-c5/"
      ],
      "confidence": "high"
    },
    {
      "controlId": "CTL-RESIDENCY-003",
      "solutionId": "aws-commercial",
      "jurisdictionIds": ["KSA"],
      "status": "non-compliant",
      "zone": "red",
      "notes": "No KSA local region; served from Bahrain.",
      "evidence": [
        "https://aws.amazon.com/compliance/saudi-arabia/"
      ],
      "eta": "2026"
    }
  ]
}
```

## Validation

The schema is a JSON Schema draft 2020-12 file. Validate with:

```bash
# Using ajv-cli
npx ajv validate -s schema/research-input.schema.json -d my-research.json

# Or import with CLI (validates during import)
comply import-research -input my-research.json
```
