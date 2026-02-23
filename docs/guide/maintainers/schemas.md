# JSON Schemas

This reference documents the JSON schemas for compliance data files.

## Schema Files

| File | Purpose |
|------|---------|
| `schema/research-input.schema.json` | Research assistant input format |
| `schema/control-mapping.json` | Maps control names to CTL IDs |

## File Formats

### framework.json

```json
{
  "name": "Data Residency & Sovereignty",
  "version": "1.0.0",
  "description": "Cloud compliance requirements",
  "lastUpdated": "2025-05-01"
}
```

### jurisdictions.json

```json
[
  {
    "id": "EU",
    "name": "European Union",
    "type": "supranational",
    "memberIds": ["FR", "DE", "IT", "..."]
  },
  {
    "id": "FR",
    "name": "France",
    "type": "country",
    "iso3166": "FR",
    "parentId": "EU"
  }
]
```

### regulations.json

```json
[
  {
    "id": "FR-SECNUMCLOUD-3.2",
    "name": "SecNumCloud Security Visa",
    "shortName": "SecNumCloud 3.2",
    "jurisdictionId": "FR",
    "status": "enforceable",
    "effectiveDate": "2022-03-01",
    "officialUrl": "https://cyber.gouv.fr/..."
  }
]
```

### requirements.json

```json
[
  {
    "id": "CTL-LEGAL-001",
    "name": "Immunity from CLOUD Act",
    "description": "Provider must not be subject to US CLOUD Act",
    "regulationId": "FR-SECNUMCLOUD-3.2",
    "category": "legal-immunity",
    "severity": "critical",
    "keywords": ["cloud-act", "extraterritorial"]
  }
]
```

### solutions.json

```json
[
  {
    "id": "aws-commercial",
    "name": "AWS Commercial Cloud",
    "provider": "AWS",
    "type": "commercial",
    "certifications": ["ISO27001", "SOC2", "C5"],
    "jurisdictionIds": ["EU", "UK", "KSA"],
    "ownershipStructure": {
      "euOwnershipPercent": 0,
      "subjectToExtraTerritorialLaw": true,
      "controllingEntity": "Amazon.com Inc. (US)"
    }
  }
]
```

### mappings.json

```json
[
  {
    "id": "MAP-001",
    "requirementId": "CTL-LEGAL-001",
    "solutionId": "aws-commercial",
    "jurisdictionIds": ["FR", "EU"],
    "complianceLevel": "non-compliant",
    "zone": "red",
    "notes": "Subject to US CLOUD Act as US corporation",
    "evidence": ["https://..."],
    "assessmentDate": "2025-05-01"
  }
]
```

### zone-assignments.json

```json
[
  {
    "id": "ZONE-001",
    "solutionId": "aws-commercial",
    "jurisdictionId": "FR",
    "zone": "red",
    "dataCategory": "essential",
    "rationale": "US ownership violates SecNumCloud 24/39 rule"
  }
]
```

## Validation

Validate files with the CLI:

```bash
comply validate ./path/to/data
```

This checks:

- Valid JSON syntax
- Required fields present
- Referential integrity (requirements → regulations, mappings → solutions)
