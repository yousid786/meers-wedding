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

// ========== COUNTDOWN TIMERS (ENGLISH DATE) ==========
// Nikah: 29th May 2027, After Asar (4:30 PM)
const nikahDate = new Date(2027, 4, 29, 16, 30, 0);

// Valima: 31st May 2027, 9:00 PM
const valimaDate = new Date(2027, 4, 31, 21, 0, 0);

function updateCountdowns() {
    const now = new Date().getTime();
    
    // Nikah Countdown
    const nikahDistance = nikahDate - now;
    if (nikahDistance < 0) {
        document.getElementById('nikahDays').innerHTML = '00';
        document.getElementById('nikahHours').innerHTML = '00';
        document.getElementById('nikahMinutes').innerHTML = '00';
        document.getElementById('nikahSeconds').innerHTML = '00';
    } else {
        const nikahDays = Math.floor(nikahDistance / (1000 * 60 * 60 * 24));
        const nikahHours = Math.floor((nikahDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const nikahMinutes = Math.floor((nikahDistance % (1000 * 60 * 60)) / (1000 * 60));
        const nikahSeconds = Math.floor((nikahDistance % (1000 * 60)) / 1000);
        
        document.getElementById('nikahDays').innerHTML = nikahDays < 10 ? '0' + nikahDays : nikahDays;
        document.getElementById('nikahHours').innerHTML = nikahHours < 10 ? '0' + nikahHours : nikahHours;
        document.getElementById('nikahMinutes').innerHTML = nikahMinutes < 10 ? '0' + nikahMinutes : nikahMinutes;
        document.getElementById('nikahSeconds').innerHTML = nikahSeconds < 10 ? '0' + nikahSeconds : nikahSeconds;
    }
    
    // Valima Countdown
    const valimaDistance = valimaDate - now;
    if (valimaDistance < 0) {
        document.getElementById('valimaDays').innerHTML = '00';
        document.getElementById('valimaHours').innerHTML = '00';
        document.getElementById('valimaMinutes').innerHTML = '00';
        document.getElementById('valimaSeconds').innerHTML = '00';
    } else {
        const valimaDays = Math.floor(valimaDistance / (1000 * 60 * 60 * 24));
        const valimaHours = Math.floor((valimaDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const valimaMinutes = Math.floor((valimaDistance % (1000 * 60 * 60)) / (1000 * 60));
        const valimaSeconds = Math.floor((valimaDistance % (1000 * 60)) / 1000);
        
        document.getElementById('valimaDays').innerHTML = valimaDays < 10 ? '0' + valimaDays : valimaDays;
        document.getElementById('valimaHours').innerHTML = valimaHours < 10 ? '0' + valimaHours : valimaHours;
        document.getElementById('valimaMinutes').innerHTML = valimaMinutes < 10 ? '0' + valimaMinutes : valimaMinutes;
        document.getElementById('valimaSeconds').innerHTML = valimaSeconds < 10 ? '0' + valimaSeconds : valimaSeconds;
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

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ========== DYNAMIC YEAR ==========
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Meer's Family. All Rights Reserved.`;
}

// ========== RSVP FORM HANDLER ==========
const rsvpForm = document.getElementById('rsvpForm');
const rsvpConfirmation = document.getElementById('rsvpConfirmation');

// Load existing RSVPs from localStorage
let rsvpResponses = JSON.parse(localStorage.getItem('rsvpResponses')) || [];

function saveRSVPToLocalStorage(data) {
    rsvpResponses.push({
        ...data,
        date: new Date().toLocaleString()
    });
    localStorage.setItem('rsvpResponses', JSON.stringify(rsvpResponses));
}

if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
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
        
        if (!name || !phone) {
            alert('Please enter your name and phone number');
            return;
        }
        
        if (events.length === 0) {
            alert('Please select at least one event you will attend');
            return;
        }
        
        saveRSVPToLocalStorage({
            name, phone, adults, children, events, message
        });
        
        rsvpForm.reset();
        document.getElementById('rsvpAdults').value = '1';
        rsvpConfirmation.style.display = 'block';
        
        setTimeout(() => {
            rsvpConfirmation.style.display = 'none';
        }, 3000);
        
        // If admin is logged in, refresh the responses table
        if (isAdminLoggedIn) {
            displayRSVPResponses();
        }
    });
}

// ========== ADMIN PANEL FUNCTIONS ==========
let isAdminLoggedIn = false;
const ADMIN_PASSWORD = "meer123"; // 🔐 Change this to your desired password

function displayRSVPResponses() {
    const tbody = document.getElementById('responsesList');
    const countDiv = document.getElementById('responsesCount');
    
    if (!tbody) return;
    
    if (rsvpResponses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No responses yet</td></tr>';
        if (countDiv) countDiv.innerHTML = 'Total: 0 responses';
        return;
    }
    
    tbody.innerHTML = rsvpResponses.map((r, index) => `
        <tr>
            <td>${escapeHTML(r.name)}</td>
            <td>${escapeHTML(r.phone)}</td>
            <td>${r.adults || 0}</td>
            <td>${r.children || 0}</td>
            <td>${(r.events || []).join(', ')}</td>
            <td>${escapeHTML(r.message || '-')}</td>
            <td>${r.date || '-'}</td>
        </tr>
    `).join('');
    
    if (countDiv) {
        let totalAdults = rsvpResponses.reduce((sum, r) => sum + (r.adults || 0), 0);
        let totalChildren = rsvpResponses.reduce((sum, r) => sum + (r.children || 0), 0);
        countDiv.innerHTML = `Total: ${rsvpResponses.length} guests | Adults: ${totalAdults} | Children: ${totalChildren} | Total People: ${totalAdults + totalChildren}`;
    }
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Admin Login
const loginBtn = document.getElementById('adminLoginBtn');
const loginBox = document.getElementById('loginBox');
const responsesBox = document.getElementById('responsesBox');
const loginError = document.getElementById('loginError');

if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        const password = document.getElementById('adminPassword').value;
        if (password === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            loginBox.style.display = 'none';
            responsesBox.style.display = 'block';
            displayRSVPResponses();
            loginError.innerHTML = '';
        } else {
            loginError.innerHTML = 'Incorrect password. Please try again.';
        }
    });
}

// Export to Excel
const exportBtn = document.getElementById('exportExcelBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        if (rsvpResponses.length === 0) {
            alert('No responses to export');
            return;
        }
        
        const headers = ['Name', 'Phone', 'Adults', 'Children', 'Events', 'Message', 'Date'];
        const rows = rsvpResponses.map(r => [
            r.name,
            r.phone,
            r.adults || 0,
            r.children || 0,
            (r.events || []).join(', '),
            r.message || '',
            r.date || ''
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'rsvp_responses.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}