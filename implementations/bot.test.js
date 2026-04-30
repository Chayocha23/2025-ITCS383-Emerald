describe('Chat Bot Logic', () => {
    test('getBotResponse: handles greetings', async () => {
        const response = await getBotResponse('Hi there');
        expect(response).toContain("Hello!");
    });

    test('getBotResponse: handles booking keywords', async () => {
        const response = await getBotResponse('I want to check my booking');
        expect(response).toContain("I see you're having trouble");
    });

    test('getBotResponse: identifies Booking ID format', async () => {
        // Mocking document.querySelectorAll for handleBookingBotLogic
        document.body.innerHTML = '<div class="booking-card__value">BK-1234</div>';
        const response = await getBotResponse('Where is BK-1234?');
        expect(response).toBe("I have found your booking BK-1234 on this page.");
    });

    test('getBotResponse: returns default message for unknown text', async () => {
        const response = await getBotResponse('XYZ random text');
        expect(response).toBe("I'm not quite sure I understand...");
    });
});
