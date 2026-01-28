// キャリアロードマップと潜在スキルデータ

export const careerData = {
  'EDLVF': {
    potentialSkills: [
      { name: 'データドリブン意思決定', description: '直感だけでなくデータを活用した判断力', priority: 'high' },
      { name: 'アクティブリスニング', description: 'チームの声に耳を傾ける傾聴力', priority: 'high' },
      { name: 'リスクマネジメント', description: '勢いだけでなく冷静なリスク評価', priority: 'medium' },
      { name: 'マインドフルネス', description: '立ち止まり内省する習慣', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'プロジェクトリーダー', description: '小規模チームを率いて成果を出す経験を積む' },
      { phase: '4-7年目', title: '事業部マネージャー', description: '複数チームを統括し、P/L責任を持つ' },
      { phase: '8-12年目', title: '執行役員/VP', description: '全社戦略に関わり、組織変革を主導' },
      { phase: '13年目以降', title: 'CEO/起業家', description: '自らビジョンを描き、組織を創造・変革する' }
    ],
    idealRoles: ['CEO', 'COO', '起業家', '事業部長', 'スタートアップファウンダー'],
    workStyle: {
      bestEnvironment: '変化が速く、挑戦的な目標がある環境',
      teamRole: 'チームの方向性を決め、全員を鼓舞する',
      stressSource: '官僚主義、遅い意思決定、細かいルール',
      motivator: '大きな成果、認知、影響力の拡大'
    }
  },
  'EDLVR': {
    potentialSkills: [
      { name: 'アジャイル思考', description: '変化に素早く対応する柔軟性', priority: 'high' },
      { name: 'イノベーション促進', description: '新しいアイデアを歓迎する姿勢', priority: 'high' },
      { name: 'スピード感覚', description: '完璧を求めすぎない決断力', priority: 'medium' },
      { name: 'リスクテイキング', description: '計算されたリスクを取る勇気', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '戦略企画担当', description: '経営企画部門で戦略立案の基礎を学ぶ' },
      { phase: '4-7年目', title: '事業戦略マネージャー', description: '中長期計画の策定と実行を主導' },
      { phase: '8-12年目', title: 'CSO/戦略担当役員', description: '全社戦略の設計と組織変革を統括' },
      { phase: '13年目以降', title: 'CEO/取締役', description: '持続的成長を実現する経営者として' }
    ],
    idealRoles: ['CSO', '経営企画部長', '事業部長', 'CFO', 'コンサルティングパートナー'],
    workStyle: {
      bestEnvironment: '長期的視点が尊重され、安定した基盤がある環境',
      teamRole: '戦略を設計し、実行のロードマップを描く',
      stressSource: '短期的な成果プレッシャー、頻繁な方向転換',
      motivator: '組織の持続的成長、戦略の成功'
    }
  },
  'EDLPF': {
    potentialSkills: [
      { name: '戦略的思考', description: '日々の業務を超えた長期視点', priority: 'high' },
      { name: 'ビジョン構築', description: '大きな絵を描く力', priority: 'high' },
      { name: 'デリゲーション', description: '任せて育てるスキル', priority: 'medium' },
      { name: '内省力', description: '自己を振り返り成長する習慣', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'プロジェクトメンバー', description: '現場で実行力とチームワークを磨く' },
      { phase: '4-7年目', title: 'プロジェクトマネージャー', description: '複数プロジェクトを機動的に運営' },
      { phase: '8-12年目', title: 'PMO/デリバリー責任者', description: '組織全体のプロジェクト品質を統括' },
      { phase: '13年目以降', title: 'COO/オペレーション責任者', description: '全社のオペレーションを最適化' }
    ],
    idealRoles: ['プロジェクトマネージャー', '営業マネージャー', 'PMO', 'COO', 'スクラムマスター'],
    workStyle: {
      bestEnvironment: 'スピード感があり、現場裁量が大きい環境',
      teamRole: '最前線でチームを率い、障害を取り除く',
      stressSource: '過度な計画策定、承認プロセスの多さ',
      motivator: 'プロジェクトの成功、チームの達成感'
    }
  },
  'EDLPR': {
    potentialSkills: [
      { name: 'イノベーション思考', description: '既存のやり方を疑う姿勢', priority: 'high' },
      { name: '創造的問題解決', description: '新しいアプローチを試す力', priority: 'high' },
      { name: '変化適応力', description: '環境変化を機会と捉える', priority: 'medium' },
      { name: 'アジリティ', description: '素早く方向転換する柔軟性', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'オペレーション担当', description: '現場の業務プロセスを深く理解' },
      { phase: '4-7年目', title: 'チームリーダー', description: 'チームの生産性と品質を向上' },
      { phase: '8-12年目', title: 'オペレーション部長', description: '部門全体の効率化と標準化を推進' },
      { phase: '13年目以降', title: 'COO/工場長', description: '大規模オペレーションの最適化を統括' }
    ],
    idealRoles: ['オペレーションマネージャー', '生産管理部長', '品質管理責任者', 'COO', 'サプライチェーン責任者'],
    workStyle: {
      bestEnvironment: '安定した業務フローと明確な目標がある環境',
      teamRole: 'プロセスを最適化し、安定した成果を出す',
      stressSource: '予測不能な変化、曖昧な指示',
      motivator: '効率改善、品質向上、安定した成果'
    }
  },
  'EDSVF': {
    potentialSkills: [
      { name: '厳格なフィードバック', description: '愛情を持って厳しく伝える力', priority: 'high' },
      { name: '成果志向', description: '人間関係だけでなく結果にこだわる', priority: 'high' },
      { name: '難しい判断', description: '時に人を切る決断力', priority: 'medium' },
      { name: 'データ活用', description: '感覚だけでなく数字で語る', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'チームメンバー', description: 'チームワークと人間関係構築を学ぶ' },
      { phase: '4-7年目', title: 'チームリーダー', description: 'メンバーの成長を支援しながら成果を出す' },
      { phase: '8-12年目', title: '人材開発マネージャー', description: '組織全体の人材育成を設計・実行' },
      { phase: '13年目以降', title: 'CHRO/組織開発責任者', description: '企業文化と人材戦略を統括' }
    ],
    idealRoles: ['人材開発マネージャー', 'CHRO', '組織開発コンサルタント', 'チームリーダー', 'コーチ'],
    workStyle: {
      bestEnvironment: '人を大切にする文化と成長機会がある環境',
      teamRole: 'メンバー一人一人の強みを引き出す',
      stressSource: '人を切る判断、成果と人間関係のトレードオフ',
      motivator: 'メンバーの成長、チームの一体感'
    }
  },
  'EDSVR': {
    potentialSkills: [
      { name: 'スピード感', description: '完璧を待たない意思決定', priority: 'high' },
      { name: '変革推進', description: '安定を超えた変化を起こす力', priority: 'high' },
      { name: 'リスクテイキング', description: '不確実性を受け入れる勇気', priority: 'medium' },
      { name: '直感力', description: 'データだけでなく感覚も信じる', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'HR担当', description: '採用・研修の実務を通じて人事の基礎を習得' },
      { phase: '4-7年目', title: 'HRビジネスパートナー', description: '事業部の人材戦略を支援' },
      { phase: '8-12年目', title: '人事部長', description: '全社の人事制度と人材戦略を設計' },
      { phase: '13年目以降', title: 'CHRO', description: '経営チームの一員として人材戦略を統括' }
    ],
    idealRoles: ['CHRO', '人事部長', 'HRビジネスパートナー', '組織開発部長', '人材戦略コンサルタント'],
    workStyle: {
      bestEnvironment: '人を大切にし、長期的視点を持つ組織',
      teamRole: '人材と組織の成長を長期的に設計・支援',
      stressSource: '短期的な人員削減、人を数字で見る文化',
      motivator: '組織の成長、後継者の育成'
    }
  },
  'EDSPF': {
    potentialSkills: [
      { name: '戦略的思考', description: '日々の対応を超えた長期視点', priority: 'high' },
      { name: 'データ分析', description: '感覚だけでなく数字で判断', priority: 'high' },
      { name: '計画立案', description: '場当たり的でない先読み', priority: 'medium' },
      { name: '感情コントロール', description: '冷静な判断を保つ力', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '営業/CS担当', description: '顧客対応の最前線で経験を積む' },
      { phase: '4-7年目', title: 'チームリーダー', description: 'チームの士気と成果を両立' },
      { phase: '8-12年目', title: '営業/CS部長', description: '部門全体の戦略と実行を統括' },
      { phase: '13年目以降', title: 'CCO/営業本部長', description: '顧客体験と売上成長を両立する戦略を統括' }
    ],
    idealRoles: ['営業マネージャー', 'カスタマーサクセス部長', 'CCO', '店舗統括マネージャー', 'フィールドセールス責任者'],
    workStyle: {
      bestEnvironment: 'チームワークが重視され、顧客との接点が多い環境',
      teamRole: '現場の士気を高め、顧客との関係を構築',
      stressSource: '孤独な作業、数字だけで評価される文化',
      motivator: '顧客の笑顔、チームの達成感'
    }
  },
  'EDSPR': {
    potentialSkills: [
      { name: '変革マインド', description: '現状維持を超えた改善意識', priority: 'high' },
      { name: 'リスクテイキング', description: '新しいことに挑戦する勇気', priority: 'high' },
      { name: 'イノベーション', description: '既存のやり方を疑う姿勢', priority: 'medium' },
      { name: '自己主張', description: '自分の意見を積極的に発信', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'バックオフィス担当', description: '総務・経理などの基礎業務を習得' },
      { phase: '4-7年目', title: 'チームリーダー', description: 'チームの業務効率化と品質向上を推進' },
      { phase: '8-12年目', title: '管理部門マネージャー', description: '複数部門の調整と最適化を担当' },
      { phase: '13年目以降', title: 'CAO/管理本部長', description: '全社の管理機能を統括' }
    ],
    idealRoles: ['総務部長', '管理部門マネージャー', 'CAO', 'オフィスマネージャー', '業務推進責任者'],
    workStyle: {
      bestEnvironment: '安定した組織と明確なプロセスがある環境',
      teamRole: 'チームの調和を保ち、着実に業務を進める',
      stressSource: '急な変更、曖昧な指示、対立',
      motivator: 'チームの安定、メンバーからの信頼'
    }
  },
  'EALVF': {
    potentialSkills: [
      { name: '実行力', description: '分析を超えて行動に移す力', priority: 'high' },
      { name: 'コミュニケーション', description: '技術を非技術者に伝える力', priority: 'high' },
      { name: '完了主義', description: '完璧より完了を優先する姿勢', priority: 'medium' },
      { name: '政治力', description: '組織内での影響力構築', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'エンジニア/アナリスト', description: '技術的な基礎と分析スキルを習得' },
      { phase: '4-7年目', title: 'テックリード/シニアアナリスト', description: '技術的方向性を主導' },
      { phase: '8-12年目', title: 'CTO/イノベーション責任者', description: '技術戦略と革新を統括' },
      { phase: '13年目以降', title: 'CEO/テック起業家', description: '技術ビジョンで会社を率いる' }
    ],
    idealRoles: ['CTO', 'イノベーション責任者', 'チーフアーキテクト', 'テック起業家', 'R&D部長'],
    workStyle: {
      bestEnvironment: '技術的挑戦と革新が評価される環境',
      teamRole: '技術ビジョンを描き、チームを技術的に導く',
      stressSource: 'レガシーシステム、技術軽視の文化',
      motivator: '技術的ブレイクスルー、革新の実現'
    }
  },
  'EALVR': {
    potentialSkills: [
      { name: 'アジリティ', description: '変化に素早く対応する柔軟性', priority: 'high' },
      { name: '実験精神', description: '小さく試して学ぶ姿勢', priority: 'high' },
      { name: 'スピード感', description: '完璧を待たない意思決定', priority: 'medium' },
      { name: '現場感覚', description: '理論だけでなく実践を重視', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'システムエンジニア', description: 'システム設計の基礎を習得' },
      { phase: '4-7年目', title: 'アーキテクト', description: 'システム全体の設計を担当' },
      { phase: '8-12年目', title: 'チーフアーキテクト', description: '企業全体のシステムアーキテクチャを統括' },
      { phase: '13年目以降', title: 'CTO/テクノロジー顧問', description: '技術戦略の最高責任者として' }
    ],
    idealRoles: ['エンタープライズアーキテクト', 'CTO', '経営企画（IT戦略）', 'テクノロジーコンサルタント', 'デジタル変革責任者'],
    workStyle: {
      bestEnvironment: '長期的な視点と技術投資が認められる環境',
      teamRole: '持続可能なシステム基盤を設計・構築',
      stressSource: '短期的な成果プレッシャー、技術負債の蓄積',
      motivator: '美しいアーキテクチャ、長期的な技術価値'
    }
  },
  'EALPF': {
    potentialSkills: [
      { name: 'ビジョン構築', description: '大きな絵を描く力', priority: 'high' },
      { name: '戦略的思考', description: '戦術を超えた長期視点', priority: 'high' },
      { name: 'ステークホルダー管理', description: '多様な関係者との調整力', priority: 'medium' },
      { name: '組織政治', description: '組織内での影響力構築', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'コンサルタント/アナリスト', description: '問題解決の基礎スキルを習得' },
      { phase: '4-7年目', title: 'シニアコンサルタント/PM', description: '複雑な問題解決をリード' },
      { phase: '8-12年目', title: 'プリンシパル/部長', description: 'ソリューション領域を統括' },
      { phase: '13年目以降', title: 'パートナー/CDO', description: '組織の問題解決能力を統括' }
    ],
    idealRoles: ['コンサルタント', 'プロダクトマネージャー', 'ソリューションアーキテクト', 'CDO', '事業開発責任者'],
    workStyle: {
      bestEnvironment: '問題が複雑で、解決策の自由度が高い環境',
      teamRole: '問題を特定し、実践的な解決策を主導',
      stressSource: '定型業務、解決策が決まっている仕事',
      motivator: '難問の解決、クライアントからの感謝'
    }
  },
  'EALPR': {
    potentialSkills: [
      { name: '創造的思考', description: '既存の枠を超えた発想', priority: 'high' },
      { name: '変化適応', description: '新しいやり方を受け入れる柔軟性', priority: 'high' },
      { name: 'リスクテイキング', description: '不確実性の中で決断する勇気', priority: 'medium' },
      { name: 'イノベーション', description: '新しい価値を生み出す姿勢', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '品質管理/プロセス担当', description: 'プロセス改善の基礎を習得' },
      { phase: '4-7年目', title: 'プロセスエンジニア', description: '業務プロセスの最適化をリード' },
      { phase: '8-12年目', title: '品質管理部長/PMO', description: '組織全体のプロセス品質を統括' },
      { phase: '13年目以降', title: 'COO/オペレーション責任者', description: '全社の業務効率を最適化' }
    ],
    idealRoles: ['プロセスエンジニア', '品質管理責任者', 'PMO', 'シックスシグマ専門家', 'オペレーション改善コンサルタント'],
    workStyle: {
      bestEnvironment: 'データに基づく改善が評価される環境',
      teamRole: 'プロセスを分析し、効率化を主導',
      stressSource: '感覚的な意思決定、データ軽視の文化',
      motivator: '効率改善の数値化、品質向上'
    }
  },
  'EASVF': {
    potentialSkills: [
      { name: '決断力', description: '分析を超えて決断する力', priority: 'high' },
      { name: '実行力', description: '計画を行動に移す力', priority: 'high' },
      { name: '自己主張', description: '自分の意見を明確に伝える', priority: 'medium' },
      { name: 'リーダーシップ', description: '方向性を示して導く力', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'アナリスト/研修担当', description: '分析スキルと育成の基礎を習得' },
      { phase: '4-7年目', title: '組織開発担当', description: 'チームと組織の成長を支援' },
      { phase: '8-12年目', title: '組織開発マネージャー', description: '全社の組織開発を統括' },
      { phase: '13年目以降', title: 'CHRO/組織コンサルタント', description: '組織変革のエキスパートとして' }
    ],
    idealRoles: ['組織開発コンサルタント', 'アジャイルコーチ', 'ラーニング&デベロップメント責任者', 'CHRO', 'チェンジマネジメント専門家'],
    workStyle: {
      bestEnvironment: '人の成長と組織開発が重視される環境',
      teamRole: 'データと対話で組織の成長を促進',
      stressSource: '人を数字だけで評価する文化',
      motivator: '組織の成長、人の変化'
    }
  },
  'EASVR': {
    potentialSkills: [
      { name: '実行力', description: '分析を行動に移す力', priority: 'high' },
      { name: '決断力', description: '不完全な情報でも決断する勇気', priority: 'high' },
      { name: '発信力', description: '分析結果を積極的に伝える', priority: 'medium' },
      { name: 'スピード感', description: '完璧を待たない姿勢', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'リサーチャー/アナリスト', description: 'リサーチと分析の基礎を習得' },
      { phase: '4-7年目', title: 'シニアアナリスト', description: '戦略的なリサーチをリード' },
      { phase: '8-12年目', title: 'リサーチ部長/経営企画', description: '経営判断を支える分析を統括' },
      { phase: '13年目以降', title: 'CSO/戦略アドバイザー', description: '経営の意思決定を分析で支援' }
    ],
    idealRoles: ['マーケットリサーチャー', '経営企画', '戦略コンサルタント', 'ビジネスインテリジェンス責任者', 'CSO'],
    workStyle: {
      bestEnvironment: 'データと分析が意思決定に活用される環境',
      teamRole: '深い分析で組織の方向性を支援',
      stressSource: '分析が無視される、感覚的な意思決定',
      motivator: '分析が経営判断に活かされること'
    }
  },
  'EASPF': {
    potentialSkills: [
      { name: 'リーダーシップ', description: '方向性を示して導く力', priority: 'high' },
      { name: '自己主張', description: '分析結果を積極的に提案', priority: 'high' },
      { name: '影響力', description: '組織に変化を起こす力', priority: 'medium' },
      { name: 'ビジョン', description: '大きな絵を描く視点', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'データアナリスト', description: 'データ分析の基礎スキルを習得' },
      { phase: '4-7年目', title: 'シニアアナリスト', description: 'ビジネス課題の分析をリード' },
      { phase: '8-12年目', title: 'アナリティクス部長', description: '組織全体の分析機能を統括' },
      { phase: '13年目以降', title: 'CDO/データ責任者', description: 'データドリブン経営を推進' }
    ],
    idealRoles: ['データアナリスト', 'ビジネスアナリスト', 'プロジェクトサポート', 'アナリティクスマネージャー', 'CDO'],
    workStyle: {
      bestEnvironment: 'データが重視され、チームワークがある環境',
      teamRole: '分析で現場を支援し、意思決定をサポート',
      stressSource: '孤独な作業、分析が活かされない環境',
      motivator: '分析がチームの成功に貢献すること'
    }
  },
  'EASPR': {
    potentialSkills: [
      { name: '変革マインド', description: '守りだけでなく攻めの姿勢', priority: 'high' },
      { name: '提案力', description: '改善策を積極的に提案', priority: 'high' },
      { name: 'イノベーション', description: '新しい品質向上策を考える', priority: 'medium' },
      { name: 'リーダーシップ', description: '品質向上を主導する力', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '品質管理担当', description: '品質管理の基礎を習得' },
      { phase: '4-7年目', title: '品質エンジニア', description: '品質改善プロジェクトをリード' },
      { phase: '8-12年目', title: '品質管理部長', description: '組織全体の品質戦略を統括' },
      { phase: '13年目以降', title: 'CQO/コンプライアンス責任者', description: '全社の品質とコンプライアンスを統括' }
    ],
    idealRoles: ['品質管理責任者', 'コンプライアンス専門家', '監査役', 'リスク管理責任者', 'CQO'],
    workStyle: {
      bestEnvironment: '品質と正確性が重視される環境',
      teamRole: '品質基準を守り、着実に改善を支援',
      stressSource: '品質軽視、スピード優先の文化',
      motivator: '品質向上、ミスのない成果'
    }
  },
  // 内向型タイプのデータも追加
  'IDLVF': {
    potentialSkills: [
      { name: 'コミュニケーション', description: 'ビジョンを他者に伝える力', priority: 'high' },
      { name: 'ネットワーキング', description: '人脈を広げる積極性', priority: 'high' },
      { name: 'プレゼンテーション', description: 'アイデアを魅力的に伝える', priority: 'medium' },
      { name: 'チームビルディング', description: '人を巻き込む力', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '専門職/エンジニア', description: '深い専門性を磨く' },
      { phase: '4-7年目', title: 'テックリード/専門家', description: '技術的方向性を主導' },
      { phase: '8-12年目', title: 'R&D責任者/CTO', description: '技術ビジョンを組織に浸透' },
      { phase: '13年目以降', title: '起業家/技術顧問', description: '独自のビジョンで事業を創造' }
    ],
    idealRoles: ['起業家', 'R&Dリーダー', 'CTO', '技術コンサルタント', 'イノベーター'],
    workStyle: {
      bestEnvironment: '深く考える時間と自由度がある環境',
      teamRole: '独自の視点で革新的なビジョンを提示',
      stressSource: '大人数での会議、浅い議論',
      motivator: 'ビジョンの実現、革新の達成'
    }
  },
  'IDLVR': {
    potentialSkills: [
      { name: '対外発信', description: '自分の考えを外に伝える力', priority: 'high' },
      { name: '柔軟性', description: '変化を受け入れる姿勢', priority: 'high' },
      { name: 'ネットワーキング', description: '外部との関係構築', priority: 'medium' },
      { name: 'アジリティ', description: '素早く方向転換する力', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '研究員/専門職', description: '深い専門知識を習得' },
      { phase: '4-7年目', title: 'シニア研究員/戦略担当', description: '長期的な研究・戦略を主導' },
      { phase: '8-12年目', title: '研究所長/戦略責任者', description: '組織の長期戦略を統括' },
      { phase: '13年目以降', title: 'CEO/戦略アドバイザー', description: '深い洞察で組織を導く' }
    ],
    idealRoles: ['研究所長', '戦略コンサルタント', 'シンクタンク研究員', '技術戦略責任者', 'アドバイザー'],
    workStyle: {
      bestEnvironment: '長期的思考と深い専門性が尊重される環境',
      teamRole: '深い分析から長期戦略を設計',
      stressSource: '短期的成果プレッシャー、浅い議論',
      motivator: '戦略の成功、長期的な影響'
    }
  },
  'IDLPF': {
    potentialSkills: [
      { name: '対人スキル', description: '人との関係構築力', priority: 'high' },
      { name: 'ビジョン発信', description: '技術的方向性を伝える力', priority: 'high' },
      { name: '政治力', description: '組織内での影響力構築', priority: 'medium' },
      { name: 'プレゼンテーション', description: '技術を非技術者に説明', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'エンジニア', description: '技術的な基礎を固める' },
      { phase: '4-7年目', title: 'テックリード', description: 'チームの技術的方向性を主導' },
      { phase: '8-12年目', title: 'エンジニアリングマネージャー', description: '複数チームの技術を統括' },
      { phase: '13年目以降', title: 'VP of Engineering/CTO', description: '組織全体の技術を統括' }
    ],
    idealRoles: ['テックリード', 'エンジニアリングマネージャー', 'CTO', 'アーキテクト', '技術コンサルタント'],
    workStyle: {
      bestEnvironment: '技術的な深さと裁量が認められる環境',
      teamRole: '技術的な問題解決でチームをリード',
      stressSource: '政治的な駆け引き、技術軽視',
      motivator: '技術的な課題解決、チームの成長'
    }
  },
  'IDLPR': {
    potentialSkills: [
      { name: '変化適応', description: '新技術を積極的に取り入れる', priority: 'high' },
      { name: 'コミュニケーション', description: '専門知識を他者に伝える', priority: 'high' },
      { name: '視野拡大', description: '専門分野以外への関心', priority: 'medium' },
      { name: 'ネットワーキング', description: '業界とのつながり構築', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'ジュニアエンジニア', description: '基礎技術を徹底的に習得' },
      { phase: '4-7年目', title: 'シニアエンジニア', description: '高い技術品質で貢献' },
      { phase: '8-12年目', title: 'プリンシパルエンジニア', description: '技術的な最終判断者として' },
      { phase: '13年目以降', title: 'フェロー/技術顧問', description: '業界のエキスパートとして' }
    ],
    idealRoles: ['プリンシパルエンジニア', '技術フェロー', '品質管理エキスパート', '技術顧問', 'マスタークラフトマン'],
    workStyle: {
      bestEnvironment: '技術的な深さと品質が重視される環境',
      teamRole: '深い専門性でチームの技術品質を担保',
      stressSource: '品質より速度優先、技術負債',
      motivator: '技術的な完成度、品質の高い成果'
    }
  },
  'IDSVF': {
    potentialSkills: [
      { name: 'スケーラビリティ', description: '多くの人に影響を与える方法', priority: 'high' },
      { name: 'パブリックスピーキング', description: '大人数への発信力', priority: 'high' },
      { name: 'コンテンツ作成', description: '知識を形にする力', priority: 'medium' },
      { name: 'ブランディング', description: '自分の価値を伝える', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '専門職', description: '深い専門知識を習得' },
      { phase: '4-7年目', title: 'メンター/コーチ', description: '個別に人材を育成' },
      { phase: '8-12年目', title: 'シニアメンター/研修責任者', description: '組織の人材育成を設計' },
      { phase: '13年目以降', title: 'エグゼクティブコーチ/著者', description: '広く影響を与えるメンターとして' }
    ],
    idealRoles: ['エグゼクティブコーチ', 'メンター', '研修講師', '人材開発コンサルタント', '著者'],
    workStyle: {
      bestEnvironment: '深い対話と人の成長が重視される環境',
      teamRole: '一人一人に寄り添い、成長を支援',
      stressSource: '大人数への発信、表面的な関係',
      motivator: '人の成長、深い信頼関係'
    }
  },
  'IDSVR': {
    potentialSkills: [
      { name: '発信力', description: '知識を積極的に共有', priority: 'high' },
      { name: 'プレゼンス', description: '存在感を高める', priority: 'high' },
      { name: '変化適応', description: '新しいことへのオープンさ', priority: 'medium' },
      { name: 'ネットワーキング', description: '外部との関係構築', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '専門職', description: '深い知識と洞察を蓄積' },
      { phase: '4-7年目', title: 'シニア専門家', description: '社内の知恵袋として信頼を構築' },
      { phase: '8-12年目', title: 'ナレッジリーダー', description: '組織の知的資産を統括' },
      { phase: '13年目以降', title: 'チーフアドバイザー/賢人', description: '組織の重要な意思決定を支援' }
    ],
    idealRoles: ['シニアアドバイザー', 'ナレッジマネージャー', '社内コンサルタント', '技術顧問', '監査役'],
    workStyle: {
      bestEnvironment: '深い知識と長期的視点が尊重される環境',
      teamRole: '深い知識で組織を正しい方向に導く',
      stressSource: '存在が見過ごされる、知識が活かされない',
      motivator: '組織への貢献、知識の継承'
    }
  },
  'IDSPF': {
    potentialSkills: [
      { name: '自己PR', description: '自分の貢献を伝える力', priority: 'high' },
      { name: 'リーダーシップ', description: '前に出て導く力', priority: 'high' },
      { name: '可視化', description: '成果を見える形にする', priority: 'medium' },
      { name: 'ネットワーキング', description: '社内外との関係構築', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'エンジニア/専門職', description: '確実な実行力を証明' },
      { phase: '4-7年目', title: 'シニアエンジニア', description: '難しい問題を確実に解決' },
      { phase: '8-12年目', title: 'プリンシパル/テックリード', description: 'チームの技術的支柱として' },
      { phase: '13年目以降', title: 'フェロー/技術顧問', description: '確実な実行力の象徴として' }
    ],
    idealRoles: ['シニアエンジニア', 'スタッフエンジニア', '技術スペシャリスト', 'トラブルシューター', '品質エンジニア'],
    workStyle: {
      bestEnvironment: '確実な実行が評価される環境',
      teamRole: '黙々と確実に成果を出す',
      stressSource: '自己PRが求められる、政治的な環境',
      motivator: '難問の解決、チームへの貢献'
    }
  },
  'IDSPR': {
    potentialSkills: [
      { name: '変化適応', description: '新しい分野への挑戦', priority: 'high' },
      { name: '発信力', description: '専門知識を共有する力', priority: 'high' },
      { name: 'イノベーション', description: '新しいアプローチを試す', priority: 'medium' },
      { name: 'プレゼンス', description: '存在感を高める', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '専門職', description: '特定分野の深い専門性を習得' },
      { phase: '4-7年目', title: 'シニアスペシャリスト', description: '専門分野で信頼を確立' },
      { phase: '8-12年目', title: 'エキスパート', description: '組織の専門知識の柱として' },
      { phase: '13年目以降', title: 'フェロー/業界エキスパート', description: '業界を代表する専門家として' }
    ],
    idealRoles: ['シニアスペシャリスト', 'テクニカルエキスパート', '品質保証専門家', '技術顧問', 'フェロー'],
    workStyle: {
      bestEnvironment: '深い専門性が尊重される環境',
      teamRole: '専門知識でチームを支える',
      stressSource: '専門性が活かされない、浅い仕事',
      motivator: '専門性の発揮、品質の高い成果'
    }
  },
  'IALVF': {
    potentialSkills: [
      { name: 'コミュニケーション', description: 'アイデアを他者に伝える', priority: 'high' },
      { name: '実行力', description: '分析から行動に移す力', priority: 'high' },
      { name: 'コラボレーション', description: 'チームで働く力', priority: 'medium' },
      { name: 'プレゼンテーション', description: '研究成果を魅力的に伝える', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '研究員/アナリスト', description: '深い分析スキルを習得' },
      { phase: '4-7年目', title: 'シニア研究員', description: '革新的な研究をリード' },
      { phase: '8-12年目', title: 'R&D部長', description: '研究開発の方向性を統括' },
      { phase: '13年目以降', title: 'CTO/チーフサイエンティスト', description: '技術ビジョンで組織を導く' }
    ],
    idealRoles: ['R&Dリーダー', '技術コンサルタント', 'チーフサイエンティスト', 'イノベーション責任者', '研究所長'],
    workStyle: {
      bestEnvironment: '深い分析と革新が評価される環境',
      teamRole: '革新的なアイデアを分析から導き出す',
      stressSource: '浅い議論、実行だけ求められる環境',
      motivator: '革新の発見、技術的ブレイクスルー'
    }
  },
  'IALVR': {
    potentialSkills: [
      { name: '実行力', description: '理論を実践に移す力', priority: 'high' },
      { name: '柔軟性', description: '変化を受け入れる姿勢', priority: 'high' },
      { name: '現場感覚', description: '理論だけでなく実務を理解', priority: 'medium' },
      { name: 'スピード', description: '完璧を待たない決断', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'アナリスト/研究員', description: '深い分析スキルを習得' },
      { phase: '4-7年目', title: 'シニアアナリスト', description: '戦略的な分析をリード' },
      { phase: '8-12年目', title: '戦略部長/シンクタンク', description: '組織の戦略を設計' },
      { phase: '13年目以降', title: 'CSO/戦略顧問', description: '経営の意思決定を支援' }
    ],
    idealRoles: ['戦略コンサルタント', 'シンクタンク研究員', 'CSO', '政策アドバイザー', 'エコノミスト'],
    workStyle: {
      bestEnvironment: '深い分析と長期思考が重視される環境',
      teamRole: '膨大な分析から戦略を導き出す',
      stressSource: '浅い議論、短期的成果プレッシャー',
      motivator: '戦略の成功、長期的な影響'
    }
  },
  'IALPF': {
    potentialSkills: [
      { name: 'ビジネス視点', description: '技術をビジネス価値に結びつける', priority: 'high' },
      { name: 'コミュニケーション', description: '技術を非技術者に説明', priority: 'high' },
      { name: 'ステークホルダー管理', description: '多様な関係者との調整', priority: 'medium' },
      { name: 'リーダーシップ', description: '人を率いる力', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'エンジニア/アナリスト', description: '技術分析の基礎を習得' },
      { phase: '4-7年目', title: 'シニアエンジニア/アーキテクト', description: '技術的な設計をリード' },
      { phase: '8-12年目', title: 'チーフアーキテクト', description: '組織の技術アーキテクチャを統括' },
      { phase: '13年目以降', title: 'CTO/技術顧問', description: '技術戦略の最高責任者として' }
    ],
    idealRoles: ['テクニカルアーキテクト', 'シニアエンジニア', 'CTO', '技術コンサルタント', 'ソリューションアーキテクト'],
    workStyle: {
      bestEnvironment: '技術的な深さが重視される環境',
      teamRole: '深い技術分析で問題を解決',
      stressSource: 'ビジネス政治、技術軽視',
      motivator: '技術的な課題解決、アーキテクチャの美しさ'
    }
  },
  'IALPR': {
    potentialSkills: [
      { name: '視野拡大', description: '専門分野以外への関心', priority: 'high' },
      { name: 'コミュニケーション', description: '専門知識を他者に伝える', priority: 'high' },
      { name: '柔軟性', description: '変化を受け入れる姿勢', priority: 'medium' },
      { name: 'コラボレーション', description: 'チームで働く力', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'ジュニア専門職', description: '特定分野の深い知識を習得' },
      { phase: '4-7年目', title: '専門家', description: '分野のエキスパートとして認知' },
      { phase: '8-12年目', title: 'プリンシパル', description: '組織の技術的最終判断者' },
      { phase: '13年目以降', title: 'フェロー/業界権威', description: '業界を代表するエキスパートとして' }
    ],
    idealRoles: ['ディープスペシャリスト', 'フェロー', '技術エキスパート', '研究者', '業界権威'],
    workStyle: {
      bestEnvironment: '深い専門性が最重要視される環境',
      teamRole: '特定分野で誰にも負けない専門性を発揮',
      stressSource: '浅く広い仕事、専門性の軽視',
      motivator: '専門分野の極め、業界への貢献'
    }
  },
  'IASVF': {
    potentialSkills: [
      { name: 'スケーラビリティ', description: '知識を広く伝える方法', priority: 'high' },
      { name: 'コンテンツ作成', description: '知識を形にする力', priority: 'high' },
      { name: 'パブリックスピーキング', description: '大人数への発信', priority: 'medium' },
      { name: 'ブランディング', description: '自分の価値を伝える', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '研究員/アシスタント', description: '深い知識と研究スキルを習得' },
      { phase: '4-7年目', title: '講師/メンター', description: '知識を個別に伝える' },
      { phase: '8-12年目', title: '教授/シニアメンター', description: '教育と研究をリード' },
      { phase: '13年目以降', title: '著名研究者/著者', description: '広く影響を与える教育者として' }
    ],
    idealRoles: ['大学教授', '研究指導者', '教育コンサルタント', '著者', 'オンライン講師'],
    workStyle: {
      bestEnvironment: '深い知識と教育が重視される環境',
      teamRole: '知識を深め、個別に人を育てる',
      stressSource: '大人数への発信、実務偏重',
      motivator: '人の知的成長、知識の継承'
    }
  },
  'IASVR': {
    potentialSkills: [
      { name: '変化適応', description: '新しい知識への積極性', priority: 'high' },
      { name: '発信力', description: '知識を積極的に共有', priority: 'high' },
      { name: 'デジタル活用', description: '新しいツールの活用', priority: 'medium' },
      { name: 'ネットワーキング', description: '外部との知識交換', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'リサーチャー/ライブラリアン', description: '知識管理の基礎を習得' },
      { phase: '4-7年目', title: 'ナレッジスペシャリスト', description: '組織の知識体系化をリード' },
      { phase: '8-12年目', title: 'ナレッジマネージャー', description: '組織の知的資産を統括' },
      { phase: '13年目以降', title: 'チーフナレッジオフィサー', description: '組織学習の最高責任者として' }
    ],
    idealRoles: ['ナレッジマネージャー', 'ライブラリアン', 'アーキビスト', '情報管理責任者', 'ドキュメンテーション責任者'],
    workStyle: {
      bestEnvironment: '知識と歴史が大切にされる環境',
      teamRole: '組織の知識を守り、体系化する',
      stressSource: '知識の軽視、過去の否定',
      motivator: '知識の保存、組織の学習'
    }
  },
  'IASPF': {
    potentialSkills: [
      { name: '自己主張', description: '分析結果を積極的に提案', priority: 'high' },
      { name: 'リーダーシップ', description: '方向性を示す力', priority: 'high' },
      { name: '影響力', description: '意思決定に影響を与える', priority: 'medium' },
      { name: 'プレゼンス', description: '存在感を高める', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: 'データアナリスト', description: 'データ分析の基礎を習得' },
      { phase: '4-7年目', title: 'シニアアナリスト', description: '複雑な分析をリード' },
      { phase: '8-12年目', title: 'アナリティクスマネージャー', description: '分析チームを統括' },
      { phase: '13年目以降', title: 'チーフアナリスト/データ顧問', description: '組織の分析能力を統括' }
    ],
    idealRoles: ['データアナリスト', 'ビジネスアナリスト', 'リサーチャー', 'アナリティクススペシャリスト', '統計専門家'],
    workStyle: {
      bestEnvironment: 'データと分析が重視される環境',
      teamRole: '深い分析でチームの意思決定を支援',
      stressSource: '分析が活かされない、表面的な仕事',
      motivator: '分析の正確さ、データからの発見'
    }
  },
  'IASPR': {
    potentialSkills: [
      { name: 'スピード感', description: '完璧を求めすぎない姿勢', priority: 'high' },
      { name: '柔軟性', description: '変化を受け入れる力', priority: 'high' },
      { name: '自己主張', description: '意見を積極的に発信', priority: 'medium' },
      { name: 'リスクテイキング', description: '不確実性の中で行動する勇気', priority: 'medium' }
    ],
    careerRoadmap: [
      { phase: '1-3年目', title: '品質管理担当/研究員', description: '緻密な分析スキルを習得' },
      { phase: '4-7年目', title: 'シニアアナリスト', description: '高品質な分析をリード' },
      { phase: '8-12年目', title: '品質管理部長/研究責任者', description: '組織の品質基準を統括' },
      { phase: '13年目以降', title: 'CQO/フェロー', description: '品質と正確性の最高責任者として' }
    ],
    idealRoles: ['品質保証専門家', '監査役', '研究者', 'コンプライアンス専門家', 'テスト責任者'],
    workStyle: {
      bestEnvironment: '正確性と品質が最重要視される環境',
      teamRole: '細部まで徹底的に検証し、品質を担保',
      stressSource: '品質軽視、スピード優先',
      motivator: '完璧な成果、ミスのない仕事'
    }
  }
};
