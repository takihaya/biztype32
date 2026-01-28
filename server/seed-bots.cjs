// Seed database with bot users for testing
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const db = new Database(path.join(__dirname, 'biztype.db'));

// Create tables first (same as server)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    gender TEXT NOT NULL,
    prefecture TEXT NOT NULL,
    age_group TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

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

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    event_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_results_type ON results(type_code);
  CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id);
  CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
`);

// Bot profiles with various types
const bots = [
  { nickname: 'ゆうき', gender: '男性', prefecture: '東京都', ageGroup: '20代', typeCode: 'EDLVF' },
  { nickname: 'さくら', gender: '女性', prefecture: '大阪府', ageGroup: '20代', typeCode: 'EALVF' },
  { nickname: 'たけし', gender: '男性', prefecture: '神奈川県', ageGroup: '30代', typeCode: 'IDLVF' },
  { nickname: 'みさき', gender: '女性', prefecture: '福岡県', ageGroup: '20代', typeCode: 'IALVF' },
  { nickname: 'けんた', gender: '男性', prefecture: '愛知県', ageGroup: '30代', typeCode: 'EDSVF' },
  { nickname: 'あやか', gender: '女性', prefecture: '北海道', ageGroup: '20代', typeCode: 'EASVF' },
  { nickname: 'りょうた', gender: '男性', prefecture: '京都府', ageGroup: '40代', typeCode: 'IDSVF' },
  { nickname: 'なつみ', gender: '女性', prefecture: '千葉県', ageGroup: '20代', typeCode: 'IASVF' },
  { nickname: 'しょうた', gender: '男性', prefecture: '埼玉県', ageGroup: '20代', typeCode: 'EDLVR' },
  { nickname: 'まい', gender: '女性', prefecture: '兵庫県', ageGroup: '30代', typeCode: 'EALVR' },
  { nickname: 'こうへい', gender: '男性', prefecture: '広島県', ageGroup: '30代', typeCode: 'EDLPF' },
  { nickname: 'えりか', gender: '女性', prefecture: '宮城県', ageGroup: '20代', typeCode: 'EALPF' },
  { nickname: 'だいき', gender: '男性', prefecture: '静岡県', ageGroup: '20代', typeCode: 'EDSPF' },
  { nickname: 'ゆい', gender: '女性', prefecture: '新潟県', ageGroup: '20代', typeCode: 'EASPF' },
  { nickname: 'はると', gender: '男性', prefecture: '長野県', ageGroup: '30代', typeCode: 'IDLPF' },
  { nickname: 'りな', gender: '女性', prefecture: '岡山県', ageGroup: '20代', typeCode: 'IALPF' },
  { nickname: 'そうた', gender: '男性', prefecture: '熊本県', ageGroup: '20代', typeCode: 'IDSPF' },
  { nickname: 'あおい', gender: '女性', prefecture: '沖縄県', ageGroup: '20代', typeCode: 'IASPF' },
  { nickname: 'かいと', gender: '男性', prefecture: '石川県', ageGroup: '30代', typeCode: 'EDLPR' },
  { nickname: 'ひなた', gender: '女性', prefecture: '奈良県', ageGroup: '20代', typeCode: 'EALPR' },
  { nickname: 'れん', gender: '男性', prefecture: '群馬県', ageGroup: '20代', typeCode: 'EDSPR' },
  { nickname: 'ももか', gender: '女性', prefecture: '三重県', ageGroup: '30代', typeCode: 'EASPR' },
  { nickname: 'ゆうと', gender: '男性', prefecture: '岐阜県', ageGroup: '20代', typeCode: 'IDLPR' },
  { nickname: 'さき', gender: '女性', prefecture: '長崎県', ageGroup: '20代', typeCode: 'IALPR' },
  { nickname: 'いつき', gender: '男性', prefecture: '鹿児島県', ageGroup: '30代', typeCode: 'IDSPR' },
  { nickname: 'ことね', gender: '女性', prefecture: '和歌山県', ageGroup: '20代', typeCode: 'IASPR' },
  { nickname: 'はやと', gender: '男性', prefecture: '滋賀県', ageGroup: '20代', typeCode: 'EDSVR' },
  { nickname: 'みゆ', gender: '女性', prefecture: '山口県', ageGroup: '20代', typeCode: 'EASVR' },
  { nickname: 'あきら', gender: '男性', prefecture: '徳島県', ageGroup: '30代', typeCode: 'IDSVR' },
  { nickname: 'かなで', gender: '女性', prefecture: '高知県', ageGroup: '20代', typeCode: 'IASVR' },
  { nickname: 'たいが', gender: '男性', prefecture: '香川県', ageGroup: '20代', typeCode: 'IDLVR' },
  { nickname: 'ほのか', gender: '女性', prefecture: '愛媛県', ageGroup: '20代', typeCode: 'IALVR' },
];

// Sample scores for each type (simplified)
const generateScores = (typeCode) => {
  const scores = { EI: 0, DA: 0, LS: 0, VP: 0, FR: 0 };
  scores.EI = typeCode[0] === 'E' ? 6 : -6;
  scores.DA = typeCode[1] === 'D' ? 6 : -6;
  scores.LS = typeCode[2] === 'L' ? 6 : -6;
  scores.VP = typeCode[3] === 'V' ? 6 : -6;
  scores.FR = typeCode[4] === 'F' ? 6 : -6;
  return scores;
};

console.log('Seeding bot users...');

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, nickname, gender, prefecture, age_group)
  VALUES (?, ?, ?, ?, ?)
`);

const insertResult = db.prepare(`
  INSERT OR IGNORE INTO results (id, user_id, type_code, scores)
  VALUES (?, ?, ?, ?)
`);

const checkUser = db.prepare(`SELECT id FROM users WHERE nickname = ?`);

let added = 0;
for (const bot of bots) {
  const existing = checkUser.get(bot.nickname);
  if (!existing) {
    const oderId = uuidv4();
    const resultId = uuidv4();
    const scores = generateScores(bot.typeCode);

    insertUser.run(oderId, bot.nickname, bot.gender, bot.prefecture, bot.ageGroup);
    insertResult.run(resultId, oderId, bot.typeCode, JSON.stringify(scores));
    added++;
    console.log(`Added: ${bot.nickname} (${bot.typeCode}) - ${bot.prefecture}`);
  }
}

console.log(`\nDone! Added ${added} bot users.`);

// Show current stats
const stats = db.prepare(`
  SELECT
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM results) as results
`).get();

console.log(`Total users: ${stats.users}`);
console.log(`Total results: ${stats.results}`);

db.close();
