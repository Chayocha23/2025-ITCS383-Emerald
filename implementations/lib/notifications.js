async function getUserNotifications(sql, userId) {
  const user = await sql`SELECT role FROM users WHERE id = ${userId}`;
  if (user.length === 0) return null;
  
  const role = user[0].role || 'customer';

  let response = {
    unreadMessages: 0,
    pendingActionBookings: 0,
    newlyConfirmedBookings: 0
  };

  // 1. Count replied support tickets
  const tickets = await sql`SELECT COUNT(*)::int FROM tickets WHERE user_id = ${userId} AND status = 'replied'`;
  response.unreadMessages = tickets[0].count;

  if (role === 'manager' || role === 'employee') {
    // 2. For employees: count 'pending' bookings
    const pending = await sql`SELECT COUNT(*)::int FROM bookings WHERE status = 'pending'`;
    response.pendingActionBookings = pending[0].count;
  } else {
    // 3. For customers: count 'confirmed' bookings in the last 10 minutes
    const confirmed = await sql`
      SELECT COUNT(*)::int FROM bookings 
      WHERE user_id = ${userId} 
      AND status = 'confirmed' 
      AND updated_at >= NOW() - INTERVAL '10 minutes'
    `;
    response.newlyConfirmedBookings = confirmed[0].count;
  }

  return response;
}

module.exports = { getUserNotifications };
