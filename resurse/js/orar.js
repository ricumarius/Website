// Orarul firmei (ziua, orele de deschidere - închidere)
// Format 24h, ore minute în format "HH:MM"
const orar = {
  "Luni": [{ deschide: "08:00", inchide: "16:00" }],
  "Marți": [{ deschide: "08:00", inchide: "16:00" }],
  "Miercuri": [{ deschide: "08:00", inchide: "16:00" }],
  "Joi": [{ deschide: "10:00", inchide: "18:00" }],
  "Vineri": [{ deschide: "10:00", inchide: "18:00" }],
  "Sâmbătă": [{ deschide: "12:00", inchide: "16:00" }],
  "Duminică": [] // Închis
};

const zileSaptamana = [, "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

const containerOrar = document.getElementById('schedule-container');
const corpOrar = document.getElementById('schedule-body');
const divStatus = document.getElementById('status');
const btnDeschideOrar = document.getElementById('open-schedule');
const btnInchideOrar = document.getElementById('close-schedule');

function parseazaTimp(timpStr) {
  const [h, m] = timpStr.split(':').map(Number);
  return { h, m };
}

function esteDeschisAcum() {
  const acum = new Date();
  const ziAzi = zileSaptamana[acum.getDay()];
  const intervale = orar[ziAzi];

  if (!intervale || intervale.length === 0) return false;

  for (const interval of intervale) {
    const deschide = parseazaTimp(interval.deschide);
    const inchide = parseazaTimp(interval.inchide);

    const oraDeschidere = new Date(acum);
    oraDeschidere.setHours(deschide.h, deschide.m, 0, 0);
    const oraInchidere = new Date(acum);
    oraInchidere.setHours(inchide.h, inchide.m, 0, 0);

    if (acum >= oraDeschidere && acum <= oraInchidere) {
      return true;
    }
  }
  return false;
}

function genereazaTabelOrar() {
  corpOrar.innerHTML = "";

  const indexAzi = new Date().getDay();

  zileSaptamana.forEach((zi, index) => {
    const tr = document.createElement('tr');
    if (index === indexAzi) {
      tr.classList.add('today');
    }

    const tdZi = document.createElement('td');
    tdZi.textContent = zi;
    tr.appendChild(tdZi);

    const intervale = orar[zi];
    const tdIntervale = document.createElement('td');

    if (!intervale || intervale.length === 0) {
      tdIntervale.textContent = "Închis";
    } else {
      tdIntervale.textContent = intervale.map(i => `${i.deschide} - ${i.inchide}`).join(", ");
    }

    tr.appendChild(tdIntervale);
    corpOrar.appendChild(tr);
  });
}

function actualizeazaStatus() {
  if (esteDeschisAcum()) {
    divStatus.textContent = "Firma este DESCHISĂ acum.";
    divStatus.style.color = "green";
  } else {
    divStatus.textContent = "Firma este ÎNCHISĂ acum.";
    divStatus.style.color = "red";
  }
}

function afiseazaOrar() {
  genereazaTabelOrar();
  actualizeazaStatus();
  containerOrar.style.display = "block";

  setTimeout(() => {
    containerOrar.style.display = "none";
  }, 10000);
}

btnDeschideOrar.addEventListener('click', afiseazaOrar);
btnInchideOrar.addEventListener('click', () => {
  containerOrar.style.display = 'none';
});
