/**
 * @jest-environment jsdom
 */

import {
    showToast,
    requireAuth,
    handleLogout,
    toggleProfileMenu,
    formatCurrency,
    formatDate,
    generateRandomID,
    handleBookingBotLogic,
    getBotResponse
} from './app'; // adjust path

// ─────────────────────────────
// Mock global objects
// ─────────────────────────────

beforeEach(() => {
    document.body.innerHTML = `
        <div id="toast"></div>
        <div id="profileDropdown" class=""></div>
        <div class="profile-menu"></div>
    `;

    jest.useFakeTimers();

    // Mock sessionStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();

    // Mock location
    delete window.location;
    window.location = { href: "" };

    // Mock fetch
    global.fetch = jest.fn();
});

// ─────────────────────────────
// showToast
// ─────────────────────────────

test('showToast displays message and hides after timeout', () => {
    const toast = document.getElementById('toast');

    showToast("Hello", "success");

    expect(toast.classList.contains('show')).toBe(true);
    expect(toast.textContent).toContain("Hello");

    // fast-forward timer
    jest.runAllTimers();

    expect(toast.classList.contains('show')).toBe(false);
});

// ─────────────────────────────
// requireAuth
// ─────────────────────────────

test('requireAuth redirects if no user', () => {
    sessionStorage.getItem.mockReturnValue(null);

    const result = requireAuth(['admin']);

    expect(result).toBeNull();
    expect(window.location.href).toBe('login.html');
});

test('requireAuth returns user if role allowed', () => {
    sessionStorage.getItem.mockReturnValue(JSON.stringify({ role: 'admin' }));

    const user = requireAuth(['admin']);

    expect(user.role).toBe('admin');
});

test('requireAuth redirects if role not allowed', () => {
    sessionStorage.getItem.mockReturnValue(JSON.stringify({ role: 'customer' }));

    requireAuth(['admin']);

    expect(window.location.href).toBe('login.html');
});

// ─────────────────────────────
// handleLogout
// ─────────────────────────────

test('handleLogout clears session and redirects', () => {
    handleLogout();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('user');
    expect(window.location.href).toBe('index.html');
});

// ─────────────────────────────
// toggleProfileMenu
// ─────────────────────────────

test('toggleProfileMenu toggles class', () => {
    const dd = document.getElementById('profileDropdown');

    toggleProfileMenu();
    expect(dd.classList.contains('show')).toBe(true);

    toggleProfileMenu();
    expect(dd.classList.contains('show')).toBe(false);
});

// ─────────────────────────────
// formatCurrency
// ─────────────────────────────

test('formatCurrency formats correctly', () => {
    const result = formatCurrency(10000);

    expect(result).toBe('฿10,000');
});

// ─────────────────────────────
// formatDate
// ─────────────────────────────

test('formatDate returns formatted date', () => {
    const result = formatDate('2024-01-01');

    expect(typeof result).toBe('string');
});

// ─────────────────────────────
// generateRandomID
// ─────────────────────────────

test('generateRandomID format is correct', () => {
    const id = generateRandomID();

    expect(id).toMatch(/^BK-[0-9A-F]{4}$/);
});

// ─────────────────────────────
// getBotResponse
// ─────────────────────────────

test('getBotResponse returns greeting', async () => {
    const res = await getBotResponse("hello");

    expect(res).toContain("Hello");
});

test('getBotResponse detects booking keyword', async () => {
    const res = await getBotResponse("booking issue");

    expect(res).toContain("trouble");
});

// ─────────────────────────────
// handleBookingBotLogic
// ─────────────────────────────

test('returns invalid format message', async () => {
    const res = await handleBookingBotLogic(["BK-@@@"]);

    expect(res).toBe("Invalid Booking ID format.");
});

test('returns found booking from DOM', async () => {
    document.body.innerHTML += `
        <div class="booking-card__value">BK-1234</div>
    `;

    const res = await handleBookingBotLogic(["BK-1234", "1234"]);

    expect(res).toContain("found your booking");
});

test('fetch success case', async () => {
    fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
            booking: { status: "confirmed" }
        })
    });

    const res = await handleBookingBotLogic(["BK-5678", "5678"]);

    expect(res).toContain("confirmed");
});

test('fetch failure case', async () => {
    fetch.mockRejectedValue(new Error("fail"));

    const res = await handleBookingBotLogic(["BK-5678", "5678"]);

    expect(res).toContain("can't verify");
});