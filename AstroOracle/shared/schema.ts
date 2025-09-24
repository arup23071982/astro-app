import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - Enhanced for comprehensive authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull().unique(),
  countryCode: text("country_code").notNull().default("+91"),
  whatsappNumber: text("whatsapp_number"),
  dateOfBirth: timestamp("date_of_birth"),
  timeOfBirth: text("time_of_birth"),
  placeOfBirth: text("place_of_birth"),
  
  // Verification status
  isVerified: boolean("is_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  emailVerified: boolean("email_verified").default(false),
  
  // Security fields
  isAdmin: boolean("is_admin").default(false),
  accountStatus: text("account_status").default("active"), // active, suspended, recovery_mode, frozen
  governmentId: text("government_id"), // Aadhaar/Passport for high-risk actions
  governmentIdType: text("government_id_type"), // aadhaar, passport, driving_license
  
  // Payment integration
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Preferences
  preferredLanguage: text("preferred_language").default("en"),
  notes: text("notes"),
  
  // Legal compliance
  termsAcceptedAt: timestamp("terms_accepted_at"),
  privacyAcceptedAt: timestamp("privacy_accepted_at"),
  disclaimerAcceptedAt: timestamp("disclaimer_accepted_at"),
  returnPolicyAcceptedAt: timestamp("return_policy_accepted_at"),
  marketingConsent: boolean("marketing_consent").default(false),
  dataProcessingConsent: boolean("data_processing_consent").default(false),
  
  // Security tracking
  lastLoginAt: timestamp("last_login_at"),
  lastLoginIp: text("last_login_ip"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lockoutUntil: timestamp("lockout_until"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OTP Verification table
export const otpVerifications = pgTable("otp_verifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  countryCode: text("country_code").notNull(),
  otp: text("otp").notNull(),
  purpose: text("purpose").notNull(), // registration, login, mobile_change, recovery
  isUsed: boolean("is_used").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  userId: uuid("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Contacts table for managing multiple contact methods
export const userContacts = pgTable("user_contacts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  contactType: text("contact_type").notNull(), // mobile, email, government_id
  contactValue: text("contact_value").notNull(),
  countryCode: text("country_code"), // for mobile numbers
  isVerified: boolean("is_verified").default(false),
  isPrimary: boolean("is_primary").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Security Events table for audit logging
export const securityEvents = pgTable("security_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  eventType: text("event_type").notNull(), // login_success, login_failed, password_change, mobile_change, etc.
  description: text("description").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceInfo: jsonb("device_info"),
  location: jsonb("location"), // geolocation data
  riskLevel: text("risk_level").default("low"), // low, medium, high, critical
  details: jsonb("details"), // additional event-specific data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Auth Sessions table for session management
export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  refreshToken: text("refresh_token").unique(),
  deviceId: text("device_id"),
  deviceInfo: jsonb("device_info"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mobile Number Changes table for security tracking
export const mobileNumberChanges = pgTable("mobile_number_changes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  oldPhoneNumber: text("old_phone_number").notNull(),
  oldCountryCode: text("old_country_code").notNull(),
  newPhoneNumber: text("new_phone_number").notNull(),
  newCountryCode: text("new_country_code").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected, expired
  requestedAt: timestamp("requested_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  holdingPeriodEnds: timestamp("holding_period_ends"), // 7-day holding period
  verificationMethod: text("verification_method"), // password_otp, security_questions, manual_review
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// Legal Agreements tracking
export const legalAgreements = pgTable("legal_agreements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  agreementType: text("agreement_type").notNull(), // terms_of_service, privacy_policy, disclaimer, return_policy
  version: text("version").notNull(), // version of the agreement
  acceptedAt: timestamp("accepted_at").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  consentMethod: text("consent_method").notNull(), // checkbox, digital_signature, verbal
});

// Consultations table
export const consultations = pgTable("consultations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: uuid("client_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // video, audio, chat, in-person
  consultationMode: text("consultation_mode").notNull(), // online, offline
  topics: jsonb("topics"), // Array of selected topics for topic-based consultations
  plan: text("plan").notNull(), // quick, focused, in-depth, comprehensive, topic-based
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").default("scheduled"), // scheduled, ongoing, completed, cancelled
  meetingId: text("meeting_id"),
  timerStarted: boolean("timer_started").default(false),
  timerStartTime: timestamp("timer_start_time"),
  timerEndTime: timestamp("timer_end_time"),
  actualDuration: integer("actual_duration"), // actual time spent in minutes
  notes: text("notes"),
  preConsultationNotes: text("pre_consultation_notes"), // Admin notes before consultation
  language: text("language").default("en"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  paymentId: text("payment_id"),
  location: text("location"), // For offline consultations - Kolkata Chamber
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxStudents: integer("max_students").default(100),
  currentStudents: integer("current_students").default(0),
  level: text("level").notNull(), // beginner, intermediate, expert
  teachingLanguage: text("teaching_language").default("en"),
  modules: jsonb("modules"), // Array of module objects
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course Enrollments table
export const courseEnrollments = pgTable("course_enrollments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  courseId: uuid("course_id").references(() => courses.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  progress: integer("progress").default(0), // percentage
  completedAt: timestamp("completed_at"),
  paymentStatus: text("payment_status").default("pending"),
  paymentId: text("payment_id"),
  notes: text("notes"),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // gemstones, yantras, malas, books, kits
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("INR"),
  images: jsonb("images"), // Array of image URLs
  stock: integer("stock").default(0),
  isActive: boolean("is_active").default(true),
  specifications: jsonb("specifications"),
  countryPricing: jsonb("country_pricing"), // Dynamic pricing by country
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: uuid("customer_id").references(() => users.id).notNull(),
  items: jsonb("items").notNull(), // Array of order items
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("INR"),
  status: text("status").default("pending"), // pending, paid, shipped, delivered, cancelled
  paymentStatus: text("payment_status").default("pending"),
  paymentId: text("payment_id"),
  shippingAddress: jsonb("shipping_address"),
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat Messages table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  consultationId: uuid("consultation_id").references(() => consultations.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // text, image, video, voice
  fileUrl: text("file_url"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Audit Logs table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // consultation, course, order, system
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
  phoneNumber: true,
  countryCode: true,
  whatsappNumber: true,
  dateOfBirth: true,
  timeOfBirth: true,
  placeOfBirth: true,
  preferredLanguage: true,
  termsAcceptedAt: true,
  privacyAcceptedAt: true,
  disclaimerAcceptedAt: true,
  returnPolicyAcceptedAt: true,
  marketingConsent: true,
  dataProcessingConsent: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).pick({
  clientId: true,
  type: true,
  consultationMode: true,
  topics: true,
  plan: true,
  duration: true,
  price: true,
  scheduledAt: true,
  notes: true,
  preConsultationNotes: true,
  language: true,
  location: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  price: true,
  maxStudents: true,
  level: true,
  teachingLanguage: true,
  modules: true,
  startDate: true,
  endDate: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  currency: true,
  images: true,
  stock: true,
  specifications: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerId: true,
  items: true,
  totalAmount: true,
  currency: true,
  shippingAddress: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  consultationId: true,
  senderId: true,
  message: true,
  messageType: true,
  fileUrl: true,
});

// FAQs table for AI chatbot
export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(), // consultation, courses, products, billing, technical, general
  keywords: text("keywords").array(), // Array of keywords for better matching
  priority: integer("priority").default(0), // Higher priority appears first in search
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support chats table for AI chatbot conversations
export const supportChats = pgTable("support_chats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(), // For tracking chat sessions
  userId: uuid("user_id").references(() => users.id), // null for anonymous users
  userEmail: text("user_email"), // For anonymous users
  userName: text("user_name"), // For anonymous users
  status: text("status").default("active"), // active, closed, escalated
  needsHumanSupport: boolean("needs_human_support").default(false),
  humanSupportRequested: boolean("human_support_requested").default(false),
  satisfactionRating: integer("satisfaction_rating"), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support chat messages
export const supportChatMessages = pgTable("support_chat_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  chatId: uuid("chat_id").references(() => supportChats.id).notNull(),
  message: text("message").notNull(),
  sender: text("sender").notNull(), // "user", "bot", "agent"
  messageType: text("message_type").default("text"), // text, image, file
  isHelpful: boolean("is_helpful"), // User feedback on bot responses
  relatedFaqId: uuid("related_faq_id").references(() => faqs.id), // If response came from FAQ
  createdAt: timestamp("created_at").defaultNow(),
});

// FAQ insert schema
export const insertFaqSchema = createInsertSchema(faqs).pick({
  question: true,
  answer: true,
  category: true,
  keywords: true,
  priority: true,
  isActive: true,
});

// Support chat insert schema
export const insertSupportChatSchema = createInsertSchema(supportChats).pick({
  sessionId: true,
  userId: true,
  userEmail: true,
  userName: true,
});

// Support chat message insert schema
export const insertSupportChatMessageSchema = createInsertSchema(supportChatMessages).pick({
  chatId: true,
  message: true,
  sender: true,
  messageType: true,
  isHelpful: true,
  relatedFaqId: true,
});

// Home Tuition Applications table
export const homeTuitionApplications = pgTable("home_tuition_applications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: uuid("applicant_id").references(() => users.id).notNull(),
  applicationType: text("application_type").notNull(), // "one_to_one", "group_learning"
  courseId: uuid("course_id").references(() => courses.id).notNull(),
  studentDetails: jsonb("student_details").notNull(), // Array of student objects with name, phone, email, etc.
  aadharCardUrls: jsonb("aadhar_card_urls").notNull(), // Array of uploaded Aadhar card file URLs
  birthDetails: jsonb("birth_details").notNull(), // Array of birth details for each student
  tuitionAddress: jsonb("tuition_address").notNull(), // Complete address where tuition will be conducted
  preferredTimings: jsonb("preferred_timings"), // Preferred schedule
  additionalNotes: text("additional_notes"),
  status: text("status").default("submitted"), // "submitted", "under_review", "interview_scheduled", "selected", "rejected", "admitted"
  interviewScheduledAt: timestamp("interview_scheduled_at"),
  interviewNotes: text("interview_notes"),
  selectionReason: text("selection_reason"),
  rejectionReason: text("rejection_reason"),
  admissionDate: timestamp("admission_date"),
  paymentStatus: text("payment_status").default("pending"), // "pending", "paid", "failed", "refunded"
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Home Tuition Courses table (separate from regular courses)
export const homeTuitionCourses = pgTable("home_tuition_courses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  oneToOnePrice: decimal("one_to_one_price", { precision: 10, scale: 2 }).notNull(),
  groupLearningPrice: decimal("group_learning_price", { precision: 10, scale: 2 }).notNull(),
  maxGroupSize: integer("max_group_size").default(5),
  duration: text("duration").notNull(), // "3 months", "6 months", etc.
  level: text("level").notNull(), // "beginner", "intermediate", "advanced"
  curriculum: jsonb("curriculum").notNull(), // Detailed course curriculum
  prerequisites: text("prerequisites"),
  availableSeats: integer("available_seats").default(10),
  occupiedSeats: integer("occupied_seats").default(0),
  isActive: boolean("is_active").default(true),
  applicationDeadline: timestamp("application_deadline"),
  courseStartDate: timestamp("course_start_date"),
  courseEndDate: timestamp("course_end_date"),
  coverageArea: text("coverage_area").default("Within 25km of Kolkata"),
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Messages table (Private messaging between admitted students and astrologer)
export const studentMessages = pgTable("student_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: uuid("conversation_id").notNull(), // Groups messages in a conversation
  studentId: uuid("student_id").references(() => users.id).notNull(),
  astrologerId: uuid("astrologer_id").references(() => users.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // "text", "image", "file", "voice"
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  priority: text("priority").default("normal"), // "low", "normal", "high", "urgent"
  replyToMessageId: uuid("reply_to_message_id"),
  isStarred: boolean("is_starred").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Conversations table (To track conversation metadata)
export const studentConversations = pgTable("student_conversations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  astrologerId: uuid("astrologer_id").references(() => users.id).notNull(),
  conversationId: uuid("conversation_id").notNull().unique(),
  subject: text("subject").notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  lastMessageBy: uuid("last_message_by").references(() => users.id),
  unreadCount: integer("unread_count").default(0),
  status: text("status").default("active"), // "active", "archived", "closed"
  priority: text("priority").default("normal"),
  tags: text("tags").array(), // Array of tags for categorization
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for new tables
export const insertHomeTuitionApplicationSchema = createInsertSchema(homeTuitionApplications).pick({
  applicantId: true,
  applicationType: true,
  courseId: true,
  studentDetails: true,
  aadharCardUrls: true,
  birthDetails: true,
  tuitionAddress: true,
  preferredTimings: true,
  additionalNotes: true,
});

export const insertHomeTuitionCourseSchema = createInsertSchema(homeTuitionCourses).pick({
  title: true,
  description: true,
  shortDescription: true,
  oneToOnePrice: true,
  groupLearningPrice: true,
  maxGroupSize: true,
  duration: true,
  level: true,
  curriculum: true,
  prerequisites: true,
  availableSeats: true,
  applicationDeadline: true,
  courseStartDate: true,
  courseEndDate: true,
  coverageArea: true,
  specialInstructions: true,
});

// Fix self-reference for proper typing
export const insertStudentMessageSchema = createInsertSchema(studentMessages).pick({
  conversationId: true,
  studentId: true,
  astrologerId: true,
  senderId: true,
  message: true,
  messageType: true,
  fileUrl: true,
  fileName: true,
  fileSize: true,
  priority: true,
  replyToMessageId: true,
});

export const insertStudentConversationSchema = createInsertSchema(studentConversations).pick({
  studentId: true,
  astrologerId: true,
  conversationId: true,
  subject: true,
  priority: true,
  tags: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertSupportChat = z.infer<typeof insertSupportChatSchema>;
export type SupportChat = typeof supportChats.$inferSelect;
export type InsertSupportChatMessage = z.infer<typeof insertSupportChatMessageSchema>;
export type SupportChatMessage = typeof supportChatMessages.$inferSelect;

// New home tuition and messaging types
export type InsertHomeTuitionApplication = z.infer<typeof insertHomeTuitionApplicationSchema>;
export type HomeTuitionApplication = typeof homeTuitionApplications.$inferSelect;
export type InsertHomeTuitionCourse = z.infer<typeof insertHomeTuitionCourseSchema>;
export type HomeTuitionCourse = typeof homeTuitionCourses.$inferSelect;
export type InsertStudentMessage = z.infer<typeof insertStudentMessageSchema>;
export type StudentMessage = typeof studentMessages.$inferSelect;
export type InsertStudentConversation = z.infer<typeof insertStudentConversationSchema>;
export type StudentConversation = typeof studentConversations.$inferSelect;

// New authentication-related types
export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertOtpVerification = typeof otpVerifications.$inferInsert;
export type UserContact = typeof userContacts.$inferSelect;
export type InsertUserContact = typeof userContacts.$inferInsert;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = typeof securityEvents.$inferInsert;
export type AuthSession = typeof authSessions.$inferSelect;
export type InsertAuthSession = typeof authSessions.$inferInsert;
export type MobileNumberChange = typeof mobileNumberChanges.$inferSelect;
export type InsertMobileNumberChange = typeof mobileNumberChanges.$inferInsert;
export type LegalAgreement = typeof legalAgreements.$inferSelect;
export type InsertLegalAgreement = typeof legalAgreements.$inferInsert;
