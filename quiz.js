const data = [
  {country: "Japan", capital: "Tokyo", cities: ['Osaka', 'Kyoto', 'Nagoya', 'Sapporo']},
  {country: "Canada", capital: "Ottawa", cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary']},
  {country: "Australia", capital: "Canberra", cities: ['Sydney', 'Melbourne', 'Perth', 'Brisbane']},
  {country: "Brazil", capital: "Brasília", cities: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Fortaleza']},
  {country: "Egypt", capital: "Cairo", cities: ['Alexandria', 'Giza', 'Luxor', 'Aswan']},
  {country: "Germany", capital: "Berlin", cities: ['Munich', 'Hamburg', 'Frankfurt', 'Cologne']},
  {country: "Kenya", capital: "Nairobi", cities: ['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']},
  {country: "India", capital: "New Delhi", cities: ['Mumbai', 'Bengaluru', 'Kolkata', 'Chennai']},
  {country: "Mexico", capital: "Mexico City", cities: ['Guadalajara', 'Monterrey', 'Cancún', 'Puebla']},
  {country: "France", capital: "Paris", cities: ['Lyon', 'Marseille', 'Nice', 'Toulouse']},
  {country: "Argentina", capital: "Buenos Aires", cities: ['Córdoba', 'Rosario', 'Mendoza', 'La Plata']},
  {country: "United States", capital: "Washington, D.C.", cities: ['New York', 'Los Angeles', 'Chicago', 'Houston']},
  {country: "United Kingdom", capital: "London", cities: ['Manchester', 'Birmingham', 'Liverpool', 'Leeds']},
  {country: "Italy", capital: "Rome", cities: ['Milan', 'Naples', 'Turin', 'Palermo']},
  {country: "Russia", capital: "Moscow", cities: ['St. Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan']},
  {country: "China", capital: "Beijing", cities: ['Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu']},
  {country: "South Korea", capital: "Seoul", cities: ['Busan', 'Incheon', 'Daegu', 'Daejeon']},
  {country: "Spain", capital: "Madrid", cities: ['Barcelona', 'Valencia', 'Seville', 'Zaragoza']},
  {country: "Netherlands", capital: "Amsterdam", cities: ['Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven']},
  {country: "Nigeria", capital: "Abuja", cities: ['Lagos', 'Kano', 'Ibadan', 'Port Harcourt']},
  {country: "Thailand", capital: "Bangkok", cities: ['Chiang Mai', 'Phuket', 'Pattaya', 'Nakhon Ratchasima']},
  {country: "Vietnam", capital: "Hanoi", cities: ['Ho Chi Minh City', 'Da Nang', 'Hai Phong', 'Can Tho']},
  {country: "Philippines", capital: "Manila", cities: ['Cebu City', 'Davao City', 'Quezon City', 'Zamboanga']},
  {country: "Turkey", capital: "Ankara", cities: ['Istanbul', 'Izmir', 'Bursa', 'Antalya']},
  {country: "Iran", capital: "Tehran", cities: ['Mashhad', 'Isfahan', 'Tabriz', 'Shiraz']},
  {country: "Pakistan", capital: "Islamabad", cities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi']},
  {country: "Indonesia", capital: "Jakarta", cities: ['Surabaya', 'Bandung', 'Medan', 'Semarang']},
  {country: "Malaysia", capital: "Kuala Lumpur", cities: ['George Town', 'Johor Bahru', 'Ipoh', 'Shah Alam']},
  {country: "Greece", capital: "Athens", cities: ['Thessaloniki', 'Patras', 'Heraklion', 'Larissa']},
  {country: "Ukraine", capital: "Kyiv", cities: ['Kharkiv', 'Odesa', 'Dnipro', 'Lviv']},
];

document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const nameStatus = document.getElementById('name-status');
  const passwordStatus = document.getElementById('password-status');
  const passwordGroup = document.getElementById('password-group');
  const passwordLabel = document.getElementById('password-label');
  const startBtn = document.getElementById('start-btn');

  let isExistingUser = false;

  usernameInput.addEventListener('input', async () => {
    const username = usernameInput.value.trim();
    passwordInput.value = "";
    startBtn.disabled = true;
    passwordStatus.textContent = "";

    if (!username) {
      nameStatus.textContent = "";
      passwordGroup.style.display = "none";
      return;
    }

    const doc = await db.collection("users").doc(username).get();
    isExistingUser = doc.exists;

    if (isExistingUser) {
      nameStatus.textContent = "🔐 Username found, enter your password";
      nameStatus.style.color = "#facc15";
      passwordLabel.textContent = "Enter your password:";
    } else {
      nameStatus.textContent = "✅ Username available, create a password";
      nameStatus.style.color = "#4ade80";
      passwordLabel.textContent = "Create a password:";
    }

    passwordGroup.style.display = "block";
  });

  passwordInput.addEventListener('input', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username) return;

    if (isExistingUser) {
      const doc = await db.collection("users").doc(username).get();
      if (doc.exists && doc.data().password === password) {
        passwordStatus.textContent = "✅ Password correct";
        passwordStatus.style.color = "#4ade80";
        startBtn.disabled = false;
      } else {
        passwordStatus.textContent = "❌ Incorrect password";
        passwordStatus.style.color = "#f87171";
        startBtn.disabled = true;
      }
    } else {
      if (password.length >= 3) {
        passwordStatus.textContent = "✅ Password saved";
        passwordStatus.style.color = "#4ade80";
        startBtn.disabled = false;
      } else {
        passwordStatus.textContent = "❌ Too short (min 3 chars)";
        passwordStatus.style.color = "#f87171";
        startBtn.disabled = true;
      }
    }
  });

  startBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) return;

    if (!isExistingUser) {
      await db.collection("users").doc(username).set({
        password: password,
        highScore: 0
      });
    }

    localStorage.setItem('quiz_username', username);
    const sel = document.getElementById('quiz-length').value;
    const custom = document.getElementById('custom-amount').value;
    let total = (sel === 'infinite') ? Infinity : parseInt(sel);
    if (custom) total = parseInt(custom);

    questionOrder = [...Array(data.length).keys()];
    shuffle(questionOrder);
    totalQuestions = Math.min(total, data.length);

    document.getElementById('intro-card').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    loadQuestion();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !startBtn.disabled) {
      startBtn.click();
    }
  });
});
