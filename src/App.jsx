import { useState, useRef, useEffect } from 'react'
import './App.css'
import { questions, resultTypes, dimensions, likertOptions, getTypeCode } from './data/questions'
import { careerData } from './data/careerData'
import Avatar from './components/Avatar'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api')

const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

const industries = [
  'IT・通信', '金融・保険', 'コンサルティング', 'メーカー', '商社',
  '広告・メディア', '人材', '不動産', '医療・福祉', '教育',
  '小売・流通', 'サービス', '官公庁・団体', 'その他'
]

const jobTypes = [
  '経営・経営企画', '営業', 'マーケティング', '企画・事業開発',
  'エンジニア', 'デザイナー', '人事・総務', '経理・財務',
  'カスタマーサポート', 'コンサルタント', '研究・開発', 'その他'
]

function App() {
  // Screen states: start, question, loading, result, register, mypage, chat
  const [screen, setScreen] = useState('start')

  // User state
  const [userId, setUserId] = useState(null)
  const [userProfile, setUserProfile] = useState({
    nickname: '',
    gender: '',
    prefecture: '',
    ageGroup: '',
    industry: '',
    jobType: '',
    experience: '',
    bio: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({ EI: 0, DA: 0, LS: 0, VP: 0, FR: 0 })
  const [result, setResult] = useState(null)
  const [chartAnimated, setChartAnimated] = useState(false)
  const [showFullResult, setShowFullResult] = useState(false)

  // UI state
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // profile, matching, talk
  const resultRef = useRef(null)

  // Matching state
  const [matchCandidates, setMatchCandidates] = useState([])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [confirmedMatches, setConfirmedMatches] = useState([])
  const [matchesLoading, setMatchesLoading] = useState(false)
  const [showCandidates, setShowCandidates] = useState(false)
  const [autoShowMatching, setAutoShowMatching] = useState(false)

  // Chat state
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState({})
  const messagesEndRef = useRef(null)

  // Load saved user from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem('biztype_user_id')
    const savedProfile = localStorage.getItem('biztype_profile')
    const savedResult = localStorage.getItem('biztype_result')
    const savedMatches = localStorage.getItem('biztype_confirmed_matches')
    const loggedIn = localStorage.getItem('biztype_logged_in')

    if (loggedIn && savedUserId && savedProfile && savedResult) {
      setUserId(savedUserId)
      setUserProfile(JSON.parse(savedProfile))
      setResult(JSON.parse(savedResult))
      if (savedMatches) {
        setConfirmedMatches(JSON.parse(savedMatches))
      }
      setIsLoggedIn(true)
      setScreen('mypage')
      setChartAnimated(true)
    }
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Poll for new messages when in chat
  useEffect(() => {
    let interval
    if (screen === 'chat' && activeChat) {
      interval = setInterval(() => {
        fetchMessages(activeChat.matchId)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [screen, activeChat])

  // Check for unread messages periodically
  useEffect(() => {
    let interval
    if (confirmedMatches.length > 0 && userId) {
      const checkUnread = async () => {
        const counts = {}
        for (const match of confirmedMatches) {
          try {
            const response = await fetch(`${API_BASE}/matches/${match.matchId}/messages?userId=${userId}`)
            const data = await response.json()
            const unread = data.messages?.filter(m => m.sender_id !== userId && !m.read_at).length || 0
            counts[match.matchId] = unread
          } catch (e) {
            counts[match.matchId] = 0
          }
        }
        setUnreadCounts(counts)
      }
      checkUnread()
      interval = setInterval(checkUnread, 10000)
    }
    return () => clearInterval(interval)
  }, [confirmedMatches, userId])

  // Auto fetch matches when showing matching tab
  useEffect(() => {
    if (autoShowMatching && userId && !userId.startsWith('local_')) {
      fetchMatchCandidates()
      setAutoShowMatching(false)
    }
  }, [autoShowMatching, userId])

  const handleStart = () => {
    setScreen('question')
  }

  const handleAnswer = (value) => {
    const question = questions[currentQuestion]
    const scoreChange = value * question.direction
    const newScores = {
      ...scores,
      [question.dimension]: scores[question.dimension] + scoreChange
    }
    setScores(newScores)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setScreen('loading')
      setTimeout(() => {
        calculateResult(newScores)
      }, 2500)
    }
  }

  const calculateResult = async (finalScores) => {
    const typeCode = getTypeCode(finalScores)
    const resultData = { type: typeCode, scores: finalScores }
    setResult(resultData)
    localStorage.setItem('biztype_result', JSON.stringify(resultData))
    setScreen('result')
    setTimeout(() => setChartAnimated(true), 300)
  }

  const handleGoToRegister = () => {
    setScreen('register')
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!userProfile.nickname || !userProfile.gender || !userProfile.prefecture) {
      alert('必須項目を入力してください')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      })

      const data = await response.json()

      if (data.userId) {
        setUserId(data.userId)
        localStorage.setItem('biztype_user_id', data.userId)
        localStorage.setItem('biztype_profile', JSON.stringify(userProfile))
        localStorage.setItem('biztype_logged_in', 'true')
        setIsLoggedIn(true)

        // Save result to backend
        await fetch(`${API_BASE}/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            typeCode: result.type,
            scores: result.scores,
            userId: data.userId
          })
        })

        // Go to mypage and auto-show matching
        setScreen('mypage')
        setActiveTab('matching')
        setAutoShowMatching(true)
      }
    } catch (error) {
      console.error('Registration failed:', error)
      alert('登録に失敗しました。もう一度お試しください。')
    }
  }

  const fetchMatchCandidates = async () => {
    if (!userId || userId.startsWith('local_')) return

    setMatchesLoading(true)
    try {
      const response = await fetch(`${API_BASE}/matches/${userId}`)
      const data = await response.json()
      const confirmedIds = confirmedMatches.map(m => m.id)
      const candidates = (data.matches || []).filter(m => !confirmedIds.includes(m.id))
      setMatchCandidates(candidates)
      setShowCandidates(true)
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setMatchesLoading(false)
    }
  }

  const toggleCandidateSelection = (candidate) => {
    setSelectedCandidates(prev => {
      const isSelected = prev.some(c => c.id === candidate.id)
      if (isSelected) {
        return prev.filter(c => c.id !== candidate.id)
      } else {
        return [...prev, candidate]
      }
    })
  }

  const confirmMatches = () => {
    if (selectedCandidates.length === 0) {
      alert('相手を選択してください')
      return
    }

    const newConfirmed = [...confirmedMatches, ...selectedCandidates]
    setConfirmedMatches(newConfirmed)
    localStorage.setItem('biztype_confirmed_matches', JSON.stringify(newConfirmed))
    setSelectedCandidates([])
    setShowCandidates(false)
    setMatchCandidates([])
    setActiveTab('talk')
  }

  const fetchMessages = async (matchId) => {
    try {
      const response = await fetch(`${API_BASE}/matches/${matchId}/messages?userId=${userId}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleOpenChat = async (match) => {
    setActiveChat(match)
    setScreen('chat')
    setChatLoading(true)
    await fetchMessages(match.matchId)
    setChatLoading(false)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat) return

    const matchId = activeChat.matchId

    try {
      const response = await fetch(`${API_BASE}/matches/${matchId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          content: newMessage.trim()
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(matchId)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleBackToMypage = () => {
    setScreen('mypage')
    setActiveChat(null)
    setMessages([])
  }

  const handleLogout = () => {
    localStorage.removeItem('biztype_user_id')
    localStorage.removeItem('biztype_profile')
    localStorage.removeItem('biztype_result')
    localStorage.removeItem('biztype_confirmed_matches')
    localStorage.removeItem('biztype_logged_in')
    setScreen('start')
    setCurrentQuestion(0)
    setScores({ EI: 0, DA: 0, LS: 0, VP: 0, FR: 0 })
    setResult(null)
    setChartAnimated(false)
    setShowShareMenu(false)
    setUserId(null)
    setUserProfile({
      nickname: '', gender: '', prefecture: '', ageGroup: '',
      industry: '', jobType: '', experience: '', bio: ''
    })
    setMatchCandidates([])
    setSelectedCandidates([])
    setConfirmedMatches([])
    setShowCandidates(false)
    setIsLoggedIn(false)
  }

  const getScorePercentage = (dimension, score) => {
    const maxScore = 12
    const percentage = ((score + maxScore) / (maxScore * 2)) * 100
    return Math.round(percentage)
  }

  const getDimensionResult = (dimension, score) => {
    const dim = dimensions[dimension]
    return score >= 0 ? dim.posLabel : dim.negLabel
  }

  const handleShare = (platform) => {
    const text = `私のビジネスパーソナリティは「${resultTypes[result.type].name}」でした！ #BizType32`
    const url = window.location.href

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const handleDownloadImage = async () => {
    const element = resultRef.current
    if (!element) return

    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#F8FAFC',
      logging: false
    })

    const link = document.createElement('a')
    link.download = `BizType32_${result.type}_${resultTypes[result.type].name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)
  const typeData = result ? resultTypes[result.type] : null
  const career = result ? careerData[result.type] : null

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => isLoggedIn ? setScreen('mypage') : null} style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}>
            <span className="logo-icon">B</span>
            <span className="logo-text">BizType</span>
            <span className="logo-badge">32</span>
          </div>
          {isLoggedIn && (
            <div className="header-nav">
              <button
                className={`nav-btn ${screen === 'mypage' ? 'active' : ''}`}
                onClick={() => setScreen('mypage')}
              >
                マイページ
              </button>
              <button className="nav-btn logout" onClick={handleLogout}>
                ログアウト
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {/* Start Screen */}
        {screen === 'start' && (
          <div className="start-screen">
            <div className="start-hero">
              <div className="hero-badge">Work Values Matching</div>
              <h1 className="start-title">
                <span className="highlight">仕事の価値観</span>が合う人と<br />すぐにつながる
              </h1>
              <p className="start-subtitle">
                たった5分の診断で、あなたと相性抜群の<br />
                ビジネスパーソンとマッチング
              </p>
            </div>

            <div className="matching-preview">
              <div className="preview-avatars">
                <div className="preview-avatar" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>E</div>
                <div className="preview-avatar" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>I</div>
                <div className="preview-avatar" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>D</div>
                <div className="preview-avatar center" style={{background: 'linear-gradient(135deg, #ec4899, #be185d)'}}>?</div>
                <div className="preview-avatar" style={{background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>A</div>
                <div className="preview-avatar" style={{background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'}}>L</div>
                <div className="preview-avatar" style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>S</div>
              </div>
              <p className="preview-text">あなたにぴったりの相手が見つかる</p>
            </div>

            <div className="start-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div className="feature-content">
                  <strong>価値観診断</strong>
                  <span>5つの軸で仕事観を分析</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💫</span>
                <div className="feature-content">
                  <strong>相性マッチング</strong>
                  <span>相性の良い人をすぐ発見</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <div className="feature-content">
                  <strong>トーク機能</strong>
                  <span>気になる相手とチャット</span>
                </div>
              </div>
            </div>

            <button className="start-button" onClick={handleStart}>
              <span>無料で診断スタート</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <p className="start-note">
              <span className="note-time">約5分で完了</span>
              <span className="note-divider">・</span>
              <span className="note-free">完全無料</span>
            </p>
          </div>
        )}

        {/* Question Screen */}
        {screen === 'question' && (
          <div className="question-screen" key={currentQuestion}>
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <div className="progress-info">
                <span className="progress-current">{currentQuestion + 1}</span>
                <span className="progress-total">/ {questions.length}</span>
              </div>
            </div>

            <div className="question-card">
              <h2 className="question-text">{questions[currentQuestion].text}</h2>

              <div className="likert-container">
                <div className="likert-labels">
                  <span>そう思わない</span>
                  <span>そう思う</span>
                </div>
                <div className="likert-buttons">
                  {likertOptions.map((option, index) => (
                    <button
                      key={index}
                      className={`likert-button likert-${option.value}`}
                      onClick={() => handleAnswer(option.value)}
                      title={option.label}
                    >
                      <span className="likert-dot"></span>
                    </button>
                  ))}
                </div>
                <div className="likert-hint">
                  {likertOptions.map((option, index) => (
                    <span key={index} className="hint-label">{option.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {screen === 'loading' && (
          <div className="loading-screen">
            <div className="loading-animation">
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
            </div>
            <h2 className="loading-title">分析中</h2>
            <p className="loading-text">あなたの回答を32タイプと照合しています...</p>
          </div>
        )}

        {/* Result Screen (Before Registration) */}
        {screen === 'result' && result && typeData && (
          <div className="result-screen">
            <div className="result-hero" ref={resultRef}>
              <div className="hero-background" style={{ background: typeData.gradientStart }}></div>
              <div className="hero-content">
                <div className="hero-avatar">
                  <Avatar
                    typeCode={result.type}
                    gradientStart={typeData.gradientStart}
                    gradientEnd={typeData.gradientEnd}
                    size={160}
                  />
                </div>
                <div className="hero-info">
                  <div className="type-badge">{result.type}</div>
                  <h1 className="type-name">{typeData.name}</h1>
                  <p className="type-subtitle">{typeData.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="result-summary-card">
              <p className="type-summary">{typeData.summary}</p>

              {!showFullResult ? (
                <button className="show-more-btn" onClick={() => setShowFullResult(true)}>
                  詳細を見る ▼
                </button>
              ) : (
                <div className="result-details">
                  <div className="detail-section">
                    <h3><span className="icon">💪</span>強み</h3>
                    <ul>
                      {typeData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h3><span className="icon">⚠️</span>注意点</h3>
                    <ul>
                      {typeData.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <button className="show-more-btn" onClick={() => setShowFullResult(false)}>
                    閉じる ▲
                  </button>
                </div>
              )}
            </div>

            {/* CTA to Register */}
            <div className="result-cta">
              <div className="cta-content">
                <h2>🎉 診断完了！</h2>
                <p>あなたと相性の良いビジネスパーソンを探しましょう</p>
                <div className="cta-benefits">
                  <div className="benefit">✓ 相性の良い人とマッチング</div>
                  <div className="benefit">✓ メッセージでやり取り</div>
                  <div className="benefit">✓ 完全無料で利用可能</div>
                </div>
              </div>
              <button className="cta-button" onClick={handleGoToRegister}>
                <span>無料会員登録してマッチング</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <p className="cta-note">30秒で完了・メールアドレス不要</p>
            </div>

            <div className="result-share-actions">
              <button className="share-btn" onClick={() => setShowShareMenu(!showShareMenu)}>
                結果をシェア
              </button>
              {showShareMenu && (
                <div className="share-menu">
                  <button onClick={() => handleShare('twitter')}>X (Twitter)</button>
                  <button onClick={() => handleShare('facebook')}>Facebook</button>
                  <button onClick={() => handleShare('line')}>LINE</button>
                </div>
              )}
              <button className="save-btn" onClick={handleDownloadImage}>
                画像保存
              </button>
            </div>
          </div>
        )}

        {/* Registration Screen */}
        {screen === 'register' && (
          <div className="register-screen">
            <div className="register-header">
              <h2>会員登録</h2>
              <p>プロフィールを入力してマッチングを始めましょう</p>
            </div>

            <form className="register-form" onSubmit={handleRegister}>
              <div className="form-section">
                <h3>基本情報 <span className="required">必須</span></h3>

                <div className="form-group">
                  <label>ニックネーム</label>
                  <input
                    type="text"
                    value={userProfile.nickname}
                    onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
                    placeholder="表示名を入力"
                    maxLength={20}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>性別</label>
                  <div className="radio-group">
                    {['男性', '女性', 'その他'].map(g => (
                      <label key={g} className={`radio-option ${userProfile.gender === g ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={userProfile.gender === g}
                          onChange={(e) => setUserProfile({ ...userProfile, gender: e.target.value })}
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>都道府県</label>
                  <select
                    value={userProfile.prefecture}
                    onChange={(e) => setUserProfile({ ...userProfile, prefecture: e.target.value })}
                    required
                  >
                    <option value="">選択してください</option>
                    {prefectures.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>年代</label>
                  <select
                    value={userProfile.ageGroup}
                    onChange={(e) => setUserProfile({ ...userProfile, ageGroup: e.target.value })}
                  >
                    <option value="">選択してください</option>
                    {['10代', '20代', '30代', '40代', '50代', '60代以上'].map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>仕事について <span className="optional">任意</span></h3>

                <div className="form-group">
                  <label>業界</label>
                  <select
                    value={userProfile.industry}
                    onChange={(e) => setUserProfile({ ...userProfile, industry: e.target.value })}
                  >
                    <option value="">選択してください</option>
                    {industries.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>職種</label>
                  <select
                    value={userProfile.jobType}
                    onChange={(e) => setUserProfile({ ...userProfile, jobType: e.target.value })}
                  >
                    <option value="">選択してください</option>
                    {jobTypes.map(j => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>経験年数</label>
                  <select
                    value={userProfile.experience}
                    onChange={(e) => setUserProfile({ ...userProfile, experience: e.target.value })}
                  >
                    <option value="">選択してください</option>
                    {['学生', '1年未満', '1〜3年', '3〜5年', '5〜10年', '10年以上'].map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>自己紹介</label>
                  <textarea
                    value={userProfile.bio}
                    onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                    placeholder="趣味や興味のあること、仕事への想いなど..."
                    maxLength={200}
                    rows={3}
                  />
                  <span className="char-count">{userProfile.bio.length}/200</span>
                </div>
              </div>

              <button type="submit" className="register-button">
                登録してマッチング開始
              </button>
            </form>
          </div>
        )}

        {/* My Page Screen */}
        {screen === 'mypage' && isLoggedIn && result && typeData && (
          <div className="mypage-screen">
            {/* Tab Navigation */}
            <div className="mypage-tabs">
              <button
                className={`mypage-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="tab-icon">👤</span>
                プロフィール
              </button>
              <button
                className={`mypage-tab ${activeTab === 'matching' ? 'active' : ''}`}
                onClick={() => { setActiveTab('matching'); if (!showCandidates && matchCandidates.length === 0) fetchMatchCandidates(); }}
              >
                <span className="tab-icon">💫</span>
                マッチング
              </button>
              <button
                className={`mypage-tab ${activeTab === 'talk' ? 'active' : ''}`}
                onClick={() => setActiveTab('talk')}
              >
                <span className="tab-icon">💬</span>
                トーク
                {totalUnread > 0 && <span className="tab-badge">{totalUnread}</span>}
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="mypage-content profile-content">
                <div className="profile-card">
                  <div className="profile-header">
                    <Avatar
                      typeCode={result.type}
                      gradientStart={typeData.gradientStart}
                      gradientEnd={typeData.gradientEnd}
                      size={100}
                    />
                    <div className="profile-info">
                      <h2>{userProfile.nickname}</h2>
                      <div className="profile-type">
                        <span className="type-code">{result.type}</span>
                        <span className="type-name">{typeData.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="detail-row">
                      <span className="label">エリア</span>
                      <span className="value">{userProfile.prefecture}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">年代</span>
                      <span className="value">{userProfile.ageGroup || '未設定'}</span>
                    </div>
                    {userProfile.industry && (
                      <div className="detail-row">
                        <span className="label">業界</span>
                        <span className="value">{userProfile.industry}</span>
                      </div>
                    )}
                    {userProfile.jobType && (
                      <div className="detail-row">
                        <span className="label">職種</span>
                        <span className="value">{userProfile.jobType}</span>
                      </div>
                    )}
                    {userProfile.experience && (
                      <div className="detail-row">
                        <span className="label">経験</span>
                        <span className="value">{userProfile.experience}</span>
                      </div>
                    )}
                  </div>

                  {userProfile.bio && (
                    <div className="profile-bio">
                      <h4>自己紹介</h4>
                      <p>{userProfile.bio}</p>
                    </div>
                  )}
                </div>

                <div className="type-summary-card">
                  <h3>あなたのタイプ</h3>
                  <p className="type-subtitle">{typeData.subtitle}</p>
                  <p className="type-desc">{typeData.summary}</p>

                  <div className="dimension-mini-chart">
                    {Object.entries(dimensions).map(([key, dim]) => {
                      const score = result.scores[key]
                      const percentage = getScorePercentage(key, score)
                      return (
                        <div key={key} className="mini-dimension">
                          <span className="dim-label">{dim.name}</span>
                          <div className="dim-bar">
                            <div
                              className="dim-fill"
                              style={{
                                width: `${percentage}%`,
                                background: dim.color
                              }}
                            />
                          </div>
                          <span className="dim-result" style={{ color: dim.color }}>
                            {getDimensionResult(key, score)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="quick-actions">
                  <button
                    className="action-card"
                    onClick={() => { setActiveTab('matching'); fetchMatchCandidates(); }}
                  >
                    <span className="action-icon">💫</span>
                    <span className="action-text">相性の良い人を探す</span>
                  </button>
                  <button
                    className="action-card"
                    onClick={() => setActiveTab('talk')}
                  >
                    <span className="action-icon">💬</span>
                    <span className="action-text">トーク ({confirmedMatches.length})</span>
                    {totalUnread > 0 && <span className="action-badge">{totalUnread}</span>}
                  </button>
                </div>
              </div>
            )}

            {/* Matching Tab */}
            {activeTab === 'matching' && (
              <div className="mypage-content matching-content">
                {matchesLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>相性の良い人を探しています...</p>
                  </div>
                ) : !showCandidates || matchCandidates.length === 0 ? (
                  <div className="empty-matching">
                    <div className="empty-icon">🔍</div>
                    <h3>マッチング候補を探す</h3>
                    <p>あなたと相性の良いビジネスパーソンを見つけましょう</p>
                    <button className="find-btn" onClick={fetchMatchCandidates}>
                      候補を探す
                    </button>
                  </div>
                ) : (
                  <div className="candidates-container">
                    <div className="candidates-header">
                      <h3>相性の良い候補 ({matchCandidates.length}人)</h3>
                      <p>気になる相手を選んでトークを始めましょう</p>
                    </div>

                    <div className="candidates-list">
                      {matchCandidates.map((candidate, i) => {
                        const isSelected = selectedCandidates.some(c => c.id === candidate.id)
                        const candidateType = resultTypes[candidate.type_code]
                        return (
                          <div
                            key={i}
                            className={`candidate-card-rich ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleCandidateSelection(candidate)}
                          >
                            <div className="candidate-select">
                              <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                                {isSelected && '✓'}
                              </div>
                            </div>

                            <div className="candidate-main">
                              <div className="candidate-top">
                                <div className="candidate-avatar">
                                  <Avatar
                                    typeCode={candidate.type_code}
                                    gradientStart={candidateType?.gradientStart || '#6366F1'}
                                    gradientEnd={candidateType?.gradientEnd || '#4F46E5'}
                                    size={60}
                                  />
                                </div>
                                <div className="candidate-header">
                                  <div className="candidate-name-row">
                                    <span className="name">{candidate.nickname}</span>
                                    <span className="compatibility">{candidate.compatibility_score}%</span>
                                  </div>
                                  <div className="candidate-type-row">
                                    <span className="type-badge">{candidate.type_code}</span>
                                    <span className="type-name">{candidateType?.name}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="candidate-details">
                                <div className="detail-tags">
                                  <span className="tag">{candidate.prefecture}</span>
                                  <span className="tag">{candidate.gender}</span>
                                  {candidate.age_group && <span className="tag">{candidate.age_group}</span>}
                                  {candidate.industry && <span className="tag">{candidate.industry}</span>}
                                  {candidate.job_type && <span className="tag">{candidate.job_type}</span>}
                                </div>
                                {candidateType && (
                                  <p className="candidate-desc">{candidateType.subtitle}</p>
                                )}
                              </div>

                              <div className="compatibility-reason">
                                <span className="reason-label">相性ポイント</span>
                                <span className="reason-text">
                                  {candidate.compatibility_score === 100
                                    ? '最高の相性！お互いの強みを活かせます'
                                    : '良い相性！補完し合える関係です'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {selectedCandidates.length > 0 && (
                      <div className="selection-bar">
                        <span>{selectedCandidates.length}人選択中</span>
                        <button className="confirm-btn" onClick={confirmMatches}>
                          この人とトークする
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Talk Tab */}
            {activeTab === 'talk' && (
              <div className="mypage-content talk-content">
                {confirmedMatches.length === 0 ? (
                  <div className="empty-talk">
                    <div className="empty-icon">💬</div>
                    <h3>まだトーク相手がいません</h3>
                    <p>マッチングタブで相手を見つけましょう</p>
                    <button className="find-btn" onClick={() => { setActiveTab('matching'); fetchMatchCandidates(); }}>
                      相手を探す
                    </button>
                  </div>
                ) : (
                  <div className="talk-list">
                    {confirmedMatches.map((match, i) => {
                      const matchType = resultTypes[match.type_code]
                      return (
                        <div
                          key={i}
                          className="talk-item"
                          onClick={() => handleOpenChat(match)}
                        >
                          <div className="talk-avatar">
                            <Avatar
                              typeCode={match.type_code}
                              gradientStart={matchType?.gradientStart || '#6366F1'}
                              gradientEnd={matchType?.gradientEnd || '#4F46E5'}
                              size={56}
                            />
                          </div>
                          <div className="talk-info">
                            <div className="talk-name">{match.nickname}</div>
                            <div className="talk-meta">
                              <span className="talk-type">{matchType?.name}</span>
                              <span className="talk-compat">相性 {match.compatibility_score}%</span>
                            </div>
                          </div>
                          {unreadCounts[match.matchId] > 0 && (
                            <div className="unread-badge">{unreadCounts[match.matchId]}</div>
                          )}
                          <div className="talk-arrow">›</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Chat Screen */}
        {screen === 'chat' && activeChat && (
          <div className="chat-screen">
            <div className="chat-header">
              <button className="back-btn" onClick={handleBackToMypage}>
                ← 戻る
              </button>
              <div className="chat-partner">
                <span className="partner-name">{activeChat.nickname}</span>
                <span className="partner-type">
                  {resultTypes[activeChat.type_code]?.name} | 相性 {activeChat.compatibility_score}%
                </span>
              </div>
            </div>

            <div className="chat-messages">
              {chatLoading ? (
                <div className="chat-loading">
                  <div className="loading-spinner"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-empty">
                  <p>まだメッセージがありません</p>
                  <p>最初のメッセージを送ってみましょう！</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
              />
              <button type="submit" disabled={!newMessage.trim()}>
                送信
              </button>
            </form>
          </div>
        )}
      </main>

      {!isLoggedIn && screen !== 'chat' && (
        <footer className="footer">
          <p>BizType 32 - Work Values Matching</p>
        </footer>
      )}
    </div>
  )
}

export default App
