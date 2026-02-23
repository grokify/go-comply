# Web Viewer Guide

The web viewer provides an interactive interface for browsing compliance data.

## Accessing the Viewer

### Local Development

```bash
cd web
python3 -m http.server 8080
# Open http://localhost:8080/?url=./data
```

### GitHub Pages

If deployed to GitHub Pages:

```
https://username.github.io/go-comply/?url=./data
```

## Interface Overview

### Tabs

| Tab | Description |
|-----|-------------|
| **Overview** | Framework summary and statistics |
| **Regulations** | Browse regulations by jurisdiction |
| **Requirements** | Browse requirements by category |
| **Solutions** | Browse cloud solutions and certifications |
| **Mappings** | Heatmap of solution-requirement compliance |
| **Zones** | Zone assignments by jurisdiction |

### Mappings Heatmap

The mappings tab shows a matrix of requirements × solutions:

- 🟢 **Green** - Compliant
- 🟡 **Yellow** - Conditional/Partial
- 🔴 **Red** - Non-compliant/Banned
- ⬜ **Gray** - No data

Click any cell to see details including:

- Compliance level
- Notes explaining the status
- Evidence URLs
- ETA for future compliance

### Filtering

Use the jurisdiction tabs to filter by region:

- **All** - Show all jurisdictions
- **EU** - European Union
- **FR** - France (SecNumCloud)
- **DE** - Germany (C5)
- **UK** - United Kingdom
- **KSA** - Saudi Arabia (PDPL)

## Loading Custom Data

The viewer can load data from any URL:

```
http://localhost:8080/?url=https://example.com/my-data
```

The URL should point to a directory containing:

- `framework.json`
- `jurisdictions.json`
- `regulations.json`
- `requirements.json`
- `solutions.json`
- `mappings.json`
- `zone-assignments.json` (optional)
- `enforcement.json` (optional)
