/* ============================================================
   LOADER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 650);
});

/* ============================================================
   NAV
   ============================================================ */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
const burgerIcon = burger.querySelector('i');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    document.getElementById('toTop').classList.toggle('show', window.scrollY > 500);
    updateActiveLink();

    const sb = document.getElementById('scrollBubble');
    if (sb) sb.classList.toggle('hide', window.scrollY > 200);
    scrollTicking = false;
  });
});

burger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const open = navMenu.classList.contains('open');
  burgerIcon.className = open ? 'fas fa-times' : 'fas fa-bars';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burgerIcon.className = 'fas fa-bars';
  });
});

function updateActiveLink() {
  const scrollPos = window.scrollY + 150;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = navLinks.find(item => item.getAttribute('href') === `#${id}`);
    if (link && scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* ============================================================
   SCROLL TOP
   ============================================================ */
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   REVEAL + COUNTERS
   ============================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');

      entry.target.querySelectorAll('.ring-fg').forEach(ring => {
        if (ring.dataset.done) return;
        const pct = parseFloat(ring.dataset.pct);
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (circumference * pct / 100);
        setTimeout(() => { ring.style.strokeDashoffset = offset; }, 200);
        ring.dataset.done = '1';
      });

      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        const w = bar.getAttribute('data-w');
        if (w && !bar.dataset.done) {
          setTimeout(() => { bar.style.width = w + '%'; }, 250);
          bar.dataset.done = '1';
        }
      });

      entry.target.querySelectorAll('[data-target], .pct[data-pct]').forEach(el => {
        if (el.dataset.counted) return;
        const target = parseInt(el.dataset.target || el.dataset.pct);
        let cur = 0;
        const step = target / 50;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = Math.floor(cur) + '%';
        }, 24);
        el.dataset.counted = '1';
      });

      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================================================
   COUNTERS (all data-count)
   ============================================================ */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = target / 45;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = Math.floor(cur) + '+';
      }, 28);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ============================================================
   PROJECT SPOTLIGHT
   ============================================================ */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* ============================================================
   FORM VALIDATION
   ============================================================ */
const form = document.getElementById('form');
const fName = document.getElementById('fName');
const fEmail = document.getElementById('fEmail');
const fMsg = document.getElementById('fMsg');
const success = document.getElementById('formSuccess');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  let ok = true;
  if (name.value.trim().length < 2) { fName.classList.add('error'); ok = false; } else fName.classList.remove('error');
  if (!emailRe.test(email.value.trim())) { fEmail.classList.add('error'); ok = false; } else fEmail.classList.remove('error');
  if (message.value.trim().length < 10) { fMsg.classList.add('error'); ok = false; } else fMsg.classList.remove('error');

  if (ok) {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name.value.trim()}`);
    const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`);
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=amnapervez8910@gmail.com&su=' + subject + '&body=' + body;
    success.classList.add('show');
    window.open(gmailUrl, '_blank', 'noopener');
    setTimeout(() => success.classList.remove('show'), 5000);
  }
});

document.getElementById('name').addEventListener('input', function() {
  if (this.value.trim().length >= 2) fName.classList.remove('error');
});
document.getElementById('email').addEventListener('input', function() {
  if (emailRe.test(this.value.trim())) fEmail.classList.remove('error');
});
document.getElementById('message').addEventListener('input', function() {
  if (this.value.trim().length >= 10) fMsg.classList.remove('error');
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* PROJECT FULL REPORT MODAL WITH DIRECT REPOSITORY LINKS */
const reportModal = document.getElementById('reportModal');
const reportClose = document.getElementById('reportClose');
const reportDone = document.getElementById('reportDone');
const reportRepoLink = document.getElementById('reportRepoLink');
const reportTitle = document.getElementById('reportTitle');
const reportCategory = document.getElementById('reportCategory');
const reportSummary = document.getElementById('reportSummary');
const reportOverview = document.getElementById('reportOverview');
const reportTech = document.getElementById('reportTech');
const reportOutcome = document.getElementById('reportOutcome');
let reportTrigger = null;

const projectRepositories = {
  'SmartLIB — Library Management System': 'https://github.com/amnapervez8910/SMARTLIB-Library-Management-System',
  'AI University Navigation System': 'https://github.com/amnapervez8910/ai-based-university-navigation-system',
  'Traffic Light Controller': 'https://github.com/amnapervez8910/Traffic-Light-Controller-FSM',
  'Robot Navigation Puzzle': 'https://github.com/amnapervez8910/robot-navigation-puzzle-game',
  'RFID Solenoid Door Lock': 'https://github.com/amnapervez8910/rfid-solenoid-door-lock-system',
  'SmartLIB Mobile App': 'https://github.com/amnapervez8910/smartlib-mobile-app',
  'Weather Monitoring System': 'https://github.com/amnapervez8910/Weather-Monitor-Simulator',
  'Online Voting System': 'https://github.com/amnapervez8910/online-voting-system',
  'Ubuntu Server on Azure': 'https://github.com/amnapervez8910/azure-ubuntu-server-configuration'
};
const projectOutcomes = {
  'SmartLIB — Library Management System': 'Role-based architecture, relational database design, transaction workflows, priority handling, fine calculation, and analytics dashboards.',
  'AI University Navigation System': 'Speech processing, natural-language location extraction, graph modelling, and DFS-based route discovery.',
  'Traffic Light Controller': 'Finite State Machine design, deterministic timing, safe state transitions, and testbench verification.',
  'Robot Navigation Puzzle': 'BFS and DFS implementation, state visualisation, obstacle handling, and interactive desktop design.',
  'RFID Solenoid Door Lock': 'Contactless authentication, embedded control logic, relay-actuated locking, and system feedback.',
  'SmartLIB Mobile App': 'Cross-platform development, role-based experiences, and real-time cloud data synchronisation.',
  'Weather Monitoring System': 'Sensor acquisition, serial communication, low-level programming, and hardware/software integration.',
  'Online Voting System': 'Desktop interface design, voter authentication, database records, validation, and vote tallying.',
  'Ubuntu Server on Azure': 'Cloud VM deployment, Linux service configuration, networking, and systems administration.'
};

function openProjectReport(button) {
  const card = button.closest('.project');
  const title = card.querySelector('h3').textContent.trim();
  const summary = card.querySelector('.project-body > p').textContent.trim();
  const category = card.querySelector('.project-cat').textContent.trim();
  const technologies = [...card.querySelectorAll('.project-tech span')].map(item => item.textContent.trim());
  reportTrigger = button;
  reportTitle.textContent = title;
  reportCategory.textContent = `${category} · Full Project Report`;
  reportSummary.textContent = summary;
  reportOverview.textContent = `This project was developed to turn a practical ${category.toLowerCase()} challenge into a clear, usable solution. ${summary}`;
  reportOutcome.textContent = projectOutcomes[title];
  reportRepoLink.href = projectRepositories[title];
  reportRepoLink.setAttribute('aria-label', `Open ${title} repository on GitHub`);
  reportTech.replaceChildren(...technologies.map(tech => { const tag=document.createElement('span'); tag.textContent=tech; return tag; }));
  reportModal.classList.add('open');
  reportModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  reportClose.focus();
}
function closeProjectReport(){reportModal.classList.remove('open');reportModal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');if(reportTrigger)reportTrigger.focus()}
document.querySelectorAll('.project-report-btn').forEach(button=>button.addEventListener('click',()=>openProjectReport(button)));
reportClose.addEventListener('click',closeProjectReport);reportDone.addEventListener('click',closeProjectReport);
reportModal.addEventListener('click',event=>{if(event.target===reportModal)closeProjectReport()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&reportModal.classList.contains('open'))closeProjectReport()});
