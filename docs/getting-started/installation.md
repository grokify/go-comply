# Installation

## CLI Tool

Install the `comply` CLI tool:

```bash
go install github.com/grokify/go-comply/cmd/comply@latest
```

Or build from source:

```bash
git clone https://github.com/grokify/go-comply.git
cd go-comply
go build -o comply ./cmd/comply
```

## Go Library

Add to your Go project:

```bash
go get github.com/grokify/go-comply
```

## Web Viewer

The web viewer requires no installation - it's a static HTML/JS application.

```bash
cd web
python3 -m http.server 8080
# Open http://localhost:8080
```

Or use any static file server (nginx, Caddy, GitHub Pages).

## Verify Installation

```bash
# Check CLI version
comply help

# Load example data
comply load ./examples/data-residency-sovereignty

# Run coverage analysis
comply coverage -dir ./examples/data-residency-sovereignty
```
