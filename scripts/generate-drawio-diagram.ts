import fs from "fs"
import path from "path"

// Define the model relationships
interface ModelRelationship {
  source: string
  target: string
  sourceField: string
  type: "one-to-one" | "one-to-many" | "many-to-many"
}

// Define the model fields
interface ModelField {
  name: string
  type: string
  required: boolean
  ref?: string
}

// Define the model structure
interface Model {
  name: string
  fields: ModelField[]
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

// Define the models with their key fields
const models: Model[] = [
  {
    name: "User",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "email", type: "String", required: true },
      { name: "password", type: "String", required: true },
      { name: "role", type: "UserRole", required: true },
      { name: "subscription", type: "Object", required: true },
    ],
  },
  {
    name: "Profile",
    fields: [
      { name: "user", type: "ObjectId", required: true, ref: "User" },
      { name: "title", type: "String", required: true },
      { name: "bio", type: "String", required: true },
      { name: "skills", type: "Array<String>", required: false },
      { name: "education", type: "Array<Object>", required: false },
      { name: "experience", type: "Array<Object>", required: false },
    ],
  },
  {
    name: "Job",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "company", type: "ObjectId", required: true, ref: "Company" },
      { name: "recruiter", type: "ObjectId", required: true, ref: "User" },
      { name: "description", type: "String", required: true },
      { name: "type", type: "JobType", required: true },
      { name: "status", type: "JobStatus", required: true },
    ],
  },
  {
    name: "Company",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "owner", type: "ObjectId", required: true, ref: "User" },
      { name: "description", type: "String", required: true },
      { name: "industry", type: "String", required: true },
      { name: "employees", type: "Array<ObjectId>", required: false, ref: "User" },
    ],
  },
  {
    name: "Application",
    fields: [
      { name: "job", type: "ObjectId", required: true, ref: "Job" },
      { name: "applicant", type: "ObjectId", required: true, ref: "User" },
      { name: "resume", type: "String", required: true },
      { name: "status", type: "ApplicationStatus", required: true },
    ],
  },
  {
    name: "CV",
    fields: [
      { name: "user", type: "ObjectId", required: true, ref: "User" },
      { name: "title", type: "String", required: true },
      { name: "template", type: "ObjectId", required: true, ref: "CVTemplate" },
      { name: "content", type: "Object", required: true },
    ],
  },
  {
    name: "CVTemplate",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "description", type: "String", required: true },
      { name: "htmlTemplate", type: "String", required: true },
      { name: "cssStyles", type: "String", required: true },
      { name: "creator", type: "ObjectId", required: true, ref: "User" },
    ],
  },
  {
    name: "Blog",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", required: true, ref: "User" },
      { name: "status", type: "String", required: true },
    ],
  },
  {
    name: "Report",
    fields: [
      { name: "type", type: "ReportType", required: true },
      { name: "reporter", type: "ObjectId", required: true, ref: "User" },
      { name: "targetId", type: "ObjectId", required: true },
      { name: "status", type: "ReportStatus", required: true },
    ],
  },
  {
    name: "Payment",
    fields: [
      { name: "user", type: "ObjectId", required: true, ref: "User" },
      { name: "amount", type: "Number", required: true },
      { name: "type", type: "PaymentType", required: true },
      { name: "status", type: "PaymentStatus", required: true },
    ],
  },
  {
    name: "Subscription",
    fields: [
      { name: "user", type: "ObjectId", required: true, ref: "User" },
      { name: "plan", type: "SubscriptionPlan", required: true },
      { name: "status", type: "SubscriptionStatus", required: true },
      { name: "features", type: "Array<Object>", required: true },
    ],
  },
  {
    name: "Notification",
    fields: [
      { name: "user", type: "ObjectId", required: true, ref: "User" },
      { name: "type", type: "NotificationType", required: true },
      { name: "title", type: "String", required: true },
      { name: "message", type: "String", required: true },
    ],
  },
  {
    name: "Message",
    fields: [
      { name: "sender", type: "ObjectId", required: true, ref: "User" },
      { name: "receiver", type: "ObjectId", required: true, ref: "User" },
      { name: "conversation", type: "ObjectId", required: true, ref: "Conversation" },
      { name: "content", type: "String", required: true },
    ],
  },
  {
    name: "Conversation",
    fields: [
      { name: "participants", type: "Array<ObjectId>", required: true, ref: "User" },
      { name: "lastMessage", type: "ObjectId", required: false, ref: "Message" },
      { name: "isActive", type: "Boolean", required: true },
    ],
  },
  {
    name: "Proposal",
    fields: [
      { name: "user", type: "ObjectId", required: true, ref: "User" },
      { name: "title", type: "String", required: true },
      { name: "client", type: "String", required: true },
      { name: "content", type: "String", required: true },
      { name: "status", type: "ProposalStatus", required: true },
    ],
  },
]

// Generate draw.io XML
function generateDrawIoXml(): string {
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<mxfile host="app.diagrams.net" modified="2023-05-24T12:00:00.000Z" agent="Mozilla/5.0" version="21.3.7">\n'
  xml += '  <diagram id="job-marketplace-schema" name="Job Marketplace Schema">\n'
  xml +=
    '    <mxGraphModel dx="1422" dy="798" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" background="#ffffff">\n'
  xml += "      <root>\n"
  xml += '        <mxCell id="0" />\n'
  xml += '        <mxCell id="1" parent="0" />\n'

  // Calculate positions
  const modelPositions: Record<string, { x: number; y: number }> = {}
  const columns = 4
  const columnWidth = 300
  const rowHeight = 250

  models.forEach((model, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    modelPositions[model.name] = {
      x: 50 + column * columnWidth,
      y: 50 + row * rowHeight,
    }
  })

  // Add model entities
  let cellId = 2 // Start from 2 as 0 and 1 are already used
  const modelCellIds: Record<string, number> = {}

  models.forEach((model) => {
    const position = modelPositions[model.name]
    modelCellIds[model.name] = cellId

    // Calculate height based on number of fields
    const height = 40 + model.fields.length * 20

    // Add entity
    xml += `        <mxCell id="${cellId}" value="${model.name}" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">\n`
    xml += `          <mxGeometry x="${position.x}" y="${position.y}" width="200" height="${height}" as="geometry" />\n`
    xml += "        </mxCell>\n"

    cellId++

    // Add fields
    model.fields.forEach((field) => {
      const requiredSymbol = field.required ? "*" : ""
      const refInfo = field.ref ? ` [${field.ref}]` : ""
      xml += `        <mxCell id="${cellId}" value="${field.name}: ${field.type}${requiredSymbol}${refInfo}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;" vertex="1" parent="${modelCellIds[model.name]}">\n`
      xml += '          <mxGeometry y="30" width="200" height="20" as="geometry" />\n'
      xml += "        </mxCell>\n"

      cellId++
    })
  })

  // Add relationships
  relationships.forEach((rel) => {
    const sourceId = modelCellIds[rel.source]
    const targetId = modelCellIds[rel.target]

    let edgeStyle = ""
    let startArrow = "none"
    let endArrow = "none"

    // Set arrow style based on relationship type
    if (rel.type === "one-to-many") {
      edgeStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
      startArrow = "none"
      endArrow = "ERmany"
    } else if (rel.type === "one-to-one") {
      edgeStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
      startArrow = "ERone"
      endArrow = "ERone"
    } else if (rel.type === "many-to-many") {
      edgeStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
      startArrow = "ERmany"
      endArrow = "ERmany"
    } else if (rel.type === "many-to-one") {
      edgeStyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
      startArrow = "ERmany"
      endArrow = "ERone"
    }

    xml += `        <mxCell id="${cellId}" value="${rel.sourceField}" style="${edgeStyle}startArrow=${startArrow};endArrow=${endArrow};endFill=0;startFill=0;" edge="1" parent="1" source="${sourceId}" target="${targetId}">\n`
    xml += '          <mxGeometry relative="1" as="geometry" />\n'
    xml += "        </mxCell>\n"

    cellId++
  })

  // Close XML
  xml += "      </root>\n"
  xml += "    </mxGraphModel>\n"
  xml += "  </diagram>\n"
  xml += "</mxfile>"

  return xml
}

// Main function to generate and save the diagram
function generateDiagram() {
  const xml = generateDrawIoXml()
  const outputPath = path.join(process.cwd(), "job-marketplace-schema.drawio")

  fs.writeFileSync(outputPath, xml)
  console.log(`Diagram saved to: ${outputPath}`)
}

// Execute the generator
generateDiagram()
