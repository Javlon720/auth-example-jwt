import './style.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3054'
const STORAGE_KEY = 'auth-example-session'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="shell">
    <section class="intro">
      <div>
        <p class="eyebrow">JWT Auth</p>
        <h1>Ro'yxatdan o'ting, kiring va profilingizni token orqali oling.</h1>
        <p class="lead">Frontend Fastify backend bilan ishlaydi: register, login, refresh va GET /auth/me endpointlari tayyor.</p>
      </div>
      <div class="status-panel">
        <span id="session-dot" class="dot"></span>
        <div>
          <strong id="session-title">Sessiya yo'q</strong>
          <p id="session-subtitle">Avval login qiling.</p>
        </div>
      </div>
    </section>

    <section class="workspace">
      <form id="register-form" class="panel">
        <div class="panel-head">
          <span class="panel-icon">+</span>
          <div>
            <h2>Register</h2>
            <p>Yangi user yaratish</p>
          </div>
        </div>

        <div class="field-grid">
          <label>
            First name
            <input id="register-first-name" autocomplete="given-name" required />
          </label>
          <label>
            Last name
            <input id="register-last-name" autocomplete="family-name" required />
          </label>
        </div>

        <label>
          Email
          <input id="register-email" type="email" autocomplete="email" required />
        </label>

        <div class="field-grid">
          <label>
            Password
            <input id="register-password" type="password" minlength="6" autocomplete="new-password" required />
          </label>
          <label>
            Age
            <input id="register-age" type="number" min="14" max="135" required />
          </label>
        </div>

        <label>
          Gender
          <select id="register-gender">
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </label>

        <button type="submit">Register</button>
        <pre id="register-result" class="result">Natija shu yerda chiqadi.</pre>
      </form>

      <form id="login-form" class="panel">
        <div class="panel-head">
          <span class="panel-icon">→</span>
          <div>
            <h2>Login</h2>
            <p>Tokenlarni olish</p>
          </div>
        </div>

        <label>
          Email
          <input id="login-email" type="email" autocomplete="email" required />
        </label>

        <label>
          Password
          <input id="login-password" type="password" minlength="6" autocomplete="current-password" required />
        </label>

        <button type="submit">Login</button>
        <pre id="login-result" class="result">Login javobi shu yerda chiqadi.</pre>
      </form>

      <section class="panel session-card">
        <div class="panel-head">
          <span class="panel-icon">✓</span>
          <div>
            <h2>Session</h2>
            <p>Access token bilan profil olish</p>
          </div>
        </div>

        <div class="actions">
          <button id="profile-button" type="button">GET /auth/me</button>
          <button id="refresh-button" type="button" class="secondary">Refresh</button>
          <button id="clear-session-button" type="button" class="ghost">Clear</button>
        </div>

        <label>
          Refresh token
          <textarea id="refresh-token" rows="4" spellcheck="false"></textarea>
        </label>

        <pre id="session-result" class="result tall">Sessiya ma'lumoti shu yerda chiqadi.</pre>
      </section>
    </section>
  </main>
`

const session = {
  accessToken: null,
  refreshToken: null,
  email: null,
  profile: null
}

const elements = {
  registerForm: document.querySelector('#register-form'),
  loginForm: document.querySelector('#login-form'),
  registerResult: document.querySelector('#register-result'),
  loginResult: document.querySelector('#login-result'),
  sessionResult: document.querySelector('#session-result'),
  refreshToken: document.querySelector('#refresh-token'),
  profileButton: document.querySelector('#profile-button'),
  refreshButton: document.querySelector('#refresh-button'),
  clearButton: document.querySelector('#clear-session-button'),
  sessionDot: document.querySelector('#session-dot'),
  sessionTitle: document.querySelector('#session-title'),
  sessionSubtitle: document.querySelector('#session-subtitle')
}

function persistSession() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  renderSession()
}

function loadSession() {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    renderSession()
    return
  }

  try {
    const parsed = JSON.parse(raw)
    session.accessToken = parsed.accessToken || null
    session.refreshToken = parsed.refreshToken || null
    session.email = parsed.email || null
    session.profile = parsed.profile || null
    elements.refreshToken.value = session.refreshToken || ''
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  renderSession()
}

function clearSession() {
  session.accessToken = null
  session.refreshToken = null
  session.email = null
  session.profile = null
  elements.refreshToken.value = ''
  window.localStorage.removeItem(STORAGE_KEY)
  renderSession()
}

function renderSession() {
  const signedIn = Boolean(session.accessToken)
  elements.sessionDot.classList.toggle('active', signedIn)
  elements.sessionTitle.textContent = signedIn ? 'Sessiya aktiv' : 'Sessiya yo\'q'
  elements.sessionSubtitle.textContent = signedIn
    ? session.email || session.profile?.email || 'Token saqlangan'
    : 'Avval login qiling.'

  setResult(elements.sessionResult, {
    api: API_URL,
    email: session.email,
    profile: session.profile,
    accessToken: session.accessToken ? 'stored' : null,
    refreshToken: session.refreshToken ? 'stored' : null
  })
}

function setResult(element, value) {
  element.textContent = typeof value === 'string'
    ? value
    : JSON.stringify(value, null, 2)
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  const data = await response.json()
  return { ok: response.ok, status: response.status, data }
}

elements.registerForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  setResult(elements.registerResult, 'Register qilinyapti...')

  const body = {
    first_name: document.querySelector('#register-first-name').value.trim(),
    last_name: document.querySelector('#register-last-name').value.trim(),
    email: document.querySelector('#register-email').value.trim(),
    password: document.querySelector('#register-password').value,
    age: Number(document.querySelector('#register-age').value),
    gender: document.querySelector('#register-gender').value
  }

  const result = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body)
  })

  setResult(elements.registerResult, result.data)

  if (result.ok) {
    document.querySelector('#login-email').value = body.email
    document.querySelector('#login-password').value = body.password
  }
})

elements.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  setResult(elements.loginResult, 'Login qilinyapti...')

  const body = {
    email: document.querySelector('#login-email').value.trim(),
    password: document.querySelector('#login-password').value
  }

  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body)
  })

  setResult(elements.loginResult, result.data)

  if (result.ok && result.data.data) {
    session.accessToken = result.data.data.accessToken
    session.refreshToken = result.data.data.refreshToken
    session.email = body.email.toLowerCase()
    session.profile = null
    elements.refreshToken.value = session.refreshToken
    persistSession()
    await loadProfile()
  }
})

async function loadProfile() {
  if (!session.accessToken) {
    setResult(elements.sessionResult, 'Access token yo\'q. Avval login qiling.')
    return
  }

  setResult(elements.sessionResult, 'Profil olinmoqda...')

  const result = await request('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.accessToken}`
    }
  })

  if (result.ok && result.data.data) {
    session.profile = result.data.data
    session.email = result.data.data.email
    persistSession()
  }

  setResult(elements.sessionResult, result.data)
}

async function refreshAccessToken() {
  const refreshToken = elements.refreshToken.value.trim() || session.refreshToken
  if (!refreshToken) {
    setResult(elements.sessionResult, 'Refresh token yo\'q. Avval login qiling.')
    return
  }

  setResult(elements.sessionResult, 'Access token yangilanyapti...')

  const result = await request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  })

  if (result.ok && result.data.data) {
    session.accessToken = result.data.data.accessToken
    session.refreshToken = refreshToken
    persistSession()
  }

  setResult(elements.sessionResult, result.data)
}

elements.profileButton.addEventListener('click', loadProfile)
elements.refreshButton.addEventListener('click', refreshAccessToken)
elements.clearButton.addEventListener('click', clearSession)

loadSession()
