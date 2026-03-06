import { z } from 'zod';
import { 
  insertSchoolSchema, schools,
  insertUserSchema, users,
  insertFlagSchema, flags,
  insertEvidenceSchema, evidences,
  insertIndicatorSchema, indicators,
  insertEvaluationSchema, evaluations
} from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ success: z.boolean() })
      }
    }
  },
  schools: {
    list: {
      method: 'GET' as const,
      path: '/api/schools' as const,
      responses: { 200: z.array(z.custom<typeof schools.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/schools' as const,
      input: insertSchoolSchema,
      responses: { 201: z.custom<typeof schools.$inferSelect>() }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/schools/:id' as const,
      responses: { 204: z.void() }
    }
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: { 200: z.array(z.custom<typeof users.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/users' as const,
      input: insertUserSchema,
      responses: { 201: z.custom<typeof users.$inferSelect>() }
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/users/:id' as const,
      input: insertUserSchema.partial(),
      responses: { 200: z.custom<typeof users.$inferSelect>() }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/users/:id' as const,
      responses: { 204: z.void() }
    }
  },
  flags: {
    list: {
      method: 'GET' as const,
      path: '/api/flags' as const,
      responses: { 200: z.array(z.custom<typeof flags.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/flags' as const,
      input: insertFlagSchema,
      responses: { 201: z.custom<typeof flags.$inferSelect>() }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/flags/:id' as const,
      responses: { 204: z.void() }
    }
  },
  evidences: {
    list: {
      method: 'GET' as const,
      path: '/api/evidences' as const,
      responses: { 200: z.array(z.custom<typeof evidences.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/evidences' as const,
      input: insertEvidenceSchema,
      responses: { 201: z.custom<typeof evidences.$inferSelect>() }
    },
    approve: {
      method: 'POST' as const,
      path: '/api/evidences/:id/approve' as const,
      responses: { 200: z.custom<typeof evidences.$inferSelect>() }
    }
  },
  indicators: {
    list: {
      method: 'GET' as const,
      path: '/api/indicators' as const,
      responses: { 200: z.array(z.custom<typeof indicators.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/indicators' as const,
      input: insertIndicatorSchema,
      responses: { 201: z.custom<typeof indicators.$inferSelect>() }
    },
    approve: {
      method: 'POST' as const,
      path: '/api/indicators/:id/approve' as const,
      responses: { 200: z.custom<typeof indicators.$inferSelect>() }
    }
  },
  evaluations: {
    list: {
      method: 'GET' as const,
      path: '/api/evaluations' as const,
      responses: { 200: z.array(z.custom<typeof evaluations.$inferSelect>()) }
    },
    start: {
      method: 'POST' as const,
      path: '/api/evaluations/start' as const,
      input: z.object({ teacherId: z.number() }),
      responses: { 201: z.custom<typeof evaluations.$inferSelect>() }
    }
  },
  ai: {
    chat: {
      method: 'POST' as const,
      path: '/api/ai/chat' as const,
      input: z.object({ message: z.string() }),
      responses: { 200: z.object({ reply: z.string() }) }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
