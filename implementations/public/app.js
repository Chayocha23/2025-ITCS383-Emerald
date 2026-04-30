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

    // 3. Create a text node for the message
    const textNode = document.createTextNode(message);

    // 4. Append both to the toast
    toast.appendChild(iconSpan);
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
            // Database-Connected Chat Logic (Improved for Demo)
            // 1. Extract the bot's decision-making logic into a separate function
            async function getBotResponse(text) {
                const lowerText = text.toLowerCase();
                const idMatch = text.match(/BK-?([\w\d]+)/i);

                //    Use early returns to avoid long else-if chains
                if (idMatch) return await handleBookingCheck(idMatch);
                if (lowerText.includes("hi") || lowerText.includes("hello")) return "Hello! I'm here to help...";
                if (lowerText.includes("booking") || lowerText.includes("reserve")) return "I see you're having trouble...";

                return "I'm not quite sure I understand...";
            }

            // 2. Extract the booking validation logic into another function
            async function handleBookingCheck(idMatch) {
                const bookingIdRaw = idMatch[1].toUpperCase();
                const fullBookingId = idMatch[0].toUpperCase();

                const allIDs = Array.from(document.querySelectorAll('.booking-card__value'))
                    .map(el => el.innerText?.toUpperCase());

                if (allIDs.includes(fullBookingId)) {
                    return `I have found your booking ${fullBookingId} on this page.`;
                }

                try {
                    if (!/^[A-Z0-9]+$/.test(bookingIdRaw)) throw new Error();
                    const res = await fetch(`/api/bookings/${bookingIdRaw}`);
                    const data = await res.json();
                    return (res.ok && (data.exists || data.booking))
                        ? `I've checked our database. Booking ${fullBookingId} is valid...`
                        : `I'm sorry, I couldn't find Booking ID: ${fullBookingId}.`;
                } catch (e) {
                    return `I found the ID ${fullBookingId}, but I can't verify it right now.`;
                }
            }

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
            };

            // Trigger send on button click
            sendBtn.addEventListener('click', sendMessage);

            // Trigger send on 'Enter' key press
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }  // End of if (toggle && chatWin)

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
            if (isNaN(userId)) {
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
        if (!userData) return; // ✅ Return Early: จบการทำงานทันทีถ้าไม่มี data

        const user = JSON.parse(userData);
        try {
            const res = await fetch(`/api/user/notifications?userId=${user.id}`);
            const data = await res.json();

            updateUIBadges(data); // ✅ แยกงานอัปเดต UI ออกไป

            // แยก Logic ตาม Role ให้ชัดเจน
            if (user.role === 'customer') {
                await handleCustomerAlerts(user.id);
            }

            handleToastNotifications(data); // ✅ แยกงานแจ้งเตือนออกไป
        } catch (err) { /* silent */ }
    }

    function updateUIBadges(data) {
        const badge = document.getElementById('inboxBadge');
        if (badge) {
            badge.innerText = data.unreadMessages;
            badge.style.display = data.unreadMessages > 0 ? 'inline-block' : 'none';
        }
    }
    // Run every 5–10 seconds
    setInterval(checkGlobalNotifications, 3000);
}  // End of initFloatingChat()

// สั่งให้ทำงานเมื่อโหลดหน้าจอ และเช็คซ้ำทุก 10 วินาที (Real-time กลายๆ)
document.addEventListener('DOMContentLoaded', () => {
        syncUnreadNotifications();
        setInterval(syncUnreadNotifications, 10000);
        initFloatingChat();
        checkGlobalNotifications();
    });
