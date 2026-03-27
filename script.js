// ========== HAMBURGER MENU ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ========== COUNTDOWN TIMERS ==========
const nikahDate = new Date(2027, 4, 29, 16, 30, 0);
const valimaDate = new Date(2027, 4, 31, 21, 0, 0);

function updateCountdowns() {
    const now = new Date().getTime();
    
    const nikahDist = nikahDate - now;
    if (nikahDist < 0) {
        document.getElementById('nikahDays').innerHTML = '00';
        document.getElementById('nikahHours').innerHTML = '00';
        document.getElementById('nikahMinutes').innerHTML = '00';
        document.getElementById('nikahSeconds').innerHTML = '00';
    } else {
        document.getElementById('nikahDays').innerHTML = Math.floor(nikahDist / (1000*60*60*24));
        document.getElementById('nikahHours').innerHTML = Math.floor((nikahDist % (1000*60*60*24)) / (1000*60*60));
        document.getElementById('nikahMinutes').innerHTML = Math.floor((nikahDist % (1000*60*60)) / (1000*60));
        document.getElementById('nikahSeconds').innerHTML = Math.floor((nikahDist % (1000*60)) / 1000);
    }
    
    const valimaDist = valimaDate - now;
    if (valimaDist < 0) {
        document.getElementById('valimaDays').innerHTML = '00';
        document.getElementById('valimaHours').innerHTML = '00';
        document.getElementById('valimaMinutes').innerHTML = '00';
        document.getElementById('valimaSeconds').innerHTML = '00';
    } else {
        document.getElementById('valimaDays').innerHTML = Math.floor(valimaDist / (1000*60*60*24));
        document.getElementById('valimaHours').innerHTML = Math.floor((valimaDist % (1000*60*60*24)) / (1000*60*60));
        document.getElementById('valimaMinutes').innerHTML = Math.floor((valimaDist % (1000*60*60)) / (1000*60));
        document.getElementById('valimaSeconds').innerHTML = Math.floor((valimaDist % (1000*60)) / 1000);
    }
}

setInterval(updateCountdowns, 1000);
updateCountdowns();

// ========== SWIPER SLIDER ==========
const swiper = new Swiper('.wishesSwiper', {
    loop: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 25 },
        1024: { slidesPerView: 3, spaceBetween: 30 }
    }
});

// ========== RSVP FORM ==========
let rsvpResponses = JSON.parse(localStorage.getItem('rsvpResponses')) || [];

function saveRSVP(data) {
    rsvpResponses.push({ ...data, date: new Date().toLocaleString() });
    localStorage.setItem('rsvpResponses', JSON.stringify(rsvpResponses));
}

const rsvpForm = document.getElementById('rsvpForm');
const rsvpConfirmation = document.getElementById('rsvpConfirmation');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvpName').value.trim();
        const phone = document.getElementById('rsvpPhone').value.trim();
        const adults = parseInt(document.getElementById('rsvpAdults').value) || 0;
        const children = parseInt(document.getElementById('rsvpChildren').value) || 0;
        const events = [];
        if (document.getElementById('attendNikah').checked) events.push('Nikah');
        if (document.getElementById('attendDinner').checked) events.push('Dinner');
        if (document.getElementById('attendWalima').checked) events.push('Walima');
        const message = document.getElementById('rsvpMessage').value.trim();
        
        if (!name || !phone) { alert('Please enter name and phone'); return; }
        if (events.length === 0) { alert('Select at least one event'); return; }
        
        saveRSVP({ name, phone, adults, children, events, message });
        rsvpForm.reset();
        document.getElementById('rsvpAdults').value = '1';
        rsvpConfirmation.style.display = 'block';
        setTimeout(() => { rsvpConfirmation.style.display = 'none'; }, 3000);
        if (isAdminLoggedIn) displayRSVPResponses();
    });
}

// ========== ADMIN PANEL ==========
let isAdminLoggedIn = false;
const ADMIN_PASSWORD = "meer123";

function displayRSVPResponses() {
    const tbody = document.getElementById('responsesList');
    const countDiv = document.getElementById('responsesCount');
    if (!tbody) return;
    if (rsvpResponses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No responses yet</td></tr>';
        if (countDiv) countDiv.innerHTML = 'Total: 0 responses';
        return;
    }
    tbody.innerHTML = rsvpResponses.map(r => `
        <tr><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.phone)}</td><td>${r.adults||0}</td><td>${r.children||0}</td><td>${(r.events||[]).join(', ')}</td><td>${escapeHTML(r.message||'-')}</td><td>${r.date||'-'}</td></tr>
    `).join('');
    if (countDiv) {
        let totalAdults = rsvpResponses.reduce((s,r) => s + (r.adults||0), 0);
        let totalChildren = rsvpResponses.reduce((s,r) => s + (r.children||0), 0);
        countDiv.innerHTML = `Total: ${rsvpResponses.length} guests | Adults: ${totalAdults} | Children: ${totalChildren} | Total People: ${totalAdults + totalChildren}`;
    }
}

function escapeHTML(str) { if(!str) return ''; return str.replace(/[&<>]/g, function(m) { if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m; }); }

const loginBtn = document.getElementById('adminLoginBtn');
const loginBox = document.getElementById('loginBox');
const responsesBox = document.getElementById('responsesBox');
const loginError = document.getElementById('loginError');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const pwd = document.getElementById('adminPassword').value;
        if (pwd === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            loginBox.style.display = 'none';
            responsesBox.style.display = 'block';
            displayRSVPResponses();
            loginError.innerHTML = '';
        } else {
            loginError.innerHTML = 'Incorrect password';
        }
    });
}

const exportBtn = document.getElementById('exportExcelBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        if (rsvpResponses.length === 0) { alert('No responses'); return; }
        const headers = ['Name','Phone','Adults','Children','Events','Message','Date'];
        const rows = rsvpResponses.map(r => [r.name, r.phone, r.adults||0, r.children||0, (r.events||[]).join(', '), r.message||'', r.date||'']);
        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csv], {type: 'text/csv;charset=utf-8;'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'rsvp_responses.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    });
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

// ========== DYNAMIC YEAR ==========
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Meer's Family. All Rights Reserved.`;
