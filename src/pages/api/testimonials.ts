import type { APIRoute } from 'astro';
import { db } from '@/lib/firebase-admin';
import { redis } from '@/lib/redis';

const TESTIMONIALS_CACHE_KEY = 'cache:testimonials';

// POST: Crear o actualizar un testimonio
export const POST: APIRoute = async ({ request }) => {
    try {
        const { userId, name, occupation, message } = await request.json();

        if (!userId || !name || !occupation || !message) {
            return new Response(JSON.stringify({ error: 'Faltan campos requeridos.' }), { status: 400 });
        }

        if (name.length < 1 || name.length > 30) {
            return new Response(JSON.stringify({ error: 'El nombre debe tener entre 1 y 30 caracteres.' }), { status: 400 });
        }

        if (occupation.length < 1 || occupation.length > 30) {
            return new Response(JSON.stringify({ error: 'La ocupación debe tener entre 1 y 30 caracteres.' }), { status: 400 });
        }

        if (message.length < 1 || message.length > 300) {
            return new Response(JSON.stringify({ error: 'El mensaje debe tener entre 1 y 300 caracteres.' }), { status: 400 });
        }

        const testimonialRef = db.collection('testimonials').doc(userId);
        
        const testimonialData = {
            name,
            occupation,
            message,
            createdAt: new Date(),
        };
        await testimonialRef.set(testimonialData, { merge: true });

        // Invalidate the cache after a new testimonial is posted
        try {
            console.log('New testimonial posted, invalidating cache...');
            await redis.del(TESTIMONIALS_CACHE_KEY);
            console.log('Cache invalidated successfully.');
        } catch (cacheError) {
            console.error('Error invalidating testimonials cache:', cacheError);
            //The cache will expire on its own via TTL.
        }

        const newTestimonial = {
            id: userId,
            ...testimonialData,
        };

        return new Response(JSON.stringify(newTestimonial), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Error creating or updating testimonial', { status: 500 });
    }
};

// DELETE: Borrar un testimonio
export const DELETE: APIRoute = async ({ request }) => {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return new Response('userId is required to delete a testimonial', { status: 400 });
        }

        const testimonialRef = db.collection('testimonials').doc(userId);
        const doc = await testimonialRef.get();

        if (!doc.exists) {
            return new Response('Testimonial not found', { status: 404 });
        }
        
        await testimonialRef.delete();

        return new Response(JSON.stringify({ success: true, message: 'Testimonial deleted' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response('Error deleting testimonial', { status: 500 });
    }
}; 