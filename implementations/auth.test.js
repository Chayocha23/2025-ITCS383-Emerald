/**
 * @jest-environment jsdom
 */

// Mocking window.location.href
delete window.location;
window.location = { href: '' };

describe('SpaceHub Auth Utilities', () => {
    beforeEach(() => {
        sessionStorage.clear();
        window.location.href = '';
        jest.clearAllMocks();
    });

    test('requireAuth: redirects to login if no user in session', () => {
        const result = requireAuth(['admin']);
        expect(window.location.href).toBe('login.html');
        expect(result).toBeNull();
    });

    test('requireAuth: redirects if user role is not allowed', () => {
        sessionStorage.setItem('user', JSON.stringify({ role: 'customer' }));
        const result = requireAuth(['admin']);
        expect(window.location.href).toBe('login.html');
        expect(result).toBeNull();
    });

    test('requireAuth: returns user if role is authorized', () => {
        const user = { role: 'admin' };
        sessionStorage.setItem('user', JSON.stringify(user));
        const result = requireAuth(['admin']);
        expect(result).toEqual(user);
    });

    test('handleLogout: clears session and redirects to index', () => {
        sessionStorage.setItem('user', 'some-data');
        handleLogout();
        expect(sessionStorage.getItem('user')).toBeNull();
        expect(window.location.href).toBe('index.html');
    });
});
