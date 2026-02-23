# Control Mapping Reference

This reference maps regulatory control names to our internal Control IDs (CTL-xxx).

## SecNumCloud 3.2

| Control Name | Control ID | Category |
|--------------|------------|----------|
| Data Storage Location - EU | `CTL-RESIDENCY-001` | data-residency |
| Data Processing Location - EU | `CTL-RESIDENCY-002` | data-residency |
| Privileged Access from EU Only | `CTL-ACCESS-001` | access-control |
| No Remote Access from Non-EU | `CTL-ACCESS-002` | access-control |
| Customer-Managed Encryption Keys | `CTL-ENCRYPTION-001` | encryption |
| Encryption Key Storage in EU | `CTL-ENCRYPTION-002` | encryption |
| EU/EEA Citizenship for Privileged Access | `CTL-STAFF-001` | personnel |
| Staff Located in EU for Support | `CTL-STAFF-002` | personnel |
| EU Majority Ownership (66%+) | `CTL-OWNERSHIP-001` | ownership |
| EU Headquarters and Governance | `CTL-OWNERSHIP-003` | ownership |
| Immunity from CLOUD Act | `CTL-LEGAL-001` | legal-immunity |
| Immunity from FISA 702 | `CTL-LEGAL-002` | legal-immunity |
| SecNumCloud Certification | `CTL-AUDIT-003` | audit |

## BSI C5 (Germany)

| Control Name | Control ID | Category |
|--------------|------------|----------|
| Independent Security Certification | `CTL-AUDIT-002` | audit |
| Data Location Transparency | `CTL-RESIDENCY-004` | data-residency |
| Customer Control Over Data Location | `CTL-RESIDENCY-005` | data-residency |
| Data Encrypted at Rest | `CTL-ENCRYPTION-004` | encryption |
| Data Encrypted in Transit | `CTL-ENCRYPTION-005` | encryption |
| Background Checks for Personnel | `CTL-STAFF-003` | personnel |

## DORA (EU)

| Control Name | Control ID | Category |
|--------------|------------|----------|
| Customer Approval for Provider Access (Art.28) | `CTL-ACCESS-004` | access-control |
| Concentration Risk Assessment (Art.29) | `CTL-THIRDPARTY-002` | third-party-risk |
| ICT Contractual Requirements (Art.30) | `CTL-CONTRACT-004` | contract |
| Critical ICT Provider Oversight (Art.31) | `CTL-THIRDPARTY-001` | third-party-risk |

## NIS2 (EU)

| Control Name | Control ID | Category |
|--------------|------------|----------|
| Supply Chain Security Assessment (Art.21) | `CTL-THIRDPARTY-003` | third-party-risk |
| Customer Access Logging and Audit (Art.21) | `CTL-ACCESS-003` | access-control |
| Incident Notification to Authority 24h (Art.23) | `CTL-INCIDENT-001` | incident-response |
| Incident Notification to Authority 72h (Art.23) | `CTL-INCIDENT-002` | incident-response |

## GDPR (EU)

| Control Name | Control ID | Category |
|--------------|------------|----------|
| SCCs for Third Country Transfers (Art.46) | `CTL-TRANSFER-001` | data-transfers |
| GDPR Breach Notification 72h (Art.33) | `CTL-INCIDENT-003` | incident-response |
| Sub-Processor Approval (Art.28) | `CTL-CONTRACT-003` | contract |

## Schrems II (EU)

| Control Name | Control ID | Category |
|--------------|------------|----------|
| Transfer Impact Assessment for US | `CTL-TRANSFER-002` | data-transfers |
| Supplementary Measures for US Transfers | `CTL-TRANSFER-003` | data-transfers |
| Provider Cannot Access Plaintext Without Customer | `CTL-ENCRYPTION-003` | encryption |
| Challenge Foreign Government Requests | `CTL-LEGAL-003` | legal-immunity |
| Transparency Report on Government Requests | `CTL-LEGAL-004` | legal-immunity |

## EU Data Act

| Control Name | Control ID | Category |
|--------------|------------|----------|
| Exit Strategy and Data Portability | `CTL-CONTRACT-001` | contract |
| Switching Period Maximum 30 Days | `CTL-CONTRACT-002` | contract |

## UK DPA 2018

| Control Name | Control ID | Category |
|--------------|------------|----------|
| UK International Data Transfer Agreement | `CTL-TRANSFER-004` | data-transfers |

## KSA PDPL

| Control Name | Control ID | Category |
|--------------|------------|----------|
| Data Storage Location - KSA | `CTL-RESIDENCY-003` | data-residency |
| KSA Cross-Border Transfer Approval | `CTL-TRANSFER-005` | data-transfers |

## Provider Name Mapping

When researching, map provider names to solution IDs:

| Provider Name | Solution ID |
|---------------|-------------|
| AWS | `aws-commercial` |
| AWS GovCloud | `aws-govcloud` |
| AWS European Sovereign Cloud | `aws-eu-sovereign` |
| Microsoft / Azure | `azure-commercial` |
| Azure Government | `azure-government` |
| Google / GCP | `google-cloud` |
| S3NS / Google+Thales | `s3ns` |
| T-Systems | `t-systems-sovereign` |
| Bleu / Orange+Capgemini | `bleu-cloud` |
| OVHcloud / OVH | `ovhcloud` |
| Cloud Temple | `cloud-temple` |
| Outscale / 3DS Outscale | `outscale` |
| Scaleway | `scaleway` |
