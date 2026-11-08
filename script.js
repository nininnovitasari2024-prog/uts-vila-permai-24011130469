const dataVila = [
    {
        id: 1,
        nama: "Vila Permai Klub Bunga",
        tipe: "3 Kamar Tidur",
        lokasi: "Jalan Kartika 1 Sisir, Villa No 8, Batu",
        harga: 3500000,
        fasilitas: "WiFi gratis, Kolam renang outdoor, Taman, serta Teras.",
        status: "Tersedia"
    },
    {
        id: 2,
        nama: "Emerald Vilas Permai",
        tipe: "2 Kamar Tidur",
        lokasi: "Jalan Mojoagung Emerald Villas A7, Batu",
        harga: 1000000,
        fasilitas: "Taman dan parkir pribadi gratis.",
        status: "Tersedia"
    },
    {
        id: 3,
        nama: "Dream Hills Vila Permai",
        tipe: "4 Kamar Tidur",
        lokasi: "Jl. Abdul Gani Atas IV, Batu",
        harga: 2300000,
        fasilitas: "Kolam renang outdoor dan pemandangan gunung",
        status: "Tersedia"
    }
];

const vilaContainer = document.getElementById('vilaContainer');
const selectVila = document.getElementById('selectVila');
const searchInput = document.getElementById('searchInput');
const bookingForm = document.getElementById('bookingForm');
const resultArea = document.getElementById('resultArea');
const resultContent = document.getElementById('resultContent');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const welcomeBackMessage = document.getElementById('welcomeBackMessage');

// Navigasi
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        sections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
    });
});

// Daftar Vila
function renderVila(listVila) {
    vilaContainer.innerHTML = '';
    
    try {
        if (listVila.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = "Vila tidak ditemukan.";
            vilaContainer.appendChild(emptyMsg);
            return;
        }

        listVila.forEach(vila => {
            const card = document.createElement('div');
            card.className = 'vila-card';

            const title = document.createElement('h3');
            title.className = 'vila-card__title';
            title.textContent = vila.nama;

            const typeLoc = document.createElement('p');
            typeLoc.textContent = `${vila.tipe} • ${vila.lokasi}`;

            const price = document.createElement('p');
            price.className = 'vila-card__price';
            price.textContent = `Rp ${vila.harga.toLocaleString('id-ID')} / malam`;

            const facilities = document.createElement('p');
            facilities.style.fontSize = '0.9rem';
            facilities.style.color = '#666';
            facilities.textContent = `Fasilitas: ${vila.fasilitas}`;

            const badge = document.createElement('span');
            badge.className = 'status-badge';
            badge.style.marginTop = '1rem';
            badge.textContent = vila.status;

            card.appendChild(title);
            card.appendChild(typeLoc);
            card.appendChild(price);
            card.appendChild(facilities);
            card.appendChild(badge);

            vilaContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Terjadi kesalahan saat merender vila:", error);
    }
}

// Pilihan Vila
function renderDropdown() {
    selectVila.innerHTML = '<option value="">-- Pilih Vila --</option>';
    dataVila.forEach(vila => {
        const option = document.createElement('option');
        option.value = vila.id;
        option.textContent = `${vila.nama} - Rp ${vila.harga.toLocaleString('id-ID')}/malam`;
        selectVila.appendChild(option);
    });
}

// Pencarian
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = dataVila.filter(v => 
        v.nama.toLowerCase().includes(keyword) || 
        v.lokasi.toLowerCase().includes(keyword) ||
        v.fasilitas.toLowerCase().includes(keyword)
    );
    renderVila(filtered);
});

// Input
function validasiForm(nama, checkIn, checkOut, jumlahTamu) {
    let isValid = true;
    
    document.getElementById('namaError').textContent = '';
    document.getElementById('checkInError').textContent = '';
    document.getElementById('checkOutError').textContent = '';
    document.getElementById('tamuError').textContent = '';

    if (!nama.trim()) {
        document.getElementById('namaError').textContent = 'Nama tamu wajib diisi.';
        isValid = false;
    }

    const today = new Date().toISOString().split('T')[0];
    if (!checkIn) {
        document.getElementById('checkInError').textContent = 'Tanggal check-in wajib diisi.';
        isValid = false;
    } else if (checkIn < today) {
        document.getElementById('checkInError').textContent = 'Tanggal check-in wajib diisi.';
        isValid = false;
    }

    if (!checkOut) {
        document.getElementById('checkOutError').textContent = 'Tanggal check-out wajib diisi.';
        isValid = false;
    } else if (checkIn && checkOut <= checkIn) {
        document.getElementById('checkOutError').textContent = 'Tanggal check-out harus setelah tanggal check-in.';
        isValid = false;
    }

    if (jumlahTamu < 1 || jumlahTamu > 10) {
        document.getElementById('tamuError').textContent = 'Jumlah tamu harus di antara 1 sampai 10 orang.';
        isValid = false;
    }

    return isValid;
}

// Total Harga
function hitungTotalHarga(vilaId, checkIn, checkOut, jumlahTamu) {
    const vila = dataVila.find(v => v.id == vilaId);
    if (!vila) return 0;

    const dateIn = new Date(checkIn);
    const dateOut = new Date(checkOut);
    const diffTime = Math.abs(dateOut - dateIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const total = vila.harga * diffDays * (jumlahTamu > 5 ? 1.2 : 1.0); 
    return { vila, diffDays, total };
}

// Cek Ketersediaan
document.getElementById('btnCek').addEventListener('click', () => {
    const vilaId = selectVila.value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const jumlahTamu = document.getElementById('jumlahTamu').value;

    if (!vilaId || !checkIn || !checkOut) {
        alert("Mohon pilih vila dan tentukan tanggal check-in serta check-out terlebih dahulu.");
        return;
    }

    const calculation = hitungTotalHarga(vilaId, checkIn, checkOut, jumlahTamu);
    alert(`Status: ${calculation.vila.nama} tersedia untuk ${calculation.diffDays} malam! Estimasi Biaya: Rp ${calculation.total.toLocaleString('id-ID')}`);
});

// Submit
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        const namaTamu = document.getElementById('namaTamu').value;
        const vilaId = selectVila.value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const jumlahTamu = parseInt(document.getElementById('jumlahTamu').value);

        if (!validasiForm(namaTamu, checkIn, checkOut, jumlahTamu)) {
            return;
        }

        if (!vilaId) {
            alert("Silakan pilih unit vila terlebih dahulu.");
            return;
        }

        const calc = hitungTotalHarga(vilaId, checkIn, checkOut, jumlahTamu);

        localStorage.setItem('lastGuestName', namaTamu);
        loadLocalStorage();

        resultContent.innerHTML = `
            <p><strong>Nama Pemesan:</strong> ${namaTamu}</p>
            <p><strong>Vila Dipilih:</strong> ${calc.vila.nama} (${calc.vila.lokasi})</p>
            <p><strong>Durasi Menginap:</strong> ${calc.diffDays} Malam (${checkIn} s.d ${checkOut})</p>
            <p><strong>Jumlah Tamu:</strong> ${jumlahTamu} orang</p>
            <p><strong>Total Biaya:</strong> Rp ${calc.total.toLocaleString('id-ID')}</p>
            <p style="color: green; margin-top: 0.5rem; font-weight: bold;">Pesanan berhasil dikonfirmasi!</p>
        `;
        resultArea.classList.remove('hidden');

    } catch (error) {
        console.error("Terjadi kesalahan saat memproses pesanan:", error);
        alert("Maaf, terjadi kendala sistem saat memproses pemesanan Anda.");
    }
});

function loadLocalStorage() {
    const savedName = localStorage.getItem('lastGuestName');
    if (savedName) {
        welcomeBackMessage.textContent = `Selamat datang di Vila Permai, ${savedName}! Semoga suka & Senang.`;
    }
}

renderVila(dataVila);
renderDropdown();
loadLocalStorage();