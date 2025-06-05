import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Instantiate the Redis client with credentials from environment variables
const redis = new Redis({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "30 s"), // 1 request per 30 seconds
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(/, /)[0] : clientAddress;

  console.log(`[Rate Limit] Recibida petición desde la IP: ${ip}`);

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please try again after some seconds.",
        limit,
        remaining,
        reset
      }),
      { status: 429 }
    );
  }

  try {
    let { userId } = await request.json().catch(() => ({ userId: null }));

    if (!userId) {
      userId = uuidv4();
    }

    const queueRef = db.collection('queue');
    const existingUser = await queueRef.where('userId', '==', userId).get();

    if (existingUser.empty) {
      await queueRef.add({
        userId,
        createdAt: new Date(),
      });
    }

    return new Response(JSON.stringify({ userId }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error processing request', { status: 500 });
  }
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response('userId is required', { status: 400 });
  }

  try {
    const queueRef = db.collection('queue');
    const snapshot = await queueRef.orderBy('createdAt', 'asc').get();

    let position = -1;
    let total = snapshot.size;

    snapshot.docs.forEach((doc, index) => {
      if (doc.data().userId === userId) {
        position = index + 1;
      }
    });

    if (position === -1) {
        return new Response(JSON.stringify({ error: 'User not found in queue' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ position, total }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error processing request', { status: 500 });
  }
}; 