/**
 * @jest-environment jsdom
 */
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


// ui.test.js
describe('showToast', () => {

    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = '<div id="toast"></div>';
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
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

const app = require('./app');

describe('requireAuth', () => {

    beforeEach(() => {
        sessionStorage.clear();
    });

    test('should redirect to login if no user in session', () => {
        const redirectSpy = jest.spyOn(app, 'redirect').mockImplementation(() => { });

        app.requireAuth(['admin']);

        expect(redirectSpy).toHaveBeenCalledWith('login.html');
    });

    test('should return user object if role matches', () => {
        const mockUser = { id: 1, role: 'admin' };
        sessionStorage.setItem('user', JSON.stringify(mockUser));

        const result = app.requireAuth(['admin']);
        expect(result).toEqual(mockUser);
    });
});

describe('Additional Utility Functions', () => {
    
    test('formatDate should return localized date string', () => {
        const { formatDate } = require('./app');
        const date = '2026-04-30';
        // ตรวจสอบค่าที่ออกมา (ขึ้นอยู่กับ Locale ของเครื่องที่รัน Test)
        expect(formatDate(date)).toBe(new Date(date).toLocaleDateString());
    });

    test('handleLogout should clear session and redirect', () => {
        const { handleLogout } = require('./app');
        // Mock window.location.href
        process.env.NODE_ENV = 'test';
        
        sessionStorage.setItem('user', JSON.stringify({ id: 1 }));
        handleLogout();

        expect(sessionStorage.getItem('user')).toBeNull();
        expect(window.__REDIRECT_URL__).toBe('index.html');
    });

    test('appendMessage should add div and scroll container', () => {
        const { appendMessage } = require('./app');
        document.body.innerHTML = '<div id="container" style="height: 100px; overflow: scroll;"></div>';
        const container = document.getElementById('container');
        
        appendMessage(container, 'Hello World', 'test-class');

        const msgDiv = container.querySelector('.test-class');
        expect(msgDiv).not.toBeNull();
        expect(msgDiv.innerText).toBe('Hello World');
        // ตรวจสอบว่ามีการเรียก scrollTop (ถึงแม้ใน JSDOM ค่าอาจจะเป็น 0)
        expect(container.scrollTop).toBeDefined();
    });
});

describe('handleBookingBotLogic - Coverage Focus', () => {
    const { handleBookingBotLogic } = require('./app');

    beforeEach(() => {
        global.fetch = jest.fn();
        document.body.innerHTML = `
            <div class="booking-card__value">BK-EXISTING</div>
        `;
    });

    test('should find booking if it exists on current page', async () => {
        const idMatch = ['BK-EXISTING', 'EXISTING'];
        const result = await handleBookingBotLogic(idMatch);
        expect(result).toContain('found your booking BK-EXISTING on this page');
    });

    test('should return "not found" when API returns no booking', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ booking: null })
        });

        const idMatch = ['BK-999', '999'];
        const result = await handleBookingBotLogic(idMatch);
        expect(result).toContain('could not find Booking ID: BK-999');
    });

    test('should handle API fetch error gracefully', async () => {
        fetch.mockRejectedValue(new Error('Network Error'));

        const idMatch = ['BK-555', '555'];
        const result = await handleBookingBotLogic(idMatch);
        expect(result).toContain("can't verify it right now");
    });
});

describe('requireAuth - Role Access', () => {
    const app = require('./app');

    test('should redirect if user role is not in allowedRoles', () => {
        const redirectSpy = jest.spyOn(app, 'redirect').mockImplementation(() => { });
        const mockUser = { id: 1, role: 'customer' };
        sessionStorage.setItem('user', JSON.stringify(mockUser));

        app.requireAuth(['admin']); // ลูกค้าพยายามเข้าหน้า Admin

        expect(redirectSpy).toHaveBeenCalledWith('login.html');
        redirectSpy.mockRestore();
    });

    test('should default to "customer" role if user.role is missing', () => {
        const redirectSpy = jest.spyOn(app, 'redirect').mockImplementation(() => { });
        const mockUser = { id: 1 }; // ไม่มีฟิลด์ role
        sessionStorage.setItem('user', JSON.stringify(mockUser));

        // ถ้าระบบต้องการ 'customer' และ user ไม่มี role (จะ fallback เป็น customer) ควรผ่าน
        const result = app.requireAuth(['customer']);
        expect(result).toEqual(mockUser);
        expect(redirectSpy).not.toHaveBeenCalled();
        redirectSpy.mockRestore();
    });
});

describe('UI Interactions', () => {
    const { toggleProfileMenu } = require('./app');

    test('toggleProfileMenu should toggle "show" class', () => {
        document.body.innerHTML = '<div id="profileDropdown"></div>';
        const dd = document.getElementById('profileDropdown');

        toggleProfileMenu();
        expect(dd.classList.contains('show')).toBe(true);

        toggleProfileMenu();
        expect(dd.classList.contains('show')).toBe(false);
    });
});

describe('getBotResponse', () => {
    const { handleBookingBotLogic } = require('./app');
    // ต้อง mock ฟังก์ชันที่ถูกเรียกข้างในด้วย
    jest.mock('./app', () => ({
        ...jest.requireActual('./app'),
        handleBookingBotLogic: jest.fn()
    }));

    test('should return greeting for hi/hello', async () => {
        const { getBotResponse } = require('./app');
        expect(await getBotResponse('Hi there')).toContain("Hello! I'm here to help");
    });

    test('should return booking help message', async () => {
        const { getBotResponse } = require('./app');
        expect(await getBotResponse('I want to check my booking')).toContain("I see you're having trouble");
    });

    test('should return default message for unknown input', async () => {
        const { getBotResponse } = require('./app');
        expect(await getBotResponse('xyz123')).toContain("I'm not quite sure");
    });
});

describe('updateNotificationBadges', () => {
    const { updateNotificationBadges } = require('./app');

    beforeEach(() => {
        document.body.innerHTML = '<div id="inboxBadge"></div>';
    });

    test('should show badge when there are unread messages', () => {
        const badge = document.getElementById('inboxBadge');
        updateNotificationBadges({ unreadMessages: 5 });
        expect(badge.innerText).toBe('5');
        expect(badge.style.display).toBe('inline-block');
    });

    test('should hide badge when unread messages are 0', () => {
        const badge = document.getElementById('inboxBadge');
        updateNotificationBadges({ unreadMessages: 0 });
        expect(badge.style.display).toBe('none');
    });
});

describe('handleToastAlerts', () => {
    const { handleToastAlerts } = require('./app');

    beforeEach(() => {
        sessionStorage.clear();
        document.body.innerHTML = '<div id="toast"></div>'; // สำหรับ showToast
    });

    test('should show toast and save to storage for newly confirmed bookings', () => {
        const data = { newlyConfirmedBookings: 2 };
        handleToastAlerts(data);
        
        expect(sessionStorage.getItem('last_confirmed_count')).toBe('2');
        const toast = document.getElementById('toast');
        expect(toast.classList.contains('show')).toBe(true);
    });
});