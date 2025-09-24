# Jai Guru Astro Remedy - Database Export

## Export Information
- **Project**: Jai Guru Astro Remedy (Astrology Business Platform)
- **Export Date**: 9/8/2025, 11:32:04 AM
- **Total Tables**: 22
- **Total Records**: 0

## Database Structure

### User Management & Authentication
- `users` - Customer and admin accounts
- `auth_sessions` - User session management  
- `otp_verifications` - Phone verification codes
- `mobile_number_changes` - Phone number update logs

### Business Core Features
- `consultations` - Astrology consultation bookings
- `courses` - Educational astrology courses
- `course_enrollments` - Student course registrations
- `products` - Astrology products & remedies
- `orders` - Purchase transactions

### Communication Systems
- `chat_messages` - Consultation chat history
- `support_chats` - Customer support conversations
- `support_chat_messages` - Support chat details
- `student_conversations` - Educational discussions
- `student_messages` - Student communication logs

### Home Tuition Services
- `home_tuition_courses` - Available tuition programs
- `home_tuition_applications` - Tuition service requests

### Administrative
- `notifications` - System notifications
- `audit_logs` - System activity tracking
- `security_events` - Security monitoring
- `legal_agreements` - Terms and privacy policies
- `faqs` - Frequently asked questions
- `user_contacts` - Contact information management

## File Format
Each JSON file contains:
- `table`: Table name
- `exportDate`: When this table was exported
- `recordCount`: Number of records
- `data`: Array of table records

## Usage
Import these JSON files into any system that supports JSON data format.
Each table is self-contained with complete data structure.
