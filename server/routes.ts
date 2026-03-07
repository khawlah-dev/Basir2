import "dotenv/config";
import express, { type Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { type InsertEvidence } from "@shared/schema";
import expressSession from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";

let API_KEYS: string[] = [];
let currentKeyIndex = 0;

function getNextApiKey() {
  if (API_KEYS.length === 0 && process.env.GEMINI_API_KEY) {
    API_KEYS = process.env.GEMINI_API_KEY.split(",").map(k => k.trim());
  }
  if (API_KEYS.length === 0) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

async function callGemini(prompt: string, imagesBase64: string[] = []) {
  console.log("Calling Gemini API...");
  const apiKey = getNextApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  console.log("Gemini URL (key hidden):", url.replace(apiKey, "HIDDEN"));

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

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Multer configuration
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storageConfig,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  });

  // Static files for uploads
  app.use("/uploads", (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  }, express.static(uploadDir));

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

  app.post(api.evidences.create.path, upload.single('file'), async (req, res) => {
    try {
      const teacherId = parseInt(req.body.teacherId);
      const criteria = req.body.criteria;
      const description = req.body.description;

      if (isNaN(teacherId)) {
        console.error("Teacher ID is NaN:", req.body.teacherId);
        return res.status(400).json({ message: "Invalid Teacher ID" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const mimeType = req.file.mimetype;
      let fileType = "document";

      if (mimeType.startsWith("image/")) fileType = "image";
      else if (mimeType.startsWith("video/")) fileType = "video";

      const evidenceData: InsertEvidence = {
        teacherId,
        criteria,
        description,
        fileUrl,
        fileType
      };

      const evidence = await storage.createEvidence(evidenceData);
      res.status(201).json(evidence);
    } catch (e: any) {
      console.error("Evidence creation error:", e);
      res.status(400).json({ message: e.message || "Invalid request" });
    }
  });

  app.patch(api.evidences.update.path, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.evidences.update.input.parse(req.body);
    const evidence = await storage.updateEvidence(id, input);
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });
    res.json(evidence);
  });

  app.delete(api.evidences.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid evidence ID" });
      }
      await storage.deleteEvidence(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting evidence:", error);
      res.status(500).json({ message: "Failed to delete evidence" });
    }
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
    console.log("Evaluation start requested for teacher:", req.body.teacherId);
    try {
      const { teacherId } = api.evaluations.start.input.parse(req.body);
      const evaluatorId = (req.session as any).userId;
      console.log("Evaluator ID from session:", evaluatorId);

      // Get teacher evidences & indicators
      console.log("Fetching evidences and indicators for teacher...");
      const evidences = await storage.getEvidences();
      const teacherEvidences = evidences.filter(e => e.teacherId === teacherId && e.status === 'approved');

      const indicators = await storage.getIndicators();
      const teacherIndicators = indicators.filter(i => i.teacherId === teacherId && i.status === 'approved');

      // Get teacher flags (administrative notes)
      const flags = await storage.getFlags();
      const teacherFlags = flags.filter(f => f.teacherId === teacherId);
      console.log(`Found ${teacherEvidences.length} evidences, ${teacherIndicators.length} indicators, and ${teacherFlags.length} flags.`);

      // Combine them to prompt
      const prompt = `قم بتقييم هذا المعلم بناءً على الشواهد، المؤشرات، والملاحظات الإدارية التالية.
  المطلوب بدقة شديدة:
  1. استخراج درجة نهائية (totalScore) كـ "رقم عشري دقيق جداً للمفاضلة" (مثلاً 96.45 أو 88.12) من أصل 100 لتجنب التساوي بين المعلمين ذوي المستويات المتقاربة.
  2. تقديم تقييم لكل شاهد على حدة من حيث (الأصالة، الابتكار، والجهد).
  3. كتابة خلاصة للمفاضلة (tieBreakerSummary) واضحة جداً، وتنسيقها باستخدام Markdown وفق التالي حصراً:
     - **أبرز نقاط القوة:** (اذكر 2-3 نقاط قوة استثنائية من شواهده أو مؤشراته).
     - **نقاط تحتاج إلى تحسين (الضعف):** (اذكر 1-2 مجالات يمكن للمعلم تطويرها بناءً على النواقص أو الملاحظات الإدارية).
     - **مبرر الفواصل العشرية (المفاضلة):** (اشرح لماذا أخذ هذه الأعشار الدقيقة تحديداً، وكيف أثرت جودة الشواهد أو التطوع أو الالتزام عليها).

  المعايير الأساسية للتوزيع:
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

  الشواهد المعرفية:
  ${teacherEvidences.map((e, i) => `${i + 1}. ${e.criteria} - ${e.description}`).join('\n')}

  المؤشرات والجهود (تدريب/تطوع):
  ${teacherIndicators.map((e, i) => `${i + 1}. ${e.title} (${e.type}) - ${e.hours} ساعات`).join('\n')}

  الملاحظات الإدارية والانضباطية:
  ${teacherFlags.length > 0 ? teacherFlags.map((f, i) => `${i + 1}. ${f.note}`).join('\n') : "لا توجد ملاحظات إدارية."}

  قم بإرجاع التقييم بتنسيق JSON فقط كما يلي:
  {
    "totalScore": 96.45,
    "details": [
      { "criteria": "أداء الواجبات", "score": 9.5, "note": "ملاحظة..." }
    ],
    "tieBreakerSummary": "تفوق هذا المعلم بـ 0.45 نقطة بفضل مبادرته التطوعية الفريدة وخلو سجله من الملاحظات السلبية...",
    "summary": "ملخص عام لأداء المعلم"
  }
  `;

      const imageBase64s = []; // AI evaluation currently supports images only
      // We'll need to adapt this if we want Gemini to see the files from disk
      // For now, we'll keep it simple or just filter for images and read them
      for (const e of teacherEvidences) {
        if (e.fileType === 'image') {
          try {
            const filePath = path.join(process.cwd(), e.fileUrl.startsWith('/') ? e.fileUrl.slice(1) : e.fileUrl);
            const data = fs.readFileSync(filePath);
            const base64 = data.toString('base64');
            imageBase64s.push(`data:image/jpeg;base64,${base64}`);
          } catch (err) {
            console.error("Error reading image for Gemini:", err);
          }
        }
      }

      const resultText = await callGemini(prompt, imageBase64s);

      // Attempt to parse JSON from response
      let jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

      // Extract just the JSON object part to avoid markdown text before/after causing parse errors
      const startIndex = jsonStr.indexOf('{');
      const endIndex = jsonStr.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        jsonStr = jsonStr.substring(startIndex, endIndex + 1);
      }

      let aiResponse: any;
      try {
        console.log("Raw AI response text:", resultText);
        aiResponse = JSON.parse(jsonStr);
      } catch (parseError: any) {
        console.error("Failed to parse AI response as JSON:", parseError);
        console.error("Processed JSON string was:", jsonStr);
        // Fallback for non-JSON responses
        aiResponse = {
          totalScore: 0,
          tieBreakerSummary: resultText,
          summary: "فشل استخراج البيانات بصيغة JSON، تم حفظ الرد كنص."
        };
      }

      const evaluation = await storage.createEvaluation({
        teacherId,
        evaluatorId: evaluatorId || 1,
        totalScore: Number(aiResponse.totalScore) || 0,
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
      const prompt = `أنت المساعد الذكي التفاعلي لمنصة "بصير" التعليمية. مهمتك تقديم إجابات سريعة، مختصرة ومباشرة للمعلمين حول الشواهد والمؤشرات.
القواعد التوجيهية الصارمة:
1. الإجابة يجب أن تكون قصيرة جداً ومباشرة (موجزة قدر الإمكان).
2. استخدم القوائم النقطية (Bullet points) لسهولة القراءة.
3. ممنوع منعاً باتاً كتابة مقدمات إنشائية أو ترحيبات طويلة (مثل "أهلاً بك أيها المعلم الفاضل..."). ادخل في صلب الموضوع فوراً.
4. أعطِ أمثلة ملموسة عن الملفات التي يجب رفعها (مثل: ورقة عمل، صورة نشاط، شهادة حضور).
5. نسق النص باستخدام Markdown (الخط العريض للكلمات المهمة).

سؤال المعلم: ${message}`;

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

  // Ensure we have at least one school
  let school = (await storage.getSchools())[0];
  if (!school) {
    school = await storage.createSchool({
      name: "مدرسة المعرفة الأهلية"
    });
  }

  // Ensure 'admin' exists
  if (!users.find(u => u.username === "admin")) {
    await storage.createUser({
      name: "مدير النظام",
      username: "admin",
      password: "admin123",
      role: "admin",
      schoolId: null
    });
  }

  // Ensure 'principal' exists and has correct password
  const principal = users.find(u => u.username === "principal");
  if (!principal) {
    await storage.createUser({
      name: "أحمد القائد",
      username: "principal",
      password: "123",
      role: "principal",
      schoolId: school.id
    });
  } else if (principal.password !== "123") {
    await storage.updateUser(principal.id, { password: "123" });
  }

  // Ensure 'a123' (Khawlah) exists and has correct password
  const khawlah = users.find(u => u.username === "a123");
  if (!khawlah) {
    await storage.createUser({
      name: "خولة خالد",
      username: "a123",
      password: "123",
      role: "teacher",
      schoolId: school.id
    });
  } else if (khawlah.password !== "123") {
    await storage.updateUser(khawlah.id, { password: "123" });
  }
}