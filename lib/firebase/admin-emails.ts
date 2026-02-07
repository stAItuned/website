export const ADMIN_EMAILS = [
    'daniele@staituned.com',
    'danielemoltisanti@gmail.com',
    // Add more authorized emails here
];

export const isAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
};
