export const NotFoundError = (message: string) => ({
    name: "NotFoundError",
    message,
});

export const ValidationError = (message: string) => ({
    name: "ValidationError",
    message,
});
