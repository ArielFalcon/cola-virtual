import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { defineMiddleware } from "astro:middleware";

const redis = new Redis({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
});

const postQueueRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "30 s"), // 1 petición por 30 segundos
  analytics: true,
  prefix: "@upstash/ratelimit-post-queue",
});

const getQueueRatelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 peticiones por 10 segundos
    analytics: true,
    prefix: "@upstash/ratelimit-get-queue",
});

// Límite para la API de testimonios
const testimonialsRatelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(2, "60 s"), // 2 peticiones (crear, borrar) por minuto
    analytics: true,
    prefix: "@upstash/ratelimit-testimonials",
});

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);
  
    if (url.pathname.startsWith('/api/queue')) {
        const ip = context.clientAddress;
        if (!ip) {
          return next();
        }

        if (context.request.method === 'POST') {
            const { success, limit, remaining, reset } = await postQueueRatelimit.limit(ip);
            
            context.locals.rateLimit = { limit, remaining, reset };
        
            if (!success) {
                return new Response(JSON.stringify({ error: "Demasiadas peticiones. Por favor, inténtalo de nuevo en unos segundos." }), {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                });
            }
        }
    
        if (context.request.method === 'GET') {
            const { success, limit, remaining, reset } = await getQueueRatelimit.limit(ip);
            
            context.locals.rateLimit = { limit, remaining, reset };
        
            if (!success) {
                return new Response(JSON.stringify({ error: "Demasiadas peticiones." }), {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                });
            }
        }
    }
  
    // --- Nueva lógica para /api/testimonials ---
    if (url.pathname.startsWith('/api/testimonials')) {
        // GET no tiene límite, solo POST y DELETE
        if (context.request.method === 'POST' || context.request.method === 'DELETE') {
            const ip = context.clientAddress;
            if (!ip) {
                return next();
            }

            const { success, limit, remaining, reset } = await testimonialsRatelimit.limit(ip);
            
            context.locals.rateLimit = { limit, remaining, reset };
        
            if (!success) {
                return new Response(JSON.stringify({ error: "Demasiadas peticiones. Por favor, inténtalo de nuevo en un minuto." }), {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                });
            }
        }
    }
    
    return next();
}); 