import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guest_name, attendance_status } = req.body;

  // Validate required fields
  if (!guest_name || !guest_name.trim()) {
    return res.status(400).json({ error: 'Guest name is required' });
  }
  if (!attendance_status || !['attending', 'declined'].includes(attendance_status)) {
    return res.status(400).json({ error: 'Attendance status must be "attending" or "declined"' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    await sql(
      'INSERT INTO rsvps (guest_name, attendance_status) VALUES ($1, $2)',
      [guest_name.trim(), attendance_status]
    );

    return res.status(200).json({
      success: true,
      message: attendance_status === 'attending'
        ? 'We look forward to celebrating with you!'
        : 'Thank you for letting us know.'
    });

  } catch (error) {
    console.error('RSVP insert error:', error);
    return res.status(500).json({ error: 'Failed to save RSVP. Please try again.' });
  }
}
