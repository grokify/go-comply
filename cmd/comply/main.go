package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"slices"
	"strings"

	comply "github.com/grokify/go-comply"
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	switch os.Args[1] {
	case "load":
		cmdLoad(os.Args[2:])
	case "list":
		cmdList(os.Args[2:])
	case "query":
		cmdQuery(os.Args[2:])
	case "validate":
		cmdValidate(os.Args[2:])
	case "coverage":
		cmdCoverage(os.Args[2:])
	case "import-research":
		cmdImportResearch(os.Args[2:])
	case "help", "-h", "--help":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n", os.Args[1])
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println(`comply - Compliance Regulations Framework CLI

Usage:
  comply <command> [options]

Commands:
  load            Load and display a compliance framework from a directory
  list            List items of a specific type (regulations, requirements, solutions, etc.)
  query           Query mappings for a solution or requirement
  validate        Validate JSON files in a directory
  coverage        Analyze mapping coverage and data completeness
  import-research Convert research findings JSON to mappings format

Examples:
  comply load ./examples/minimal
  comply list -dir ./examples/minimal -type regulations
  comply query -dir ./examples/minimal -solution cloud-provider-a
  comply validate ./examples/minimal
  comply coverage -dir ./examples/minimal
  comply import-research -input research.json -output mappings-new.json`)
}

func cmdLoad(args []string) {
	if len(args) < 1 {
		fmt.Fprintln(os.Stderr, "Error: directory path required")
		os.Exit(1)
	}
	dir := args[0]

	cf, err := comply.LoadFrameworkFromDir(dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading framework: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Compliance Framework: %s (v%s)\n", cf.Name, cf.Version)
	if cf.Description != "" {
		fmt.Printf("Description: %s\n", cf.Description)
	}
	fmt.Printf("\nStatistics:\n")
	fmt.Printf("  Jurisdictions:    %d\n", len(cf.Jurisdictions))
	fmt.Printf("  Regulations:      %d\n", len(cf.Regulations))
	fmt.Printf("  Requirements:     %d\n", len(cf.Requirements))
	fmt.Printf("  Solutions:        %d\n", len(cf.Solutions))
	fmt.Printf("  Zone Assignments: %d\n", len(cf.ZoneAssignments))
	fmt.Printf("  Mappings:         %d\n", len(cf.Mappings))
	fmt.Printf("  Enforcement:      %d\n", len(cf.EnforcementAssessments))
}

func cmdList(args []string) {
	fs := flag.NewFlagSet("list", flag.ExitOnError)
	dir := fs.String("dir", ".", "Directory containing JSON files")
	itemType := fs.String("type", "", "Type to list (jurisdictions, regulations, requirements, solutions, mappings, zones, enforcement)")
	format := fs.String("format", "table", "Output format (table, json)")
	if err := fs.Parse(args); err != nil {
		os.Exit(1)
	}

	if *itemType == "" {
		fmt.Fprintln(os.Stderr, "Error: -type is required")
		os.Exit(1)
	}

	cf, err := comply.LoadFrameworkFromDir(*dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading framework: %v\n", err)
		os.Exit(1)
	}

	switch *itemType {
	case "jurisdictions":
		listJurisdictions(cf, *format)
	case "regulations":
		listRegulations(cf, *format)
	case "requirements":
		listRequirements(cf, *format)
	case "solutions":
		listSolutions(cf, *format)
	case "mappings":
		listMappings(cf, *format)
	case "zones":
		listZoneAssignments(cf, *format)
	case "enforcement":
		listEnforcement(cf, *format)
	default:
		fmt.Fprintf(os.Stderr, "Unknown type: %s\n", *itemType)
		os.Exit(1)
	}
}

func cmdQuery(args []string) {
	fs := flag.NewFlagSet("query", flag.ExitOnError)
	dir := fs.String("dir", ".", "Directory containing JSON files")
	solutionID := fs.String("solution", "", "Solution ID to query")
	requirementID := fs.String("requirement", "", "Requirement ID to query")
	jurisdictionID := fs.String("jurisdiction", "", "Filter by jurisdiction ID")
	format := fs.String("format", "table", "Output format (table, json)")
	if err := fs.Parse(args); err != nil {
		os.Exit(1)
	}

	if *solutionID == "" && *requirementID == "" {
		fmt.Fprintln(os.Stderr, "Error: -solution or -requirement is required")
		os.Exit(1)
	}

	cf, err := comply.LoadFrameworkFromDir(*dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading framework: %v\n", err)
		os.Exit(1)
	}

	var mappings []comply.RequirementMapping
	if *solutionID != "" {
		mappings = cf.GetMappingsForSolution(*solutionID)
	} else {
		mappings = cf.GetMappingsForRequirement(*requirementID)
	}

	// Filter by jurisdiction if specified
	if *jurisdictionID != "" {
		var filtered []comply.RequirementMapping
		for _, m := range mappings {
			if len(m.JurisdictionIDs) == 0 || slices.Contains(m.JurisdictionIDs, *jurisdictionID) {
				filtered = append(filtered, m)
			}
		}
		mappings = filtered
	}

	if *format == "json" {
		outputJSON(mappings)
		return
	}

	fmt.Printf("Found %d mappings\n\n", len(mappings))
	for _, m := range mappings {
		fmt.Printf("ID: %s\n", m.ID)
		fmt.Printf("  Requirement: %s\n", m.RequirementID)
		fmt.Printf("  Solution:    %s\n", m.SolutionID)
		fmt.Printf("  Compliance:  %s\n", m.ComplianceLevel)
		if m.Zone != "" {
			fmt.Printf("  Zone:        %s\n", m.Zone)
		}
		if len(m.JurisdictionIDs) > 0 {
			fmt.Printf("  Jurisdictions: %s\n", strings.Join(m.JurisdictionIDs, ", "))
		}
		if m.Notes != "" {
			fmt.Printf("  Notes:       %s\n", m.Notes)
		}
		fmt.Println()
	}
}

func cmdValidate(args []string) {
	if len(args) < 1 {
		fmt.Fprintln(os.Stderr, "Error: directory path required")
		os.Exit(1)
	}
	dir := args[0]

	cf, err := comply.LoadFrameworkFromDir(dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Validation failed: %v\n", err)
		os.Exit(1)
	}

	var errors []string

	// Validate regulation references
	regulationIDs := make(map[string]bool)
	for _, r := range cf.Regulations {
		regulationIDs[r.ID] = true
	}

	for _, req := range cf.Requirements {
		if req.RegulationID != "" && !regulationIDs[req.RegulationID] {
			errors = append(errors, fmt.Sprintf("Requirement %s references unknown regulation: %s", req.ID, req.RegulationID))
		}
	}

	// Validate solution references
	solutionIDs := make(map[string]bool)
	for _, s := range cf.Solutions {
		solutionIDs[s.ID] = true
	}

	requirementIDs := make(map[string]bool)
	for _, r := range cf.Requirements {
		requirementIDs[r.ID] = true
	}

	for _, m := range cf.Mappings {
		if !solutionIDs[m.SolutionID] {
			errors = append(errors, fmt.Sprintf("Mapping %s references unknown solution: %s", m.ID, m.SolutionID))
		}
		if !requirementIDs[m.RequirementID] {
			errors = append(errors, fmt.Sprintf("Mapping %s references unknown requirement: %s", m.ID, m.RequirementID))
		}
	}

	// Validate zone assignments
	jurisdictionIDs := make(map[string]bool)
	for _, j := range cf.Jurisdictions {
		jurisdictionIDs[j.ID] = true
	}

	for _, za := range cf.ZoneAssignments {
		if !solutionIDs[za.SolutionID] {
			errors = append(errors, fmt.Sprintf("Zone assignment %s references unknown solution: %s", za.ID, za.SolutionID))
		}
		if !jurisdictionIDs[za.JurisdictionID] {
			errors = append(errors, fmt.Sprintf("Zone assignment %s references unknown jurisdiction: %s", za.ID, za.JurisdictionID))
		}
	}

	if len(errors) > 0 {
		fmt.Println("Validation errors found:")
		for _, e := range errors {
			fmt.Printf("  - %s\n", e)
		}
		os.Exit(1)
	}

	fmt.Println("Validation passed!")
}

func listJurisdictions(cf *comply.ComplianceFramework, format string) {
	if format == "json" {
		outputJSON(cf.Jurisdictions)
		return
	}
	fmt.Printf("%-10s %-30s %-15s %s\n", "ID", "NAME", "TYPE", "PARENT")
	fmt.Println(strings.Repeat("-", 70))
	for _, j := range cf.Jurisdictions {
		fmt.Printf("%-10s %-30s %-15s %s\n", j.ID, j.Name, j.Type, j.ParentID)
	}
}

func listRegulations(cf *comply.ComplianceFramework, format string) {
	if format == "json" {
		outputJSON(cf.Regulations)
		return
	}
	fmt.Printf("%-20s %-15s %-15s %s\n", "ID", "SHORT NAME", "STATUS", "JURISDICTION")
	fmt.Println(strings.Repeat("-", 70))
	for _, r := range cf.Regulations {
		fmt.Printf("%-20s %-15s %-15s %s\n", r.ID, r.ShortName, r.Status, r.JurisdictionID)
	}
}

func listRequirements(cf *comply.ComplianceFramework, format string) {
	if format == "json" {
		outputJSON(cf.Requirements)
		return
	}
	fmt.Printf("%-30s %-20s %-10s %s\n", "ID", "REGULATION", "SEVERITY", "CATEGORY")
	fmt.Println(strings.Repeat("-", 80))
	for _, r := range cf.Requirements {
		fmt.Printf("%-30s %-20s %-10s %s\n", r.ID, r.RegulationID, r.Severity, r.Category)
	}
}

func listSolutions(cf *comply.ComplianceFramework, format string) {
	if format == "json" {
		outputJSON(cf.Solutions)
		return
	}
	fmt.Printf("%-25s %-15s %-15s %s\n", "ID", "PROVIDER", "TYPE", "NAME")
	fmt.Println(strings.Repeat("-", 80))
	for _, s := range cf.Solutions {
		fmt.Printf("%-25s %-15s %-15s %s\n", s.ID, s.Provider, s.Type, s.Name)
	}
}

func listMappings(cf *comply.ComplianceFramework, format string) {
	if format == "json" {
		outputJSON(cf.Mappings)
		return
	}
	fmt.Printf("%-35s %-25s %-15s %s\n", "REQUIREMENT", "SOLUTION", "COMPLIANCE", "ZONE")
	fmt.Println(strings.Repeat("-", 90))
	for _, m := range cf.Mappings {
		fmt.Printf("%-35s %-25s %-15s %s\n", m.RequirementID, m.SolutionID, m.ComplianceLevel, m.Zone)
	}
}

func listZoneAssignments(cf *comply.ComplianceFramework, format string) {
	if format == "json" {
		outputJSON(cf.ZoneAssignments)
		return
	}
	fmt.Printf("%-25s %-15s %-10s %s\n", "SOLUTION", "JURISDICTION", "ZONE", "DATA CATEGORY")
	fmt.Println(strings.Repeat("-", 70))
	for _, za := range cf.ZoneAssignments {
		fmt.Printf("%-25s %-15s %-10s %s\n", za.SolutionID, za.JurisdictionID, za.Zone, za.DataCategory)
	}
}

func listEnforcement(cf *comply.ComplianceFramework, format string) {
	if format == "json" {
		outputJSON(cf.EnforcementAssessments)
		return
	}
	fmt.Printf("%-15s %-20s %-12s %s\n", "JURISDICTION", "REGULATION", "LIKELIHOOD", "DATE")
	fmt.Println(strings.Repeat("-", 70))
	for _, ea := range cf.EnforcementAssessments {
		fmt.Printf("%-15s %-20s %-12s %s\n", ea.JurisdictionID, ea.RegulationID, ea.Likelihood, ea.AssessmentDate)
	}
}

func cmdCoverage(args []string) {
	fs := flag.NewFlagSet("coverage", flag.ExitOnError)
	dir := fs.String("dir", ".", "Directory containing JSON files")
	format := fs.String("format", "table", "Output format (table, json)")
	if err := fs.Parse(args); err != nil {
		os.Exit(1)
	}

	cf, err := comply.LoadFrameworkFromDir(*dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading framework: %v\n", err)
		os.Exit(1)
	}

	stats := calculateCoverage(cf)

	if *format == "json" {
		outputJSON(stats)
		return
	}

	printCoverageReport(stats)
}

// CoverageStats holds coverage statistics for the framework.
type CoverageStats struct {
	TotalRequirements   int                       `json:"totalRequirements"`
	TotalSolutions      int                       `json:"totalSolutions"`
	TotalMappings       int                       `json:"totalMappings"`
	MappingsWithEvidence int                      `json:"mappingsWithEvidence"`
	EvidencePercent     float64                   `json:"evidencePercent"`
	ByJurisdiction      map[string]JurisdictionCoverage `json:"byJurisdiction"`
}

// JurisdictionCoverage holds coverage stats for a specific jurisdiction.
type JurisdictionCoverage struct {
	JurisdictionID   string  `json:"jurisdictionId"`
	SolutionCount    int     `json:"solutionCount"`
	MaxCells         int     `json:"maxCells"`
	CoveredCells     int     `json:"coveredCells"`
	CoveragePercent  float64 `json:"coveragePercent"`
	WithEvidence     int     `json:"withEvidence"`
	EvidencePercent  float64 `json:"evidencePercent"`
	MissingCells     int     `json:"missingCells"`
}

func calculateCoverage(cf *comply.ComplianceFramework) *CoverageStats {
	stats := &CoverageStats{
		TotalRequirements: len(cf.Requirements),
		TotalSolutions:    len(cf.Solutions),
		TotalMappings:     len(cf.Mappings),
		ByJurisdiction:    make(map[string]JurisdictionCoverage),
	}

	// Count mappings with evidence
	for _, m := range cf.Mappings {
		if len(m.Evidence) > 0 {
			stats.MappingsWithEvidence++
		}
	}
	if stats.TotalMappings > 0 {
		stats.EvidencePercent = float64(stats.MappingsWithEvidence) / float64(stats.TotalMappings) * 100
	}

	// Build solution-to-jurisdictions map
	solJurisdictions := make(map[string][]string)
	for _, s := range cf.Solutions {
		solJurisdictions[s.ID] = s.JurisdictionIDs
	}

	// Track covered cells per jurisdiction
	type cellKey struct {
		reqID string
		solID string
	}
	coveredByJur := make(map[string]map[cellKey]bool)
	evidenceByJur := make(map[string]map[cellKey]bool)

	for _, m := range cf.Mappings {
		hasEvidence := len(m.Evidence) > 0
		for _, jurID := range m.JurisdictionIDs {
			if coveredByJur[jurID] == nil {
				coveredByJur[jurID] = make(map[cellKey]bool)
				evidenceByJur[jurID] = make(map[cellKey]bool)
			}
			key := cellKey{m.RequirementID, m.SolutionID}
			coveredByJur[jurID][key] = true
			if hasEvidence {
				evidenceByJur[jurID][key] = true
			}
		}
	}

	// Calculate stats per jurisdiction
	mainJurisdictions := []string{"EU", "FR", "DE", "UK", "KSA"}
	for _, jurID := range mainJurisdictions {
		// Count solutions available in this jurisdiction
		var solsInJur []string
		for _, s := range cf.Solutions {
			if slices.Contains(s.JurisdictionIDs, jurID) {
				solsInJur = append(solsInJur, s.ID)
			}
		}

		maxCells := len(cf.Requirements) * len(solsInJur)
		coveredCells := len(coveredByJur[jurID])
		withEvidence := len(evidenceByJur[jurID])

		jc := JurisdictionCoverage{
			JurisdictionID:  jurID,
			SolutionCount:   len(solsInJur),
			MaxCells:        maxCells,
			CoveredCells:    coveredCells,
			MissingCells:    maxCells - coveredCells,
			WithEvidence:    withEvidence,
		}

		if maxCells > 0 {
			jc.CoveragePercent = float64(coveredCells) / float64(maxCells) * 100
		}
		if coveredCells > 0 {
			jc.EvidencePercent = float64(withEvidence) / float64(coveredCells) * 100
		}

		stats.ByJurisdiction[jurID] = jc
	}

	return stats
}

func printCoverageReport(stats *CoverageStats) {
	fmt.Println("=== Compliance Framework Coverage Report ===")
	fmt.Println()
	fmt.Println("Summary:")
	fmt.Printf("  Requirements:        %d\n", stats.TotalRequirements)
	fmt.Printf("  Solutions:           %d\n", stats.TotalSolutions)
	fmt.Printf("  Total Mappings:      %d\n", stats.TotalMappings)
	fmt.Printf("  With Evidence:       %d (%.1f%%)\n", stats.MappingsWithEvidence, stats.EvidencePercent)
	fmt.Println()

	fmt.Println("Coverage by Jurisdiction:")
	fmt.Println()
	fmt.Printf("%-8s %8s %8s %8s %10s %10s %10s\n",
		"JUR", "SOLS", "MAX", "COVERED", "COVERAGE%", "EVIDENCE", "EVIDENCE%")
	fmt.Println(strings.Repeat("-", 72))

	totalMax := 0
	totalCovered := 0
	totalEvidence := 0

	jurisdictionOrder := []string{"EU", "FR", "DE", "UK", "KSA"}
	for _, jurID := range jurisdictionOrder {
		jc, ok := stats.ByJurisdiction[jurID]
		if !ok {
			continue
		}
		fmt.Printf("%-8s %8d %8d %8d %9.1f%% %10d %9.1f%%\n",
			jc.JurisdictionID,
			jc.SolutionCount,
			jc.MaxCells,
			jc.CoveredCells,
			jc.CoveragePercent,
			jc.WithEvidence,
			jc.EvidencePercent)
		totalMax += jc.MaxCells
		totalCovered += jc.CoveredCells
		totalEvidence += jc.WithEvidence
	}

	fmt.Println(strings.Repeat("-", 72))
	overallCoverage := float64(0)
	overallEvidence := float64(0)
	if totalMax > 0 {
		overallCoverage = float64(totalCovered) / float64(totalMax) * 100
	}
	if totalCovered > 0 {
		overallEvidence = float64(totalEvidence) / float64(totalCovered) * 100
	}
	fmt.Printf("%-8s %8s %8d %8d %9.1f%% %10d %9.1f%%\n",
		"TOTAL", "-", totalMax, totalCovered, overallCoverage, totalEvidence, overallEvidence)
	fmt.Println()

	fmt.Println("Gap Analysis:")
	for _, jurID := range jurisdictionOrder {
		jc, ok := stats.ByJurisdiction[jurID]
		if !ok {
			continue
		}
		fmt.Printf("  %s: %d cells missing (%.1f%% gap)\n",
			jurID, jc.MissingCells, 100-jc.CoveragePercent)
	}
}

func cmdImportResearch(args []string) {
	fs := flag.NewFlagSet("import-research", flag.ExitOnError)
	inputFile := fs.String("input", "", "Input research JSON file")
	outputFile := fs.String("output", "", "Output mappings JSON file (default: stdout)")
	frameworkDir := fs.String("dir", "", "Framework directory for validation (optional)")
	analyze := fs.Bool("analyze", false, "Print analysis report instead of mappings")
	validate := fs.Bool("validate", false, "Validate research against framework")
	merge := fs.Bool("merge", false, "Merge with existing mappings (requires -dir)")
	format := fs.String("format", "table", "Output format (table, json)")
	if err := fs.Parse(args); err != nil {
		os.Exit(1)
	}

	if *inputFile == "" {
		fmt.Fprintln(os.Stderr, "Error: -input is required")
		os.Exit(1)
	}

	// Load research file using the comply package
	research, err := comply.LoadResearchInput(*inputFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading research file: %v\n", err)
		os.Exit(1)
	}

	// If analyzing, just print the analysis report
	if *analyze {
		analysis := research.Analyze()
		if *format == "json" {
			outputJSON(analysis)
		} else {
			fmt.Print(analysis.PrintReport())
		}
		return
	}

	// Load framework if specified for validation or merge
	var framework *comply.ComplianceFramework
	if *frameworkDir != "" {
		framework, err = comply.LoadFrameworkFromDir(*frameworkDir)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error loading framework: %v\n", err)
			os.Exit(1)
		}
	}

	// Validate if requested
	if *validate {
		if framework == nil {
			fmt.Fprintln(os.Stderr, "Error: -dir is required for validation")
			os.Exit(1)
		}
		result := research.Validate(framework)
		if *format == "json" {
			outputJSON(result)
		} else {
			printValidationResult(result)
		}
		if !result.Valid {
			os.Exit(1)
		}
		return
	}

	// Merge with existing mappings if requested
	if *merge {
		if framework == nil {
			fmt.Fprintln(os.Stderr, "Error: -dir is required for merge")
			os.Exit(1)
		}
		newMappings, updatedMappings, unchangedMappings := research.MergeWithMappings(framework.Mappings)

		fmt.Fprintf(os.Stderr, "Merge Summary:\n")
		fmt.Fprintf(os.Stderr, "  New mappings:       %d\n", len(newMappings))
		fmt.Fprintf(os.Stderr, "  Updated mappings:   %d\n", len(updatedMappings))
		fmt.Fprintf(os.Stderr, "  Unchanged mappings: %d\n", len(unchangedMappings))

		// Combine all mappings
		allMappings := make([]comply.RequirementMapping, 0, len(newMappings)+len(updatedMappings)+len(unchangedMappings))
		allMappings = append(allMappings, unchangedMappings...)
		allMappings = append(allMappings, updatedMappings...)
		allMappings = append(allMappings, newMappings...)

		if *outputFile != "" {
			output, err := json.MarshalIndent(allMappings, "", "  ")
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error encoding mappings: %v\n", err)
				os.Exit(1)
			}
			if err := os.WriteFile(*outputFile, output, 0644); err != nil {
				fmt.Fprintf(os.Stderr, "Error writing output file: %v\n", err)
				os.Exit(1)
			}
			fmt.Fprintf(os.Stderr, "Wrote %d mappings to %s\n", len(allMappings), *outputFile)
		} else if *format == "json" {
			outputJSON(allMappings)
		}
		return
	}

	// Default: convert to mappings
	mappings := research.ToMappings()

	// Output
	if *outputFile != "" {
		output, err := json.MarshalIndent(mappings, "", "  ")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error encoding mappings: %v\n", err)
			os.Exit(1)
		}
		if err := os.WriteFile(*outputFile, output, 0644); err != nil {
			fmt.Fprintf(os.Stderr, "Error writing output file: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("Wrote %d mappings to %s\n", len(mappings), *outputFile)
	} else if *format == "json" {
		outputJSON(mappings)
	} else {
		// Print summary in table format
		fmt.Printf("Research Import Summary\n")
		fmt.Printf("=======================\n")
		fmt.Printf("Research Date: %s\n", research.Metadata.ResearchDate)
		fmt.Printf("Researcher:    %s\n", research.Metadata.Researcher)
		fmt.Printf("Findings:      %d\n", len(research.Findings))
		fmt.Printf("\nUse -format json to output mappings JSON, or -output to write to file\n")
	}
}

func printValidationResult(result *comply.ValidationResult) {
	if result.Valid {
		fmt.Println("Validation PASSED")
	} else {
		fmt.Println("Validation FAILED")
	}
	fmt.Printf("Checked: %d findings\n\n", result.TotalChecked)

	if len(result.Errors) > 0 {
		fmt.Printf("Errors (%d):\n", len(result.Errors))
		for _, e := range result.Errors {
			fmt.Printf("  [%d] %s: %s", e.Index, e.Field, e.Message)
			if e.Value != "" {
				fmt.Printf(" (value: %s)", e.Value)
			}
			fmt.Println()
		}
		fmt.Println()
	}

	if len(result.Warnings) > 0 {
		fmt.Printf("Warnings (%d):\n", len(result.Warnings))
		// Group warnings by type to avoid repetition
		warningCounts := make(map[string]int)
		for _, w := range result.Warnings {
			key := fmt.Sprintf("%s: %s", w.Field, w.Message)
			warningCounts[key]++
		}
		for msg, count := range warningCounts {
			fmt.Printf("  %s (x%d)\n", msg, count)
		}
	}
}

func outputJSON(v any) {
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	if err := enc.Encode(v); err != nil {
		fmt.Fprintf(os.Stderr, "Error encoding JSON: %v\n", err)
		os.Exit(1)
	}
}
