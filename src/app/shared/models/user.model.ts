export interface User {
    email: string;
    password: string;
}

export interface AuthError {
    isValid: false;
    message: string;
}