import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import expressSession from "express-session";

const API_KEYS = [
  "AIzaSyBT9_JYZPgfezbyAdl8OHB3aoDMg49pocY",
  "AIzaSyA-Cwx1OeiZRHDlmpfqxtoXDH_B0oEwNTE"
];
let currentKeyIndex = 0;

function getNextApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

async function callGemini(prompt: string, imagesBase64: string[] = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${getNextApiKey()}`;

  const contents: any[] = [];
  
  if (imagesBase64.length > 0) {
    const parts = imagesBase64.map(img => {
      // Remove data:image/...;base64, prefix if present
      const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
      // simple guess for mime type or default to jpeg
      const mimeType = img.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      return {
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      };
    });
    contents.push({ parts: [...parts, { text: prompt }] });
  } else {
    contents.push({ parts: [{ text: prompt }] });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Session setup
  app.use(expressSession({
    secret: process.env.SESSION_SECRET || "baseer_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  // Auth routes
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      (req.session as any).userId = user.id;
      res.json(user);
    } catch (e) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Users
  app.get(api.users.list.path, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.post(api.users.create.path, async (req, res) => {
    const input = api.users.create.input.parse(req.body);
    const user = await storage.createUser(input);
    res.status(201).json(user);
  });

  app.patch(api.users.update.path, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.users.update.input.parse(req.body);
    const user = await storage.updateUser(id, input);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  });

  app.delete(api.users.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteUser(id);
    res.status(204).end();
  });

  // Schools
  app.get(api.schools.list.path, async (req, res) => {
    const schools = await storage.getSchools();
    res.json(schools);
  });

  app.post(api.schools.create.path, async (req, res) => {
    const input = api.schools.create.input.parse(req.body);
    const school = await storage.createSchool(input);
    res.status(201).json(school);
  });

  app.delete(api.schools.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteSchool(id);
    res.status(204).end();
  });

  // Flags
  app.get(api.flags.list.path, async (req, res) => {
    const flags = await storage.getFlags();
    res.json(flags);
  });

  app.post(api.flags.create.path, async (req, res) => {
    const input = api.flags.create.input.parse(req.body);
    const flag = await storage.createFlag(input);
    res.status(201).json(flag);
  });

  app.delete(api.flags.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteFlag(id);
    res.status(204).end();
  });

  // Evidences
  app.get(api.evidences.list.path, async (req, res) => {
    const evidences = await storage.getEvidences();
    res.json(evidences);
  });

  app.post(api.evidences.create.path, async (req, res) => {
    const input = api.evidences.create.input.parse(req.body);
    const evidence = await storage.createEvidence(input);
    res.status(201).json(evidence);
  });

  app.post(api.evidences.approve.path, async (req, res) => {
    const evidence = await storage.approveEvidence(Number(req.params.id));
    res.json(evidence);
  });

  // Indicators
  app.get(api.indicators.list.path, async (req, res) => {
    const indicators = await storage.getIndicators();
    res.json(indicators);
  });

  app.post(api.indicators.create.path, async (req, res) => {
    const input = api.indicators.create.input.parse(req.body);
    const indicator = await storage.createIndicator(input);
    res.status(201).json(indicator);
  });

  app.post(api.indicators.approve.path, async (req, res) => {
    const indicator = await storage.approveIndicator(Number(req.params.id));
    res.json(indicator);
  });

  // Evaluations
  app.get(api.evaluations.list.path, async (req, res) => {
    const evaluations = await storage.getEvaluations();
    res.json(evaluations);
  });

  app.post(api.evaluations.start.path, async (req, res) => {
    try {
      const { teacherId } = api.evaluations.start.input.parse(req.body);
      const evaluatorId = (req.session as any).userId; 
      
      // Get teacher evidences & indicators
      const evidences = await storage.getEvidences();
      const teacherEvidences = evidences.filter(e => e.teacherId === teacherId && e.status === 'approved');
      
      const indicators = await storage.getIndicators();
      const teacherIndicators = indicators.filter(i => i.teacherId === teacherId && i.status === 'approved');

      // Combine them to prompt
      const prompt = `قم بتقييم هذا المعلم بناءً على الشواهد والمؤشرات التالية.
  الرجاء استخراج درجة نهائية (درجة موضوعية من 100) وتقديم تقييم لكل شاهد على حدة.
  المعايير المطلوبة:
  أداء الواجبات الوظيفية 10%
  التفاعل مع المجتمع المهني 10%
  التفاعل مع أولياء الأمور 10%
  التنويع في استراتيجيات التدريس 10%
  تحسين نتائج المتعلمين 10%
  إعداد وتنفيذ خطة التعلم 10%
  توظيف تقنيات ووسائل التعلم المناسبة 10%
  تهيئة بيئة تعليمية 5%
  الادارة الصفية 5%
  تحليل نتائج المتعلمين وتشخيص مستواهم 10%
  تنوع اساليب التقييم 10%

  الشواهد:
  ${teacherEvidences.map((e, i) => `${i+1}. ${e.criteria} - ${e.description}`).join('\n')}

  المؤشرات:
  ${teacherIndicators.map((e, i) => `${i+1}. ${e.title} (${e.type}) - ${e.hours} ساعات`).join('\n')}

  قم بإرجاع التقييم بتنسيق JSON فقط:
  {
    "totalScore": 85,
    "details": [
      { "criteria": "أداء الواجبات", "score": 9, "note": "ملاحظة..." }
    ],
    "summary": "ملخص عام"
  }
  `;
      
      const imageBase64s = teacherEvidences.map(e => e.imageUrl).filter(Boolean);
      
      const resultText = await callGemini(prompt, imageBase64s);
      
      // Attempt to parse JSON from response
      const jsonStr = resultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      const aiResponse = JSON.parse(jsonStr);

      const evaluation = await storage.createEvaluation({
        teacherId,
        evaluatorId: evaluatorId || 1,
        totalScore: aiResponse.totalScore || 0,
        details: aiResponse
      });

      res.status(201).json(evaluation);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ message: "Failed to evaluate via AI", details: e.message });
    }
  });

  // AI Chat
  app.post(api.ai.chat.path, async (req, res) => {
    try {
      const { message } = api.ai.chat.input.parse(req.body);
      const prompt = `أنت مساعد ذكي لمنصة "بصير" التعليمية. مهمتك هي مساعدة المعلمين في فهم ما يحتاجون إرفاقه من شواهد ومؤشرات، وتقديم نصائح حول ذلك.\nسؤال المعلم: ${message}`;
      
      const reply = await callGemini(prompt, []);
      res.json({ reply });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ reply: "عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي." });
    }
  });


  // SEED DATA
  try {
    await seedDatabase();
  } catch (e) {
    console.error("Error seeding database:", e);
  }

  return httpServer;
}

async function seedDatabase() {
  const users = await storage.getUsers();
  if (users.length === 0) {
    // create admin
    await storage.createUser({
      name: "مدير النظام",
      username: "admin",
      password: "admin123",
      role: "admin",
      schoolId: null
    });
    
    // create a school
    const school = await storage.createSchool({
      name: "مدرسة المعرفة الأهلية"
    });

    // create a principal
    await storage.createUser({
      name: "أحمد القائد",
      username: "principal",
      password: "123",
      role: "principal",
      schoolId: school.id
    });

    // create a teacher
    await storage.createUser({
      name: "محمد المعلم",
      username: "teacher",
      password: "123",
      role: "teacher",
      schoolId: school.id
    });
  }
}