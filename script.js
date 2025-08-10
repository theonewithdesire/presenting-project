// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const heroCode = document.getElementById('hero-code');
const fileTreeContent = document.getElementById('file-tree-content');

// Code samples for hero section
const codeSamples = {
    'App.jsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from './hooks/useAuth';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageRouter from './components/LanguageRouter';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <LanguageRouter
                EnglishComponent={MainPage}
                PersianComponent={MainPageFa}
              />
            } />
            <Route path="/signin" element={
              <LanguageRouter
                EnglishComponent={SignIn}
                PersianComponent={SignInFa}
              />
            } />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}`,
    'server.js': `const express = require('express');
const cors = require('cors');
const { pool } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const cookieRoutes = require('./routes/cookieRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cookies', cookieRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    'database.js': `const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cookie_delivery',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const initializeDatabase = async () => {
  try {
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(15) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

module.exports = { pool, initializeDatabase };`
};

// Removed file tree structure - not needed in new clean design

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    startTypingAnimation();

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        initializeApp();
    }, 3000);
});

function initializeApp() {
    displayHeroCode();
    initializeNavigation();
    initializeAnimations();
    initializeRevealAnimations();
}

// Typing Animation Function
function startTypingAnimation() {
    const commands = [
        'npm run analyze',
        'Scanning project structure...',
        'Analyzing frontend architecture...',
        'Processing backend components...',
        'Calculating metrics...',
        'Analysis complete!'
    ];

    const typingCommand = document.getElementById('typing-command');
    const terminalOutput = document.getElementById('terminal-output');

    if (!typingCommand || !terminalOutput) return;

    let commandIndex = 0;

    function typeCommand(text, callback) {
        let charIndex = 0;
        typingCommand.textContent = '';

        const typeChar = () => {
            if (charIndex < text.length) {
                typingCommand.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 50);
            } else {
                setTimeout(callback, 300);
            }
        };

        typeChar();
    }

    function addOutputLine(text, delay = 0) {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = text;
            terminalOutput.appendChild(line);
        }, delay);
    }

    function processCommands() {
        if (commandIndex < commands.length) {
            const currentCommand = commands[commandIndex];

            if (commandIndex === 0) {
                typeCommand(currentCommand, () => {
                    commandIndex++;
                    setTimeout(processCommands, 200);
                });
            } else {
                addOutputLine(currentCommand);
                commandIndex++;
                setTimeout(processCommands, 300);
            }
        }
    }

    processCommands();
}

function displayHeroCode() {
    let currentSample = 'App.jsx';

    if (heroCode) {
        heroCode.textContent = codeSamples[currentSample];
    }

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.textContent;
            if (codeSamples[tabName] && heroCode) {
                heroCode.textContent = codeSamples[tabName];
            }
        });
    });
}

function initializeRevealAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = document.querySelectorAll(`
        .stat-card,
        .tech-item,
        .feature-item,
        .arch-layer,
        .metric-card
    `);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

function initializeNavigation() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Simple navbar background change
        if (scrollPos > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
}

function initializeAnimations() {
    // Only animate hero stats that have data-target attributes
    const heroStatNumbers = document.querySelectorAll('#hero .stat-number[data-target]');

    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            }
        });
    });

    // Only observe hero stats with data-target attributes
    heroStatNumbers.forEach(stat => {
        observer.observe(stat);
    });

    // Format static numbers in stat cards (no animation)
    const staticStatNumbers = document.querySelectorAll('.stat-card .stat-number');
    staticStatNumbers.forEach(stat => {
        const value = stat.textContent.trim();
        // Only format if it's a number
        if (!isNaN(value) && value !== '') {
            const numValue = parseInt(value.replace(/,/g, ''));
            if (!isNaN(numValue)) {
                stat.textContent = numValue.toLocaleString();
            }
        }
    });
}

function initializeRevealAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = document.querySelectorAll(`
        .overview-card,
        .arch-layer,
        .backend-stat,
        .backend-feature,
        .endpoint-group,
        .feature-card,
        .tech-stack-section,
        .metric-card,
        .detail-card
    `);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

// Enhanced smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Console branding
console.log('Cookie Store Full-Stack Analysis');
console.log('Frontend: React 19 + Vite + Tailwind CSS');
console.log('Backend: Node.js + Express + PostgreSQL');
console.log('Total Files: 181');
console.log('Lines of Code: 32,937');