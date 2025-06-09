import fs from "fs"
import path from "path"

// Define the model relationships
interface ModelRelationship {
  source: string
  target: string
  sourceField: string
  type: "one-to-one" | "one-to-many" | "many-to-many" | "many-to-one"
}

// Define the relationships between models
const relationships: ModelRelationship[] = [
  { source: "User", target: "Profile", sourceField: "user", type: "one-to-one" },
  { source: "User", target: "Job", sourceField: "recruiter", type: "one-to-many" },
  { source: "User", target: "Company", sourceField: "owner", type: "one-to-many" },
  { source: "User", target: "Application", sourceField: "applicant", type: "one-to-many" },
  { source: "User", target: "CV", sourceField: "user", type: "one-to-many" },
  { source: "User", target: "CVTemplate", sourceField: "creator", type: "one-to-many" },
  { source: "User", target: "Blog", sourceField: "author", type: "one-to-many" },
  { source: "User", target: "Report", sourceField: "reporter", type: "one-to-many" },
  { source: "User", target: "Payment", sourceField: "user", type: "one-to-many" },
  { source: "User", target: "Subscription", sourceField: "user", type: "one-to-one" },
  { source: "User", target: "Notification", sourceField: "user", type: "one-to-many" },
  { source: "User", target: "Message", sourceField: "sender", type: "one-to-many" },
  { source: "User", target: "Message", sourceField: "receiver", type: "one-to-many" },
  { source: "User", target: "Conversation", sourceField: "participants", type: "many-to-many" },
  { source: "User", target: "Proposal", sourceField: "user", type: "one-to-many" },
  { source: "Company", target: "Job", sourceField: "company", type: "one-to-many" },
  { source: "Job", target: "Application", sourceField: "job", type: "one-to-many" },
  { source: "CVTemplate", target: "CV", sourceField: "template", type: "one-to-many" },
  { source: "Message", target: "Conversation", sourceField: "conversation", type: "many-to-one" },
]

// Generate Mermaid ER diagram
function generateMermaidDiagram(): string {
  let mermaid = "erDiagram\n"

  // Add relationships
  relationships.forEach((rel) => {
    let relationshipType = ""

    // Set relationship type based on relationship type
    if (rel.type === "one-to-many") {
      relationshipType = "1..n"
    } else if (rel.type === "one-to-one") {
      relationshipType = "1..1"
    } else if (rel.type === "many-to-many") {
      relationshipType = "n..n"
    } else if (rel.type === "many-to-one") {
      relationshipType = "n..1"
    }

    mermaid += `    "${rel.source}" ${relationshipType} "${rel.target}" : "${rel.sourceField}"\n`
  })

  return mermaid
}

// Main function to generate and save the diagram
function generateDiagram() {
  const mermaid = generateMermaidDiagram()
  const outputPath = path.join(process.cwd(), "job-marketplace-schema.mermaid")

  fs.writeFileSync(outputPath, mermaid)
  console.log(`Mermaid diagram saved to: ${outputPath}`)
}

// Execute the generator
generateDiagram()
