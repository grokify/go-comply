# Reading Compliance Mappings

Compliance mappings show how well each cloud solution meets each regulatory requirement.

## Understanding the Heatmap

The Mappings tab displays a matrix:

- **Rows:** Compliance requirements (controls)
- **Columns:** Cloud solutions
- **Cells:** Compliance status for that combination

### Cell Colors

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 Green | Compliant | Fully meets requirement |
| 🟡 Yellow | Conditional/Partial | Meets with customer action or partial |
| 🔴 Red | Non-compliant/Banned | Does not meet or prohibited |
| ⬜ Gray | Unknown | No data available |

### Cell Details

Click any cell to see:

- **Compliance Level:** compliant, partial, conditional, non-compliant, banned
- **Zone:** red, yellow, or green
- **Notes:** Explanation of the status
- **Evidence:** Links to authoritative sources
- **ETA:** Expected availability date (for conditional status)

## Filtering by Jurisdiction

Different jurisdictions have different requirements. Use the jurisdiction tabs:

| Tab | Focus |
|-----|-------|
| EU | General EU regulations (GDPR, NIS2, DORA) |
| FR | France (SecNumCloud 3.2) |
| DE | Germany (BSI C5) |
| UK | United Kingdom (UK DPA) |
| KSA | Saudi Arabia (PDPL) |

## Interpreting Results

### Compliant (Green)

The provider officially meets this requirement:

- Has certification/attestation
- Published documentation confirms compliance
- Evidence URLs available

### Conditional (Yellow)

The provider can meet the requirement, but:

- Customer must enable specific features
- Additional configuration required
- Contractual addendum needed

### Non-Compliant (Red)

The provider does not meet this requirement:

- Structural issue (US ownership for SecNumCloud)
- Missing certification
- No regional availability

### Banned (Red)

The provider is explicitly prohibited:

- US hyperscalers cannot get SecNumCloud due to ownership rules
- CLOUD Act exposure prevents immunity claims

## CLI Query

Query mappings programmatically:

```bash
# All mappings for a solution
comply query -dir ./examples/data-residency-sovereignty -solution aws-commercial

# Filter by jurisdiction
comply query -dir ./examples/data-residency-sovereignty -solution aws-commercial -jurisdiction FR

# JSON output for processing
comply query -dir ./examples/data-residency-sovereignty -solution aws-commercial -format json
```
