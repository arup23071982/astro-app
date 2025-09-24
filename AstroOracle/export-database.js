#!/usr/bin/env node

import { Pool } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

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
    return fileName;
  } catch (error) {
    console.error(`❌ Error exporting ${tableName}:`, error.message);
    return null;
  }
}

async function createDatabaseExport() {
  console.log('🚀 Starting Jai Guru Astro Remedy Database Export...\n');
  
  // Create export directory
  const exportDir = 'database_export';
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true });
  }
  fs.mkdirSync(exportDir);
  
  // Change to export directory
  process.chdir(exportDir);
  
  const exportedFiles = [];
  const exportSummary = {
    projectName: 'Jai Guru Astro Remedy',
    exportDate: new Date().toISOString(),
    totalTables: tables.length,
    exportedTables: [],
    totalRecords: 0
  };
  
  // Export each table
  for (const table of tables) {
    const fileName = await exportTableToJSON(table);
    if (fileName) {
      exportedFiles.push(fileName);
      
      // Get record count for summary
      try {
        const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        exportSummary.exportedTables.push({
          name: table,
          records: data.recordCount,
          file: fileName
        });
        exportSummary.totalRecords += data.recordCount;
      } catch (e) {
        console.error(`Error reading ${fileName}:`, e.message);
      }
    }
  }
  
  // Create export summary
  fs.writeFileSync('export_summary.json', JSON.stringify(exportSummary, null, 2));
  exportedFiles.push('export_summary.json');
  
  console.log(`\n📋 Export Summary:`);
  console.log(`• Total Tables: ${exportSummary.totalTables}`);
  console.log(`• Successfully Exported: ${exportSummary.exportedTables.length}`);
  console.log(`• Total Records: ${exportSummary.totalRecords}`);
  
  // Create README for the export
  const readmeContent = `# Jai Guru Astro Remedy - Database Export

## Export Information
- **Project**: Jai Guru Astro Remedy (Astrology Business Platform)
- **Export Date**: ${new Date().toLocaleString()}
- **Total Tables**: ${exportSummary.totalTables}
- **Total Records**: ${exportSummary.totalRecords}

## Database Structure

### User Management & Authentication
- \`users\` - Customer and admin accounts
- \`auth_sessions\` - User session management  
- \`otp_verifications\` - Phone verification codes
- \`mobile_number_changes\` - Phone number update logs

### Business Core Features
- \`consultations\` - Astrology consultation bookings
- \`courses\` - Educational astrology courses
- \`course_enrollments\` - Student course registrations
- \`products\` - Astrology products & remedies
- \`orders\` - Purchase transactions

### Communication Systems
- \`chat_messages\` - Consultation chat history
- \`support_chats\` - Customer support conversations
- \`support_chat_messages\` - Support chat details
- \`student_conversations\` - Educational discussions
- \`student_messages\` - Student communication logs

### Home Tuition Services
- \`home_tuition_courses\` - Available tuition programs
- \`home_tuition_applications\` - Tuition service requests

### Administrative
- \`notifications\` - System notifications
- \`audit_logs\` - System activity tracking
- \`security_events\` - Security monitoring
- \`legal_agreements\` - Terms and privacy policies
- \`faqs\` - Frequently asked questions
- \`user_contacts\` - Contact information management

## File Format
Each JSON file contains:
- \`table\`: Table name
- \`exportDate\`: When this table was exported
- \`recordCount\`: Number of records
- \`data\`: Array of table records

## Usage
Import these JSON files into any system that supports JSON data format.
Each table is self-contained with complete data structure.
`;
  
  fs.writeFileSync('README.md', readmeContent);
  exportedFiles.push('README.md');
  
  // Go back to parent directory
  process.chdir('..');
  
  // Create ZIP archive
  console.log('\n📦 Creating ZIP archive...');
  const zipFileName = `jai-guru-astro-database-${new Date().toISOString().split('T')[0]}.zip`;
  
  try {
    execSync(`zip -r "${zipFileName}" "${exportDir}"`, { stdio: 'inherit' });
    console.log(`✅ Database export completed successfully!`);
    console.log(`📁 ZIP File: ${zipFileName}`);
    console.log(`📂 Export Directory: ${exportDir}/`);
    
    // Show file size
    const stats = fs.statSync(zipFileName);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 ZIP Size: ${fileSizeInMB} MB`);
    
  } catch (error) {
    console.error('❌ Error creating ZIP file:', error.message);
    console.log(`📂 Individual files available in: ${exportDir}/`);
  }
  
  await pool.end();
}

// Run the export
createDatabaseExport().catch(console.error);