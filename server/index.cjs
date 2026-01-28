// BizType 32 - Backend Server with Matching & Chat
// Express + SQLite for data storage

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'biztype.db'));

// Create tables
db.exec(`
  -- Users table (with profile info)
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    gender TEXT NOT NULL,
    prefecture TEXT NOT NULL,
    age_group TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Results table (linked to users)
  CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type_code TEXT NOT NULL,
    scores TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Matches table (stores match connections)
  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    matched_user_id TEXT NOT NULL,
    compatibility_score INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (matched_user_id) REFERENCES users(id)
  );

  -- Messages table (chat)
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );

  -- Analytics table
  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    event_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_results_type ON results(type_code);
  CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id);
  CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
`);

// Compatibility mapping (which types work well together)
const compatibilityMap = {
  'EDLVF': { best: ['IASPR', 'IALPR'], good: ['EASVR', 'IDSVR'] },
  'EDLVR': { best: ['EALVF', 'IALPF'], good: ['EDSVF', 'IDSPR'] },
  'EDLPF': { best: ['IASVR', 'IALVR'], good: ['EASPF', 'IDSVF'] },
  'EDLPR': { best: ['EALVF', 'IASPF'], good: ['EDSVR', 'IDLVF'] },
  'EDSVF': { best: ['IALPR', 'IDLPR'], good: ['EASPR', 'EDLVR'] },
  'EDSVR': { best: ['IDLPF', 'IALPF'], good: ['EDLPR', 'EASVF'] },
  'EDSPF': { best: ['IASPR', 'IALVR'], good: ['EASPR', 'IDSVR'] },
  'EDSPR': { best: ['IDLVF', 'IALVF'], good: ['EDLPF', 'IASPF'] },
  'EALVF': { best: ['IDSPR', 'IDLPR'], good: ['EDLVR', 'IASPR'] },
  'EALVR': { best: ['EDSPF', 'IDSPF'], good: ['EDLPF', 'IASPF'] },
  'EALPF': { best: ['IDSVR', 'IASVR'], good: ['EDSVF', 'IDSPR'] },
  'EALPR': { best: ['EDSVF', 'IDSVF'], good: ['EDLPF', 'IASPF'] },
  'EASVF': { best: ['IDLPR', 'EDLPR'], good: ['EDLVF', 'IALPR'] },
  'EASVR': { best: ['EDLVF', 'EDLPF'], good: ['IDLVF', 'EALVF'] },
  'EASPF': { best: ['EDLVF', 'EDLPF'], good: ['IDLPF', 'EALVR'] },
  'EASPR': { best: ['EDLVF', 'EDSPF'], good: ['IDLVF', 'EALVF'] },
  'IDLVF': { best: ['EASPR', 'EDSPR'], good: ['EDLPR', 'EASPF'] },
  'IDLVR': { best: ['EDSPF', 'EASPF'], good: ['EDLPF', 'EASVF'] },
  'IDLPF': { best: ['EDSVR', 'EASVR'], good: ['EDSVF', 'EASPF'] },
  'IDLPR': { best: ['EDSVF', 'EASVF'], good: ['EDLVF', 'EALVF'] },
  'IDSVF': { best: ['EDLPF', 'EALPR'], good: ['EDLVF', 'EALPF'] },
  'IDSVR': { best: ['EDLPF', 'EALPF'], good: ['EDSPF', 'EASVF'] },
  'IDSPF': { best: ['EALVR', 'EDLVR'], good: ['EALVF', 'EDSVF'] },
  'IDSPR': { best: ['EALVF', 'EDLVF'], good: ['EALPF', 'EDSPF'] },
  'IALVF': { best: ['EDSPF', 'EDSPR'], good: ['EDSVF', 'EASPF'] },
  'IALVR': { best: ['EDSPF', 'EDLPF'], good: ['EDSPR', 'EASPF'] },
  'IALPF': { best: ['EDSVR', 'EDLVR'], good: ['EASVF', 'EDSPR'] },
  'IALPR': { best: ['EDSVF', 'EASVF'], good: ['EDLVF', 'EASPF'] },
  'IASVF': { best: ['EDLPF', 'EDLVF'], good: ['EALPF', 'EDSPF'] },
  'IASVR': { best: ['EDLPF', 'EALPF'], good: ['EDLVF', 'EASVF'] },
  'IASPF': { best: ['EDLVF', 'EDLPF'], good: ['EALVF', 'EDSVF'] },
  'IASPR': { best: ['EDLVF', 'EALVF'], good: ['EDSPF', 'EDLPF'] }
};

// Middleware
app.use(cors());
app.use(express.json());

// ============ USER REGISTRATION ============

// Register new user
app.post('/api/users', (req, res) => {
  try {
    const { nickname, gender, prefecture, ageGroup } = req.body;

    if (!nickname || !gender || !prefecture) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO users (id, nickname, gender, prefecture, age_group)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, nickname, gender, prefecture, ageGroup || null);

    res.json({ success: true, userId: id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT u.*, r.type_code, r.scores
      FROM users u
      LEFT JOIN results r ON u.id = r.user_id
      WHERE u.id = ?
    `);
    const user = stmt.get(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ...user,
      scores: user.scores ? JSON.parse(user.scores) : null
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ============ RESULTS ============

// Save result (with user association)
app.post('/api/results', (req, res) => {
  try {
    const { typeCode, scores, userId } = req.body;
    const id = uuidv4();
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';

    const stmt = db.prepare(`
      INSERT INTO results (id, user_id, type_code, scores, user_agent, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId || null, typeCode, JSON.stringify(scores), userAgent, ipAddress);

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

// Get result by ID
app.get('/api/results/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM results WHERE id = ?');
    const result = stmt.get(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({
      ...result,
      scores: JSON.parse(result.scores)
    });
  } catch (error) {
    console.error('Error getting result:', error);
    res.status(500).json({ error: 'Failed to get result' });
  }
});

// ============ MATCHING ============

// Find matches for a user
app.get('/api/matches/:userId', (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user's result
    const userStmt = db.prepare(`
      SELECT u.*, r.type_code
      FROM users u
      JOIN results r ON u.id = r.user_id
      WHERE u.id = ?
    `);
    const user = userStmt.get(userId);

    if (!user || !user.type_code) {
      return res.status(404).json({ error: 'User or result not found' });
    }

    // Get compatible types
    const compat = compatibilityMap[user.type_code] || { best: [], good: [] };
    const compatibleTypes = [...compat.best, ...compat.good];

    if (compatibleTypes.length === 0) {
      return res.json({ matches: [] });
    }

    // Find matching users (excluding self)
    const placeholders = compatibleTypes.map(() => '?').join(',');
    const matchStmt = db.prepare(`
      SELECT u.id, u.nickname, u.gender, u.prefecture, u.age_group, r.type_code,
             CASE WHEN r.type_code IN (${compat.best.map(() => '?').join(',')}) THEN 100 ELSE 75 END as compatibility_score
      FROM users u
      JOIN results r ON u.id = r.user_id
      WHERE r.type_code IN (${placeholders})
        AND u.id != ?
      ORDER BY compatibility_score DESC, RANDOM()
      LIMIT 3
    `);

    const matches = matchStmt.all(...compat.best, ...compatibleTypes, userId);

    // Create or get existing match records
    const matchRecords = matches.map(match => {
      // Check if match already exists
      const existingMatch = db.prepare(`
        SELECT * FROM matches
        WHERE (user_id = ? AND matched_user_id = ?)
           OR (user_id = ? AND matched_user_id = ?)
      `).get(userId, match.id, match.id, userId);

      if (existingMatch) {
        return { ...match, matchId: existingMatch.id };
      }

      // Create new match
      const matchId = uuidv4();
      db.prepare(`
        INSERT INTO matches (id, user_id, matched_user_id, compatibility_score, status)
        VALUES (?, ?, ?, ?, 'active')
      `).run(matchId, userId, match.id, match.compatibility_score);

      return { ...match, matchId };
    });

    res.json({ matches: matchRecords });
  } catch (error) {
    console.error('Error finding matches:', error);
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

// Get user's active matches
app.get('/api/users/:userId/matches', (req, res) => {
  try {
    const userId = req.params.userId;

    const stmt = db.prepare(`
      SELECT m.id as match_id, m.compatibility_score, m.created_at as matched_at,
             u.id as user_id, u.nickname, u.gender, u.prefecture, r.type_code,
             (SELECT content FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message,
             (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
             (SELECT COUNT(*) FROM messages WHERE match_id = m.id AND sender_id != ? AND read_at IS NULL) as unread_count
      FROM matches m
      JOIN users u ON (
        CASE WHEN m.user_id = ? THEN m.matched_user_id ELSE m.user_id END
      ) = u.id
      LEFT JOIN results r ON u.id = r.user_id
      WHERE (m.user_id = ? OR m.matched_user_id = ?)
        AND m.status = 'active'
      ORDER BY last_message_at DESC NULLS LAST
    `);

    const matches = stmt.all(userId, userId, userId, userId);

    res.json({ matches });
  } catch (error) {
    console.error('Error getting matches:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// ============ CHAT / MESSAGES ============

// Get messages for a match
app.get('/api/matches/:matchId/messages', (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.query;

    const stmt = db.prepare(`
      SELECT m.*, u.nickname as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.match_id = ?
      ORDER BY m.created_at ASC
    `);

    const messages = stmt.all(matchId);

    // Mark messages as read
    if (userId) {
      db.prepare(`
        UPDATE messages
        SET read_at = CURRENT_TIMESTAMP
        WHERE match_id = ? AND sender_id != ? AND read_at IS NULL
      `).run(matchId, userId);
    }

    res.json({ messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
app.post('/api/matches/:matchId/messages', (req, res) => {
  try {
    const { matchId } = req.params;
    const { senderId, content } = req.body;

    if (!senderId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify match exists and user is part of it
    const match = db.prepare(`
      SELECT * FROM matches
      WHERE id = ? AND (user_id = ? OR matched_user_id = ?)
    `).get(matchId, senderId, senderId);

    if (!match) {
      return res.status(403).json({ error: 'Not authorized to send message to this match' });
    }

    const id = uuidv4();

    db.prepare(`
      INSERT INTO messages (id, match_id, sender_id, content)
      VALUES (?, ?, ?, ?)
    `).run(id, matchId, senderId, content);

    const message = db.prepare(`
      SELECT m.*, u.nickname as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `).get(id);

    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ============ ADMIN APIs ============

// Admin: Get all results with pagination
app.get('/api/admin/results', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const countStmt = db.prepare('SELECT COUNT(*) as total FROM results');
    const { total } = countStmt.get();

    const stmt = db.prepare(`
      SELECT r.*, u.nickname, u.gender, u.prefecture
      FROM results r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `);
    const results = stmt.all(limit, offset);

    res.json({
      results: results.map(r => ({
        ...r,
        scores: JSON.parse(r.scores)
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

// Admin: Get statistics
app.get('/api/admin/stats', (req, res) => {
  try {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM results');
    const { total } = totalStmt.get();

    const usersStmt = db.prepare('SELECT COUNT(*) as total FROM users');
    const { total: totalUsers } = usersStmt.get();

    const matchesStmt = db.prepare('SELECT COUNT(*) as total FROM matches');
    const { total: totalMatches } = matchesStmt.get();

    const messagesStmt = db.prepare('SELECT COUNT(*) as total FROM messages');
    const { total: totalMessages } = messagesStmt.get();

    const typeStmt = db.prepare(`
      SELECT type_code, COUNT(*) as count
      FROM results
      GROUP BY type_code
      ORDER BY count DESC
    `);
    const typeDistribution = typeStmt.all();

    const todayStmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM results
      WHERE DATE(created_at) = DATE('now')
    `);
    const { count: todayCount } = todayStmt.get();

    const weekStmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM results
      WHERE created_at >= datetime('now', '-7 days')
    `);
    const { count: weekCount } = weekStmt.get();

    res.json({
      total,
      totalUsers,
      totalMatches,
      totalMessages,
      todayCount,
      weekCount,
      typeDistribution
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Admin: Delete result
app.delete('/api/admin/results/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM results WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Failed to delete result' });
  }
});

// Admin: Export data as JSON
app.get('/api/admin/export', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM results ORDER BY created_at DESC');
    const results = stmt.all();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=biztype-export-${new Date().toISOString().split('T')[0]}.json`);

    res.json(results.map(r => ({
      ...r,
      scores: JSON.parse(r.scores)
    })));
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Prefectures list (for dropdown)
app.get('/api/prefectures', (req, res) => {
  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];
  res.json({ prefectures });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/admin')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`BizType API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
