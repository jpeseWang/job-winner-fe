import { execSync } from "child_process"
import path from "path"

// Execute all diagram generators
function generateAllDiagrams() {
  console.log("Generating all diagrams...")

  try {
    console.log("\nGenerating draw.io XML diagram...")
    execSync(`npx ts-node ${path.join(__dirname, "generate-drawio-diagram.ts")}`, { stdio: "inherit" })

    console.log("\nGenerating Mermaid diagram...")
    execSync(`npx ts-node ${path.join(__dirname, "generate-mermaid-diagram.ts")}`, { stdio: "inherit" })

    console.log("\nGenerating JSON schema...")
    execSync(`npx ts-node ${path.join(__dirname, "generate-json-schema.ts")}`, { stdio: "inherit" })

    console.log("\nGenerating DBML schema...")
    execSync(`npx ts-node ${path.join(__dirname, "generate-dbml.ts")}`, { stdio: "inherit" })

    console.log("\nAll diagrams generated successfully!")
  } catch (error) {
    console.error("Error generating diagrams:", error)
  }
}

// Execute the generator
generateAllDiagrams()
