# Evidence Guidelines

Good evidence makes compliance claims credible and verifiable. This guide explains how to find and cite authoritative sources.

## Principles

1. **Primary sources over secondary** - Official provider pages > news articles > analyst reports
2. **Current over outdated** - Check publication dates; certifications expire
3. **Specific over general** - Link to exact compliance page, not homepage
4. **Multiple sources** - Cross-reference claims when possible

## Source Hierarchy

### Tier 1: Official Provider Documentation (Preferred)

| Source Type | Example |
|-------------|---------|
| Compliance portal | `https://aws.amazon.com/compliance/` |
| Trust center | `https://www.microsoft.com/en-us/trust-center` |
| Security whitepaper | `https://d1.awsstatic.com/whitepapers/...` |
| Certification page | `https://cloud.google.com/security/compliance/bsi-c5` |
| Official blog post | `https://aws.amazon.com/blogs/security/...` |

### Tier 2: Regulatory/Certification Bodies

| Source Type | Example |
|-------------|---------|
| ANSSI listings | SecNumCloud qualified providers |
| BSI C5 registry | German C5 attestations |
| ISO certification databases | ISO 27001 certificates |

### Tier 3: Authoritative Third Parties

| Source Type | Example |
|-------------|---------|
| EU official sources | EDPS decisions, ENISA guidance |
| Legal analysis | Law firm whitepapers on CLOUD Act |
| Industry groups | CISPE code of conduct |

### Tier 4: News and Analysis (Use Sparingly)

| Source Type | When to Use |
|-------------|-------------|
| Press releases | Announcing new certifications |
| Tech news | Launch dates, regional availability |
| Analyst reports | Market context (not compliance claims) |

## Finding Evidence

### For Certifications (C5, ISO 27001, SOC 2)

1. Go to provider's compliance/trust center
2. Find the specific certification page
3. Look for attestation reports or certificate numbers
4. Check scope and validity dates

**Example search**: `site:aws.amazon.com BSI C5 attestation`

### For Data Residency

1. Check provider's region documentation
2. Verify specific services available in region
3. Look for data residency commitments
4. Check for any exceptions (support access, etc.)

### For Sovereignty (CLOUD Act, FISA)

1. Look for provider statements on government access
2. Check legal entity structure (US parent company?)
3. Review trustee model documentation if applicable
4. Find legal analyses from reputable sources

## URL Best Practices

### Do

- ✅ Use permanent URLs when available
- ✅ Link to specific sections/pages
- ✅ Include date-stamped blog posts
- ✅ Use HTTPS URLs

### Don't

- ❌ Link to PDFs that require login
- ❌ Use URL shorteners
- ❌ Link to cached/archived versions (unless original is gone)
- ❌ Use marketing landing pages

## Examples

### Good Evidence

```json
"evidence": [
  "https://aws.amazon.com/compliance/bsi-c5/",
  "https://aws.amazon.com/blogs/security/aws-achieves-2025-c5-type-2-attestation-report-with-183-services-in-scope/"
]
```

Why it's good:

- Primary source (AWS official)
- Specific page (BSI C5, not general compliance)
- Dated blog post with details

### Weak Evidence

```json
"evidence": [
  "https://aws.amazon.com/",
  "https://techcrunch.com/2024/01/01/aws-gets-certification"
]
```

Why it's weak:

- Homepage, not specific
- News article instead of official source

## Documenting Missing Evidence

If evidence isn't available:

```json
{
  "status": "unknown",
  "notes": "No public documentation found for C5 attestation. Provider support contacted 2025-05-01.",
  "evidence": [],
  "confidence": "low"
}
```

## Updating Stale Evidence

Compliance certifications expire. When refreshing research:

1. Check if URLs still work
2. Verify certification dates are current
3. Update notes with latest attestation dates
4. Add new blog posts announcing renewals
