import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertConsultationSchema, 
  insertCourseSchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertChatMessageSchema,
  insertHomeTuitionCourseSchema,
  insertHomeTuitionApplicationSchema,
  insertStudentMessageSchema,
  insertStudentConversationSchema
} from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";
import { registerConsultationSessionRoutes } from "./consultation-session";
import { z } from "zod";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

// Custom validation schemas for multi-step registration
const registrationStep1Schema = z.object({
  step: z.literal(1),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
});

const registrationStep2Schema = z.object({
  step: z.literal(2),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  countryCode: z.string().startsWith("+", "Country code must start with +"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const registrationStep3Schema = z.object({
  step: z.literal(3),
  dateOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  whatsappNumber: z.string().optional(),
  preferredLanguage: z.string().optional(),
});

const registrationStep4Schema = z.object({
  step: z.literal(4),
  agreements: z.object({
    terms: z.boolean().refine(val => val === true, "Terms of service must be accepted"),
    privacy: z.boolean().refine(val => val === true, "Privacy policy must be accepted"),
    disclaimer: z.boolean().refine(val => val === true, "Disclaimer must be accepted"),
    returnPolicy: z.boolean().refine(val => val === true, "Return policy must be accepted"),
    dataProcessing: z.boolean().optional(),
    marketing: z.boolean().optional(),
  }),
  // Include all data from previous steps
  username: z.string(),
  password: z.string(),
  fullName: z.string(),
  email: z.string().optional().or(z.literal("")),
  phoneNumber: z.string(),
  countryCode: z.string(),
  dateOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  whatsappNumber: z.string().optional(),
  preferredLanguage: z.string().optional(),
});
// import bcrypt from "bcrypt"; // Already imported above
// import jwt from "jsonwebtoken"; // Already imported above
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
}) : null;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== COMPREHENSIVE AUTHENTICATION SYSTEM ==========
  
  // Step 1: Send OTP for registration/login
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phoneNumber, countryCode, purpose } = req.body;
      
      // Validate input
      if (!phoneNumber || !countryCode || !purpose) {
        return res.status(400).json({ message: "Phone number, country code, and purpose are required" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in database
      await storage.createOtpVerification({
        phoneNumber,
        countryCode,
        otp,
        purpose,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      // Log security event
      await storage.createSecurityEvent({
        eventType: "OTP_SENT",
        description: `OTP sent for ${purpose} to ${countryCode}${phoneNumber}`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "low",
        details: { phoneNumber, countryCode, purpose },
      });

      // In production, send SMS via Twilio/other provider
      console.log(`OTP for ${countryCode}${phoneNumber}: ${otp} (Purpose: ${purpose})`);
      
      res.json({ 
        message: "OTP sent successfully",
        expiresIn: 600 // 10 minutes
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  // Step 2: Multi-step Registration Process
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { step } = req.body;

      if (step === 1) {
        // Validate step 1 data
        const result = registrationStep1Schema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: result.error.errors 
          });
        }

        const { username } = result.data;

        // Check if username already exists
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }

        return res.json({ message: "Step 1 validated. Proceed to phone verification." });
      }

      if (step === 2) {
        // Validate step 2 data
        const result = registrationStep2Schema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: result.error.errors 
          });
        }

        const { phoneNumber, countryCode, otp } = result.data;

        const isValidOtp = await storage.verifyOtp(phoneNumber, countryCode, otp, "registration");
        if (!isValidOtp) {
          return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Check if phone number already registered
        const existingPhone = await storage.getUserByPhone(phoneNumber, countryCode);
        if (existingPhone) {
          return res.status(400).json({ message: "Phone number already registered" });
        }

        return res.json({ message: "Phone verified. Proceed to birth details." });
      }

      if (step === 3) {
        // Validate step 3 data
        const result = registrationStep3Schema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: result.error.errors 
          });
        }

        // Birth details are optional but recommended
        return res.json({ message: "Birth details saved. Proceed to legal agreements." });
      }

      if (step === 4) {
        // Validate step 4 data
        const result = registrationStep4Schema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: result.error.errors 
          });
        }

        const { agreements, username, password, fullName, email, phoneNumber, countryCode, dateOfBirth, timeOfBirth, placeOfBirth, whatsappNumber, preferredLanguage } = result.data;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await storage.createUser({
          username,
          email: email || null,
          password: hashedPassword,
          fullName,
          phoneNumber,
          countryCode,
          whatsappNumber: whatsappNumber || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          timeOfBirth: timeOfBirth || null,
          placeOfBirth: placeOfBirth || null,
          preferredLanguage: preferredLanguage || "en",
          termsAcceptedAt: new Date(),
          privacyAcceptedAt: new Date(),
          disclaimerAcceptedAt: new Date(),
          returnPolicyAcceptedAt: new Date(),
          dataProcessingConsent: agreements.dataProcessing || false,
          marketingConsent: agreements.marketing || false,
        });

        // Create legal agreement records
        const agreementTypes = ['terms_of_service', 'privacy_policy', 'disclaimer', 'return_policy'];
        for (const agreementType of agreementTypes) {
          await storage.createLegalAgreement({
            userId: user.id,
            agreementType,
            version: "1.0",
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
            consentMethod: "checkbox",
          });
        }

        // Generate token and session
        const token = jwt.sign(
          { userId: user.id, username: user.username, isAdmin: user.isAdmin },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        // Create auth session
        await storage.createAuthSession({
          userId: user.id,
          token,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        // Log security events
        await storage.createSecurityEvent({
          userId: user.id,
          eventType: "USER_REGISTERED",
          description: "User registration completed successfully",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "low",
        });

        res.json({ 
          token, 
          user: { 
            id: user.id, 
            username: user.username, 
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            countryCode: user.countryCode,
            isAdmin: user.isAdmin,
            preferredLanguage: user.preferredLanguage
          },
          message: "Registration completed successfully!"
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Method A: Mobile + OTP Login (Most Secure)
  app.post("/api/auth/login/mobile-otp", async (req, res) => {
    try {
      const { phoneNumber, countryCode, otp } = req.body;
      
      if (!phoneNumber || !countryCode || !otp) {
        return res.status(400).json({ message: "Phone number, country code, and OTP are required" });
      }

      // Verify OTP
      const isValidOtp = await storage.verifyOtp(phoneNumber, countryCode, otp, "login");
      if (!isValidOtp) {
        await storage.createSecurityEvent({
          eventType: "LOGIN_FAILED",
          description: "Invalid OTP for mobile login",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "medium",
          details: { phoneNumber, countryCode, reason: "invalid_otp" },
        });
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }

      // Find user by phone number
      const user = await storage.getUserByPhone(phoneNumber, countryCode);
      if (!user) {
        return res.status(404).json({ message: "User not found with this phone number" });
      }

      // Generate token and create session
      const token = jwt.sign(
        { userId: user.id, username: user.username, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      await storage.createAuthSession({
        userId: user.id,
        token,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // Log successful login
      await storage.createSecurityEvent({
        userId: user.id,
        eventType: "LOGIN_SUCCESS",
        description: "Successful mobile + OTP login",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "low",
        details: { method: "mobile_otp" },
      });

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin 
        },
        method: "mobile_otp"
      });
    } catch (error: any) {
      console.error("Mobile OTP login error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Method B: User ID + Password Login (Quick Login)
  app.post("/api/auth/login/userid-password", async (req, res) => {
    try {
      const { userId, password } = req.body;
      
      if (!userId || !password) {
        return res.status(400).json({ message: "User ID and password are required" });
      }

      const user = await storage.getUserByUserId(userId);
      if (!user) {
        await storage.createSecurityEvent({
          eventType: "LOGIN_FAILED",
          description: "Login attempt with non-existent user ID",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "medium",
          details: { userId, reason: "user_not_found" },
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        await storage.createSecurityEvent({
          userId: user.id,
          eventType: "LOGIN_FAILED",
          description: "Invalid password for user ID login",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "medium",
          details: { method: "userid_password", reason: "invalid_password" },
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token and create session
      const token = jwt.sign(
        { userId: user.id, username: user.username, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      await storage.createAuthSession({
        userId: user.id,
        token,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await storage.createSecurityEvent({
        userId: user.id,
        eventType: "LOGIN_SUCCESS",
        description: "Successful user ID + password login",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "low",
        details: { method: "userid_password" },
      });

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin 
        },
        method: "userid_password"
      });
    } catch (error: any) {
      console.error("User ID password login error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Method C: Mobile + Password Login (Alternative)
  app.post("/api/auth/login/mobile-password", async (req, res) => {
    try {
      const { phoneNumber, countryCode, password } = req.body;
      
      if (!phoneNumber || !countryCode || !password) {
        return res.status(400).json({ message: "Phone number, country code, and password are required" });
      }

      const user = await storage.getUserByPhone(phoneNumber, countryCode);
      if (!user) {
        await storage.createSecurityEvent({
          eventType: "LOGIN_FAILED",
          description: "Login attempt with non-existent phone number",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "medium",
          details: { phoneNumber, countryCode, reason: "user_not_found" },
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        await storage.createSecurityEvent({
          userId: user.id,
          eventType: "LOGIN_FAILED",
          description: "Invalid password for mobile login",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "medium",
          details: { method: "mobile_password", reason: "invalid_password" },
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token and create session
      const token = jwt.sign(
        { userId: user.id, username: user.username, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      await storage.createAuthSession({
        userId: user.id,
        token,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await storage.createSecurityEvent({
        userId: user.id,
        eventType: "LOGIN_SUCCESS",
        description: "Successful mobile + password login",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "low",
        details: { method: "mobile_password" },
      });

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin 
        },
        method: "mobile_password"
      });
    } catch (error: any) {
      console.error("Mobile password login error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", authenticateToken, async (req: any, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (token) {
        await storage.invalidateAuthSession(token);
      }

      await storage.createSecurityEvent({
        userId: req.user.userId,
        eventType: "USER_LOGOUT",
        description: "User logged out successfully",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "low",
      });

      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Password Reset Request
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { phoneNumber, countryCode } = req.body;
      
      if (!phoneNumber || !countryCode) {
        return res.status(400).json({ message: "Phone number and country code are required" });
      }

      const user = await storage.getUserByPhone(phoneNumber, countryCode);
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ message: "If an account exists with this phone number, you will receive an OTP to reset your password." });
      }

      // Generate and send OTP for password reset
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      await storage.createOtpVerification({
        phoneNumber,
        countryCode,
        otp,
        purpose: "password_reset",
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      await storage.createSecurityEvent({
        userId: user.id,
        eventType: "PASSWORD_RESET_REQUESTED",
        description: "Password reset OTP requested",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "medium",
        details: { phoneNumber, countryCode },
      });

      // In production, send SMS via Twilio
      console.log(`Password reset OTP for ${countryCode}${phoneNumber}: ${otp}`);

      res.json({ message: "If an account exists with this phone number, you will receive an OTP to reset your password." });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset Password with OTP
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { phoneNumber, countryCode, otp, newPassword } = req.body;
      
      if (!phoneNumber || !countryCode || !otp || !newPassword) {
        return res.status(400).json({ message: "Phone number, country code, OTP, and new password are required" });
      }

      // Verify OTP
      const isValidOtp = await storage.verifyOtp(phoneNumber, countryCode, otp, "password_reset");
      if (!isValidOtp) {
        await storage.createSecurityEvent({
          eventType: "PASSWORD_RESET_FAILED",
          description: "Invalid OTP for password reset",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "high",
          details: { phoneNumber, countryCode, reason: "invalid_otp" },
        });
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      const user = await storage.getUserByPhone(phoneNumber, countryCode);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await storage.updateUser(user.id, { password: hashedPassword });

      await storage.createSecurityEvent({
        userId: user.id,
        eventType: "PASSWORD_RESET_SUCCESS",
        description: "Password reset completed successfully",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "medium",
      });

      res.json({ message: "Password reset successfully. You can now login with your new password." });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Change Password (Authenticated users)
  app.post("/api/auth/change-password", authenticateToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        await storage.createSecurityEvent({
          userId: user.id,
          eventType: "PASSWORD_CHANGE_FAILED",
          description: "Invalid current password for password change",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "medium",
          details: { reason: "invalid_current_password" },
        });
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await storage.updateUser(user.id, { password: hashedPassword });

      await storage.createSecurityEvent({
        userId: user.id,
        eventType: "PASSWORD_CHANGED",
        description: "Password changed successfully",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "low",
      });

      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Account Recovery (Lost mobile access)
  app.post("/api/auth/account-recovery", async (req, res) => {
    try {
      const { username, email, governmentId } = req.body;
      
      if (!username && !email && !governmentId) {
        return res.status(400).json({ message: "At least one identifier (username, email, or government ID) is required" });
      }

      let user: any = null;
      if (username) {
        user = await storage.getUserByUsername(username);
      } else if (email) {
        user = Array.from((storage as any).users.values()).find((u: any) => u.email === email);
      }

      await storage.createSecurityEvent({
        userId: user?.id || null,
        eventType: "ACCOUNT_RECOVERY_REQUESTED",
        description: "Account recovery request submitted",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "high",
        details: { username, email, governmentId },
      });

      // Always return same message for security
      res.json({ 
        message: "Account recovery request submitted. Our support team will contact you within 24-48 hours to verify your identity and assist with account recovery.",
        supportContact: "support@jaiguruastroremedy.com"
      });
    } catch (error: any) {
      console.error("Account recovery error:", error);
      res.status(500).json({ message: "Failed to process account recovery request" });
    }
  });

  // Verify user identity for account operations
  app.post("/api/auth/verify-identity", authenticateToken, async (req: any, res) => {
    try {
      const { password, otp, phoneNumber, countryCode } = req.body;
      
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let verified = false;
      
      // Method 1: Password verification
      if (password) {
        verified = await bcrypt.compare(password, user.password);
      }
      
      // Method 2: OTP verification (for high-security operations)
      if (otp && phoneNumber && countryCode) {
        verified = await storage.verifyOtp(phoneNumber, countryCode, otp, "identity_verification");
      }

      if (!verified) {
        await storage.createSecurityEvent({
          userId: user.id,
          eventType: "IDENTITY_VERIFICATION_FAILED",
          description: "Failed identity verification attempt",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          riskLevel: "high",
        });
        return res.status(401).json({ message: "Identity verification failed" });
      }

      await storage.createSecurityEvent({
        userId: user.id,
        eventType: "IDENTITY_VERIFIED",
        description: "Identity verification successful",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        riskLevel: "low",
      });

      res.json({ message: "Identity verified successfully", verified: true });
    } catch (error: any) {
      console.error("Identity verification error:", error);
      res.status(500).json({ message: "Failed to verify identity" });
    }
  });

  // User profile routes
  app.get("/api/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/profile", authenticateToken, async (req: any, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Don't allow password updates through this endpoint
      delete updates.isAdmin; // Don't allow admin status changes
      
      const updatedUser = await storage.updateUser(req.user.userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.createAuditLog({
        userId: req.user.userId,
        action: "PROFILE_UPDATED",
        resourceType: "USER",
        resourceId: req.user.userId,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Consultation routes
  app.get("/api/consultations", authenticateToken, async (req: any, res) => {
    try {
      let consultations;
      if (req.user.isAdmin) {
        consultations = Array.from((storage as any).consultations.values());
      } else {
        consultations = await storage.getConsultationsByClient(req.user.userId);
      }
      res.json(consultations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/consultations", authenticateToken, async (req, res) => {
    try {
      const consultationData = insertConsultationSchema.parse({
        ...req.body,
        clientId: (req as any).user.userId,
      });

      const consultation = await storage.createConsultation(consultationData);

      // Create notification
      await storage.createNotification({
        userId: consultation.clientId,
        title: "Consultation Booked",
        message: `Your ${consultation.type} consultation has been scheduled for ${consultation.scheduledAt}`,
        type: "consultation",
        actionUrl: `/consultation/${consultation.id}`,
      });

      await storage.createAuditLog({
        userId: (req as any).user.userId,
        action: "CONSULTATION_BOOKED",
        resourceType: "CONSULTATION",
        resourceId: consultation.id,
        details: consultationData,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      res.json(consultation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/consultations/:id", authenticateToken, async (req: any, res) => {
    try {
      const consultation = await storage.getConsultation(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }

      // Check if user owns the consultation or is admin
      if (consultation.clientId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(consultation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/consultations/:id", authenticateToken, async (req: any, res) => {
    try {
      const consultation = await storage.getConsultation(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }

      // Only admin or client can update (client can only reschedule)
      if (consultation.clientId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updates = req.body;
      
      // Clients can only reschedule
      if (!req.user.isAdmin) {
        const allowedUpdates = ['scheduledAt', 'notes'];
        Object.keys(updates).forEach(key => {
          if (!allowedUpdates.includes(key)) {
            delete updates[key];
          }
        });
      }

      const updatedConsultation = await storage.updateConsultation(req.params.id, updates);

      await storage.createAuditLog({
        userId: req.user.userId,
        action: "CONSULTATION_UPDATED",
        resourceType: "CONSULTATION",
        resourceId: req.params.id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      res.json(updatedConsultation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getActiveCourses();
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/courses", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);

      await storage.createAuditLog({
        userId: req.user.userId,
        action: "COURSE_CREATED",
        resourceType: "COURSE",
        resourceId: course.id,
        details: courseData,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      res.json(course);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/courses/:id/enroll", authenticateToken, async (req: any, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if ((course.currentStudents || 0) >= (course.maxStudents || 0)) {
        return res.status(400).json({ message: "Course is full" });
      }

      const enrollment = await storage.enrollStudent(req.user.userId, req.params.id);

      // Update course student count
      await storage.updateCourse(req.params.id, {
        currentStudents: (course.currentStudents || 0) + 1
      });

      await storage.createNotification({
        userId: req.user.userId,
        title: "Course Enrollment",
        message: `You have been enrolled in ${course.title}`,
        type: "course",
        actionUrl: `/courses/${course.id}`,
      });

      res.json(enrollment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string;
      let products;
      
      if (category) {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);

      await storage.createAuditLog({
        userId: req.user.userId,
        action: "PRODUCT_CREATED",
        resourceType: "PRODUCT",
        resourceId: product.id,
        details: productData,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Order routes
  app.get("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      let orders;
      if (req.user.isAdmin) {
        orders = Array.from((storage as any).orders.values());
      } else {
        orders = await storage.getOrdersByCustomer(req.user.userId);
      }
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        customerId: req.user.userId,
      });

      const order = await storage.createOrder(orderData);

      await storage.createNotification({
        userId: req.user.userId,
        title: "Order Placed",
        message: `Your order #${order.id} has been placed successfully`,
        type: "order",
        actionUrl: `/orders/${order.id}`,
      });

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chat message routes
  app.get("/api/consultations/:id/messages", authenticateToken, async (req: any, res) => {
    try {
      const consultation = await storage.getConsultation(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }

      if (consultation.clientId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const messages = await storage.getChatMessages(req.params.id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/consultations/:id/messages", authenticateToken, async (req: any, res) => {
    try {
      const consultation = await storage.getConsultation(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }

      if (consultation.clientId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        consultationId: req.params.id,
        senderId: req.user.userId,
      });

      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications", authenticateToken, async (req: any, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user.userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/notifications/:id/read", authenticateToken, async (req: any, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Support Chat Routes
  
  // Get or create a support chat session
  app.get("/api/support-chat/:sessionId", async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      
      let supportChat = await storage.getSupportChat(sessionId);
      
      if (!supportChat) {
        // Create new support chat session
        supportChat = await storage.createSupportChat({
          sessionId,
          userId: req.user?.userId || null,
          userEmail: req.user?.email || null,
          userName: req.user?.fullName || null,
        });
      }
      
      // Get messages for this chat
      const messages = await storage.getSupportChatMessages(supportChat.id);
      
      res.json({ ...supportChat, messages });
    } catch (error: any) {
      console.error("Error getting support chat:", error);
      res.status(500).json({ message: "Failed to get support chat" });
    }
  });

  // Send a message in support chat
  app.post("/api/support-chat/message", async (req: any, res) => {
    try {
      const { sessionId, message, messageType = "user" } = req.body;
      
      // Get or create support chat
      let supportChat = await storage.getSupportChat(sessionId);
      if (!supportChat) {
        supportChat = await storage.createSupportChat({
          sessionId,
          userId: req.user?.userId || null,
          userEmail: req.user?.email || null,
          userName: req.user?.fullName || null,
        });
      }
      
      // Create user message
      const userMessage = await storage.createSupportChatMessage({
        chatId: supportChat.id,
        message,
        messageType,
        sender: req.user?.fullName || "User",
      });
      
      // Generate AI response
      let aiResponse = null;
      if (messageType === "user") {
        // Use AI with service context for intelligent responses
        const { generateAIResponse, buildServiceContext } = await import("./gemini");
        
        try {
          // Build context with current service information
          const context = await buildServiceContext(storage);
          
          // Generate AI response with context
          const aiMessage = await generateAIResponse(message, context);
          
          aiResponse = await storage.createSupportChatMessage({
            chatId: supportChat.id,
            message: aiMessage,
            messageType: "ai", 
            sender: "AI Assistant",
          });
          
        } catch (error: any) {
          console.error("AI response generation failed, falling back to FAQ search:", error);
          
          // Fallback to FAQ search if AI fails
          const faqs = await storage.searchFaqs(message);
          
          if (faqs.length > 0) {
            const bestMatch = faqs[0];
            await storage.incrementFaqView(bestMatch.id);
            
            aiResponse = await storage.createSupportChatMessage({
              chatId: supportChat.id,
              message: bestMatch.answer,
              messageType: "ai",
              sender: "AI Assistant",
              relatedFaqId: bestMatch.id,
            });
          } else {
            // Final fallback to default response
            const defaultResponse = "Thank you for your question. Our expert astrologer Arup Shastri would be happy to help you with personalized guidance. Would you like to book a consultation? You can choose from video, audio, chat, in-person, or home service sessions.";
            
            aiResponse = await storage.createSupportChatMessage({
              chatId: supportChat.id,
              message: defaultResponse,
              messageType: "ai",
              sender: "AI Assistant",
            });
            
            await storage.updateSupportChat(supportChat.id, {
              needsHumanSupport: true
            });
          }
        }
      }
      
      res.json({ 
        userMessage, 
        aiResponse,
        needsHumanSupport: supportChat.needsHumanSupport 
      });
      
    } catch (error: any) {
      console.error("Error sending support chat message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Rate a chat message as helpful/unhelpful
  app.post("/api/support-chat/rate-message", async (req: any, res) => {
    try {
      const { messageId, isHelpful } = req.body;
      await storage.rateChatMessage(messageId, isHelpful);
      res.json({ message: "Rating recorded" });
    } catch (error: any) {
      console.error("Error rating message:", error);
      res.status(500).json({ message: "Failed to rate message" });
    }
  });

  // Request human support
  app.post("/api/support-chat/request-human", async (req: any, res) => {
    try {
      const { sessionId } = req.body;
      
      const supportChat = await storage.getSupportChat(sessionId);
      if (supportChat) {
        await storage.updateSupportChat(supportChat.id, {
          humanSupportRequested: true,
          needsHumanSupport: true
        });
        
        res.json({ message: "Human support requested. Our team will respond shortly." });
      } else {
        res.status(404).json({ message: "Chat session not found" });
      }
    } catch (error: any) {
      console.error("Error requesting human support:", error);
      res.status(500).json({ message: "Failed to request human support" });
    }
  });

  // FAQ Routes
  
  // Get all FAQs or search FAQs
  app.get("/api/faqs", async (req: any, res) => {
    try {
      const { search, category } = req.query;
      
      let faqs;
      if (search) {
        faqs = await storage.searchFaqs(search as string);
      } else if (category) {
        faqs = await storage.getFaqsByCategory(category as string);
      } else {
        faqs = await storage.getAllFaqs();
      }
      
      res.json(faqs);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  // Create FAQ (admin only)
  app.post("/api/faqs", authenticateToken, async (req: any, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const faq = await storage.createFaq(req.body);
      res.status(201).json(faq);
    } catch (error: any) {
      console.error("Error creating FAQ:", error);
      res.status(500).json({ message: "Failed to create FAQ" });
    }
  });

  // Update FAQ (admin only)
  app.put("/api/faqs/:id", authenticateToken, async (req: any, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const faq = await storage.updateFaq(req.params.id, req.body);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      
      res.json(faq);
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      res.status(500).json({ message: "Failed to update FAQ" });
    }
  });

  // Delete FAQ (admin only)
  app.delete("/api/faqs/:id", authenticateToken, async (req: any, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const deleted = await storage.deleteFaq(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      
      res.json({ message: "FAQ deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });

  // Rate FAQ as helpful
  app.post("/api/faqs/:id/rate", async (req: any, res) => {
    try {
      const { isHelpful } = req.body;
      await storage.rateFaqHelpful(req.params.id, isHelpful);
      res.json({ message: "Rating recorded" });
    } catch (error: any) {
      console.error("Error rating FAQ:", error);
      res.status(500).json({ message: "Failed to rate FAQ" });
    }
  });

  // Payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", authenticateToken, async (req, res) => {
      try {
        const { amount, currency = "inr", metadata } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents/paise
          currency,
          metadata: {
            userId: (req as any).user.userId,
            ...metadata
          },
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });
  }

  // Admin routes
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const users = Array.from((storage as any).users.values()).map((user: any) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/dashboard", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const totalUsers = (storage as any).users.size;
      const totalConsultations = (storage as any).consultations.size;
      const totalCourses = (storage as any).courses.size;
      const totalProducts = (storage as any).products.size;
      const totalOrders = (storage as any).orders.size;
      
      // Calculate monthly revenue
      const monthlyRevenue = Array.from((storage as any).orders.values())
        .filter((o: any) => new Date(o.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount || 0), 0);

      const upcomingConsultations = await storage.getUpcomingConsultations();
      
      res.json({
        stats: {
          totalUsers,
          totalConsultations,
          totalCourses,
          totalProducts,
          totalOrders,
          monthlyRevenue,
          homeTuitionApplications: (storage as any).homeTuitionApplications?.size || 0,
          supportChats: (storage as any).supportChats?.size || 0,
          faqViews: 1250, // Mock data for FAQ views
        },
        upcomingConsultations: upcomingConsultations.slice(0, 5),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin users endpoint
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin consultations endpoint
  app.get("/api/admin/consultations", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const consultations = Array.from((storage as any).consultations.values());
      res.json(consultations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin home tuition applications endpoint
  app.get("/api/admin/home-tuition-applications", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const applications = Array.from((storage as any).homeTuitionApplications?.values() || []);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin support chats endpoint
  app.get("/api/admin/support-chats", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const supportChats = Array.from((storage as any).supportChats?.values() || []);
      res.json(supportChats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chat analytics endpoint
  app.get("/api/admin/chat-analytics", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const analytics = {
        avgResponseTime: 2.5,
        satisfactionRate: 94,
        resolutionRate: 89
      };
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== HOME TUITION SYSTEM ==========
  
  // Get all home tuition courses
  app.get("/api/home-tuition/courses", async (req, res) => {
    try {
      const courses = await storage.getActiveHomeTuitionCourses();
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get specific home tuition course
  app.get("/api/home-tuition/courses/:id", async (req, res) => {
    try {
      const course = await storage.getHomeTuitionCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create home tuition course (Admin only)
  app.post("/api/home-tuition/courses", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const parsed = insertHomeTuitionCourseSchema.parse(req.body);
      const course = await storage.createHomeTuitionCourse(parsed);
      res.status(201).json(course);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Update home tuition course (Admin only)
  app.put("/api/home-tuition/courses/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const course = await storage.updateHomeTuitionCourse(req.params.id, req.body);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Submit home tuition application
  app.post("/api/home-tuition/applications", authenticateToken, async (req: any, res) => {
    try {
      const applicationData = {
        ...req.body,
        applicantId: req.user.userId, // Use authenticated user ID
      };
      
      const parsed = insertHomeTuitionApplicationSchema.parse(applicationData);
      const application = await storage.createHomeTuitionApplication(parsed);
      
      // Log audit event
      await storage.createAuditLog({
        userId: req.user.userId,
        action: "HOME_TUITION_APPLICATION_SUBMITTED",
        resourceType: "home_tuition_application",
        resourceId: application.id,
        details: { courseId: parsed.courseId, applicationType: parsed.applicationType },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      
      res.status(201).json(application);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get user's home tuition applications
  app.get("/api/home-tuition/applications", authenticateToken, async (req: any, res) => {
    try {
      const applications = await storage.getHomeTuitionApplicationsByApplicant(req.user.userId);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get specific home tuition application
  app.get("/api/home-tuition/applications/:id", authenticateToken, async (req: any, res) => {
    try {
      const application = await storage.getHomeTuitionApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user is owner or admin
      if (application.applicantId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all home tuition applications
  app.get("/api/admin/home-tuition/applications", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      let applications;
      
      if (status) {
        applications = await storage.getHomeTuitionApplicationsByStatus(status as string);
      } else {
        applications = await storage.getAllHomeTuitionApplications();
      }
      
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Update home tuition application status
  app.put("/api/admin/home-tuition/applications/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const application = await storage.updateHomeTuitionApplication(req.params.id, req.body);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== FILE UPLOAD SYSTEM ==========
  
  // Get upload URL for file uploads
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const { fileType = "aadhar" } = req.body;
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getUploadURL(fileType);
      res.json({ uploadURL });
    } catch (error: any) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL", error: error.message });
    }
  });

  // Serve uploaded files
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      console.error("Error serving file:", error);
      if (error.name === "ObjectNotFoundError") {
        return res.status(404).json({ message: "File not found" });
      }
      res.status(500).json({ message: "Error serving file" });
    }
  });

  // ========== STUDENT COMMUNICATION SYSTEM ==========
  
  // Get student conversations
  app.get("/api/student/conversations", authenticateToken, async (req: any, res) => {
    try {
      const conversations = await storage.getStudentConversationsByStudent(req.user.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create new student conversation
  app.post("/api/student/conversations", authenticateToken, async (req: any, res) => {
    try {
      const conversationData = {
        ...req.body,
        studentId: req.user.userId,
        astrologerId: "admin-user-id", // This should be the admin/astrologer ID
        conversationId: require("crypto").randomUUID(),
      };
      
      const parsed = insertStudentConversationSchema.parse(conversationData);
      const conversation = await storage.createStudentConversation(parsed);
      res.status(201).json(conversation);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get messages in a conversation
  app.get("/api/student/conversations/:conversationId/messages", authenticateToken, async (req: any, res) => {
    try {
      const { conversationId } = req.params;
      const { limit, offset } = req.query;
      
      // Verify user has access to this conversation
      const conversation = await storage.getStudentConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.studentId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messages = await storage.getStudentMessagesByConversation(
        conversationId,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );
      
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send message in conversation
  app.post("/api/student/conversations/:conversationId/messages", authenticateToken, async (req: any, res) => {
    try {
      const { conversationId } = req.params;
      
      // Verify user has access to this conversation
      const conversation = await storage.getStudentConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.studentId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messageData = {
        ...req.body,
        conversationId,
        senderId: req.user.userId,
        studentId: conversation.studentId,
        astrologerId: conversation.astrologerId,
      };
      
      const parsed = insertStudentMessageSchema.parse(messageData);
      const message = await storage.createStudentMessage(parsed);
      res.status(201).json(message);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Mark message as read
  app.put("/api/student/messages/:messageId/read", authenticateToken, async (req: any, res) => {
    try {
      await storage.markStudentMessageAsRead(req.params.messageId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mark all messages in conversation as read
  app.put("/api/student/conversations/:conversationId/read", authenticateToken, async (req: any, res) => {
    try {
      const { conversationId } = req.params;
      
      // Verify user has access to this conversation
      const conversation = await storage.getStudentConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.studentId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.markAllStudentMessagesAsRead(conversationId, req.user.userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all student conversations
  app.get("/api/admin/student/conversations", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const conversations = await storage.getStudentConversationsByAstrologer(req.user.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== PHONEPE PAYMENT INTEGRATION ==========
  
  // Import PhonePe service
  const { phonePeService } = await import('./phonepe');

  // Create PhonePe payment
  app.post("/api/payments/phonepe/create", authenticateToken, async (req: any, res) => {
    try {
      const { amount, merchantOrderId, merchantUserId, items, paymentMethod, upiId, redirectUrl, callbackUrl } = req.body;
      
      const paymentRequest = {
        amount,
        merchantOrderId,
        merchantUserId,
        redirectUrl,
        callbackUrl,
        paymentInstrument: paymentMethod === 'upi_collect' ? {
          type: 'UPI_COLLECT' as const,
          targetApp: 'com.phonepe.app'
        } : {
          type: 'PAY_PAGE' as const
        }
      };

      // Store order in storage
      const order = {
        id: merchantOrderId,
        customerId: req.user.userId,
        items,
        totalAmount: (amount / 100).toString(), // Convert from paisa to rupees as string
        status: 'pending',
        paymentMethod,
        paymentGateway: 'phonepe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await storage.createOrder(order);

      const result = await phonePeService.createPayment(paymentRequest);
      
      if (result.success) {
        res.json({
          success: true,
          paymentUrl: (result.data as any)?.paymentUrl,
          transactionId: result.data?.merchantTransactionId,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // PhonePe payment callback/webhook
  app.post("/api/payments/phonepe/callback", async (req, res) => {
    try {
      const { transactionId, code, merchantId } = req.body;
      
      if (code === 'PAYMENT_SUCCESS') {
        // Update order status
        const order = await storage.getOrderByTransactionId(transactionId);
        if (order) {
          await storage.updateOrderStatus(order.id, 'completed');
          
          // Get user details for notifications  
          const user = await storage.getUser(order.customerId);
          if (user) {
            // Send payment confirmation SMS
            try {
              await twilioService.sendPaymentConfirmation(
                user.phoneNumber, 
                user.countryCode, 
                {
                  transactionId,
                  amount: parseFloat(order.totalAmount),
                  items: Array.isArray(order.items) ? (order.items as any[]).map((item: any) => item.name) : ['Order items']
                }
              );
            } catch (error) {
              console.error('Failed to send payment confirmation SMS:', error);
            }

            // Send payment receipt email
            if (user.email) {
              try {
                await emailService.sendPaymentReceiptEmail(
                  user.email,
                  user.fullName,
                  {
                    transactionId,
                    amount: parseFloat(order.totalAmount),
                    items: Array.isArray(order.items) ? order.items : [],
                    paymentMethod: 'PhonePe UPI'
                  }
                );
              } catch (error) {
                console.error('Failed to send payment receipt email:', error);
              }
            }

            // If order contains consultations, send booking confirmation
            const consultationItems = Array.isArray(order.items) ? order.items.filter((item: any) => item.type === 'consultation') : [];
            for (const consultation of consultationItems) {
              try {
                // Send booking confirmation SMS
                await twilioService.sendBookingConfirmation(
                  user.phoneNumber,
                  user.countryCode,
                  {
                    bookingId: order.id,
                    consultationType: consultation.name,
                    dateTime: 'To be scheduled',
                    astrologer: 'Arup Shastri',
                    amount: consultation.price
                  }
                );

                // Send booking confirmation email
                if (user.email) {
                  await emailService.sendBookingConfirmationEmail(
                    user.email,
                    user.fullName,
                    {
                      bookingId: order.id,
                      consultationType: consultation.name,
                      dateTime: 'To be scheduled - you will be contacted shortly',
                      astrologer: 'Astrologer Arup Shastri',
                      amount: consultation.price,
                      paymentId: transactionId
                    }
                  );
                }
              } catch (error) {
                console.error('Failed to send booking confirmation:', error);
              }
            }

            // If order contains courses, send enrollment confirmation  
            const courseItems = Array.isArray(order.items) ? order.items.filter((item: any) => item.type === 'course') : [];
            for (const course of courseItems) {
              try {
                // Send course enrollment SMS
                await twilioService.sendCourseEnrollmentConfirmation(
                  user.phoneNumber,
                  user.countryCode,
                  {
                    courseName: course.name,
                    startDate: 'To be announced',
                    duration: course.duration || 'As specified'
                  }
                );

                // Send course enrollment email
                if (user.email) {
                  await emailService.sendCourseEnrollmentEmail(
                    user.email,
                    user.fullName,
                    {
                      courseName: course.name,
                      startDate: 'To be announced - you will be notified',
                      duration: course.duration || 'As specified in course details',
                      courseId: course.id
                    }
                  );
                }
              } catch (error) {
                console.error('Failed to send course enrollment confirmation:', error);
              }
            }
          }
        }
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error('PhonePe callback error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Verify PhonePe payment
  app.get("/api/payments/phonepe/verify/:transactionId", authenticateToken, async (req: any, res) => {
    try {
      const { transactionId } = req.params;
      const result = await phonePeService.verifyPayment(transactionId);
      
      if (result.success && result.data) {
        // Update order status based on payment status
        const order = await storage.getOrderByTransactionId(transactionId);
        if (order) {
          const status = result.data.state === 'COMPLETED' ? 'completed' : 
                        result.data.state === 'FAILED' ? 'failed' : 'pending';
          await storage.updateOrderStatus(order.id, status);
        }
      }
      
      res.json(result);
    } catch (error: any) {
      console.error('Payment verification error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get payment details
  app.get("/api/payments/details/:transactionId", authenticateToken, async (req: any, res) => {
    try {
      const { transactionId } = req.params;
      const order = await storage.getOrderByTransactionId(transactionId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Verify user owns this order
      if (order.customerId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(order);
    } catch (error: any) {
      console.error('Payment details error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get user orders
  app.get("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      const orders = await storage.getUserOrders(req.user.userId);
      res.json(orders);
    } catch (error: any) {
      console.error('Get orders error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ========== MOBILE OTP AUTHENTICATION ==========

  // Import communication services
  const { twilioService } = await import('./twilio-service');
  const { emailService } = await import('./email-service');

  // Send OTP for registration/login
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phoneNumber, countryCode, purpose } = req.body;
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP (expires in 10 minutes)
      const otpData = {
        id: uuidv4(),
        phoneNumber,
        countryCode,
        otp,
        purpose, // registration, login, mobile_change, recovery
        isUsed: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        createdAt: new Date(),
      };
      
      await storage.createOtpVerification(otpData);
      
      // Send OTP via Twilio SMS
      const smsResult = await twilioService.sendOTP(phoneNumber, countryCode, otp, purpose);
      
      if (!smsResult.success) {
        console.error('Failed to send SMS OTP:', smsResult.error);
      }
      
      res.json({ 
        message: "OTP sent successfully",
        smsDelivered: smsResult.success,
        // Show OTP only in development mode
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Verify OTP and login/register
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, countryCode, otp, purpose, userData } = req.body;
      
      // Verify OTP
      const otpRecord = await storage.verifyOtp(phoneNumber, countryCode, otp, purpose);
      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      
      let user;
      if (purpose === 'registration') {
        // Create new user
        const hashedPassword = await bcrypt.hash(userData.password || Math.random().toString(), 10);
        
        user = await storage.createUser({
          ...userData,
          phoneNumber,
          countryCode,
          password: hashedPassword,
          isVerified: true,
          phoneVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Send welcome email after successful registration
        if (user && user.email) {
          try {
            await emailService.sendWelcomeEmail(user.email, user.fullName);
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
          }
        }
      } else if (purpose === 'login') {
        // Find existing user
        user = await storage.getUserByPhone(phoneNumber, countryCode);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
      }
      
      if (user) {
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
        
        // Update last login
        await storage.updateUserLoginInfo(user.id, req.ip, req.get('User-Agent'));
        
        res.json({
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin
          }
        });
      } else {
        res.status(400).json({ message: "User verification failed" });
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ========== NOTIFICATION AND REMINDER ENDPOINTS ==========

  // Send consultation reminder (can be triggered by cron job)
  app.post("/api/notifications/consultation-reminder", authenticateToken, async (req: any, res) => {
    try {
      const { consultationId, reminderType } = req.body; // reminderType: '24hours' | '1hour'
      
      const consultation = await storage.getConsultation(consultationId);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      
      const user = await storage.getUser(consultation.clientId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const consultationDetails = {
        consultationType: consultation.type,
        dateTime: consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleString('en-IN') : 'To be scheduled',
        astrologer: 'Astrologer Arup Shastri',
        meetingLink: consultation.meetingId || undefined
      };
      
      // Send SMS reminder
      try {
        await twilioService.sendConsultationReminder(
          user.phoneNumber,
          user.countryCode,
          consultationDetails
        );
      } catch (error) {
        console.error('Failed to send SMS reminder:', error);
      }
      
      // Send email reminder
      if (user.email) {
        try {
          await emailService.sendConsultationReminderEmail(
            user.email,
            user.fullName,
            {
              ...consultationDetails,
              reminderType: reminderType || '24hours'
            }
          );
        } catch (error) {
          console.error('Failed to send email reminder:', error);
        }
      }
      
      res.json({ message: "Reminder sent successfully" });
    } catch (error: any) {
      console.error('Send reminder error:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get notification service status
  app.get("/api/notifications/status", (req, res) => {
    res.json({
      twilioConfigured: twilioService.isConfigured(),
      emailConfigured: emailService.isConfigured(),
      services: {
        sms: {
          provider: 'Twilio',
          configured: twilioService.isConfigured(),
          features: ['OTP', 'Booking confirmations', 'Payment notifications', 'Reminders']
        },
        email: {
          provider: 'Amazon SES',
          configured: emailService.isConfigured(),
          features: ['Welcome emails', 'Booking confirmations', 'Payment receipts', 'Course enrollment', 'Reminders']
        }
      }
    });
  });

  // Register consultation session routes
  registerConsultationSessionRoutes(app);

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_message') {
          // Broadcast message to all clients in the same consultation
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                consultationId: message.consultationId,
                senderId: message.senderId,
                message: message.message,
                timestamp: new Date().toISOString(),
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
