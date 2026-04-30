describe('Formatting Utilities', () => {
    test('formatCurrency: adds Thai Baht symbol and commas', () => {
        expect(formatCurrency(1500)).toBe('฿1,500');
        expect(formatCurrency(50000)).toBe('฿50,000');
    });

    test('formatDate: converts date string to locale format', () => {
        const date = '2026-04-30';
        // Note: Output depends on system locale, adjust expectation accordingly
        expect(formatDate(date)).toContain('2026');
    });

    test('generateRandomID: returns string starting with BK-', () => {
        const id = generateRandomID();
        expect(id).toMatch(/^BK-[0-9A-F]{4}$/);
    });
});
