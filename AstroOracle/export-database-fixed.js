#!/usr/bin/env node

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Fix WebSocket connection for Neon database
neonConfig.webSocketConstructor = ws;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// List of all your tables
const tables = [
  'auth_sessions',
  'consultations', 
  'course_enrollments',
  'courses',
  'home_tuition_applications',
  'legal_agreements',
  'faqs',
  'home_tuition_courses',
  'audit_logs',
  'notifications',
  'orders',
  'otp_verifications',
  'mobile_number_changes',
  'products',
  'student_conversations',
  'student_messages',
  'support_chats',
  'user_contacts',
  'chat_messages',
  'users',
  'security_events',
  'support_chat_messages'
];

async function exportTableToJSON(tableName) {
  console.log(`📊 Exporting table: ${tableName}...`);
  
  try {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    const jsonData = {
      table: tableName,
      exportDate: new Date().toISOString(),
      recordCount: result.rows.length,
      data: result.rows
    };
    
    const fileName = `${tableName}.json`;
    fs.writeFileSync(fileName, JSON.stringify(jsonData, null, 2));
    console.log(`✅ Exported ${result.rows.length} records from ${tableName}`);
    return { fileName, recordCount: result.rows.length };
  } catch (error) {
    console.error(`❌ Error exporting ${tableName}:`, error.message);
    return null;
  }
}

async function createDatabaseExport() {
  console.log('🚀 Starting Jai Guru Astro Remedy Database Export...\n');
  
  // Create export directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const exportDir = `astro-database-export-${timestamp}`;
  
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true });
  }
  fs.mkdirSync(exportDir);
  
  // Change to export directory
  process.chdir(exportDir);
  
  const exportedFiles = [];
  const exportSummary = {
    projectName: 'Jai Guru Astro Remedy',
    description: 'Complete astrology business platform database export',
    exportDate: new Date().toISOString(),
    totalTables: tables.length,
    exportedTables: [],
    totalRecords: 0
  };
  
  // Export each table
  for (const table of tables) {
    const result = await exportTableToJSON(table);
    if (result) {
      exportedFiles.push(result.fileName);
      
      exportSummary.exportedTables.push({
        name: table,
        records: result.recordCount,
        file: result.fileName
      });
      exportSummary.totalRecords += result.recordCount;
    }
  }
  
  // Create export summary
  fs.writeFileSync('export-summary.json', JSON.stringify(exportSummary, null, 2));
  exportedFiles.push('export-summary.json');
  
  console.log(`\n📋 Export Summary:`);
  console.log(`• Total Tables: ${exportSummary.totalTables}`);
  console.log(`• Successfully Exported: ${exportSummary.exportedTables.length}`);
  console.log(`• Total Records: ${exportSummary.totalRecords}`);
  
  // Create comprehensive README
  const readmeContent = `# Jai Guru Astro Remedy - Complete Database Export

## 🌟 Project Overview
**Jai Guru Astro Remedy** is a comprehensive astrology consultation platform built for Astrologer Arup Shastri's business. This export contains all business-critical data from the production database.

## 📊 Export Information
- **Export Date**: ${new Date().toLocaleString()}
- **Total Tables**: ${exportSummary.totalTables}
- **Total Records**: ${exportSummary.totalRecords}
- **Database Type**: PostgreSQL (Neon)
- **Format**: JSON per table

## 🗃️ Database Structure

### 👥 User Management & Authentication
- **\`users\`** - Customer accounts, admin profiles, birth details for readings
- **\`auth_sessions\`** - Active user sessions and authentication tracking  
- **\`otp_verifications\`** - Mobile phone verification codes (Twilio SMS)
- **\`mobile_number_changes\`** - Phone number update audit trail

### 🔮 Core Astrology Business
- **\`consultations\`** - Video/Audio/Chat/In-person consultation bookings
- **\`courses\`** - Astrology education courses and content
- **\`course_enrollments\`** - Student registrations and progress tracking
- **\`products\`** - Astrological remedies, gems, books for sale
- **\`orders\`** - E-commerce transactions and payment records

### 💬 Communication & Support
- **\`chat_messages\`** - Real-time consultation chat history
- **\`support_chats\`** - Customer service conversations  
- **\`support_chat_messages\`** - Detailed support interaction logs
- **\`student_conversations\`** - Educational discussion threads
- **\`student_messages\`** - Student-teacher communication logs

### 🏠 Home Tuition Services
- **\`home_tuition_courses\`** - Available in-home astrology courses
- **\`home_tuition_applications\`** - Service requests and scheduling

### 🔧 System Administration
- **\`notifications\`** - In-app notification system
- **\`audit_logs\`** - Complete system activity tracking
- **\`security_events\`** - Security monitoring and breach detection
- **\`legal_agreements\`** - Terms of service and privacy policies
- **\`faqs\`** - Customer frequently asked questions
- **\`user_contacts\`** - Customer contact information management

## 📁 File Structure
Each JSON file contains:
\`\`\`json
{
  "table": "table_name",
  "exportDate": "ISO timestamp", 
  "recordCount": "number of records",
  "data": [
    // Array of all table records
  ]
}
\`\`\`

## 🔄 Data Usage
- **Import**: Use with any JSON-compatible system
- **Backup**: Complete business data snapshot
- **Migration**: Ready for database restoration  
- **Analysis**: Business intelligence and reporting
- **Development**: Test data for development environments

## 🛡️ Data Privacy
This export contains sensitive customer data including:
- Personal information and birth details
- Communication history
- Payment records
- Authentication sessions

**Handle with appropriate security measures.**

## 📱 Platform Features Represented
- Multi-language support (50+ languages)
- Video/Audio consultations via Jitsi Meet
- PhonePe payment processing
- AI chatbot support (Gemini API)
- Mobile OTP verification (Twilio)
- Email notifications (AWS SES)
- Complete e-commerce functionality
- Real-time chat systems
- Admin dashboard analytics
- Home tuition booking system

---
*Generated by Jai Guru Astro Remedy Database Export System*
*Astrologer Arup Shastri's Digital Astrology Platform*
`;
  
  fs.writeFileSync('README.md', readmeContent);
  exportedFiles.push('README.md');
  
  // Create database schema documentation
  const schemaDoc = `# Database Schema Documentation

## Tables Overview (${exportSummary.exportedTables.length}/${exportSummary.totalTables} exported)

${exportSummary.exportedTables.map(table => 
  `### ${table.name}
- **Records**: ${table.records.toLocaleString()}
- **File**: ${table.file}
`).join('\n')}

## Record Distribution
${exportSummary.exportedTables
  .sort((a, b) => b.records - a.records)
  .map((table, i) => `${i + 1}. ${table.name}: ${table.records.toLocaleString()} records`)
  .join('\n')}

Total Records: **${exportSummary.totalRecords.toLocaleString()}**
`;

  fs.writeFileSync('SCHEMA.md', schemaDoc);
  exportedFiles.push('SCHEMA.md');
  
  // Go back to parent directory
  process.chdir('..');
  
  // Create compressed archive using tar.gz
  console.log('\n📦 Creating compressed archive...');
  const archiveName = `${exportDir}.tar.gz`;
  
  try {
    execSync(`tar -czf "${archiveName}" "${exportDir}"`, { stdio: 'inherit' });
    console.log(`\n✅ Database export completed successfully!`);
    console.log(`📁 Archive: ${archiveName}`);
    console.log(`📂 Directory: ${exportDir}/`);
    
    // Show file sizes
    const archiveStats = fs.statSync(archiveName);
    const archiveSizeInMB = (archiveStats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 Archive Size: ${archiveSizeInMB} MB`);
    
    // Show directory size
    const dirSize = execSync(`du -sh "${exportDir}"`, { encoding: 'utf8' }).trim().split('\t')[0];
    console.log(`📊 Uncompressed Size: ${dirSize}`);
    
    console.log(`\n🎉 Your complete Jai Guru Astro Remedy database is ready!`);
    console.log(`   ${exportSummary.totalRecords.toLocaleString()} records from ${exportSummary.exportedTables.length} tables`);
    
  } catch (error) {
    console.error('❌ Error creating archive:', error.message);
    console.log(`📂 Individual files available in: ${exportDir}/`);
  }
  
  await pool.end();
}

// Run the export with error handling
createDatabaseExport()
  .then(() => console.log('\n🏁 Export process completed!'))
  .catch(error => {
    console.error('\n💥 Export failed:', error.message);
    process.exit(1);
  });