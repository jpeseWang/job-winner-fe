import fs from "fs"
import path from "path"

// Define the model relationships
interface ModelRelationship {
  source: string
  target: string
  sourceField: string
  type: "one-to-one" | "one-to-many" | "many-to-many" | "many-to-one"
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

// Generate JSON schema
function generateJsonSchema() {
  const schema = {
    models,
    relationships,
  }

  return JSON.stringify(schema, null, 2)
}

// Main function to generate and save the schema
function generateSchema() {
  const json = generateJsonSchema()
  const outputPath = path.join(process.cwd(), "job-marketplace-schema.json")

  fs.writeFileSync(outputPath, json)
  console.log(`JSON schema saved to: ${outputPath}`)
}

// Execute the generator
generateSchema()
