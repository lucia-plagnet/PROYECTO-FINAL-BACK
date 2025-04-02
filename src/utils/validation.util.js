export const registerValidationRules = [
    { name: 'username', type: 'string', minLength: 3 },
    { name: 'email', type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { name: 'password', type: 'string', pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/ },
];

export const loginValidationRules = [
    { name: 'email', type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { name: 'password', type: 'string' },
];

export const resetPasswordValidationRules = [
    { name: 'email', type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
];

export const rewritePasswordValidationRules = [
    { name: 'password', type: 'string', pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/ },
    { name: 'reset_token', type: 'string' },
];