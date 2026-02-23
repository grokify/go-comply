# Requirements Reference

This reference documents the compliance requirements (controls) tracked in the framework.

## Control ID Format

Control IDs follow the pattern: `CTL-{CATEGORY}-{NUMBER}`

| Category | Description |
|----------|-------------|
| `LEGAL` | Legal immunity and corporate structure |
| `OWNER` | Ownership and control requirements |
| `DATA` | Data residency and localization |
| `ACCESS` | Access control and personnel |
| `ENCRYPT` | Encryption and key management |
| `SUPPLY` | Supply chain and vendor management |
| `INCIDENT` | Incident response and notification |
| `AUDIT` | Certification and audit requirements |
| `CONTRACT` | Contractual obligations |
| `EXIT` | Exit strategy and portability |

## Legal Immunity Controls

### CTL-LEGAL-001: Immunity from CLOUD Act

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud 3.2 |
| Severity | Critical |
| Category | legal-immunity |

Provider must not be subject to US CLOUD Act or other extraterritorial laws that could compel data disclosure.

**Assessment Criteria:**

- Provider's controlling entity is not US-based
- Provider is not a subsidiary of a US company
- No US investors with >39% ownership

### CTL-LEGAL-002: Immunity from FISA 702

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud 3.2 |
| Severity | Critical |
| Category | legal-immunity |

Provider must not be subject to FISA Section 702 surveillance authority.

## Ownership Controls

### CTL-OWNER-001: 24/39 Ownership Rule

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud 3.2 |
| Severity | Critical |
| Category | ownership |

At least 24% EU ownership with no single non-EU entity holding more than 39%.

**Assessment Criteria:**

- Calculate EU ownership percentage
- Identify largest non-EU shareholder
- Verify controlling entity location

### CTL-OWNER-002: EU Headquarters

| Field | Value |
|-------|-------|
| Regulation | EUCS (High) |
| Severity | High |
| Category | ownership |

Provider must be headquartered in the EU for high assurance level.

## Data Residency Controls

### CTL-DATA-001: EU Data Residency

| Field | Value |
|-------|-------|
| Regulation | GDPR, SecNumCloud |
| Severity | High |
| Category | data-residency |

Personal data must be stored and processed within the EU/EEA.

### CTL-DATA-002: France Data Residency

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud 3.2 |
| Severity | High |
| Category | data-residency |

For SecNumCloud qualification, data must be stored in France.

### CTL-DATA-003: KSA Data Localization

| Field | Value |
|-------|-------|
| Regulation | KSA PDPL |
| Severity | High |
| Category | data-residency |

Personal data of Saudi residents must be processed in Saudi Arabia.

## Access Control

### CTL-ACCESS-001: EU Personnel Only

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud 3.2 |
| Severity | High |
| Category | access-control |

Only EU-based personnel may have administrative access to customer data.

### CTL-ACCESS-002: Security Clearance

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud 3.2 |
| Severity | Medium |
| Category | personnel |

Personnel with privileged access must hold appropriate security clearances.

## Encryption Controls

### CTL-ENCRYPT-001: Customer-Controlled Keys

| Field | Value |
|-------|-------|
| Regulation | Multiple |
| Severity | High |
| Category | encryption |

Customer must be able to control encryption keys (BYOK/HYOK).

### CTL-ENCRYPT-002: EU Key Management

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud, EUCS |
| Severity | High |
| Category | encryption |

Key management systems must be located in the EU.

## Supply Chain Controls

### CTL-SUPPLY-001: NIS2 Supply Chain Security

| Field | Value |
|-------|-------|
| Regulation | NIS2 (Art 21) |
| Severity | High |
| Category | supply-chain |

Essential entities must assess security of their ICT supply chain.

### CTL-SUPPLY-002: DORA Third-Party Risk

| Field | Value |
|-------|-------|
| Regulation | DORA (Art 28) |
| Severity | High |
| Category | third-party-risk |

Financial entities must perform due diligence on ICT third-party service providers.

### CTL-SUPPLY-003: Concentration Risk

| Field | Value |
|-------|-------|
| Regulation | DORA |
| Severity | Medium |
| Category | third-party-risk |

Avoid over-reliance on single ICT service providers.

## Incident Response

### CTL-INCIDENT-001: 24-Hour Notification

| Field | Value |
|-------|-------|
| Regulation | NIS2 |
| Severity | High |
| Category | incident-response |

Early warning within 24 hours of significant incident detection.

### CTL-INCIDENT-002: 72-Hour Incident Report

| Field | Value |
|-------|-------|
| Regulation | NIS2, GDPR |
| Severity | High |
| Category | incident-response |

Full incident notification within 72 hours.

## Certification Controls

### CTL-AUDIT-001: SecNumCloud Certification

| Field | Value |
|-------|-------|
| Regulation | SecNumCloud 3.2 |
| Severity | Critical |
| Category | audit |

Provider must hold current SecNumCloud certification from ANSSI.

### CTL-AUDIT-002: C5 Attestation

| Field | Value |
|-------|-------|
| Regulation | DE-C5 |
| Severity | High |
| Category | audit |

Provider must have C5 attestation from BSI-approved auditor.

### CTL-AUDIT-003: ISO 27001 Certification

| Field | Value |
|-------|-------|
| Regulation | Multiple |
| Severity | Medium |
| Category | audit |

Provider must maintain ISO 27001 certification.

## Exit Strategy Controls

### CTL-EXIT-001: Data Portability

| Field | Value |
|-------|-------|
| Regulation | EU Data Act |
| Severity | High |
| Category | data-transfers |

Provider must enable data export in standard formats.

### CTL-EXIT-002: Cloud Switching

| Field | Value |
|-------|-------|
| Regulation | EU Data Act |
| Severity | Medium |
| Category | contract |

Provider must support migration to alternative providers.

### CTL-EXIT-003: Exit Strategy Documentation

| Field | Value |
|-------|-------|
| Regulation | DORA |
| Severity | High |
| Category | contract |

Financial entities must have documented exit strategies for critical ICT providers.

## AI Controls

### CTL-AI-001: High-Risk AI Compliance

| Field | Value |
|-------|-------|
| Regulation | EU AI Act |
| Severity | High |
| Category | ai-governance |

High-risk AI systems must meet transparency and oversight requirements.

### CTL-AI-002: Human Oversight

| Field | Value |
|-------|-------|
| Regulation | EU AI Act (Art 14) |
| Severity | High |
| Category | ai-governance |

High-risk AI systems must enable meaningful human oversight.
