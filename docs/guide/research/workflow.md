# Research Workflow

This guide explains how research assistants can document compliance findings that feed into the mappings database.

## Overview

The research workflow converts compliance research into structured data:

```
Research → JSON Input → CLI Import → Mappings Database → Web Viewer
```

## Step 1: Understand the Data Model

Before researching, understand what you're documenting:

| Field | Description | Example |
|-------|-------------|---------|
| **Control ID** | Our internal requirement ID | `CTL-AUDIT-002` |
| **Solution ID** | Cloud provider identifier | `aws-commercial` |
| **Jurisdiction** | Where this applies | `EU`, `FR`, `DE` |
| **Status** | Compliance level | `compliant`, `banned` |
| **Evidence** | Authoritative source URLs | Official docs, certifications |

## Step 2: Research a Control

For each control-solution-jurisdiction combination:

1. **Find official documentation** - Provider compliance pages, certification documents
2. **Verify certification status** - Is it current? What scope?
3. **Note any conditions** - Customer configuration required? Limited scope?
4. **Capture evidence URLs** - Direct links to authoritative sources

### Example Research

Researching AWS BSI C5 compliance:

- ✅ Found: [AWS C5 compliance page](https://aws.amazon.com/compliance/bsi-c5/)
- ✅ Found: [AWS 2025 C5 attestation blog](https://aws.amazon.com/blogs/security/aws-achieves-2025-c5-type-2-attestation-report-with-183-services-in-scope/)
- 📝 Note: 183 services in scope, Type 2 attestation

## Step 3: Create Research Input JSON

Use the research input schema to structure your findings:

```json
{
  "metadata": {
    "researchDate": "2025-05-01",
    "researcher": "your-name"
  },
  "findings": [
    {
      "controlId": "CTL-AUDIT-002",
      "solutionId": "aws-commercial",
      "jurisdictionIds": ["EU", "DE", "UK"],
      "status": "compliant",
      "zone": "green",
      "notes": "BSI C5 Type 2 attestation (2025) with 183 services in scope.",
      "evidence": [
        "https://aws.amazon.com/compliance/bsi-c5/",
        "https://aws.amazon.com/blogs/security/aws-achieves-2025-c5-type-2-attestation-report-with-183-services-in-scope/"
      ],
      "confidence": "high"
    }
  ]
}
```

## Step 4: Validate and Import

Use the CLI to convert research to mappings:

```bash
# Preview the conversion
comply import-research -input my-research.json

# Save to file
comply import-research -input my-research.json -output new-mappings.json
```

## Step 5: Merge with Existing Data

The import creates new mapping entries. To add them to the database:

1. Review the generated mappings
2. Check for duplicates with existing `mappings.json`
3. Merge new entries (update IDs to avoid conflicts)
4. Validate with `comply validate`

## Status Reference

| Status | When to Use | Zone |
|--------|-------------|------|
| `compliant` | Fully meets requirement, certified | 🟢 green |
| `partial` | Meets some aspects, gaps exist | 🟡 yellow |
| `conditional` | Meets with customer action required | 🟡 yellow |
| `non-compliant` | Does not meet requirement | 🔴 red |
| `banned` | Explicitly prohibited (e.g., SecNumCloud for US providers) | 🔴 red |
| `unknown` | No information available | - |

## Evidence Guidelines

See [Evidence Guidelines](evidence.md) for best practices on finding and citing sources.

## Control ID Reference

See [Control Mapping](../../reference/control-mapping.md) for the full list of control IDs.
