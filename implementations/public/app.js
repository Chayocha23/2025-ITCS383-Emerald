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
    const close = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    if (toggle && chatWin) {
        // Toggle the chat window visibility
        toggle.addEventListener('click', () => chatWin.classList.toggle('show'));

        // Close chat window when clicking the 'X' button
        if (close) {
            close.addEventListener('click', () => chatWin.classList.remove('show'));
        }

        // Message sending logic
        if (sendBtn && userInput) {
            const sendMessage = () => {
                const text = userInput.value.trim();
                if (!text) return;

                // Display user's message bubble
                const msg = document.createElement('div');
                msg.className = 'user-message';
                msg.innerText = text;
                chatMessages.appendChild(msg);

                // Clear input field and scroll to the latest message
                userInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // ──────────────────────────────────────────────────────────────────────────
                // Database-Connected Chat Logic
                // ──────────────────────────────────────────────────────────────────────────

                // Database-Connected Chat Logic (Improved for Demo)
                setTimeout(async () => {

                    const botMsg = document.createElement('div');
                    botMsg.style.cssText = "align-self: flex-start; background: white; padding: 8px 12px; border-radius: 12px 12px 12px 0; font-size: 0.85rem; box-shadow: var(--shadow-sm);";

                    let responseText = "";
                    const lowerText = text.toLowerCase();
                    const idMatch = text.match(/BK-?([\w\d]+)/i);

                    // ✅ แยกฟังก์ชันตัดสินใจของบอท (Extract Function)
                    async function getBotResponse(text) {
                        const lowerText = text.toLowerCase();
                        const idMatch = text.match(/BK-?([\w\d]+)/i);

                        if (idMatch) return await handleBookingBotLogic(idMatch); // Return Early
                        if (lowerText.includes("hi") || lowerText.includes("hello")) return "Hello! I'm here to help...";
                        if (lowerText.includes("booking") || lowerText.includes("reserve")) return "I see you're having trouble...";

                        return "I'm not quite sure I understand...";
                    }

                    // ✅ แยกส่วนเช็คข้อมูลการจอง
                    async function handleBookingBotLogic(idMatch) {
                        const bookingIdRaw = idMatch[1].toUpperCase();
                        const fullBookingId = idMatch[0].toUpperCase();

                        if (!/^[A-Z0-9]+$/.test(bookingIdRaw)) return "Invalid Booking ID format.";

                        // ตรวจสอบบนหน้าจอ
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

                    if (lowerText.includes("hi") || lowerText.includes("hello")) {
                        responseText = "Hello! I'm here to help. To provide the best assistance, please tell me a bit about your issue (e.g., Booking error, Payment problem).";
                    }
                    else if (lowerText.includes("booking") || lowerText.includes("reserve")) {
                        responseText = "I see you're having trouble with a booking. Could you provide your Booking ID so I can check the status?";
                    }
                    else {
                        responseText = "I'm not quite sure I understand. Could you please specify your problem or provide a Booking ID (e.g., BK-7)?";
                    }

                    botMsg.innerText = responseText;
                    chatMessages.appendChild(botMsg);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            };

            // Trigger send on button click
            sendBtn.addEventListener('click', sendMessage);

            // Trigger send on 'Enter' key press
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
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
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return;

    try {
        const userId = user.id;
        if (!userId || isNaN(userId)) {
            console.error("Invalid User ID");
            return;
        }
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

    try {
        // ยิงไปที่ Endpoint ที่เราสร้างไว้ใน server.js
        const res = await fetch(`/api/user/unread-messages?userId=${user.id}`);
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
        const res = await fetch(`/api/user/notifications?userId=${user.id}`);
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

async function checkGlobalNotifications() {
    const userData = sessionStorage.getItem('user');
    if (!userData) return; // ✅ Return Early (จบงานทันทีถ้าไม่มีข้อมูล)

    const user = JSON.parse(userData);
    try {
        const res = await fetch(`/api/user/notifications?userId=${user.id}`);
        const data = await res.json();

        updateNotificationBadges(data); // ✅ แยกงานอัปเดต UI ออกไป

        if (user.role === 'customer') {
            await checkUpcomingReservations(user.id); // ✅ แยกงานเช็คการจอง
        }

        handleToastAlerts(data); // ✅ แยกงานแสดงแจ้งเตือน
    } catch (err) { /* silent error */ }
}

// ✅ ฟังก์ชันย่อยสำหรับอัปเดต Badge (Single Responsibility)
function updateNotificationBadges(data) {
    const badge = document.getElementById('inboxBadge');
    if (badge) {
        badge.innerText = data.unreadMessages;
        badge.style.display = data.unreadMessages > 0 ? 'inline-block' : 'none';
    }
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
