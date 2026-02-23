# Solutions Reference

This reference documents all cloud solutions included in the Data Residency & Sovereignty framework.

## Solution Types

| Type | Description | Example |
|------|-------------|---------|
| `commercial` | Standard commercial cloud | AWS Commercial, Azure Commercial |
| `govcloud` | Government-isolated cloud | AWS GovCloud, Azure Government |
| `sovereign` | Sovereignty-focused cloud | OVHcloud, AWS European Sovereign |
| `national-partner` | Operated by local partner | T-Systems Sovereign Cloud |
| `private` | Air-gapped/on-premises | Azure Sovereign Private |

## AWS Solutions

### AWS Commercial

| Field | Value |
|-------|-------|
| ID | `aws-commercial` |
| Provider | AWS |
| Type | commercial |
| Certifications | ISO27001, SOC2, C5 |
| CLOUD Act | Subject |

Standard AWS commercial cloud. Available in EU, UK, KSA regions.

**Ownership:**

- US-owned (Amazon.com Inc.)
- Subject to US CLOUD Act and FISA 702
- Cannot achieve SecNumCloud certification

### AWS GovCloud

| Field | Value |
|-------|-------|
| ID | `aws-govcloud` |
| Provider | AWS |
| Type | govcloud |
| Certifications | FedRAMP-High, ITAR, CJIS |
| CLOUD Act | Subject |

Isolated cloud for US government workloads. US-only availability.

### AWS European Sovereign Cloud

| Field | Value |
|-------|-------|
| ID | `aws-eu-sovereign` |
| Provider | AWS |
| Type | sovereign |
| Certifications | TBD |
| CLOUD Act | Subject (US ownership) |

Announced sovereign cloud for Europe. Operational controls in EU, but US ownership means CLOUD Act exposure remains.

## Microsoft Solutions

### Azure Commercial

| Field | Value |
|-------|-------|
| ID | `azure-commercial` |
| Provider | Microsoft |
| Type | commercial |
| Certifications | ISO27001, SOC2, C5 |
| CLOUD Act | Subject |

Standard Azure commercial cloud. Available in EU, UK, KSA regions.

### Azure Government

| Field | Value |
|-------|-------|
| ID | `azure-government` |
| Provider | Microsoft |
| Type | govcloud |
| Certifications | FedRAMP-High, CJIS, DoD-IL4 |
| CLOUD Act | Subject |

Isolated cloud for US government workloads. US-only availability.

### Bleu Cloud (Microsoft + Orange/Capgemini)

| Field | Value |
|-------|-------|
| ID | `bleu-cloud` |
| Provider | Bleu |
| Type | sovereign |
| Certifications | Pursuing SecNumCloud |
| CLOUD Act | Not subject |

French sovereign cloud joint venture. Microsoft provides technology under license; Orange and Capgemini operate the infrastructure. 100% EU-owned.

## Google Solutions

### Google Cloud Platform

| Field | Value |
|-------|-------|
| ID | `google-cloud` |
| Provider | Google |
| Type | commercial |
| Certifications | ISO27001, SOC2, C5 |
| CLOUD Act | Subject |

Standard Google Cloud commercial offering. Available in EU, UK regions.

### S3NS (Google + Thales)

| Field | Value |
|-------|-------|
| ID | `s3ns` |
| Provider | S3NS |
| Type | sovereign |
| Certifications | Pursuing SecNumCloud |
| CLOUD Act | Not subject |

French sovereign cloud joint venture between Google and Thales. 100% EU-owned, pursuing SecNumCloud certification.

### T-Systems Sovereign Cloud

| Field | Value |
|-------|-------|
| ID | `t-systems-sovereign` |
| Provider | T-Systems |
| Type | national-partner |
| Certifications | C5, ISO27001 |
| CLOUD Act | Not subject |

German sovereign cloud using Google technology. Operated by T-Systems (Deutsche Telekom). "German trustee model" provides CLOUD Act immunity.

## French Sovereign Providers

### OVHcloud

| Field | Value |
|-------|-------|
| ID | `ovhcloud` |
| Provider | OVHcloud |
| Type | sovereign |
| Certifications | SecNumCloud, ISO27001, HDS, C5 |
| CLOUD Act | Not subject |

French cloud provider with 100% EU ownership. SecNumCloud certified. Available across EU, UK.

### Cloud Temple

| Field | Value |
|-------|-------|
| ID | `cloud-temple` |
| Provider | Cloud Temple |
| Type | sovereign |
| Certifications | SecNumCloud, ISO27001, HDS |
| CLOUD Act | Not subject |

French sovereign cloud provider. SecNumCloud certified. Focus on government and healthcare sectors.

### Outscale (3DS Outscale)

| Field | Value |
|-------|-------|
| ID | `outscale` |
| Provider | Outscale |
| Type | sovereign |
| Certifications | SecNumCloud, ISO27001 |
| CLOUD Act | Not subject |

Cloud subsidiary of Dassault Systemes. SecNumCloud certified. Includes Cloud Gouvernemental offering.

### Scaleway

| Field | Value |
|-------|-------|
| ID | `scaleway` |
| Provider | Scaleway |
| Type | sovereign |
| Certifications | ISO27001, HDS |
| CLOUD Act | Not subject |

French cloud provider owned by Iliad Group. EU-owned with regions in France, Netherlands, Poland.

## Ownership Comparison

| Solution | EU Ownership | CLOUD Act | SecNumCloud Eligible |
|----------|--------------|-----------|---------------------|
| AWS Commercial | 0% | Yes | No |
| Azure Commercial | 0% | Yes | No |
| Google Cloud | 0% | Yes | No |
| AWS EU Sovereign | 0% | Yes | No |
| Bleu Cloud | 100% | No | Yes (pursuing) |
| S3NS | 100% | No | Yes (pursuing) |
| T-Systems | 100% | No | N/A (German) |
| OVHcloud | 100% | No | Yes (certified) |
| Cloud Temple | 100% | No | Yes (certified) |
| Outscale | 100% | No | Yes (certified) |
| Scaleway | 100% | No | Possible |
