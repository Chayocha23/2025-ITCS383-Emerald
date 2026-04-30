const { 
    formatCurrency, 
    getValidatedId, 
    requireAuth, 
    showToast, 
    handleBookingBotLogic 
} = require('./app');

describe('SpaceHub Utility Functions', () => {
    test('formatCurrency should return formatted Thai Baht', () => {
        expect(formatCurrency(1000)).toBe('฿1,000');
        expect(formatCurrency(50.5)).toBe('฿50.5');
    });

    test('getValidatedId should validate numeric IDs correctly', () => {
        expect(getValidatedId("123")).toBe(123);
        expect(getValidatedId("abc")).toBeNull();
        expect(getValidatedId("-5")).toBeNull();
        expect(getValidatedId(null)).toBeNull();
    });
});

// auth.test.js
describe('requireAuth', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        delete window.location;
        window.location = { ...originalLocation, href: '' }; 
        sessionStorage.clear();
    });

    afterAll(() => {
        window.location = originalLocation;
    });

    test('should redirect to login if no user in session', () => {
        requireAuth(['admin']);
        expect(window.location.href).toBe('login.html');
    });

    test('should return user object if role matches', () => {
        const mockUser = { id: 1, role: 'admin' };
        sessionStorage.setItem('user', JSON.stringify(mockUser));
        const result = requireAuth(['admin']);
        expect(result).toEqual(mockUser);
    });
});

// ui.test.js
describe('showToast', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // ✅ เปิดใช้งาน Fake Timers[cite: 18]
        document.body.innerHTML = '<div id="toast"></div>';
    });

    afterEach(() => {
        jest.useRealTimers(); 
    });

    test('should display toast and remove "show" class after 3.5 seconds', () => {
        showToast('Test Message', 'success');
        const toast = document.getElementById('toast');
        
        expect(toast.className).toContain('toast--success');
        expect(toast.classList.contains('show')).toBe(true);

        jest.advanceTimersByTime(3500); // ✅ เร่งเวลา[cite: 18]

        expect(toast.classList.contains('show')).toBe(false);
    });
});

// api.test.js
describe('handleBookingBotLogic', () => {
    beforeEach(() => {
        global.fetch = jest.fn(); // ✅ Mock fetch[cite: 18]
        document.body.innerHTML = '<div class="booking-card__value">BK-123</div>';
    });

    test('should return status from API for valid booking ID', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ booking: { status: 'confirmed' } })
        });

        const idMatch = ['BK-456', '456'];
        const result = await handleBookingBotLogic(idMatch);
        
        expect(result).toContain('is confirmed');
        expect(fetch).toHaveBeenCalledWith('/api/bookings/456');
    });

    test('should return error message for invalid format', async () => {
        const idMatch = ['BK-!!!', '!!!'];
        const result = await handleBookingBotLogic(idMatch);
        expect(result).toBe('Invalid Booking ID format.');
    });
});
