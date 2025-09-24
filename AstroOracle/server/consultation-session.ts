import type { Express } from "express";
import { z } from "zod";

// Schemas for consultation session management
const CreateSessionSchema = z.object({
  consultationId: z.string(),
  duration: z.number().min(15).max(180), // 15 minutes to 3 hours
  type: z.enum(['video', 'audio', 'chat']),
  scheduledTime: z.string().optional()
});

const UpdateSessionTimerSchema = z.object({
  sessionId: z.string(),
  action: z.enum(['start', 'pause', 'resume', 'extend', 'end']),
  extensionMinutes: z.number().optional()
});

const SessionFeedbackSchema = z.object({
  sessionId: z.string(),
  rating: z.number().min(1).max(5),
  experience: z.enum(['excellent', 'good', 'average', 'poor']),
  helpfulness: z.enum(['very-helpful', 'somewhat-helpful', 'not-helpful']),
  clarity: z.enum(['very-clear', 'mostly-clear', 'unclear']),
  recommendation: z.enum(['yes', 'maybe', 'no']),
  comments: z.string().optional(),
  suggestions: z.string().optional(),
  followUp: z.boolean().default(false)
});

// In-memory session storage (you can replace with database later)
interface ConsultationSession {
  id: string;
  consultationId: string;
  userId: string;
  astrologerId: string;
  duration: number; // in minutes
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  pausedAt?: Date;
  totalPausedTime: number; // in seconds
  extensionsGranted: number; // additional minutes added
  createdAt: Date;
  scheduledTime?: Date;
}

interface SessionTimer {
  sessionId: string;
  totalDuration: number; // in seconds
  remainingTime: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  startedAt?: Date;
  pausedAt?: Date;
  warnings: {
    fifteenMin: boolean;
    fiveMin: boolean;
    oneMin: boolean;
  };
}

// Storage for active sessions
const activeSessions = new Map<string, ConsultationSession>();
const activeTimers = new Map<string, SessionTimer>();
const sessionFeedbacks = new Map<string, any>();

export function registerConsultationSessionRoutes(app: Express) {
  
  // Get session data
  app.get("/api/consultation-session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = activeSessions.get(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      const timer = activeTimers.get(sessionId);
      
      res.json({
        session,
        timer,
        message: "Session data retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session data" });
    }
  });

  // Create new consultation session
  app.post("/api/consultation-session/create", async (req, res) => {
    try {
      const { consultationId, duration, type, scheduledTime } = req.body;
      
      // Generate session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create session object
      const session: ConsultationSession = {
        id: sessionId,
        consultationId,
        userId: "user_123", // Get from authenticated user
        astrologerId: "astrologer_arup",
        duration,
        type,
        status: 'scheduled',
        totalPausedTime: 0,
        extensionsGranted: 0,
        createdAt: new Date(),
        scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined
      };
      
      // Create timer
      const timer: SessionTimer = {
        sessionId,
        totalDuration: duration * 60, // Convert to seconds
        remainingTime: duration * 60,
        isActive: false,
        isPaused: false,
        warnings: {
          fifteenMin: false,
          fiveMin: false,
          oneMin: false
        }
      };
      
      // Store session and timer
      activeSessions.set(sessionId, session);
      activeTimers.set(sessionId, timer);
      
      res.json({
        sessionId,
        session,
        timer,
        message: "Consultation session created successfully"
      });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create consultation session" });
    }
  });

  // Update session timer (start, pause, extend, end)
  app.post("/api/consultation-session/timer", async (req, res) => {
    try {
      const { sessionId, action, extensionMinutes } = req.body;
      
      const session = activeSessions.get(sessionId);
      const timer = activeTimers.get(sessionId);
      
      if (!session || !timer) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      const now = new Date();
      
      switch (action) {
        case 'start':
          session.status = 'active';
          session.startTime = now;
          timer.isActive = true;
          timer.isPaused = false;
          timer.startedAt = now;
          break;
          
        case 'pause':
          session.status = 'paused';
          session.pausedAt = now;
          timer.isPaused = true;
          timer.pausedAt = now;
          break;
          
        case 'resume':
          if (session.pausedAt && timer.pausedAt) {
            const pausedDuration = now.getTime() - timer.pausedAt.getTime();
            session.totalPausedTime += Math.floor(pausedDuration / 1000);
          }
          session.status = 'active';
          session.pausedAt = undefined;
          timer.isPaused = false;
          timer.pausedAt = undefined;
          break;
          
        case 'extend':
          if (extensionMinutes && extensionMinutes > 0) {
            const extensionSeconds = extensionMinutes * 60;
            timer.totalDuration += extensionSeconds;
            timer.remainingTime += extensionSeconds;
            session.extensionsGranted += extensionMinutes;
          }
          break;
          
        case 'end':
          session.status = 'completed';
          session.endTime = now;
          timer.isActive = false;
          timer.isPaused = false;
          timer.remainingTime = 0;
          break;
      }
      
      // Update stored data
      activeSessions.set(sessionId, session);
      activeTimers.set(sessionId, timer);
      
      res.json({
        session,
        timer,
        message: `Session timer ${action}ed successfully`
      });
    } catch (error) {
      console.error("Error updating session timer:", error);
      res.status(500).json({ error: "Failed to update session timer" });
    }
  });

  // Submit consultation feedback
  app.post("/api/consultation-feedback", async (req, res) => {
    try {
      const feedbackData = req.body;
      const { sessionId } = feedbackData;
      
      // Store feedback
      sessionFeedbacks.set(sessionId, {
        ...feedbackData,
        submittedAt: new Date(),
        id: `feedback_${Date.now()}`
      });
      
      // Mark session as completed if not already
      const session = activeSessions.get(sessionId);
      if (session && session.status !== 'completed') {
        session.status = 'completed';
        session.endTime = new Date();
        activeSessions.set(sessionId, session);
      }
      
      res.json({
        message: "Feedback submitted successfully",
        feedbackId: `feedback_${Date.now()}`
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Get all active sessions (for admin)
  app.get("/api/consultation-sessions/active", async (req, res) => {
    try {
      const activeSessionsArray = Array.from(activeSessions.values()).filter(
        session => ['scheduled', 'active', 'paused'].includes(session.status)
      );
      
      const sessionsWithTimers = activeSessionsArray.map(session => ({
        session,
        timer: activeTimers.get(session.id)
      }));
      
      res.json({
        sessions: sessionsWithTimers,
        count: sessionsWithTimers.length
      });
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      res.status(500).json({ error: "Failed to fetch active sessions" });
    }
  });

  // Get session statistics
  app.get("/api/consultation-sessions/stats", async (req, res) => {
    try {
      const allSessions = Array.from(activeSessions.values());
      const allFeedbacks = Array.from(sessionFeedbacks.values());
      
      const stats = {
        totalSessions: allSessions.length,
        activeSessions: allSessions.filter(s => s.status === 'active').length,
        completedSessions: allSessions.filter(s => s.status === 'completed').length,
        averageRating: allFeedbacks.length > 0 
          ? allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length
          : 0,
        totalFeedbacks: allFeedbacks.length,
        averageDuration: allSessions.length > 0
          ? allSessions.reduce((sum, s) => sum + s.duration, 0) / allSessions.length
          : 0
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching session stats:", error);
      res.status(500).json({ error: "Failed to fetch session statistics" });
    }
  });

  // Delete session (cleanup)
  app.delete("/api/consultation-session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      activeSessions.delete(sessionId);
      activeTimers.delete(sessionId);
      sessionFeedbacks.delete(sessionId);
      
      res.json({ message: "Session deleted successfully" });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });
}

// Export for use in main routes file
export { 
  activeSessions, 
  activeTimers, 
  sessionFeedbacks,
  type ConsultationSession,
  type SessionTimer
};