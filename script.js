// ===== CONFIGURACIÓN CENTRAL DE ASESORES =====
const WA_MICHAEL = '50583341349';
const WA_OMAR = '50587886017';

// ===== INTERRUPTORES DE ESTADO (CONECTADOS / DESCONECTADOS) =====
// true = En línea  |  false = Desconectado (Cambia de color y muestra etiqueta)
const MICHAEL_ONLINE = true; 
const OMAR_ONLINE = false; // Lo puse en false para probar cómo se ve Omar desconectado


// ===== MOTOR DE PARTÍCULAS (DIAMANTES GIRATORIOS) =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getAccentColor() {
    const style = getComputedStyle(document.body);
    return style.getPropertyValue('--accent').trim();
}

function createParticle() {
    const accent = getAccentColor();
    const isGem = Math.random() > 0.80;
    
    const velocidadGiroBase = 0.4 + Math.random() * 1.0;
    
    return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        size: isGem ? 8 + Math.random() * 12 : 2 + Math.random() * 3,
        speedY: -0.3 - Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.2 + Math.random() * 0.5,
        rotate: Math.random() * 360,
        
        // 50% de probabilidad de girar de izquierda a derecha (+) o de derecha a izquierda (-)
        rotateSpeed: Math.random() > 0.5 ? velocidadGiroBase : -velocidadGiroBase, 
        
        isGem,
        color: isGem ? accent : `rgba(255,255,255,${0.1 + Math.random() * 0.2})`,
        life: 0,
        maxLife: 300 + Math.random() * 400
    };
}

for (let i = 0; i < 35; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
}

function drawGem(x, y, size, rotate, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate * Math.PI / 180);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.7, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(s * 0.35, 0);
    ctx.lineTo(0, s * 0.5);
    ctx.lineTo(-s * 0.35, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() > 0.6 && particles.length < 70) particles.push(createParticle());
    particles = particles.filter(p => p.life < p.maxLife);
    const accent = getAccentColor();
    particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotate += p.rotateSpeed;
        p.life++;
        const fade = p.life < 60 ? p.life / 60 : 1;
        const fadeOut = p.life > p.maxLife - 60 ? (p.maxLife - p.life) / 60 : 1;
        const op = p.opacity * fade * fadeOut;
   
        if (p.isGem) {
            p.color = accent;
            drawGem(p.x, p.y, p.size, p.rotate, accent, op);
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = op * 0.4;
            ctx.fill();
        }
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== INTERCAMBIADOR DE TEMAS =====
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.className = btn.dataset.theme;
    });
});

// ===== SISTEMA DE PESTAÑAS (TABS) =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById('section-' + btn.dataset.section).classList.add('active');
    });
});

// ===== CONTROLADORES DE RENDERIZADO DE TIENDA =====
function renderCards(containerId, items, icon, badgeLabel) {
    const container = document.getElementById(containerId);
    items.forEach((item, idx) => {
        const isBest = idx === 2 || idx === 3;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            ${isBest ? '<div class="card-badge best">⭐ Más Vendido</div>' : `<div class="card-badge">${badgeLabel}</div>`}
            <div>
                <span class="card-icon">${icon}</span>
                <div class="card-title">${item.titulo}</div>
                <div class="card-desc">${item.desc || ''}</div>
            </div>
            <div>
                <div class="price">$ ${item.precio} <small>USD</small></div>
                <button class="btn-buy" onclick="openCheckoutModal('${item.titulo}', '${item.precio}')">Comprar por WhatsApp</button>
            </div>
        `;
        container.appendChild(card);
    });
}

const diamantes = [
    { titulo: '100 + 10 Diamantes', desc: 'Bono Garena 10% incluido', precio: '1.14' },
    { titulo: '310 + 31 Diamantes', desc: 'Bono Garena 10% incluido', precio: '3.45' },
    { titulo: '520 + 52 Diamantes', desc: 'Bono Garena 10% incluido', precio: '5.38' },
    { titulo: '1,060 + 106 Diamantes', desc: 'Bono Garena 10% incluido', precio: '12' },
    { titulo: '2,180 + 218 Diamantes', desc: 'Bono Garena 10% incluido', precio: '22.32' },
    { titulo: '5,600 + 560 Diamantes', desc: 'Bono Garena 10% incluido', precio: '54' }
];
renderCards('tienda-diamantes', diamantes, '💎', 'Free Fire');

// ===== MANEJO DEL MODAL CON ETIQUETAS DE ESTADO VARIABLES =====
const modal = document.getElementById('checkout-modal');
const closeModalBtn = document.querySelector('.close-modal');

function openCheckoutModal(titulo, precio) {
    document.getElementById('modal-package-info').textContent = `${titulo} — $${precio} USD`;
    const msg = `Hola, quiero comprar el paquete oficial de ${titulo} por $${precio} USD para mi ID de Free Fire.`;
    const encodedMsg = encodeURIComponent(msg);
    
    const btnMichael = document.getElementById('btn-pay-michael');
    const btnOmar = document.getElementById('btn-pay-omar');
    const labelMichael = document.getElementById('status-michael');
    const labelOmar = document.getElementById('status-omar');

    btnMichael.href = `https://wa.me/${WA_MICHAEL}?text=${encodedMsg}`;
    btnOmar.href = `https://wa.me/${WA_OMAR}?text=${encodedMsg}`;
    
    // CONTROL DE ESTADO — MICHAEL
    if (MICHAEL_ONLINE) {
        btnMichael.classList.remove('operator-offline');
        labelMichael.textContent = 'En Línea';
        labelMichael.className = 'status-tag online';
    } else {
        btnMichael.classList.add('operator-offline');
        labelMichael.textContent = 'Desconectado';
        labelMichael.className = 'status-tag offline';
    }

    // CONTROL DE ESTADO — OMAR
    if (OMAR_ONLINE) {
        btnOmar.classList.remove('operator-offline');
        labelOmar.textContent = 'En Línea';
        labelOmar.className = 'status-tag online';
    } else {
        btnOmar.classList.add('operator-offline');
        labelOmar.textContent = 'Desconectado';
        labelOmar.className = 'status-tag offline';
    }
    
    modal.classList.add('active');
}

closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

// ===== CONTADORES ANIMADOS =====
function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 50);
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current.toLocaleString('es-NI') + '+';
    }, 25);
}

const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(document.getElementById('d-clientes'), 1547);
            animateCounter(document.getElementById('d-entregas'), 3200);
            animateCounter(document.getElementById('d-paquetes'), diamantes.length);
            obs.disconnect();
        }
    });
}, { threshold: 0.3 });
obs.observe(document.getElementById('stats-diamantes'));
