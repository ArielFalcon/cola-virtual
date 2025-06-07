import type { APIRoute } from 'astro';
import { db } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

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
    
    // Paso 1: Obtener el documento del usuario para saber su `createdAt`
    const userSnapshot = await queueRef.where('userId', '==', userId).limit(1).get();

    if (userSnapshot.empty) {
        return new Response(JSON.stringify({ error: 'User not found in queue' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const userCreatedAt = userSnapshot.docs[0].data().createdAt;

    // Paso 2 y 3: Ejecutar consultas de conteo en paralelo para máxima eficiencia
    const positionPromise = queueRef.where('createdAt', '<=', userCreatedAt).count().get();
    const totalPromise = queueRef.count().get();

    const [positionSnapshot, totalSnapshot] = await Promise.all([
        positionPromise,
        totalPromise,
    ]);

    const position = positionSnapshot.data().count;
    const total = totalSnapshot.data().count;

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