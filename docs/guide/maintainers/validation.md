# Data Validation

Ensure data integrity before publishing.

## CLI Validation

```bash
comply validate ./examples/data-residency-sovereignty
```

## Checks Performed

### Referential Integrity

- Requirements reference valid regulation IDs
- Mappings reference valid solution IDs
- Mappings reference valid requirement IDs
- Zone assignments reference valid jurisdiction IDs

### Required Fields

Each type has required fields:

| Type | Required Fields |
|------|-----------------|
| Jurisdiction | id, name, type |
| Regulation | id, name, jurisdictionId |
| Requirement | id, name, regulationId |
| Solution | id, name, provider, type |
| Mapping | id, requirementId, solutionId, complianceLevel |

## Common Errors

### Missing Regulation Reference

```
Requirement CTL-NEW-001 references unknown regulation: UNKNOWN-REG
```

Fix: Add the regulation to `regulations.json` or correct the `regulationId`.

### Invalid Solution Reference

```
Mapping MAP-099 references unknown solution: invalid-solution
```

Fix: Use a valid solution ID from `solutions.json`.

## Pre-Publish Checklist

1. ✅ `comply validate` passes
2. ✅ `comply coverage` shows expected statistics
3. ✅ Evidence URLs are accessible
4. ✅ Assessment dates are current
5. ✅ No duplicate mapping IDs
