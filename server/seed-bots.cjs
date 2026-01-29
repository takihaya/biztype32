// Seed database with bot users for testing
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Use /opt/render/project/data in production for persistent storage
const dataDir = process.env.NODE_ENV === 'production'
  ? '/opt/render/project/data'
  : __dirname;

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'biztype.db'));

// Create tables first (same as server)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    gender TEXT NOT NULL,
    prefecture TEXT NOT NULL,
    age_group TEXT,
    industry TEXT,
    job_type TEXT,
    experience TEXT,
    bio TEXT,
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

// Rich bot profiles with various types
const bots = [
  { nickname: 'ゆうき', gender: '男性', prefecture: '東京都', ageGroup: '20代', typeCode: 'EDLVF', industry: 'IT・通信', jobType: 'エンジニア', experience: '3〜5年', bio: 'スタートアップでフルスタックエンジニアをしています。新しい技術が好きで、週末はハッカソンに参加しています。' },
  { nickname: 'さくら', gender: '女性', prefecture: '大阪府', ageGroup: '20代', typeCode: 'EALVF', industry: '広告・メディア', jobType: 'マーケティング', experience: '3〜5年', bio: 'デジタルマーケティングが専門です。データ分析からクリエイティブまで幅広く担当しています。' },
  { nickname: 'たけし', gender: '男性', prefecture: '神奈川県', ageGroup: '30代', typeCode: 'IDLVF', industry: 'コンサルティング', jobType: 'コンサルタント', experience: '5〜10年', bio: '戦略コンサルタントとして様々な業界のDX支援をしています。論理的に考えることが得意です。' },
  { nickname: 'みさき', gender: '女性', prefecture: '福岡県', ageGroup: '20代', typeCode: 'IALVF', industry: '金融・保険', jobType: '企画・事業開発', experience: '1〜3年', bio: 'フィンテック企業で新規事業開発をしています。金融×テクノロジーの可能性を追求中。' },
  { nickname: 'けんた', gender: '男性', prefecture: '愛知県', ageGroup: '30代', typeCode: 'EDSVF', industry: 'メーカー', jobType: '営業', experience: '5〜10年', bio: '自動車部品メーカーで法人営業をしています。顧客との関係構築を大切にしています。' },
  { nickname: 'あやか', gender: '女性', prefecture: '北海道', ageGroup: '20代', typeCode: 'EASVF', industry: '人材', jobType: '人事・総務', experience: '1〜3年', bio: '人材会社で採用コンサルタントをしています。人と企業のベストマッチを見つけるのが仕事です。' },
  { nickname: 'りょうた', gender: '男性', prefecture: '京都府', ageGroup: '40代', typeCode: 'IDSVF', industry: '教育', jobType: '研究・開発', experience: '10年以上', bio: '大学で教育工学を研究しています。テクノロジーを活用した新しい学びの形を探求中。' },
  { nickname: 'なつみ', gender: '女性', prefecture: '千葉県', ageGroup: '20代', typeCode: 'IASVF', industry: '医療・福祉', jobType: 'コンサルタント', experience: '1〜3年', bio: '医療系コンサルタントとして病院の経営改善を支援。患者さんと医療者の橋渡しを目指しています。' },
  { nickname: 'しょうた', gender: '男性', prefecture: '埼玉県', ageGroup: '20代', typeCode: 'EDLVR', industry: 'IT・通信', jobType: 'エンジニア', experience: '1〜3年', bio: 'Webエンジニアです。React/TypeScriptが得意。オープンソースにも積極的に貢献しています。' },
  { nickname: 'まい', gender: '女性', prefecture: '兵庫県', ageGroup: '30代', typeCode: 'EALVR', industry: '小売・流通', jobType: 'マーケティング', experience: '5〜10年', bio: 'ECサイトのマーケティング責任者。データドリブンな意思決定を心がけています。' },
  { nickname: 'こうへい', gender: '男性', prefecture: '広島県', ageGroup: '30代', typeCode: 'EDLPF', industry: 'コンサルティング', jobType: '経営・経営企画', experience: '5〜10年', bio: '中小企業の経営コンサルタント。地方創生に興味があり、地域企業の成長を支援しています。' },
  { nickname: 'えりか', gender: '女性', prefecture: '宮城県', ageGroup: '20代', typeCode: 'EALPF', industry: '広告・メディア', jobType: 'デザイナー', experience: '3〜5年', bio: 'UI/UXデザイナーです。ユーザー体験を第一に考えたデザインを心がけています。' },
  { nickname: 'だいき', gender: '男性', prefecture: '静岡県', ageGroup: '20代', typeCode: 'EDSPF', industry: 'サービス', jobType: '営業', experience: '1〜3年', bio: 'SaaSの法人営業をしています。お客様の課題解決にコミットするのがモットーです。' },
  { nickname: 'ゆい', gender: '女性', prefecture: '新潟県', ageGroup: '20代', typeCode: 'EASPF', industry: '人材', jobType: 'カスタマーサポート', experience: '1〜3年', bio: 'キャリアアドバイザーとして転職支援をしています。一人ひとりに寄り添ったサポートを大切に。' },
  { nickname: 'はると', gender: '男性', prefecture: '長野県', ageGroup: '30代', typeCode: 'IDLPF', industry: '金融・保険', jobType: '経理・財務', experience: '5〜10年', bio: 'ベンチャーCFOとして財務戦略を担当。数字で会社の成長を支えています。' },
  { nickname: 'りな', gender: '女性', prefecture: '岡山県', ageGroup: '20代', typeCode: 'IALPF', industry: 'IT・通信', jobType: 'エンジニア', experience: '1〜3年', bio: 'データサイエンティストです。機械学習を使った予測モデルの開発が専門。' },
  { nickname: 'そうた', gender: '男性', prefecture: '熊本県', ageGroup: '20代', typeCode: 'IDSPF', industry: 'メーカー', jobType: '研究・開発', experience: '1〜3年', bio: '素材メーカーで研究開発をしています。新しい素材で社会課題を解決したい。' },
  { nickname: 'あおい', gender: '女性', prefecture: '沖縄県', ageGroup: '20代', typeCode: 'IASPF', industry: 'サービス', jobType: 'マーケティング', experience: '1〜3年', bio: '観光業界でマーケティングを担当。地域の魅力を発信する仕事にやりがいを感じています。' },
  { nickname: 'かいと', gender: '男性', prefecture: '石川県', ageGroup: '30代', typeCode: 'EDLPR', industry: '商社', jobType: '営業', experience: '5〜10年', bio: '専門商社で海外営業を担当。グローバルビジネスの最前線で働いています。' },
  { nickname: 'ひなた', gender: '女性', prefecture: '奈良県', ageGroup: '20代', typeCode: 'EALPR', industry: '教育', jobType: '企画・事業開発', experience: '1〜3年', bio: 'EdTechスタートアップで事業開発をしています。教育の未来を変えたい。' },
  { nickname: 'れん', gender: '男性', prefecture: '群馬県', ageGroup: '20代', typeCode: 'EDSPR', industry: 'IT・通信', jobType: 'エンジニア', experience: '1〜3年', bio: 'インフラエンジニアです。クラウド・コンテナ技術に興味があります。' },
  { nickname: 'ももか', gender: '女性', prefecture: '三重県', ageGroup: '30代', typeCode: 'EASPR', industry: '広告・メディア', jobType: 'デザイナー', experience: '5〜10年', bio: 'ブランディングデザイナー。企業のアイデンティティを視覚化する仕事をしています。' },
  { nickname: 'ゆうと', gender: '男性', prefecture: '岐阜県', ageGroup: '20代', typeCode: 'IDLPR', industry: 'コンサルティング', jobType: 'コンサルタント', experience: '1〜3年', bio: 'ITコンサルタントとしてシステム導入を支援。技術と経営の橋渡しを目指しています。' },
  { nickname: 'さき', gender: '女性', prefecture: '長崎県', ageGroup: '20代', typeCode: 'IALPR', industry: '金融・保険', jobType: 'コンサルタント', experience: '1〜3年', bio: 'M&Aアドバイザリーで企業の成長をサポート。財務分析が得意です。' },
  { nickname: 'いつき', gender: '男性', prefecture: '鹿児島県', ageGroup: '30代', typeCode: 'IDSPR', industry: 'メーカー', jobType: 'エンジニア', experience: '5〜10年', bio: '電機メーカーで組み込みエンジニアをしています。IoTで世界を変えたい。' },
  { nickname: 'ことね', gender: '女性', prefecture: '和歌山県', ageGroup: '20代', typeCode: 'IASPR', industry: '医療・福祉', jobType: '研究・開発', experience: '1〜3年', bio: '製薬会社で創薬研究をしています。患者さんに届く新薬開発を目指して日々研究中。' },
  { nickname: 'はやと', gender: '男性', prefecture: '滋賀県', ageGroup: '20代', typeCode: 'EDSVR', industry: 'IT・通信', jobType: '営業', experience: '1〜3年', bio: 'IT企業でソリューション営業をしています。テクノロジーでお客様の課題を解決。' },
  { nickname: 'みゆ', gender: '女性', prefecture: '山口県', ageGroup: '20代', typeCode: 'EASVR', industry: '人材', jobType: '人事・総務', experience: '1〜3年', bio: 'HR Techスタートアップで人事を担当。働きやすい環境づくりに取り組んでいます。' },
  { nickname: 'あきら', gender: '男性', prefecture: '徳島県', ageGroup: '30代', typeCode: 'IDSVR', industry: 'コンサルティング', jobType: 'コンサルタント', experience: '5〜10年', bio: '組織・人事コンサルタント。企業の組織変革を支援しています。' },
  { nickname: 'かなで', gender: '女性', prefecture: '高知県', ageGroup: '20代', typeCode: 'IASVR', industry: '広告・メディア', jobType: 'マーケティング', experience: '1〜3年', bio: 'SNSマーケティングが専門。インフルエンサーマーケティングを手がけています。' },
  { nickname: 'たいが', gender: '男性', prefecture: '香川県', ageGroup: '20代', typeCode: 'IDLVR', industry: 'IT・通信', jobType: 'エンジニア', experience: '3〜5年', bio: 'セキュリティエンジニアです。サイバーセキュリティの最前線で活動中。' },
  { nickname: 'ほのか', gender: '女性', prefecture: '愛媛県', ageGroup: '20代', typeCode: 'IALVR', industry: '金融・保険', jobType: 'マーケティング', experience: '1〜3年', bio: 'フィンテック企業でグロースマーケティングを担当。データ分析が好きです。' },
];

// Sample scores for each type
const generateScores = (typeCode) => {
  const scores = { EI: 0, DA: 0, LS: 0, VP: 0, FR: 0 };
  scores.EI = typeCode[0] === 'E' ? Math.floor(Math.random() * 6) + 3 : -(Math.floor(Math.random() * 6) + 3);
  scores.DA = typeCode[1] === 'D' ? Math.floor(Math.random() * 6) + 3 : -(Math.floor(Math.random() * 6) + 3);
  scores.LS = typeCode[2] === 'L' ? Math.floor(Math.random() * 6) + 3 : -(Math.floor(Math.random() * 6) + 3);
  scores.VP = typeCode[3] === 'V' ? Math.floor(Math.random() * 6) + 3 : -(Math.floor(Math.random() * 6) + 3);
  scores.FR = typeCode[4] === 'F' ? Math.floor(Math.random() * 6) + 3 : -(Math.floor(Math.random() * 6) + 3);
  return scores;
};

console.log('Seeding bot users...');

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, nickname, gender, prefecture, age_group, industry, job_type, experience, bio)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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

    insertUser.run(oderId, bot.nickname, bot.gender, bot.prefecture, bot.ageGroup, bot.industry, bot.jobType, bot.experience, bot.bio);
    insertResult.run(resultId, oderId, bot.typeCode, JSON.stringify(scores));
    added++;
    console.log(`Added: ${bot.nickname} (${bot.typeCode}) - ${bot.industry} / ${bot.jobType}`);
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
