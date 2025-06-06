export type Testimonial = {
	id: string;
	createdAt: string; // ISO date string
	occupation: string;
	name: string;
	message: string;
};

export type TestimonialsResponse = Testimonial[];