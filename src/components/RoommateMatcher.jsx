import React, { useState } from 'react'
import { Plus, Search, MessageSquare, Send, X } from 'lucide-react'

export default function RoommateMatcher({ roommates, onAddRoommate }) {
  // Filter states
  const [genderFilter, setGenderFilter] = useState('')
  const [sleepFilter, setSleepFilter] = useState('')
  const [foodFilter, setFoodFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [activeChatRoommate, setActiveChatRoommate] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatLog, setChatLog] = useState([
    { sender: 'them', text: 'Hey there! Thanks for reaching out. What branch are you in?' }
  ])

  // Post form states
  const [newName, setNewName] = useState('')
  const [newGender, setNewGender] = useState('boys')
  const [newBranch, setNewBranch] = useState('')
  const [newYear, setNewYear] = useState('1st Year')
  const [newBudget, setNewBudget] = useState('₹10,000 - ₹15,000')
  const [newSleep, setNewSleep] = useState('Flexible')
  const [newFood, setNewFood] = useState('Veg / Non-Veg')
  const [newAreas, setNewAreas] = useState('')
  const [newBio, setNewBio] = useState('')

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (!newName || !newBranch || !newBio) return

    const parsedAreas = newAreas ? newAreas.split(',').map(s => s.trim()) : ['Kothrud']
    const avatars = newGender === 'girls' ? ['🎨', '💃', '📚', '👩‍💻'] : ['👨‍💻', '🎸', '📈', '🏃‍♂️']
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]

    const newProfile = {
      id: 'room-' + Date.now(),
      name: newName,
      gender: newGender,
      branch: newBranch,
      year: newYear,
      budget: newBudget,
      areas: parsedAreas,
      sleep: newSleep,
      food: newFood,
      hobbies: 'Student Life',
      bio: newBio,
      avatar: randomAvatar
    }

    onAddRoommate(newProfile)
    setIsPostModalOpen(false)

    // Reset fields
    setNewName('')
    setNewBranch('')
    setNewAreas('')
    setNewBio('')
  }

  const handleOpenChat = (roommate) => {
    setActiveChatRoommate(roommate)
    setChatLog([
      { sender: 'them', text: `Hey! I am ${roommate.name}. Thanks for reaching out about sharing a room in ${roommate.areas.join(' or ')}.` },
      { sender: 'them', text: `My budget is around ${roommate.budget}. What PG/hostel are you targeting?` }
    ])
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    const userMsg = { sender: 'me', text: chatMessage }
    setChatLog(prev => [...prev, userMsg])
    setChatMessage('')

    // Simulated auto response
    setTimeout(() => {
      setChatLog(prev => [...prev, { 
        sender: 'them', 
        text: "That sounds awesome! Let me check the rooms there this weekend. Do you want to exchange numbers and meet up at Cafe Durga?" 
      }])
    }, 1500)
  }

  // Filter logic
  const filteredRoommates = roommates.filter(profile => {
    const matchesGender = !genderFilter || profile.gender === genderFilter;
    const matchesSleep = !sleepFilter || profile.sleep.toLowerCase().includes(sleepFilter.toLowerCase());
    const matchesFood = !foodFilter || profile.food.toLowerCase().includes(foodFilter.toLowerCase()) || foodFilter === 'Veg / Non-Veg';
    const matchesSearch = !searchQuery || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.areas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesGender && matchesSleep && matchesFood && matchesSearch;
  })

  return (
    <div className="roommate-dashboard" id="roommate-matcher-root">
      {/* Left Filters Pane */}
      <aside className="filters-sidebar">
        <div>
          <button 
            id="matcher-post-btn"
            className="post-matcher-btn" 
            onClick={() => setIsPostModalOpen(true)}
          >
            <Plus size={16} /> Post My Profile
          </button>
        </div>

        <div className="filter-group">
          <h3 className="filter-section-title">I am looking for</h3>
          <div className="gender-filters" role="group" aria-label="Gender filter">
            <button
              id="matcher-filter-boys"
              className={`gender-btn boys ${genderFilter === 'boys' ? 'active' : ''}`}
              onClick={() => setGenderFilter(genderFilter === 'boys' ? '' : 'boys')}
            >
              Boys
            </button>
            <button
              id="matcher-filter-girls"
              className={`gender-btn girls ${genderFilter === 'girls' ? 'active' : ''}`}
              onClick={() => setGenderFilter(genderFilter === 'girls' ? '' : 'girls')}
            >
              Girls
            </button>
            <button
              id="matcher-filter-all"
              className={`gender-btn coliving ${genderFilter === '' ? 'active' : ''}`}
              onClick={() => setGenderFilter('')}
            >
              Any
            </button>
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-section-title">Dietary Pref</h3>
          <select 
            id="diet-select"
            className="sort-select" 
            style={{ width: '100%' }}
            value={foodFilter}
            onChange={(e) => setFoodFilter(e.target.value)}
          >
            <option value="">Any Diet</option>
            <option value="vegetarian">Strictly Veg</option>
            <option value="Veg / Non-Veg">Veg & Non-Veg</option>
          </select>
        </div>

        <div className="filter-group">
          <h3 className="filter-section-title">Sleep Habit</h3>
          <select 
            id="sleep-select"
            className="sort-select" 
            style={{ width: '100%' }}
            value={sleepFilter}
            onChange={(e) => setSleepFilter(e.target.value)}
          >
            <option value="">Any Schedule</option>
            <option value="night">Night Owl</option>
            <option value="early">Early Bird</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div className="filter-group">
          <h3 className="filter-section-title">Search Seeker</h3>
          <div className="search-bar-container" style={{ borderSize: '1px', padding: '0.15rem' }}>
            <input 
              id="matcher-search"
              type="text" 
              placeholder="Search branch or area..." 
              className="search-input"
              style={{ padding: '0.5rem 1rem 0.5rem 1rem', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </aside>

      {/* Right listings Area */}
      <div className="listings-area">
        <div className="listings-header">
          <h2 style={{ fontSize: '1.25rem' }}>Roommate Seeker Board</h2>
          <span className="results-count">Showing <span>{filteredRoommates.length}</span> students</span>
        </div>

        {filteredRoommates.length === 0 ? (
          <div className="empty-state">
            <h4>No students found matching your filters.</h4>
            <p>Try modifying your dietary or sleeping filters or search keywords.</p>
          </div>
        ) : (
          <div className="roommates-grid">
            {filteredRoommates.map(profile => (
              <div key={profile.id} className="roommate-card" id={`room-card-${profile.id}`}>
                <div className="roommate-card-header">
                  <div className="roommate-avatar">{profile.avatar}</div>
                  <div className="roommate-meta-header">
                    <span className="roommate-name">{profile.name}</span>
                    <span className="roommate-branch">{profile.branch} ({profile.year})</span>
                  </div>
                </div>

                <div className="roommate-tags">
                  <span className="roommate-tag" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>⏰ {profile.sleep}</span>
                  <span className="roommate-tag">🥗 {profile.food}</span>
                </div>

                <p className="roommate-bio">{profile.bio}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', margin: '0.25rem 0' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>PREFER: </span>
                  {profile.areas.map((a, idx) => (
                    <span key={idx} style={{ fontSize: '0.65rem', background: 'var(--bg-tertiary)', padding: '0.05rem 0.3rem', borderRadius: '3px' }}>{a}</span>
                  ))}
                </div>

                <div className="roommate-footer">
                  <div className="roommate-budget-box">
                    <span className="roommate-budget-label">Budget Range</span>
                    <span className="roommate-budget-val">{profile.budget}</span>
                  </div>
                  <button 
                    id={`connect-btn-${profile.id}`}
                    className="connect-btn"
                    onClick={() => handleOpenChat(profile)}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Profile Modal */}
      {isPostModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPostModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post Roommate Ad</h3>
              <button className="compare-close-btn" onClick={() => setIsPostModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handlePostSubmit} className="modal-form">
              <div className="modal-form-group">
                <label htmlFor="p-name">Full Name</label>
                <input id="p-name" type="text" placeholder="e.g. Shaurya Sharma" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              </div>
              
              <div className="modal-form-group">
                <label>Your Gender</label>
                <select id="p-gender" value={newGender} onChange={(e) => setNewGender(e.target.value)}>
                  <option value="boys">Male</option>
                  <option value="girls">Female</option>
                </select>
              </div>

              <div className="modal-form-group">
                <label htmlFor="p-branch">Branch & Year</label>
                <input id="p-branch" type="text" placeholder="e.g. B.Tech IT, 3rd Year" value={newBranch} onChange={(e) => setNewBranch(e.target.value)} required />
              </div>

              <div className="modal-form-group">
                <label htmlFor="p-budget">Monthly Budget Range</label>
                <input id="p-budget" type="text" placeholder="e.g. ₹8,000 - ₹12,000" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} required />
              </div>

              <div className="modal-form-group">
                <label>Sleeping Schedule</label>
                <select id="p-sleep" value={newSleep} onChange={(e) => setNewSleep(e.target.value)}>
                  <option value="Flexible">Flexible</option>
                  <option value="Night Owl (1 AM - 8 AM)">Night Owl</option>
                  <option value="Early Bird (10 PM - 5 AM)">Early Bird</option>
                </select>
              </div>

              <div className="modal-form-group">
                <label>Dietary Habit</label>
                <select id="p-food" value={newFood} onChange={(e) => setNewFood(e.target.value)}>
                  <option value="Veg / Non-Veg">Veg / Non-Veg</option>
                  <option value="Strictly Vegetarian">Strictly Vegetarian</option>
                </select>
              </div>

              <div className="modal-form-group">
                <label htmlFor="p-areas">Target Localities (Comma separated)</label>
                <input id="p-areas" type="text" placeholder="e.g. Rambaug Colony, Paud Road" value={newAreas} onChange={(e) => setNewAreas(e.target.value)} />
              </div>

              <div className="modal-form-group">
                <label htmlFor="p-bio">Introduce Yourself</label>
                <textarea id="p-bio" placeholder="Hobbies, cleanliness levels, habits, what PG you are planning to join..." value={newBio} onChange={(e) => setNewBio(e.target.value)} required></textarea>
              </div>

              <button id="p-submit" type="submit" className="modal-submit-btn">Publish Ad</button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Window Modal */}
      {activeChatRoommate && (
        <div className="modal-overlay" onClick={() => setActiveChatRoommate(null)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="roommate-avatar" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>{activeChatRoommate.avatar}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Chat with {activeChatRoommate.name}</span>
                  <span style={{ fontSize: '0.65rem', color: '#10b981' }}>Active student seeker</span>
                </div>
              </div>
              <button className="compare-close-btn" onClick={() => setActiveChatRoommate(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="chat-window">
              <div className="chat-messages">
                {chatLog.map((msg, index) => (
                  <div key={index} className={`chat-msg ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  id="chat-message-input"
                  type="text"
                  placeholder="Type a message..."
                  className="review-form-input"
                  style={{ flex: 1, padding: '0.4rem 0.75rem' }}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  required
                />
                <button id="chat-send-btn" type="submit" className="theme-toggle-btn" style={{ borderRadius: '8px', background: 'var(--accent-primary)', color: 'white' }}>
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
