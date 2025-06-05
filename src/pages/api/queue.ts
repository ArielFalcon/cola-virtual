import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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