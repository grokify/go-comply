# Executive Overview

The Executive Overview provides a high-level summary of compliance requirements by market segment and provider readiness assessment.

## Market Segments

The framework analyzes three market segments:

### Commercial Enterprises

General commercial companies operating in EMEA without sector-specific regulations.

| Characteristic | Details |
|----------------|---------|
| Industries | Retail, Manufacturing, Technology, Professional Services |
| Risk Level | Medium |
| Key Drivers | GDPR, NIS2, Data Act |

US hyperscalers (AWS, Azure, Google) are generally viable for this segment with proper data processing agreements.

### Highly Regulated Industries

Commercial enterprises in regulated sectors subject to additional oversight.

| Characteristic | Details |
|----------------|---------|
| Industries | Financial Services, Energy, Healthcare, Pharma, Telecommunications |
| Risk Level | High |
| Key Drivers | DORA, NIS2 Essential Entities, C5 |

DORA (financial services) imposes strict third-party risk management. Concentration risk rules may require multi-cloud strategies.

### Government & Public Sector

EMEA governmental agencies subject to strictest sovereignty requirements.

| Characteristic | Details |
|----------------|---------|
| Industries | Government, Defense, Public Administration, Law Enforcement |
| Risk Level | Critical |
| Key Drivers | SecNumCloud 3.2, EUCS, National Requirements |

French government mandates SecNumCloud certification, which US hyperscalers cannot achieve due to ownership structure and CLOUD Act exposure.

## Provider Readiness Matrix

The overview includes a provider readiness matrix showing:

| Column | Description |
|--------|-------------|
| Provider | Cloud provider name and solution ID |
| Type | commercial, govcloud, sovereign, national-partner |
| Commercial | Readiness for commercial segment |
| Regulated | Readiness for regulated industries |
| Government | Readiness for government workloads |
| EU Owned | Whether provider is EU-owned |
| CLOUD Act Immune | Whether provider is immune from US CLOUD Act |
| SecNumCloud | Certification status (Certified, Planned, Not eligible) |

## Status Values

| Status | Color | Meaning |
|--------|-------|---------|
| Ready | Green | Can serve this segment today |
| Partial | Yellow | Can serve with limitations or gaps |
| Planned | Yellow | Will be able to serve (with ETA) |
| Not Viable | Red | Cannot serve due to structural barriers |

## Key Findings

### US Hyperscalers (AWS, Azure, Google)

- **Commercial:** Ready - Full compliance with DPAs
- **Regulated:** Partial - Viable with concentration risk considerations
- **Government:** Not Viable - CLOUD Act exposure prevents certification

### EU Sovereign Providers (OVHcloud, Cloud Temple, Outscale)

- **Commercial:** Ready
- **Regulated:** Ready
- **Government:** Ready - SecNumCloud certified

### Joint Ventures (Bleu, S3NS)

- **Commercial:** Planned
- **Regulated:** Planned
- **Government:** Planned - Pursuing SecNumCloud certification

## Using the Overview

1. **Identify your segment** based on your industry and regulatory requirements
2. **Review key requirements** for your segment
3. **Assess provider readiness** using the matrix
4. **Drill down** to Mappings tab for detailed requirement-by-requirement analysis

## CLI Access

Query provider readiness programmatically:

```bash
# Load and display executive overview
comply overview -dir ./examples/data-residency-sovereignty

# Filter by segment
comply overview -dir ./examples/data-residency-sovereignty -segment government

# JSON output
comply overview -dir ./examples/data-residency-sovereignty -format json
```
