# Job Marketplace Database Schema Diagrams

This directory contains scripts to generate various diagram formats for the Job Marketplace database schema.

## Available Diagram Formats

1. **draw.io XML** - Can be imported directly into draw.io for visualization and editing
2. **Mermaid ER Diagram** - Can be rendered in GitHub markdown or other Mermaid-compatible viewers
3. **JSON Schema** - A structured representation of the database schema
4. **DBML (Database Markup Language)** - Can be visualized on dbdiagram.io

## How to Generate Diagrams

### Prerequisites

Make sure you have Node.js and npm installed on your system.

### Install Dependencies

\`\`\`bash
npm install typescript ts-node @types/node --save-dev
\`\`\`

### Generate All Diagrams

\`\`\`bash
npx ts-node scripts/generate-all-diagrams.ts
\`\`\`

This will generate all diagram formats at once.

### Generate Individual Diagrams

To generate a specific diagram format:

\`\`\`bash
# For draw.io XML
npx ts-node scripts/generate-drawio-diagram.ts

# For Mermaid ER Diagram
npx ts-node scripts/generate-mermaid-diagram.ts

# For JSON Schema
npx ts-node scripts/generate-json-schema.ts

# For DBML
npx ts-node scripts/generate-dbml.ts
\`\`\`

## Using the Generated Diagrams

### draw.io XML

1. Open [draw.io](https://app.diagrams.net/)
2. Click on "Open Existing Diagram"
3. Select the generated `job-marketplace-schema.drawio` file

### Mermaid ER Diagram

1. Copy the content of `job-marketplace-schema.mermaid`
2. Paste it into a Mermaid-compatible viewer (like [Mermaid Live Editor](https://mermaid.live/))
3. Or include it in a GitHub markdown file between ````mermaid` tags

### JSON Schema

The `job-marketplace-schema.json` file can be used for documentation or imported into tools that support JSON schema visualization.

### DBML

1. Copy the content of `job-marketplace-schema.dbml`
2. Paste it into [dbdiagram.io](https://dbdiagram.io/d)
3. The diagram will be automatically rendered

## Customizing the Diagrams

You can customize the diagrams by modifying the corresponding generator scripts:

- `scripts/generate-drawio-diagram.ts` - For draw.io XML
- `scripts/generate-mermaid-diagram.ts` - For Mermaid ER Diagram
- `scripts/generate-json-schema.ts` - For JSON Schema
- `scripts/generate-dbml.ts` - For DBML

Each script contains model and relationship definitions that you can update to match your schema changes.
