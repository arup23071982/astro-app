import { 
  type User, 
  type InsertUser, 
  type Consultation, 
  type InsertConsultation,
  type Course,
  type InsertCourse,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type ChatMessage,
  type InsertChatMessage,
  type CourseEnrollment,
  type Notification,
  type AuditLog,
  type Faq,
  type InsertFaq,
  type SupportChat,
  type InsertSupportChat,
  type SupportChatMessage,
  type InsertSupportChatMessage,
  type HomeTuitionApplication,
  type InsertHomeTuitionApplication,
  type HomeTuitionCourse,
  type InsertHomeTuitionCourse,
  type StudentMessage,
  type InsertStudentMessage,
  type StudentConversation,
  type InsertStudentConversation
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string, countryCode?: string): Promise<User | undefined>;
  getUserByUserId(userId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: string, stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(id: string, info: { customerId: string; subscriptionId: string }): Promise<User | undefined>;
  
  // OTP verification
  createOtpVerification(otp: { phoneNumber: string; countryCode: string; otp: string; purpose: string; userId?: string; ipAddress?: string; userAgent?: string }): Promise<any>;
  getOtpVerification(phoneNumber: string, countryCode: string, purpose: string): Promise<any | undefined>;
  verifyOtp(phoneNumber: string, countryCode: string, otp: string, purpose: string): Promise<boolean>;
  
  // Security events
  createSecurityEvent(event: { userId?: string; eventType: string; description: string; ipAddress?: string; userAgent?: string; riskLevel?: string; details?: any }): Promise<any>;
  
  // Auth sessions
  createAuthSession(session: { userId: string; token: string; refreshToken?: string; deviceId?: string; deviceInfo?: any; ipAddress?: string; userAgent?: string; expiresAt: Date }): Promise<any>;
  getAuthSession(token: string): Promise<any | undefined>;
  invalidateAuthSession(token: string): Promise<void>;
  
  // Legal agreements
  createLegalAgreement(agreement: { userId: string; agreementType: string; version: string; ipAddress?: string; userAgent?: string; consentMethod: string }): Promise<any>;
  
  // Consultation management
  getConsultation(id: string): Promise<Consultation | undefined>;
  getConsultationsByClient(clientId: string): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined>;
  getUpcomingConsultations(): Promise<Consultation[]>;
  
  // Course management
  getCourse(id: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getActiveCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined>;
  
  // Course enrollment
  enrollStudent(studentId: string, courseId: string): Promise<CourseEnrollment>;
  getStudentEnrollments(studentId: string): Promise<CourseEnrollment[]>;
  getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]>;
  updateEnrollmentProgress(id: string, progress: number): Promise<CourseEnrollment | undefined>;
  
  // Product management
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  
  // Order management
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  
  // Chat messages
  getChatMessages(consultationId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Notifications
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: { userId: string; title: string; message: string; type: string; actionUrl?: string }): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
  
  // Audit logs
  createAuditLog(log: { userId?: string; action: string; resourceType: string; resourceId?: string; details?: any; ipAddress?: string; userAgent?: string }): Promise<AuditLog>;
  
  // FAQ management
  getAllFaqs(): Promise<Faq[]>;
  getFaqsByCategory(category: string): Promise<Faq[]>;
  searchFaqs(query: string): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: string, updates: Partial<Faq>): Promise<Faq | undefined>;
  deleteFaq(id: string): Promise<boolean>;
  incrementFaqView(id: string): Promise<void>;
  rateFaqHelpful(id: string, isHelpful: boolean): Promise<void>;
  
  // Support chat management
  getSupportChat(sessionId: string): Promise<SupportChat | undefined>;
  createSupportChat(chat: InsertSupportChat): Promise<SupportChat>;
  updateSupportChat(id: string, updates: Partial<SupportChat>): Promise<SupportChat | undefined>;
  getSupportChatMessages(chatId: string): Promise<SupportChatMessage[]>;
  createSupportChatMessage(message: InsertSupportChatMessage): Promise<SupportChatMessage>;
  rateChatMessage(messageId: string, isHelpful: boolean): Promise<void>;
  
  // Home Tuition Course management
  getHomeTuitionCourse(id: string): Promise<HomeTuitionCourse | undefined>;
  getAllHomeTuitionCourses(): Promise<HomeTuitionCourse[]>;
  getActiveHomeTuitionCourses(): Promise<HomeTuitionCourse[]>;
  createHomeTuitionCourse(course: InsertHomeTuitionCourse): Promise<HomeTuitionCourse>;
  updateHomeTuitionCourse(id: string, updates: Partial<HomeTuitionCourse>): Promise<HomeTuitionCourse | undefined>;
  
  // Home Tuition Application management
  getHomeTuitionApplication(id: string): Promise<HomeTuitionApplication | undefined>;
  getHomeTuitionApplicationsByApplicant(applicantId: string): Promise<HomeTuitionApplication[]>;
  getHomeTuitionApplicationsByCourse(courseId: string): Promise<HomeTuitionApplication[]>;
  getAllHomeTuitionApplications(): Promise<HomeTuitionApplication[]>;
  getHomeTuitionApplicationsByStatus(status: string): Promise<HomeTuitionApplication[]>;
  createHomeTuitionApplication(application: InsertHomeTuitionApplication): Promise<HomeTuitionApplication>;
  updateHomeTuitionApplication(id: string, updates: Partial<HomeTuitionApplication>): Promise<HomeTuitionApplication | undefined>;
  
  // Student Communication management
  getStudentConversation(conversationId: string): Promise<StudentConversation | undefined>;
  getStudentConversationsByStudent(studentId: string): Promise<StudentConversation[]>;
  getStudentConversationsByAstrologer(astrologerId: string): Promise<StudentConversation[]>;
  createStudentConversation(conversation: InsertStudentConversation): Promise<StudentConversation>;
  updateStudentConversation(id: string, updates: Partial<StudentConversation>): Promise<StudentConversation | undefined>;
  
  getStudentMessages(conversationId: string): Promise<StudentMessage[]>;
  createStudentMessage(message: InsertStudentMessage): Promise<StudentMessage>;
  markStudentMessageAsRead(messageId: string): Promise<void>;
  getUnreadStudentMessagesCount(conversationId: string, userId: string): Promise<number>;
  markAllStudentMessagesAsRead(conversationId: string, userId: string): Promise<void>;
  getStudentMessagesByConversation(conversationId: string, limit?: number, offset?: number): Promise<StudentMessage[]>;
  
  // Order and Payment management
  getUserOrders(userId: string): Promise<Order[]>;
  getOrderByTransactionId(transactionId: string): Promise<Order | undefined>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;
  
  // Login and Authentication
  updateUserLoginInfo(userId: string, ipAddress?: string, userAgent?: string): Promise<void>;
  
  // OTP Verification specific methods
  createOtpVerification(otp: { id?: string; phoneNumber: string; countryCode: string; otp: string; purpose: string; isUsed?: boolean; expiresAt: Date; ipAddress?: string; userAgent?: string; createdAt?: Date }): Promise<any>;
  verifyOtp(phoneNumber: string, countryCode: string, otp: string, purpose: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private consultations: Map<string, Consultation>;
  private courses: Map<string, Course>;
  private courseEnrollments: Map<string, CourseEnrollment>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private chatMessages: Map<string, ChatMessage>;
  private notifications: Map<string, Notification>;
  private auditLogs: Map<string, AuditLog>;
  private faqs: Map<string, Faq>;
  private supportChats: Map<string, SupportChat>;
  private supportChatMessages: Map<string, SupportChatMessage>;
  
  // Home tuition and student communication
  private homeTuitionCourses: Map<string, HomeTuitionCourse>;
  private homeTuitionApplications: Map<string, HomeTuitionApplication>;
  private studentConversations: Map<string, StudentConversation>;
  private studentMessages: Map<string, StudentMessage>;
  private otpVerifications: Map<string, any>;
  private authSessions: Map<string, any>;
  private securityEvents: Map<string, any>;
  private legalAgreements: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.consultations = new Map();
    this.courses = new Map();
    this.courseEnrollments = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.chatMessages = new Map();
    this.notifications = new Map();
    this.auditLogs = new Map();
    this.faqs = new Map();
    this.supportChats = new Map();
    this.supportChatMessages = new Map();
    
    // Home tuition and student communication
    this.homeTuitionCourses = new Map();
    this.homeTuitionApplications = new Map();
    this.studentConversations = new Map();
    this.studentMessages = new Map();
    this.otpVerifications = new Map();
    this.authSessions = new Map();
    this.securityEvents = new Map();
    this.legalAgreements = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
    this.initializeSampleFAQs();
    this.initializeHomeTuitionData();
  }

  private initializeSampleData() {
    // Create admin user
    const adminUser: User = {
      id: randomUUID(),
      username: "arupshastri",
      email: "arup@jaiguruastroremedy.com",
      password: "$2b$10$8v0Eb6M4DnK//5e01KoxEuODs5c47suALGBShQPYFcHPHgFaR.lzi", // admin123
      fullName: "Arup Shastri",
      phoneNumber: "9999999999",
      countryCode: "+91",
      phoneVerified: true,
      emailVerified: true,
      whatsappNumber: "9999999999",
      dateOfBirth: null,
      timeOfBirth: null,
      placeOfBirth: "Kolkata, West Bengal, India",
      isVerified: true,
      isAdmin: true,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      preferredLanguage: "en",
      notes: "Master Astrologer with 18+ years of experience",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample courses
    const beginnerCourse: Course = {
      id: randomUUID(),
      title: "Astrology Fundamentals",
      description: "Perfect for beginners. Learn the basics of Vedic astrology, zodiac signs, houses, and planetary influences.",
      price: "15999",
      maxStudents: 100,
      currentStudents: 25,
      level: "beginner",
      teachingLanguage: "en",
      modules: [
        { title: "Introduction to Vedic Astrology", duration: 60, videoUrl: "", materials: [] },
        { title: "Understanding Zodiac Signs", duration: 90, videoUrl: "", materials: [] },
        { title: "Houses and Their Meanings", duration: 75, videoUrl: "", materials: [] }
      ],
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.set(beginnerCourse.id, beginnerCourse);

    // Create sample products
    const gemstoneProduct: Product = {
      id: randomUUID(),
      name: "Astrological Ruby Gemstone",
      description: "Authentic certified ruby gemstone for Sun planet remedy",
      category: "gemstones",
      price: "2500",
      currency: "INR",
      images: ["/api/placeholder/gemstone-ruby.jpg"],
      stock: 10,
      isActive: true,
      specifications: {
        weight: "3 carats",
        origin: "Burma",
        certification: "GIA Certified",
        treatment: "Natural, Unheated"
      },
      countryPricing: {
        "US": { price: "30", currency: "USD" },
        "UK": { price: "25", currency: "GBP" },
        "IN": { price: "2500", currency: "INR" }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(gemstoneProduct.id, gemstoneProduct);
  }

  private async initializeSampleFAQs() {
    const sampleFAQs = [
      // Consultation FAQs
      {
        question: "How do I book a consultation?",
        answer: "You can book a consultation by visiting our booking page and selecting your preferred consultation type (Video, Audio, Chat, or In-Person). Choose your date and time, then complete the payment to confirm your booking.",
        category: "consultation",
        keywords: ["book", "booking", "appointment", "schedule", "consultation"],
        priority: 10,
        isActive: true,
      },
      {
        question: "What are the different types of consultations available?",
        answer: "We offer 4 types of consultations: Video Call (₹2,500) for face-to-face sessions, Audio Call (₹1,800) for voice-only guidance, Chat Session (₹1,200) for text-based consultation, and In-Person (₹5,000) for traditional meetings at our Kolkata location.",
        category: "consultation",
        keywords: ["types", "video", "audio", "chat", "in-person", "price", "cost"],
        priority: 9,
        isActive: true,
      },
      {
        question: "How long does each consultation last?",
        answer: "Our consultations vary by plan: Quick Consultation (15 minutes), Focused Session (30 minutes), In-Depth Reading (60 minutes), and Comprehensive Analysis (90 minutes). Topic-based consultations are 6 minutes per topic.",
        category: "consultation",
        keywords: ["duration", "time", "length", "minutes", "how long"],
        priority: 8,
        isActive: true,
      },
      
      // Course FAQs
      {
        question: "What astrology courses do you offer?",
        answer: "We offer comprehensive Vedic astrology courses for all levels - Beginner, Intermediate, and Expert. Our courses cover birth chart analysis, planetary movements, remedial measures, and practical application of astrological principles.",
        category: "courses",
        keywords: ["courses", "learning", "vedic", "astrology", "beginner", "expert"],
        priority: 10,
        isActive: true,
      },
      {
        question: "Are the courses online or offline?",
        answer: "We offer both online and offline courses. Online courses provide flexibility to learn from anywhere, while offline courses offer direct interaction at our center in Kolkata. Both formats include comprehensive study materials.",
        category: "courses",
        keywords: ["online", "offline", "format", "location", "study"],
        priority: 7,
        isActive: true,
      },
      
      // Product FAQs
      {
        question: "What kind of products do you sell?",
        answer: "We offer authentic cosmic remedies including gemstones, yantras, rudraksha beads, spiritual books, and other astrological products. All items are energized and blessed for maximum effectiveness.",
        category: "products",
        keywords: ["products", "gemstones", "yantras", "rudraksha", "spiritual", "remedies"],
        priority: 8,
        isActive: true,
      },
      {
        question: "How do I know which gemstone is right for me?",
        answer: "The right gemstone depends on your birth chart analysis. We recommend booking a consultation first, where Arup Shastri will analyze your planetary positions and suggest the most suitable gemstones for your specific needs.",
        category: "products",
        keywords: ["gemstone", "birth chart", "suitable", "recommendation", "planetary"],
        priority: 9,
        isActive: true,
      },
      
      // Billing FAQs
      {
        question: "What payment methods do you accept?",
        answer: "We accept multiple payment methods including credit/debit cards, UPI, net banking, and digital wallets. For international clients, we also accept PayPal and Stripe payments.",
        category: "billing",
        keywords: ["payment", "methods", "card", "upi", "paypal", "stripe", "international"],
        priority: 7,
        isActive: true,
      },
      {
        question: "Is my payment secure?",
        answer: "Yes, all payments are processed through secure, encrypted gateways. We use industry-standard security measures and do not store your payment information on our servers.",
        category: "billing",
        keywords: ["secure", "payment", "safety", "encryption", "security"],
        priority: 6,
        isActive: true,
      },
      
      // Technical FAQs
      {
        question: "I'm having trouble joining my video consultation. What should I do?",
        answer: "For video consultation issues, please check your internet connection and browser. We recommend using Chrome or Firefox. If problems persist, you can switch to audio consultation or contact our technical support.",
        category: "technical",
        keywords: ["video", "trouble", "joining", "technical", "browser", "connection"],
        priority: 8,
        isActive: true,
      },
      {
        question: "Can I reschedule my consultation?",
        answer: "Yes, you can reschedule your consultation up to 24 hours before the scheduled time. Please contact us through the chat or call our support team to reschedule without any additional charges.",
        category: "consultation",
        keywords: ["reschedule", "change", "appointment", "24 hours", "cancel"],
        priority: 6,
        isActive: true,
      },
      
      // General FAQs
      {
        question: "Who is Astrologer Arup Shastri?",
        answer: "Arup Shastri is a renowned Vedic astrologer with 18+ years of experience. He has guided over 5000+ clients worldwide and specializes in Vedic astrology, palmistry, numerology, Vastu Shastra, and cosmic remedies.",
        category: "general",
        keywords: ["arup", "shastri", "astrologer", "experience", "background", "about"],
        priority: 10,
        isActive: true,
      },
      {
        question: "Do you provide services internationally?",
        answer: "Yes, we serve clients in 100+ countries worldwide. Our online consultations (video, audio, chat) are available globally. We also ship cosmic remedies and products internationally.",
        category: "general",
        keywords: ["international", "worldwide", "global", "countries", "shipping"],
        priority: 5,
        isActive: true,
      }
    ];

    for (const faqData of sampleFAQs) {
      await this.createFaq(faqData);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByPhone(phoneNumber: string, countryCode?: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => 
      user.phoneNumber === phoneNumber && 
      (!countryCode || user.countryCode === countryCode)
    );
  }

  async getUserByUserId(userId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === userId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      whatsappNumber: insertUser.whatsappNumber || null,
      dateOfBirth: insertUser.dateOfBirth || null,
      timeOfBirth: insertUser.timeOfBirth || null,
      placeOfBirth: insertUser.placeOfBirth || null,
      preferredLanguage: insertUser.preferredLanguage || "en",
      isVerified: false,
      isAdmin: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(id: string, stripeCustomerId: string): Promise<User | undefined> {
    return this.updateUser(id, { stripeCustomerId });
  }

  async updateUserStripeInfo(id: string, info: { customerId: string; subscriptionId: string }): Promise<User | undefined> {
    return this.updateUser(id, { 
      stripeCustomerId: info.customerId, 
      stripeSubscriptionId: info.subscriptionId 
    });
  }

  // Consultation methods
  async getConsultation(id: string): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async getConsultationsByClient(clientId: string): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(c => c.clientId === clientId);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      status: "scheduled",
      meetingId: null,
      notes: insertConsultation.notes || null,
      language: insertConsultation.language || "en",
      paymentStatus: "pending",
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation = { ...consultation, ...updates, updatedAt: new Date() };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  async getUpcomingConsultations(): Promise<Consultation[]> {
    const now = new Date();
    return Array.from(this.consultations.values())
      .filter(c => c.scheduledAt > now && c.status === "scheduled")
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  }

  // Course methods
  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getActiveCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(c => c.isActive);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      ...insertCourse,
      id,
      maxStudents: insertCourse.maxStudents || 100,
      currentStudents: 0,
      teachingLanguage: insertCourse.teachingLanguage || "en",
      modules: insertCourse.modules || null,
      startDate: insertCourse.startDate || null,
      endDate: insertCourse.endDate || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...updates, updatedAt: new Date() };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  // Course enrollment methods
  async enrollStudent(studentId: string, courseId: string): Promise<CourseEnrollment> {
    const id = randomUUID();
    const enrollment: CourseEnrollment = {
      id,
      studentId,
      courseId,
      enrolledAt: new Date(),
      progress: 0,
      completedAt: null,
      paymentStatus: "pending",
      paymentId: null,
      notes: null,
    };
    this.courseEnrollments.set(id, enrollment);
    return enrollment;
  }

  async getStudentEnrollments(studentId: string): Promise<CourseEnrollment[]> {
    return Array.from(this.courseEnrollments.values()).filter(e => e.studentId === studentId);
  }

  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    return Array.from(this.courseEnrollments.values()).filter(e => e.courseId === courseId);
  }

  async updateEnrollmentProgress(id: string, progress: number): Promise<CourseEnrollment | undefined> {
    const enrollment = this.courseEnrollments.get(id);
    if (!enrollment) return undefined;
    
    const updatedEnrollment = { 
      ...enrollment, 
      progress,
      completedAt: progress >= 100 ? new Date() : null
    };
    this.courseEnrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category && p.isActive);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      currency: insertProduct.currency || "INR",
      images: insertProduct.images || [],
      stock: insertProduct.stock || 0,
      specifications: insertProduct.specifications || null,
      countryPricing: insertProduct.countryPricing || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.customerId === customerId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      currency: insertOrder.currency || "INR",
      shippingAddress: insertOrder.shippingAddress || null,
      status: "pending",
      paymentStatus: "pending",
      paymentId: null,
      trackingNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Chat methods
  async getChatMessages(consultationId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.consultationId === consultationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Notification methods
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(notification: { userId: string; title: string; message: string; type: string; actionUrl?: string }): Promise<Notification> {
    const id = randomUUID();
    const newNotification: Notification = {
      ...notification,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      this.notifications.set(id, { ...notification, isRead: true });
    }
  }

  // Audit log methods
  async createAuditLog(log: { userId?: string; action: string; resourceType: string; resourceId?: string; details?: any; ipAddress?: string; userAgent?: string }): Promise<AuditLog> {
    const id = randomUUID();
    const auditLog: AuditLog = {
      ...log,
      id,
      timestamp: new Date(),
    };
    this.auditLogs.set(id, auditLog);
    return auditLog;
  }

  // FAQ methods
  async getAllFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values())
      .filter(faq => faq.isActive)
      .sort((a, b) => b.priority - a.priority);
  }

  async getFaqsByCategory(category: string): Promise<Faq[]> {
    return Array.from(this.faqs.values())
      .filter(faq => faq.isActive && faq.category === category)
      .sort((a, b) => b.priority - a.priority);
  }

  async searchFaqs(query: string): Promise<Faq[]> {
    const searchTerms = query.toLowerCase().split(' ');
    return Array.from(this.faqs.values())
      .filter(faq => {
        if (!faq.isActive) return false;
        const searchText = `${faq.question} ${faq.answer} ${faq.keywords?.join(' ') || ''}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      })
      .sort((a, b) => b.priority - a.priority);
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const id = randomUUID();
    const newFaq: Faq = {
      ...faq,
      id,
      viewCount: 0,
      helpfulCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.faqs.set(id, newFaq);
    return newFaq;
  }

  async updateFaq(id: string, updates: Partial<Faq>): Promise<Faq | undefined> {
    const faq = this.faqs.get(id);
    if (!faq) return undefined;
    
    const updatedFaq = { ...faq, ...updates, updatedAt: new Date() };
    this.faqs.set(id, updatedFaq);
    return updatedFaq;
  }

  async deleteFaq(id: string): Promise<boolean> {
    return this.faqs.delete(id);
  }

  async incrementFaqView(id: string): Promise<void> {
    const faq = this.faqs.get(id);
    if (faq) {
      this.faqs.set(id, { ...faq, viewCount: faq.viewCount + 1 });
    }
  }

  async rateFaqHelpful(id: string, isHelpful: boolean): Promise<void> {
    const faq = this.faqs.get(id);
    if (faq && isHelpful) {
      this.faqs.set(id, { ...faq, helpfulCount: faq.helpfulCount + 1 });
    }
  }

  // Support chat methods
  async getSupportChat(sessionId: string): Promise<SupportChat | undefined> {
    return Array.from(this.supportChats.values()).find(chat => chat.sessionId === sessionId);
  }

  async createSupportChat(chat: InsertSupportChat): Promise<SupportChat> {
    const id = randomUUID();
    const newChat: SupportChat = {
      ...chat,
      id,
      status: "active",
      needsHumanSupport: false,
      humanSupportRequested: false,
      satisfactionRating: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.supportChats.set(id, newChat);
    return newChat;
  }

  async updateSupportChat(id: string, updates: Partial<SupportChat>): Promise<SupportChat | undefined> {
    const chat = this.supportChats.get(id);
    if (!chat) return undefined;
    
    const updatedChat = { ...chat, ...updates, updatedAt: new Date() };
    this.supportChats.set(id, updatedChat);
    return updatedChat;
  }

  async getSupportChatMessages(chatId: string): Promise<SupportChatMessage[]> {
    return Array.from(this.supportChatMessages.values())
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createSupportChatMessage(message: InsertSupportChatMessage): Promise<SupportChatMessage> {
    const id = randomUUID();
    const newMessage: SupportChatMessage = {
      ...message,
      id,
      isHelpful: null,
      relatedFaqId: null,
      createdAt: new Date(),
    };
    this.supportChatMessages.set(id, newMessage);
    return newMessage;
  }

  async rateChatMessage(messageId: string, isHelpful: boolean): Promise<void> {
    const message = this.supportChatMessages.get(messageId);
    if (message) {
      this.supportChatMessages.set(messageId, { ...message, isHelpful });
    }
  }

  // OTP Verification methods
  async createOtpVerification(otpData: { 
    phoneNumber: string; 
    countryCode: string; 
    otp: string; 
    purpose: string; 
    userId?: string; 
    ipAddress?: string; 
    userAgent?: string 
  }): Promise<any> {
    const id = randomUUID();
    const verification = {
      id,
      ...otpData,
      isUsed: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date(),
    };
    this.otpVerifications.set(id, verification);
    return verification;
  }

  async getOtpVerification(phoneNumber: string, countryCode: string, purpose: string): Promise<any | undefined> {
    return Array.from(this.otpVerifications.values()).find(otp => 
      otp.phoneNumber === phoneNumber && 
      otp.countryCode === countryCode && 
      otp.purpose === purpose &&
      !otp.isUsed &&
      otp.expiresAt > new Date()
    );
  }

  async verifyOtp(phoneNumber: string, countryCode: string, otp: string, purpose: string): Promise<boolean> {
    const verification = await this.getOtpVerification(phoneNumber, countryCode, purpose);
    if (verification && verification.otp === otp) {
      verification.isUsed = true;
      this.otpVerifications.set(verification.id, verification);
      return true;
    }
    return false;
  }

  // Security Events methods
  async createSecurityEvent(eventData: { 
    userId?: string; 
    eventType: string; 
    description: string; 
    ipAddress?: string; 
    userAgent?: string; 
    riskLevel?: string; 
    details?: any 
  }): Promise<any> {
    const id = randomUUID();
    const event = {
      id,
      ...eventData,
      riskLevel: eventData.riskLevel || "low",
      timestamp: new Date(),
    };
    this.securityEvents.set(id, event);
    return event;
  }

  // Auth Sessions methods
  async createAuthSession(sessionData: { 
    userId: string; 
    token: string; 
    refreshToken?: string; 
    deviceId?: string; 
    deviceInfo?: any; 
    ipAddress?: string; 
    userAgent?: string; 
    expiresAt: Date 
  }): Promise<any> {
    const id = randomUUID();
    const session = {
      id,
      ...sessionData,
      isActive: true,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
    };
    this.authSessions.set(id, session);
    return session;
  }

  async getAuthSession(token: string): Promise<any | undefined> {
    return Array.from(this.authSessions.values()).find(session => 
      session.token === token && 
      session.isActive && 
      session.expiresAt > new Date()
    );
  }

  async invalidateAuthSession(token: string): Promise<void> {
    const session = await this.getAuthSession(token);
    if (session) {
      session.isActive = false;
      this.authSessions.set(session.id, session);
    }
  }

  // Legal Agreements methods
  async createLegalAgreement(agreementData: { 
    userId: string; 
    agreementType: string; 
    version: string; 
    ipAddress?: string; 
    userAgent?: string; 
    consentMethod: string 
  }): Promise<any> {
    const id = randomUUID();
    const agreement = {
      id,
      ...agreementData,
      acceptedAt: new Date(),
    };
    this.legalAgreements.set(id, agreement);
    return agreement;
  }

  // Initialize sample home tuition data
  private async initializeHomeTuitionData() {
    // Create sample home tuition courses
    const beginnerHomeTuition: HomeTuitionCourse = {
      id: randomUUID(),
      title: "Fundamental Astrology - Home Tuition",
      description: "Comprehensive one-on-one or group astrology learning at your home. Perfect for beginners who want personalized attention and flexible learning schedules.",
      shortDescription: "Learn astrology fundamentals at your home with personalized guidance",
      oneToOnePrice: "25000",
      groupLearningPrice: "18000",
      maxGroupSize: 4,
      duration: "3 months",
      level: "beginner",
      curriculum: [
        { module: "Introduction to Vedic Astrology", topics: ["History and principles", "Zodiac system", "Basic concepts"], duration: "2 weeks" },
        { module: "Understanding Planets", topics: ["9 Grahas", "Planetary influences", "Strengths and weaknesses"], duration: "3 weeks" },
        { module: "Houses and Signs", topics: ["12 Houses significance", "Zodiac signs", "House-sign combinations"], duration: "3 weeks" },
        { module: "Chart Reading Basics", topics: ["Birth chart construction", "Basic predictions", "Remedial measures"], duration: "4 weeks" }
      ],
      prerequisites: "No prior knowledge required. Basic English/Hindi reading ability.",
      availableSeats: 15,
      occupiedSeats: 3,
      isActive: true,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      courseStartDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      courseEndDate: new Date(Date.now() + 135 * 24 * 60 * 60 * 1000), // 135 days from now (3 months)
      coverageArea: "Within 25km of Kolkata city center",
      specialInstructions: "Students must arrange for a quiet study space. All study materials will be provided.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.homeTuitionCourses.set(beginnerHomeTuition.id, beginnerHomeTuition);

    const advancedHomeTuition: HomeTuitionCourse = {
      id: randomUUID(),
      title: "Advanced Astrology & Palmistry - Home Tuition",
      description: "Advanced level home tuition covering deep astrology, palmistry, and remedial astrology. Suitable for students with basic astrology knowledge.",
      shortDescription: "Advanced astrology and palmistry training at your home",
      oneToOnePrice: "40000",
      groupLearningPrice: "30000",
      maxGroupSize: 3,
      duration: "6 months",
      level: "advanced",
      curriculum: [
        { module: "Advanced Chart Analysis", topics: ["Divisional charts", "Dasha systems", "Transit analysis"], duration: "6 weeks" },
        { module: "Palmistry Fundamentals", topics: ["Hand types", "Major lines", "Minor lines", "Mounts"], duration: "8 weeks" },
        { module: "Predictive Astrology", topics: ["Time prediction", "Event timing", "Career analysis"], duration: "8 weeks" },
        { module: "Remedial Astrology", topics: ["Gemstone therapy", "Yantra therapy", "Mantra remedies"], duration: "6 weeks" }
      ],
      prerequisites: "Basic knowledge of astrology required. Must have completed beginner level or equivalent.",
      availableSeats: 8,
      occupiedSeats: 2,
      isActive: true,
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      courseStartDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      courseEndDate: new Date(Date.now() + 230 * 24 * 60 * 60 * 1000), // 6 months
      coverageArea: "Within 25km of Kolkata city center",
      specialInstructions: "Students should have their own palm prints ready for analysis practice.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.homeTuitionCourses.set(advancedHomeTuition.id, advancedHomeTuition);
  }

  // Home Tuition Course methods
  async getHomeTuitionCourse(id: string): Promise<HomeTuitionCourse | undefined> {
    return this.homeTuitionCourses.get(id);
  }

  async getAllHomeTuitionCourses(): Promise<HomeTuitionCourse[]> {
    return Array.from(this.homeTuitionCourses.values());
  }

  async getActiveHomeTuitionCourses(): Promise<HomeTuitionCourse[]> {
    return Array.from(this.homeTuitionCourses.values()).filter(c => c.isActive);
  }

  async createHomeTuitionCourse(insertCourse: InsertHomeTuitionCourse): Promise<HomeTuitionCourse> {
    const id = randomUUID();
    const course: HomeTuitionCourse = {
      ...insertCourse,
      id,
      maxGroupSize: insertCourse.maxGroupSize || 5,
      availableSeats: insertCourse.availableSeats || 10,
      occupiedSeats: 0,
      isActive: true,
      applicationDeadline: insertCourse.applicationDeadline || null,
      courseStartDate: insertCourse.courseStartDate || null,
      courseEndDate: insertCourse.courseEndDate || null,
      coverageArea: insertCourse.coverageArea || "Within 25km of Kolkata",
      specialInstructions: insertCourse.specialInstructions || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.homeTuitionCourses.set(id, course);
    return course;
  }

  async updateHomeTuitionCourse(id: string, updates: Partial<HomeTuitionCourse>): Promise<HomeTuitionCourse | undefined> {
    const course = this.homeTuitionCourses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...updates, updatedAt: new Date() };
    this.homeTuitionCourses.set(id, updatedCourse);
    return updatedCourse;
  }

  // Home Tuition Application methods
  async getHomeTuitionApplication(id: string): Promise<HomeTuitionApplication | undefined> {
    return this.homeTuitionApplications.get(id);
  }

  async getHomeTuitionApplicationsByApplicant(applicantId: string): Promise<HomeTuitionApplication[]> {
    return Array.from(this.homeTuitionApplications.values()).filter(app => app.applicantId === applicantId);
  }

  async getHomeTuitionApplicationsByCourse(courseId: string): Promise<HomeTuitionApplication[]> {
    return Array.from(this.homeTuitionApplications.values()).filter(app => app.courseId === courseId);
  }

  async getAllHomeTuitionApplications(): Promise<HomeTuitionApplication[]> {
    return Array.from(this.homeTuitionApplications.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getHomeTuitionApplicationsByStatus(status: string): Promise<HomeTuitionApplication[]> {
    return Array.from(this.homeTuitionApplications.values())
      .filter(app => app.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createHomeTuitionApplication(insertApplication: InsertHomeTuitionApplication): Promise<HomeTuitionApplication> {
    const id = randomUUID();
    const application: HomeTuitionApplication = {
      ...insertApplication,
      id,
      status: "submitted",
      interviewScheduledAt: null,
      interviewNotes: null,
      selectionReason: null,
      rejectionReason: null,
      admissionDate: null,
      paymentStatus: "pending",
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.homeTuitionApplications.set(id, application);
    return application;
  }

  async updateHomeTuitionApplication(id: string, updates: Partial<HomeTuitionApplication>): Promise<HomeTuitionApplication | undefined> {
    const application = this.homeTuitionApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, ...updates, updatedAt: new Date() };
    this.homeTuitionApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Student Communication methods
  async getStudentConversation(conversationId: string): Promise<StudentConversation | undefined> {
    return Array.from(this.studentConversations.values()).find(conv => conv.conversationId === conversationId);
  }

  async getStudentConversationsByStudent(studentId: string): Promise<StudentConversation[]> {
    return Array.from(this.studentConversations.values())
      .filter(conv => conv.studentId === studentId)
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }

  async getStudentConversationsByAstrologer(astrologerId: string): Promise<StudentConversation[]> {
    return Array.from(this.studentConversations.values())
      .filter(conv => conv.astrologerId === astrologerId)
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }

  async createStudentConversation(insertConversation: InsertStudentConversation): Promise<StudentConversation> {
    const id = randomUUID();
    const conversation: StudentConversation = {
      ...insertConversation,
      id,
      lastMessageAt: new Date(),
      lastMessageBy: null,
      unreadCount: 0,
      status: "active",
      priority: insertConversation.priority || "normal",
      tags: insertConversation.tags || [],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.studentConversations.set(id, conversation);
    return conversation;
  }

  async updateStudentConversation(id: string, updates: Partial<StudentConversation>): Promise<StudentConversation | undefined> {
    const conversation = this.studentConversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation = { ...conversation, ...updates, updatedAt: new Date() };
    this.studentConversations.set(id, updatedConversation);
    return updatedConversation;
  }

  async getStudentMessages(conversationId: string): Promise<StudentMessage[]> {
    return Array.from(this.studentMessages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createStudentMessage(insertMessage: InsertStudentMessage): Promise<StudentMessage> {
    const id = randomUUID();
    const message: StudentMessage = {
      ...insertMessage,
      id,
      messageType: insertMessage.messageType || "text",
      fileUrl: insertMessage.fileUrl || null,
      fileName: insertMessage.fileName || null,
      fileSize: insertMessage.fileSize || null,
      isRead: false,
      readAt: null,
      priority: insertMessage.priority || "normal",
      replyToMessageId: insertMessage.replyToMessageId || null,
      isStarred: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.studentMessages.set(id, message);

    // Update conversation's last message info
    const conversation = await this.getStudentConversation(insertMessage.conversationId);
    if (conversation) {
      await this.updateStudentConversation(conversation.id, {
        lastMessageAt: new Date(),
        lastMessageBy: insertMessage.senderId,
        unreadCount: conversation.unreadCount + 1,
      });
    }

    return message;
  }

  async markStudentMessageAsRead(messageId: string): Promise<void> {
    const message = this.studentMessages.get(messageId);
    if (message && !message.isRead) {
      const updatedMessage = { ...message, isRead: true, readAt: new Date() };
      this.studentMessages.set(messageId, updatedMessage);
    }
  }

  async getUnreadStudentMessagesCount(conversationId: string, userId: string): Promise<number> {
    return Array.from(this.studentMessages.values())
      .filter(msg => 
        msg.conversationId === conversationId && 
        msg.senderId !== userId && 
        !msg.isRead
      ).length;
  }

  async markAllStudentMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const messages = Array.from(this.studentMessages.values())
      .filter(msg => 
        msg.conversationId === conversationId && 
        msg.senderId !== userId && 
        !msg.isRead
      );

    for (const message of messages) {
      await this.markStudentMessageAsRead(message.id);
    }

    // Update conversation's unread count
    const conversation = await this.getStudentConversation(conversationId);
    if (conversation) {
      await this.updateStudentConversation(conversation.id, {
        unreadCount: 0,
      });
    }
  }

  async getStudentMessagesByConversation(conversationId: string, limit?: number, offset?: number): Promise<StudentMessage[]> {
    const messages = Array.from(this.studentMessages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (limit) {
      const start = offset || 0;
      return messages.slice(start, start + limit);
    }

    return messages;
  }

  // ================ NEW PAYMENT AND OTP METHODS ================

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.customerId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getOrderByTransactionId(transactionId: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => 
      order.id === transactionId || (order as any).transactionId === transactionId
    );
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (order) {
      const updatedOrder = {
        ...order,
        status: status as any,
        updatedAt: new Date(),
      };
      this.orders.set(orderId, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  async updateUserLoginInfo(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = {
        ...user,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress || null,
        lastLoginUserAgent: userAgent || null,
        updatedAt: new Date(),
      };
      this.users.set(userId, updatedUser);
    }
  }

  async createOtpVerification(otpData: {
    id?: string;
    phoneNumber: string;
    countryCode: string;
    otp: string;
    purpose: string;
    isUsed?: boolean;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    createdAt?: Date;
  }): Promise<any> {
    const otp = {
      id: otpData.id || randomUUID(),
      phoneNumber: otpData.phoneNumber,
      countryCode: otpData.countryCode,
      otp: otpData.otp,
      purpose: otpData.purpose,
      isUsed: otpData.isUsed || false,
      expiresAt: otpData.expiresAt,
      ipAddress: otpData.ipAddress,
      userAgent: otpData.userAgent,
      createdAt: otpData.createdAt || new Date(),
    };
    this.otpVerifications.set(otp.id, otp);
    return otp;
  }

  async verifyOtp(phoneNumber: string, countryCode: string, otp: string, purpose: string): Promise<any> {
    const otpRecord = Array.from(this.otpVerifications.values()).find(record =>
      record.phoneNumber === phoneNumber &&
      record.countryCode === countryCode &&
      record.otp === otp &&
      record.purpose === purpose &&
      !record.isUsed &&
      new Date() < new Date(record.expiresAt)
    );

    if (otpRecord) {
      // Mark OTP as used
      otpRecord.isUsed = true;
      this.otpVerifications.set(otpRecord.id, otpRecord);
      return otpRecord;
    }

    return null;
  }

  // Security and auth methods
  async createSecurityEvent(event: {
    userId?: string;
    eventType: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    riskLevel?: string;
    details?: any;
  }): Promise<any> {
    const securityEvent = {
      id: randomUUID(),
      userId: event.userId,
      eventType: event.eventType,
      description: event.description,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      riskLevel: event.riskLevel,
      details: event.details,
      createdAt: new Date(),
    };
    this.securityEvents.set(securityEvent.id, securityEvent);
    return securityEvent;
  }

  async createAuthSession(session: {
    userId: string;
    token: string;
    refreshToken?: string;
    deviceId?: string;
    deviceInfo?: any;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }): Promise<any> {
    const authSession = {
      id: randomUUID(),
      userId: session.userId,
      token: session.token,
      refreshToken: session.refreshToken,
      deviceId: session.deviceId,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      createdAt: new Date(),
    };
    this.authSessions.set(authSession.id, authSession);
    return authSession;
  }

  async getAuthSession(token: string): Promise<any | undefined> {
    return Array.from(this.authSessions.values()).find(session => session.token === token);
  }

  async invalidateAuthSession(token: string): Promise<void> {
    const session = Array.from(this.authSessions.values()).find(s => s.token === token);
    if (session) {
      this.authSessions.delete(session.id);
    }
  }

  async createLegalAgreement(agreement: {
    userId: string;
    agreementType: string;
    version: string;
    ipAddress?: string;
    userAgent?: string;
    consentMethod: string;
  }): Promise<any> {
    const legalAgreement = {
      id: randomUUID(),
      userId: agreement.userId,
      agreementType: agreement.agreementType,
      version: agreement.version,
      ipAddress: agreement.ipAddress,
      userAgent: agreement.userAgent,
      consentMethod: agreement.consentMethod,
      createdAt: new Date(),
    };
    this.legalAgreements.set(legalAgreement.id, legalAgreement);
    return legalAgreement;
  }

  // Additional user management
  async getUserByPhone(phoneNumber: string, countryCode?: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user =>
      user.phoneNumber === phoneNumber &&
      (countryCode ? user.countryCode === countryCode : true)
    );
  }

  async getUserByUserId(userId: string): Promise<User | undefined> {
    return this.users.get(userId);
  }

  async updateStripeCustomerId(id: string, stripeCustomerId: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async updateUserStripeInfo(id: string, info: { customerId: string; subscriptionId: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Existing method overrides for additional functionality
  async getOtpVerification(phoneNumber: string, countryCode: string, purpose: string): Promise<any | undefined> {
    return Array.from(this.otpVerifications.values()).find(record =>
      record.phoneNumber === phoneNumber &&
      record.countryCode === countryCode &&
      record.purpose === purpose &&
      !record.isUsed &&
      new Date() < new Date(record.expiresAt)
    );
  }
}

export const storage = new MemStorage();
