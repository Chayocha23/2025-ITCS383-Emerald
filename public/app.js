// ──────────────────────────────────────────
// SpaceHub — Shared Frontend Utilities
// ──────────────────────────────────────────

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {'success'|'error'} type - Toast type
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast toast--${type} show`;
    toast.innerHTML = `${type === 'success' ? '✓' : '✕'} ${message}`;

    // Auto hide after 3.5s
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
