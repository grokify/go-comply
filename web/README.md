# Go-Comply Web Viewer

A static HTML/JavaScript web application for visualizing Go-Comply compliance framework data.

## Features

- **Load from any URL**: Point to any directory containing Go-Comply JSON files
- **URL Parameters**: Load data automatically via `?url=` query parameter (like Swagger UI)
- **Filter & Search**: Filter by jurisdiction, regulation, solution, and compliance zone
- **Interactive Details**: Click any item to view full details in a modal
- **Responsive Design**: Works on desktop and mobile devices

## Usage

### Local Development

1. Start a local HTTP server in the `web` directory:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (with npx)
npx serve .

# Using Go
go run -m net/http -e 'http.ListenAndServe(":8080", http.FileServer(http.Dir(".")))'
```

2. Open `http://localhost:8080` in your browser

3. Enter the data URL (e.g., `./data` for local data, or a remote URL)

### GitHub Pages

1. Copy the `web` directory contents to your GitHub Pages repository
2. Copy your compliance data JSON files to a `data` subdirectory
3. Access via: `https://username.github.io/repo/?url=./data`

### URL Parameter

Load data automatically by adding the `url` parameter:

```
https://example.com/comply-viewer/?url=https://example.com/my-framework-data
https://example.com/comply-viewer/?url=./data
```

## Directory Structure

The data URL should point to a directory containing these JSON files:

```
data/
├── framework.json          # Framework metadata (optional)
├── jurisdictions.json      # Jurisdictions
├── regulations.json        # Regulations
├── requirements.json       # Requirements
├── solutions.json          # Solutions
├── mappings.json           # Requirement-solution mappings
├── zone-assignments.json   # Compliance zone assignments
├── entities.json           # Regulated entities (optional)
└── enforcement.json        # Enforcement assessments (optional)
```

All files are optional - the viewer will display whatever data is available.

## File Format

All files follow the Go-Comply JSON schema. See the main [README](../README.md) for the full data model.

### Example: framework.json

```json
{
  "name": "My Compliance Framework",
  "version": "1.0.0",
  "description": "Framework description",
  "lastUpdated": "2025-05-01"
}
```

### Example: regulations.json

```json
[
  {
    "id": "EU-GDPR",
    "name": "General Data Protection Regulation",
    "shortName": "GDPR",
    "jurisdictionId": "EU",
    "status": "enforceable",
    "description": "EU data protection regulation"
  }
]
```

## Compliance Zones

The viewer uses color-coded zones:

| Zone | Color | Meaning |
|------|-------|---------|
| Red | Red background | Banned/non-compliant |
| Yellow | Yellow background | Conditional/partial compliance |
| Green | Green background | Fully compliant |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Hosting Options

1. **GitHub Pages**: Free static hosting
2. **Netlify**: Free tier available
3. **Vercel**: Free tier available
4. **S3 + CloudFront**: AWS static hosting
5. **Any static file server**: nginx, Apache, Caddy, etc.

## CORS Considerations

When loading data from a different domain, the server must include CORS headers:

```
Access-Control-Allow-Origin: *
```

For GitHub Pages or most static hosts, this is handled automatically for JSON files.

## Customization

Edit `style.css` to customize:

- Color scheme (CSS variables in `:root`)
- Typography
- Layout and spacing
- Badge colors for different statuses

## Security

This is a read-only viewer that:

- Only fetches JSON data
- Does not execute any code from loaded data
- Has no backend or database
- Stores no user data
