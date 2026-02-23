# Quick Start

Get up and running with Go-Comply in 5 minutes.

## 1. Install the CLI

```bash
go install github.com/grokify/go-comply/cmd/comply@latest
```

## 2. Explore Example Data

```bash
# Clone the repository
git clone https://github.com/grokify/go-comply.git
cd go-comply

# Load the example framework
comply load ./examples/data-residency-sovereignty
```

## 3. Query Compliance Mappings

```bash
# See all mappings for AWS
comply query -dir ./examples/data-residency-sovereignty -solution aws-commercial

# Filter to France jurisdiction
comply query -dir ./examples/data-residency-sovereignty -solution aws-commercial -jurisdiction FR
```

## 4. Analyze Coverage

```bash
# See what's documented vs missing
comply coverage -dir ./examples/data-residency-sovereignty
```

## 5. Browse in Web Viewer

```bash
cd web
python3 -m http.server 8080
# Open http://localhost:8080/?url=./data
```

## Next Steps

- [CLI Reference](../guide/developers/cli.md) - Full command documentation
- [Web Viewer Guide](../guide/compliance-officers/web-viewer.md) - Interactive browsing
- [Research Workflow](../guide/research/workflow.md) - Contributing compliance data
