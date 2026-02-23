# Understanding Compliance Zones

Compliance zones classify cloud solutions based on their suitability for different data sensitivity levels.

## Zone Definitions

### 🔴 Red Zone - Full Sovereignty Required

**Meaning:** US hyperscalers banned; only EU-owned sovereign providers allowed.

**When it applies:**

- French government data under SecNumCloud
- Essential Data requiring CLOUD Act immunity
- Critical infrastructure systems

**Acceptable solutions:**

- OVHcloud (SecNumCloud certified)
- Cloud Temple (SecNumCloud certified)
- Outscale (SecNumCloud certified)
- S3NS (SecNumCloud qualified, Dec 2025)

### 🟡 Yellow Zone - Trustee Model Acceptable

**Meaning:** US technology acceptable if operated by EU trustee with no US access.

**When it applies:**

- German financial services under DORA
- Data requiring operational controls without full ownership requirements
- Organizations willing to accept trustee oversight model

**Acceptable solutions:**

- T-Systems Sovereign Cloud (German trustee for Google)
- Bleu (French trustee for Microsoft)
- US hyperscalers with appropriate contractual controls

### 🟢 Green Zone - Commercial Cloud Acceptable

**Meaning:** Standard commercial cloud services acceptable with proper data protection controls.

**When it applies:**

- General B2B SaaS workloads
- Non-sensitive business data
- Data covered by SCCs and supplementary measures

**Acceptable solutions:**

- All providers with appropriate certifications (ISO 27001, SOC 2, etc.)
- AWS, Azure, Google Cloud with EU regions
- EU-native providers

## Zone Assignment Factors

Zones are assigned based on:

1. **Data classification** - Sensitivity level of the data
2. **Regulatory requirements** - Applicable regulations (SecNumCloud, DORA, etc.)
3. **Entity type** - Government, essential entity, financial services
4. **Jurisdiction** - Where the data subjects are located

## Viewing Zone Assignments

In the web viewer, the Zones tab shows which zone each solution falls into for each jurisdiction.

In the CLI:

```bash
comply list -dir ./examples/data-residency-sovereignty -type zones
```
