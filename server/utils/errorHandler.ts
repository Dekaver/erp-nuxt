import { type H3Event, type EventHandlerRequest } from 'h3';

export const NotFoundError = (message: string) => ({
    name: "NotFoundError",
    message,
});

export const ValidationError = (message: string) => ({
    name: "ValidationError",
    message,
});


export function handleError(event: H3Event<EventHandlerRequest>, error: any) {
    const formattedError = {
        status: 500,
        message: 'Internal Server Error',
        details: null,
    };

    
    if (error.name === 'ZodError') {
        formattedError.status = 400;
        formattedError.message = 'Validation Error';
        formattedError.details = error.errors;
    } else if (error.message) {
        formattedError.message = error.message;
    }
    
    event.node.res.statusCode = error.status || 500;
    return formattedError;
}
