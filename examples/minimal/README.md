# Minimal Example

This example demonstrates the basic data structures of go-comply with minimal sample data.

## Files

| File | Description |
|------|-------------|
| `jurisdictions.json` | Geographic regions and countries |
| `regulations.json` | Regulatory frameworks |
| `requirements.json` | Specific compliance requirements |
| `solutions.json` | Cloud/infrastructure solutions |
| `mappings.json` | Solution-to-requirement mappings |
| `zone-assignments.json` | Compliance zone classifications |

## Usage

```bash
# Load and validate
go run ./cmd/comply validate ./examples/minimal/

# Generate report
go run ./cmd/comply report ./examples/minimal/ -o report.md
```
