// ──────────────────────────────────────────
// SpaceHub — Shared Frontend Utilities
// ──────────────────────────────────────────

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast toast--${type} show`;

    // 1. Clear all existing content first
    toast.textContent = '';

    // 2. Create an element for the icon (100% safe since innerHTML is not used)
    const iconSpan = document.createElement('span');
    iconSpan.textContent = type === 'success' ? '✓ ' : '✕ ';
    toast.appendChild(iconSpan);

    // 3. Use createTextNode for the message text (100% safe)
    const textNode = document.createTextNode(message);
    toast.appendChild(textNode);

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function requireAuth(allowedRoles) {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
        window.location.href = 'login.html';
        return null;
    }
    const user = JSON.parse(userData);
    if (allowedRoles && !allowedRoles.includes(user.role || 'customer')) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function handleLogout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

function toggleProfileMenu() {
    const dd = document.getElementById('profileDropdown');
    if (dd) dd.classList.toggle('show');
}

document.addEventListener('click', (e) => {
    const menu = document.querySelector('.profile-menu');
    if (menu && !menu.contains(e.target)) {
        const dd = document.getElementById('profileDropdown');
        if (dd) dd.classList.remove('show');
    }
});

function formatCurrency(amount) {
    return '฿' + Number(amount).toLocaleString();
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString();
}

// ──────────────────────────────────────────
// Floating Chat Support Logic
// ──────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────────
// Floating Chat Support Logic (Feature 1)
// ──────────────────────────────────────────────────────────────────────────

function initFloatingChat() {
    const toggle = document.getElementById('chatToggle');
    const chatWin = document.getElementById('chatWindow');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    if (!toggle || !chatWin) return;

    toggle.addEventListener('click', () => chatWin.classList.toggle('show'));

    if (sendBtn && userInput) {
        const sendMessage = async () => {
            const text = userInput.value.trim();
            if (!text) return;

            // แสดงข้อความ User
            appendMessage(chatMessages, text, 'user-message');
            userInput.value = '';

            // บอทตอบสนอง
            setTimeout(async () => {
                const response = await getBotResponse(text); // ✅ เรียกใช้ฟังก์ชันที่แยกไว้ข้างนอก
                appendMessage(chatMessages, response, 'bot-message');
            }, 1000);
        };

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    }
}

async function getBotResponse(text) {
    const lowerText = text.toLowerCase();
    const idMatch = text.match(/BK-?([\w\d]+)/i);

    if (idMatch) return await handleBookingBotLogic(idMatch); // Return Early
    if (lowerText.includes("hi") || lowerText.includes("hello")) return "Hello! I'm here to help...";
    if (lowerText.includes("booking") || lowerText.includes("reserve")) return "I see you're having trouble...";

    return "I'm not quite sure I understand...";
}


async function handleBookingBotLogic(idMatch) {
    const bookingIdRaw = idMatch[1].toUpperCase();
    const fullBookingId = idMatch[0].toUpperCase();

    if (!/^[A-Z0-9]+$/.test(bookingIdRaw)) {
        return "Invalid Booking ID format.";
    }
    const allIDs = Array.from(document.querySelectorAll('.booking-card__value'))
        .map(el => el.innerText?.toUpperCase());
    if (allIDs.includes(fullBookingId)) {
        return `I have found your booking ${fullBookingId} on this page.`;
    }

    try {
        const res = await fetch(`/api/bookings/${bookingIdRaw}`);
        const data = await res.json();
        return (res.ok && data.booking)
            ? `I've checked our database. Booking ${fullBookingId} is ${data.booking.status}.`
            : `I'm sorry, I couldn't find Booking ID: ${fullBookingId}.`;
    } catch (e) {
        return `I found the ID ${fullBookingId}, but I can't verify it right now.`;
    }
}

// Function to generate a random Booking ID (e.g., BK-7A92)
function generateRandomID() {
    const chars = '0123456789ABCDEF';
    let result = 'BK-';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// Example: const id = generateRandomID();

function notifyUserOfReply(ticketId) {
    const message = `Admin has replied to your Support Ticket #${ticketId}. Check your inbox!`;
    // เรียกใช้ฟังก์ชันแจ้งเตือนที่เราสร้างไว้ก่อนหน้านี้
    addMockNotification(message);

    // เปลี่ยนไอคอนกระดิ่งเป็นรูปจดหมายชั่วคราวเพื่อให้สะดุดตา
    const notiIcon = document.querySelector('.noti-icon');
    if (notiIcon) notiIcon.innerText = '📩';
}

// ในไฟล์ app.js
async function checkNewMessages() {
    const userData = sessionStorage.getItem('user');
    if (!userData) return;

    try {
        const user = JSON.parse(userData);
        // 1. แปลงเป็นตัวเลข Integer และฐาน 10 ให้ชัดเจน (Sanitization)
        const userId = parseInt(user.id, 10);

        // 2. ตรวจสอบด้วย Regex เพื่อให้ SonarQube มั่นใจว่าเป็นแค่ตัวเลขเท่านั้น (Validation)
        // และเช็คว่าต้องไม่ใช่ NaN และมากกว่า 0
        if (isNaN(userId) || userId <= 0 || !/^\d+$/.test(user.id.toString())) {
            console.error("Security Alert: Invalid User ID format");
            return;
        }

        // 3. ใช้ตัวแปรที่ผ่านการ Clean มาแล้ว (userId) ในการเรียก fetch
        const res = await fetch(`/api/user/unread-messages?userId=${userId}`);
        const data = await res.json();

        const badge = document.getElementById('notiBadge');
        const inboxCount = document.getElementById('inboxCount');

        if (data.unreadCount > 0) {
            badge.innerText = data.unreadCount;
            badge.style.display = 'flex'; // แสดงจุดแดงบนวงกลม Profile
            if (inboxCount) inboxCount.innerText = `(${data.unreadCount})`;
        } else {
            badge.style.display = 'none';
        }
    } catch (err) {
        console.error("Live check failed");
    }
}

// เริ่มทำงานและเช็คทุกๆ 5 วินาที
if (sessionStorage.getItem('user')) {
    checkNewMessages();
    setInterval(checkNewMessages, 5000);
}

async function syncUnreadNotifications() {
    const userData = sessionStorage.getItem('user');
    if (!userData) return;
    const user = JSON.parse(userData);
    const userId = user.id;

    if (!userId || isNaN(userId)) {
        console.error("Security Alert: Invalid User ID");
        return;
    }

    try {
        // ยิงไปที่ Endpoint ที่เราสร้างไว้ใน server.js
        const res = await fetch(`/api/user/unread-messages?userId=${userId}`);
        const data = await res.json();

        const badge = document.getElementById('inboxBadge');
        if (badge) {
            if (data.unreadCount > 0) {
                badge.innerText = data.unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (err) {
        console.error("Notification sync error:", err);
    }
}

async function updateNotificationSystem() {
    const userData = sessionStorage.getItem('user');
    if (!userData) return;
    const user = JSON.parse(userData);

    try {
        const res = await fetch(`/api/user/notifications?userId=${userId}`);
        const data = await res.json();

        // แสดงตัวเลขที่เมนู Messages
        const inboxBadge = document.getElementById('inboxBadge');
        if (inboxBadge) {
            inboxBadge.innerText = data.unreadMessages;
            inboxBadge.style.display = data.unreadMessages > 0 ? 'inline-flex' : 'none';
        }

        // แสดงแจ้งเตือนบนหน้าจอ (Toast) ถ้ามีการอัปเดตสถานะการจอง
        if (data.unreadBookings > 0) {
            showToast(`You have ${data.confirmedBookings} confirmed booking(s)!`, 'success');
        }
    } catch (err) {
        console.error("Notification sync error:", err);
    }
}

// ใน app.js แทนที่ฟังก์ชัน checkGlobalNotifications เดิมด้วยอันนี้:

async function checkUpcomingReservations(userId) {
    if (!userId || isNaN(userId)) return; // ตรวจสอบความปลอดภัย (SSRF Fix)

    const bookingRes = await fetch(`/api/bookings/user/${userId}`);
    const bookingData = await bookingRes.json();

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const hasUpcoming = bookingData.bookings.some(b =>
        (b.booking_date.startsWith(todayStr) || b.booking_date.startsWith(tomorrowStr))
        && b.status === 'confirmed'
    );

    const alertBanner = document.getElementById('upcomingAlert');
    if (alertBanner) {
        alertBanner.style.display = hasUpcoming ? 'flex' : 'none';
        const upcomingText = document.getElementById('upcomingText');
        if (upcomingText && hasUpcoming) {
            const isTomorrow = bookingData.bookings.some(b => b.booking_date.startsWith(tomorrowStr));
            upcomingText.innerText = isTomorrow
                ? "Reminder: You have a reservation scheduled for tomorrow!"
                : "You have a reservation coming up today!";
        }
    }
}

// ✅ ฟังก์ชันย่อยสำหรับอัปเดต Badge (Single Responsibility)
function updateNotificationBadges(data) {
    const badge = document.getElementById('inboxBadge');
    if (badge) {
        badge.innerText = data.unreadMessages;
        badge.style.display = data.unreadMessages > 0 ? 'inline-block' : 'none';
    }
}

function handleToastAlerts(data) {
    // แจ้งเตือนเมื่อมีการ Confirm การจองใหม่
    if (data.newlyConfirmedBookings > 0) {
        const lastNotified = sessionStorage.getItem('last_confirmed_count');
        if (lastNotified != data.newlyConfirmedBookings) {
            showToast(`Your booking has been confirmed!`, 'success');
            sessionStorage.setItem('last_confirmed_count', data.newlyConfirmedBookings);
        }
    }

    // แจ้งเตือน Admin เมื่อมีรายการรอการยืนยัน
    if (data.pendingActionBookings > 0) {
        const lastPendingCount = sessionStorage.getItem('last_pending_count');
        if (lastPendingCount != data.pendingActionBookings) {
            showToast(`There are ${data.pendingActionBookings} bookings waiting.`, 'info');
            sessionStorage.setItem('last_pending_count', data.pendingActionBookings);
        }
    }
}

async function checkGlobalNotifications() {
    const userData = sessionStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);
    try {
        const res = await fetch(`/api/user/notifications?userId=${userId}`);
        const data = await res.json();

        // ✅ เรียกใช้ฟังก์ชันย่อยที่คุณแยกออกมาแล้ว
        updateNotificationBadges(data);

        if (user.role === 'customer') {
            await checkUpcomingReservations(user.id);
        }

        handleToastAlerts(data);
    } catch (err) { /* silent error */ }
}

// รันทุก 5-10 วินาที
setInterval(checkGlobalNotifications, 3000);

// สั่งให้ทำงานเมื่อโหลดหน้าจอ และเช็คซ้ำทุก 10 วินาที (Real-time กลายๆ)
document.addEventListener('DOMContentLoaded', () => {
    syncUnreadNotifications();
    setInterval(syncUnreadNotifications, 10000);
    initFloatingChat();
    checkGlobalNotifications();
});
