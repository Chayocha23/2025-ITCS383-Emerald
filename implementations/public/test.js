const { formatCurrency, getValidatedId } = require('./app'); // ✅ // Import and use the function

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

// utilities.test.js
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
    beforeEach(() => {
        delete window.location;
        window.location = { href: '' };
        sessionStorage.clear();
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
        document.body.innerHTML = '<div id="toast"></div>';
    });

    test('should display toast with correct message and type', () => {
        showToast('Success Message', 'success');
        const toast = document.getElementById('toast');
        
        expect(toast.className).toContain('toast--success');
        expect(toast.textContent).toContain('Success Message');
        expect(toast.textContent).toContain('✓'); // Check icon
    });
});

// api.test.js
describe('handleBookingBotLogic', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('should return status from API for valid booking ID', async () => {
        // Mock API response
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ booking: { status: 'confirmed' } })
        });

        const idMatch = ['BK-123', '123'];
        const result = await handleBookingBotLogic(idMatch);
        
        expect(result).toContain('is confirmed');
        expect(fetch).toHaveBeenCalledWith('/api/bookings/123');
    });

    test('should return error message for invalid format', async () => {
        const idMatch = ['BK-!!!', '!!!'];
        const result = await handleBookingBotLogic(idMatch);
        expect(result).toBe('Invalid Booking ID format.');
    });
});

// ui.test.js
describe('showToast', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // ✅ เปิดใช้งาน Fake Timers
        document.body.innerHTML = '<div id="toast"></div>';
    });

    afterEach(() => {
        jest.useRealTimers(); // คืนค่าเดิมหลังจบ Test
    });

    test('should remove "show" class after 3.5 seconds', () => {
        showToast('Test Message', 'success');
        const toast = document.getElementById('toast');
        
        expect(toast.classList.contains('show')).toBe(true);

        jest.advanceTimersByTime(3500); // ✅ เร่งเวลาไป 3.5 วินาทีทันที

        expect(toast.classList.contains('show')).toBe(false);
    });
});

// auth.test.js
describe('requireAuth', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        delete window.location;
        window.location = { ...originalLocation, href: '' }; // ✅ จำลองแบบปลอดภัย
        sessionStorage.clear();
    });

    afterAll(() => {
        window.location = originalLocation;
    });
    // ... test cases ...
});

const { requireAuth } = require('./app'); // ✅ ดึงฟังก์ชันมาใช้

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

const { showToast } = require('./app'); // ✅ ดึงฟังก์ชันมาใช้

describe('showToast', () => {
    beforeEach(() => {
        jest.useFakeTimers(); 
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

        jest.advanceTimersByTime(3500); 

        expect(toast.classList.contains('show')).toBe(false);
    });
});

const { showToast } = require('./app'); // ✅ ดึงฟังก์ชันมาใช้

describe('showToast', () => {
    beforeEach(() => {
        jest.useFakeTimers(); 
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

        jest.advanceTimersByTime(3500); 

        expect(toast.classList.contains('show')).toBe(false);
    });
});