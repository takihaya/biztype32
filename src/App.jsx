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

function App() {
  // Screen states
  const [screen, setScreen] = useState('start') // start, register, question, loading, result, chat

  // User state
  const [userId, setUserId] = useState(null)
  const [userProfile, setUserProfile] = useState({ nickname: '', gender: '', prefecture: '', ageGroup: '' })

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({ EI: 0, DA: 0, LS: 0, VP: 0, FR: 0 })
  const [result, setResult] = useState(null)
  const [chartAnimated, setChartAnimated] = useState(false)

  // UI state
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const resultRef = useRef(null)

  // Matching state
  const [matchCandidates, setMatchCandidates] = useState([]) // 候補者リスト
  const [selectedCandidates, setSelectedCandidates] = useState([]) // 選択した候補者
  const [confirmedMatches, setConfirmedMatches] = useState([]) // 確定したマッチング
  const [matchesLoading, setMatchesLoading] = useState(false)
  const [showCandidates, setShowCandidates] = useState(false) // 候補者表示フラグ

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

    if (savedUserId && savedProfile && savedResult) {
      setUserId(savedUserId)
      setUserProfile(JSON.parse(savedProfile))
      setResult(JSON.parse(savedResult))
      if (savedMatches) {
        setConfirmedMatches(JSON.parse(savedMatches))
      }
      setScreen('result')
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

  const handleStart = () => {
    setScreen('register')
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!userProfile.nickname || !userProfile.gender || !userProfile.prefecture) {
      alert('全ての項目を入力してください')
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
        setScreen('question')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      // Continue anyway with local-only mode
      const tempId = 'local_' + Date.now()
      setUserId(tempId)
      setScreen('question')
    }
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
    setActiveTab('overview')
    setTimeout(() => setChartAnimated(true), 300)

    // Save result to backend
    try {
      await fetch(`${API_BASE}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeCode, scores: finalScores, userId })
      })
    } catch (error) {
      console.warn('Could not save result:', error)
    }
  }

  // マッチング候補を取得
  const fetchMatchCandidates = async () => {
    if (!userId || userId.startsWith('local_')) return

    setMatchesLoading(true)
    try {
      const response = await fetch(`${API_BASE}/matches/${userId}`)
      const data = await response.json()
      // 既に確定済みのユーザーを除外
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

  // 候補者を選択/解除
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

  // マッチングを確定
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
    setActiveTab('talk') // トークタブに移動
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

  const handleBackToResult = () => {
    setScreen('result')
    setActiveChat(null)
    setMessages([])
    setActiveTab('talk')
  }

  const handleRestart = () => {
    localStorage.removeItem('biztype_user_id')
    localStorage.removeItem('biztype_profile')
    localStorage.removeItem('biztype_result')
    localStorage.removeItem('biztype_confirmed_matches')
    setScreen('start')
    setCurrentQuestion(0)
    setScores({ EI: 0, DA: 0, LS: 0, VP: 0, FR: 0 })
    setResult(null)
    setChartAnimated(false)
    setShowShareMenu(false)
    setUserId(null)
    setUserProfile({ nickname: '', gender: '', prefecture: '', ageGroup: '' })
    setMatchCandidates([])
    setSelectedCandidates([])
    setConfirmedMatches([])
    setShowCandidates(false)
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

  const handleDownloadPDF = async () => {
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
          <div className="logo" onClick={() => result ? setScreen('result') : null} style={{ cursor: result ? 'pointer' : 'default' }}>
            <span className="logo-icon">B</span>
            <span className="logo-text">BizType</span>
            <span className="logo-badge">32</span>
          </div>
          {userId && userProfile.nickname && (
            <div className="user-info">
              <span className="user-name">{userProfile.nickname}</span>
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

        {/* Registration Screen */}
        {screen === 'register' && (
          <div className="register-screen">
            <h2 className="register-title">プロフィール登録</h2>
            <p className="register-subtitle">マッチング機能を利用するための情報を入力してください</p>

            <form className="register-form" onSubmit={handleRegister}>
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
                <label>年代（任意）</label>
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

              <button type="submit" className="register-button">
                診断を開始する
              </button>
            </form>
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

        {/* Result Screen */}
        {screen === 'result' && result && typeData && (
          <div className="result-screen">
            {/* Hero Section */}
            <div className="result-hero" ref={resultRef}>
              <div className="hero-background" style={{ background: typeData.gradientStart }}></div>
              <div className="hero-content">
                <div className="hero-avatar">
                  <Avatar
                    typeCode={result.type}
                    gradientStart={typeData.gradientStart}
                    gradientEnd={typeData.gradientEnd}
                    size={180}
                  />
                </div>
                <div className="hero-info">
                  <div className="type-badge">{result.type}</div>
                  <h1 className="type-name">{typeData.name}</h1>
                  <p className="type-subtitle">{typeData.subtitle}</p>
                  <p className="type-summary">{typeData.summary}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="result-tabs">
              <button
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                概要
              </button>
              <button
                className={`tab-button ${activeTab === 'career' ? 'active' : ''}`}
                onClick={() => setActiveTab('career')}
              >
                キャリア
              </button>
              <button
                className={`tab-button ${activeTab === 'matching' ? 'active' : ''}`}
                onClick={() => setActiveTab('matching')}
              >
                マッチング
              </button>
              <button
                className={`tab-button ${activeTab === 'talk' ? 'active' : ''}`}
                onClick={() => setActiveTab('talk')}
              >
                トーク
                {totalUnread > 0 && <span className="tab-badge">{totalUnread}</span>}
              </button>
            </div>

            {/* Tab Content */}
            <div className="result-content">
              {activeTab === 'overview' && (
                <div className="tab-content overview-tab">
                  <section className="content-section">
                    <h3 className="section-title">
                      <span className="section-icon">📋</span>
                      あなたの特徴
                    </h3>
                    <p className="description-text">{typeData.description}</p>
                  </section>

                  <div className="two-column">
                    <section className="content-section strength-card">
                      <h3 className="section-title">
                        <span className="section-icon positive">+</span>
                        強み
                      </h3>
                      <ul className="trait-list">
                        {typeData.strengths.map((s, i) => (
                          <li key={i} className="trait-item positive">{s}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="content-section weakness-card">
                      <h3 className="section-title">
                        <span className="section-icon negative">!</span>
                        注意点
                      </h3>
                      <ul className="trait-list">
                        {typeData.weaknesses.map((w, i) => (
                          <li key={i} className="trait-item negative">{w}</li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <section className="content-section advice-card">
                    <h3 className="section-title">
                      <span className="section-icon">💡</span>
                      アドバイス
                    </h3>
                    <p className="advice-text">{typeData.advice}</p>
                  </section>

                  <section className="content-section">
                    <h3 className="section-title">
                      <span className="section-icon">📊</span>
                      スコア分布
                    </h3>
                    <div className="dimension-chart">
                      {Object.entries(dimensions).map(([key, dim]) => {
                        const score = result.scores[key]
                        const percentage = getScorePercentage(key, score)
                        return (
                          <div key={key} className="dimension-row">
                            <div className="dimension-labels">
                              <span className="dim-neg">{dim.negLabel}</span>
                              <span className="dim-pos" style={{ color: dim.color }}>{dim.posLabel}</span>
                            </div>
                            <div className="dimension-bar">
                              <div className="bar-track">
                                <div className="bar-center"></div>
                                <div
                                  className="bar-indicator"
                                  style={{
                                    left: chartAnimated ? `${percentage}%` : '50%',
                                    backgroundColor: dim.color
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="dimension-value" style={{ color: dim.color }}>
                              {getDimensionResult(key, score)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'career' && career && (
                <div className="tab-content career-tab">
                  <section className="content-section">
                    <h3 className="section-title">
                      <span className="section-icon">🎯</span>
                      適性のある職種
                    </h3>
                    <div className="role-tags">
                      {career.idealRoles.map((role, i) => (
                        <span key={i} className="role-tag">{role}</span>
                      ))}
                    </div>
                  </section>

                  <section className="content-section">
                    <h3 className="section-title">
                      <span className="section-icon">🗺️</span>
                      キャリアロードマップ
                    </h3>
                    <div className="roadmap">
                      {career.careerRoadmap.map((phase, i) => (
                        <div key={i} className="roadmap-item">
                          <div className="roadmap-timeline">
                            <div className="timeline-dot" style={{ background: typeData.gradientStart }}></div>
                            {i < career.careerRoadmap.length - 1 && <div className="timeline-line"></div>}
                          </div>
                          <div className="roadmap-content">
                            <div className="roadmap-phase">{phase.phase}</div>
                            <div className="roadmap-title">{phase.title}</div>
                            <div className="roadmap-description">{phase.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="content-section">
                    <h3 className="section-title">
                      <span className="section-icon">🚀</span>
                      獲得すべきスキル
                    </h3>
                    <div className="skills-list">
                      {career.potentialSkills.map((skill, i) => (
                        <div key={i} className={`skill-card priority-${skill.priority}`}>
                          <div className="skill-header">
                            <span className="skill-name">{skill.name}</span>
                            <span className={`skill-priority ${skill.priority}`}>
                              {skill.priority === 'high' ? '重要' : '推奨'}
                            </span>
                          </div>
                          <p className="skill-description">{skill.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'matching' && (
                <div className="tab-content matching-tab">
                  <section className="content-section">
                    <h3 className="section-title">
                      <span className="section-icon">💫</span>
                      マッチング
                    </h3>
                    <p className="section-description">
                      あなたのタイプと相性の良いビジネスパーソンを探しましょう。<br />
                      気になる相手を選んで、トークを始めましょう！
                    </p>

                    {!showCandidates ? (
                      <div className="matching-start">
                        <div className="matching-highlight">NEW! おすすめ機能</div>
                        <div className="matching-start-icon">🔍</div>
                        <p>下のボタンをタップして<br />相性の良い相手を探しましょう</p>
                        <button
                          className="find-matches-btn"
                          onClick={fetchMatchCandidates}
                          disabled={matchesLoading}
                        >
                          {matchesLoading ? (
                            <>
                              <span className="loading-spinner-small"></span>
                              検索中...
                            </>
                          ) : (
                            <>
                              <span>🔍</span>
                              相手を探す
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="candidates-section">
                        <p className="candidates-instruction">
                          気になる相手を選択して「決定」を押してください
                        </p>

                        {matchCandidates.length > 0 ? (
                          <>
                            <div className="candidates-list">
                              {matchCandidates.map((candidate, i) => {
                                const isSelected = selectedCandidates.some(c => c.id === candidate.id)
                                return (
                                  <div
                                    key={i}
                                    className={`candidate-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleCandidateSelection(candidate)}
                                  >
                                    <div className="candidate-checkbox">
                                      {isSelected ? '✓' : ''}
                                    </div>
                                    <div className="candidate-avatar">
                                      <Avatar
                                        typeCode={candidate.type_code}
                                        gradientStart={resultTypes[candidate.type_code]?.gradientStart || '#6366F1'}
                                        gradientEnd={resultTypes[candidate.type_code]?.gradientEnd || '#4F46E5'}
                                        size={70}
                                      />
                                    </div>
                                    <div className="candidate-info">
                                      <div className="candidate-name">{candidate.nickname}</div>
                                      <div className="candidate-type">
                                        <span className="type-badge-small">{candidate.type_code}</span>
                                        <span>{resultTypes[candidate.type_code]?.name}</span>
                                      </div>
                                      <div className="candidate-meta">
                                        <span>{candidate.prefecture}</span>
                                        <span>{candidate.gender}</span>
                                        {candidate.age_group && <span>{candidate.age_group}</span>}
                                      </div>
                                    </div>
                                    <div className="candidate-compatibility">
                                      <span className="compatibility-score">{candidate.compatibility_score}%</span>
                                      <span className="compatibility-label">相性</span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>

                            <div className="candidates-actions">
                              <button
                                className="cancel-btn"
                                onClick={() => { setShowCandidates(false); setSelectedCandidates([]); }}
                              >
                                キャンセル
                              </button>
                              <button
                                className="confirm-btn"
                                onClick={confirmMatches}
                                disabled={selectedCandidates.length === 0}
                              >
                                決定 ({selectedCandidates.length}人)
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="no-candidates">
                            <p>現在マッチする相手が見つかりませんでした</p>
                            <button
                              className="retry-btn"
                              onClick={() => { setShowCandidates(false); }}
                            >
                              戻る
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </section>

                  {typeData.compatibility && (
                    <section className="content-section">
                      <h3 className="section-title">
                        <span className="section-icon">✨</span>
                        相性の良いタイプ
                      </h3>
                      <div className="compat-cards">
                        {typeData.compatibility.best.map((type, i) => (
                          <div key={i} className="compat-card best">
                            <div className="compat-type-code">{type}</div>
                            <div className="compat-type-name">{resultTypes[type]?.name || type}</div>
                            <div className="compat-label">最高の相性</div>
                          </div>
                        ))}
                        {typeData.compatibility.good.map((type, i) => (
                          <div key={i} className="compat-card good">
                            <div className="compat-type-code">{type}</div>
                            <div className="compat-type-name">{resultTypes[type]?.name || type}</div>
                            <div className="compat-label">良い相性</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {activeTab === 'talk' && (
                <div className="tab-content talk-tab">
                  <section className="content-section">
                    <h3 className="section-title">
                      <span className="section-icon">💬</span>
                      トーク
                    </h3>

                    {confirmedMatches.length > 0 ? (
                      <div className="talk-list">
                        {confirmedMatches.map((match, i) => (
                          <div
                            key={i}
                            className="talk-card"
                            onClick={() => handleOpenChat(match)}
                          >
                            <div className="talk-avatar">
                              <Avatar
                                typeCode={match.type_code}
                                gradientStart={resultTypes[match.type_code]?.gradientStart || '#6366F1'}
                                gradientEnd={resultTypes[match.type_code]?.gradientEnd || '#4F46E5'}
                                size={60}
                              />
                            </div>
                            <div className="talk-info">
                              <div className="talk-name">{match.nickname}</div>
                              <div className="talk-type">
                                {resultTypes[match.type_code]?.name}
                              </div>
                            </div>
                            {unreadCounts[match.matchId] > 0 && (
                              <div className="talk-unread">{unreadCounts[match.matchId]}</div>
                            )}
                            <div className="talk-arrow">›</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-talks">
                        <div className="no-talks-icon">💬</div>
                        <p>まだトーク相手がいません</p>
                        <p className="no-talks-hint">
                          「マッチング」タブで相手を探して<br />トークを始めましょう！
                        </p>
                        <button
                          className="go-matching-btn"
                          onClick={() => setActiveTab('matching')}
                        >
                          マッチングへ
                        </button>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="result-actions">
              <div className="share-container">
                <button
                  className="action-button share-button"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  シェア
                </button>
                {showShareMenu && (
                  <div className="share-menu">
                    <button onClick={() => handleShare('twitter')} className="share-option twitter">X (Twitter)</button>
                    <button onClick={() => handleShare('facebook')} className="share-option facebook">Facebook</button>
                    <button onClick={() => handleShare('line')} className="share-option line">LINE</button>
                  </div>
                )}
              </div>

              <button className="action-button download-button" onClick={handleDownloadPDF}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                保存
              </button>

              <button className="action-button restart-button" onClick={handleRestart}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                やり直す
              </button>
            </div>
          </div>
        )}

        {/* Chat Screen */}
        {screen === 'chat' && activeChat && (
          <div className="chat-screen">
            <div className="chat-header">
              <button className="chat-back-btn" onClick={handleBackToResult}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <div className="chat-user-info">
                <span className="chat-user-name">{activeChat.nickname}</span>
                <span className="chat-user-type">
                  {activeChat.type_code} - {resultTypes[activeChat.type_code]?.name}
                </span>
              </div>
              <div className="chat-compatibility">
                相性 {activeChat.compatibility_score}%
              </div>
            </div>

            <div className="chat-messages">
              {chatLoading ? (
                <div className="chat-loading">
                  <div className="loading-spinner-small"></div>
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

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>BizType 32 - Business Personality Assessment</p>
      </footer>
    </div>
  )
}

export default App
