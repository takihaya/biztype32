// ビジネスパーソナリティ アバターコンポーネント
// タイプに応じた詳細なSVGイラストを生成

const avatarStyles = {
  // リーダー系 (L)
  leader: {
    accessories: 'tie',
    pose: 'confident',
    items: ['briefcase', 'chart']
  },
  // サポート系 (S)
  supporter: {
    accessories: 'glasses',
    pose: 'friendly',
    items: ['clipboard', 'heart']
  },
  // 分析系 (A)
  analyst: {
    accessories: 'glasses',
    pose: 'thinking',
    items: ['laptop', 'graph']
  },
  // 決断系 (D)
  decisive: {
    accessories: 'none',
    pose: 'action',
    items: ['lightning', 'target']
  }
};

export default function Avatar({ typeCode, gradientStart, gradientEnd, size = 160 }) {
  const isLeader = typeCode.includes('L');
  const isAnalyst = typeCode.includes('A');
  const isExtrovert = typeCode.startsWith('E');
  const isVisionary = typeCode.includes('V');

  // グラデーションID
  const gradId = `avatar-grad-${typeCode}`;
  const skinGradId = `skin-grad-${typeCode}`;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}
    >
      <defs>
        {/* メイングラデーション */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>

        {/* 肌色グラデーション */}
        <linearGradient id={skinGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE8D7" />
          <stop offset="100%" stopColor="#F5D0B9" />
        </linearGradient>

        {/* シャドウフィルター */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
        </filter>

        {/* 輝きエフェクト */}
        <radialGradient id="glow" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* 背景円 */}
      <circle cx="100" cy="100" r="95" fill={`url(#${gradId})`} />
      <circle cx="100" cy="100" r="95" fill="url(#glow)" />

      {/* 装飾パターン */}
      <g opacity="0.1">
        {isVisionary && (
          <>
            <circle cx="40" cy="50" r="8" fill="white"/>
            <circle cx="160" cy="60" r="5" fill="white"/>
            <circle cx="150" cy="150" r="6" fill="white"/>
          </>
        )}
        {isAnalyst && (
          <>
            <rect x="25" y="140" width="30" height="3" rx="1.5" fill="white" transform="rotate(-15 40 141)"/>
            <rect x="145" y="145" width="25" height="3" rx="1.5" fill="white" transform="rotate(10 157 146)"/>
          </>
        )}
      </g>

      {/* 体（スーツ/服） */}
      <path
        d="M 50 200 Q 50 150 100 140 Q 150 150 150 200"
        fill={isLeader ? '#1E293B' : '#374151'}
        filter="url(#shadow)"
      />

      {/* 白シャツ/インナー */}
      <path
        d="M 75 200 L 85 155 Q 100 150 115 155 L 125 200"
        fill="white"
      />

      {/* ネクタイ（リーダー系） */}
      {isLeader && (
        <path
          d="M 97 155 L 93 180 L 100 200 L 107 180 L 103 155 Z"
          fill={gradientStart}
        />
      )}

      {/* 首 */}
      <rect x="90" y="125" width="20" height="20" rx="5" fill={`url(#${skinGradId})`}/>

      {/* 顔 */}
      <ellipse cx="100" cy="95" rx="40" ry="45" fill={`url(#${skinGradId})`} filter="url(#shadow)"/>

      {/* 髪の毛 */}
      <ellipse
        cx="100"
        cy="65"
        rx="38"
        ry="25"
        fill={isExtrovert ? '#4A3728' : '#2D2A26'}
      />
      <path
        d={isExtrovert
          ? "M 62 75 Q 70 50 100 45 Q 130 50 138 75 Q 130 65 100 60 Q 70 65 62 75"
          : "M 62 80 Q 65 55 100 50 Q 135 55 138 80 Q 125 70 100 68 Q 75 70 62 80"
        }
        fill={isExtrovert ? '#4A3728' : '#2D2A26'}
      />

      {/* 眉毛 */}
      <path
        d={isLeader
          ? "M 75 82 Q 82 78 90 82"
          : "M 75 84 Q 82 82 90 84"
        }
        stroke="#4A3728"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={isLeader
          ? "M 110 82 Q 118 78 125 82"
          : "M 110 84 Q 118 82 125 84"
        }
        stroke="#4A3728"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* 目 */}
      <ellipse cx="82" cy="95" rx="8" ry="5" fill="white"/>
      <ellipse cx="118" cy="95" rx="8" ry="5" fill="white"/>
      <circle cx={isExtrovert ? "84" : "82"} cy="95" r="4" fill="#2D2A26"/>
      <circle cx={isExtrovert ? "120" : "118"} cy="95" r="4" fill="#2D2A26"/>
      <circle cx={isExtrovert ? "85" : "83"} cy="94" r="1.5" fill="white"/>
      <circle cx={isExtrovert ? "121" : "119"} cy="94" r="1.5" fill="white"/>

      {/* メガネ（分析系） */}
      {isAnalyst && (
        <g stroke="#4A3728" strokeWidth="2" fill="none">
          <rect x="70" y="88" width="22" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
          <rect x="108" y="88" width="22" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
          <line x1="92" y1="95" x2="108" y2="95"/>
          <line x1="70" y1="95" x2="62" y2="92"/>
          <line x1="130" y1="95" x2="138" y2="92"/>
        </g>
      )}

      {/* 鼻 */}
      <path
        d="M 100 95 L 100 108 Q 97 112 100 112 Q 103 112 100 108"
        stroke="#E5C4AD"
        strokeWidth="2"
        fill="none"
      />

      {/* 口 */}
      <path
        d={isExtrovert
          ? "M 88 120 Q 100 130 112 120"
          : "M 90 122 Q 100 126 110 122"
        }
        stroke="#C9877A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* アクセサリー/アイテム */}
      {isVisionary && (
        <g transform="translate(145, 40)">
          {/* 電球アイコン */}
          <circle cx="0" cy="0" r="15" fill="rgba(255,255,255,0.2)"/>
          <path
            d="M 0 -8 Q -6 -2 -4 4 L 4 4 Q 6 -2 0 -8"
            fill="#FCD34D"
            stroke="#F59E0B"
            strokeWidth="1"
          />
          <rect x="-3" y="4" width="6" height="4" fill="#9CA3AF" rx="1"/>
        </g>
      )}

      {isAnalyst && !isVisionary && (
        <g transform="translate(150, 45)">
          {/* グラフアイコン */}
          <circle cx="0" cy="0" r="15" fill="rgba(255,255,255,0.2)"/>
          <rect x="-8" y="2" width="4" height="6" fill="white" rx="1"/>
          <rect x="-2" y="-2" width="4" height="10" fill="white" rx="1"/>
          <rect x="4" y="-6" width="4" height="14" fill="white" rx="1"/>
        </g>
      )}

      {isLeader && !isVisionary && !isAnalyst && (
        <g transform="translate(148, 42)">
          {/* スターアイコン */}
          <circle cx="0" cy="0" r="15" fill="rgba(255,255,255,0.2)"/>
          <path
            d="M 0 -8 L 2 -2 L 8 -2 L 3 2 L 5 8 L 0 4 L -5 8 L -3 2 L -8 -2 L -2 -2 Z"
            fill="#FCD34D"
          />
        </g>
      )}
    </svg>
  );
}
