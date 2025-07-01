

// ===== CONSTANTE =====
const CHEIE_COMPARARE = "produseComparare";
const CHEIE_TIMESTAMP = "comparareUltimClick";

// ===== FUNCtII LOCAL STORAGE PENTRU COMPARARE =====
function getProduseComparate() {
  const raw = localStorage.getItem(CHEIE_COMPARARE);
  return raw ? JSON.parse(raw) : [];
}

function salvareComparare(produse) {
  localStorage.setItem(CHEIE_COMPARARE, JSON.stringify(produse));
  localStorage.setItem(CHEIE_TIMESTAMP, Date.now().toString());
}

function stergeProdusComparat(id) {
  let produse = getProduseComparate().filter(p => p.id !== id);
  salvareComparare(produse);
  afiseazaContainerComparare();
}

// ===== AFIsARE CONTAINER COMPARARE =====
function afiseazaContainerComparare() {
  const produse = getProduseComparate();
  let container = document.getElementById("container-comparare");

  if (produse.length === 0) {
    if (container) container.remove();
    activeazaButonComparare();
    return;
  }

  if (!container) {
    container = document.createElement("div");
    container.id = "container-comparare";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      background: "#f8f9fa",
      border: "1px solid #333",
      padding: "10px",
      zIndex: "10000"
    });
    document.body.appendChild(container);
  }

  container.innerHTML = "";

  produse.forEach(p => {
    let div = document.createElement("div");
    div.style.marginBottom = "5px";
    div.textContent = p.nume + " ";
  
    let btnSterge = document.createElement("button");
    btnSterge.classList.add("btn", "btn-sm", "btn-danger"); // stil Bootstrap (opțional)
    btnSterge.innerHTML = '<i class="bi bi-trash3-fill"></i>';   // iconiță Bootstrap
  
    btnSterge.addEventListener("click", () => stergeProdusComparat(p.id));
  
    div.appendChild(btnSterge);
    container.appendChild(div);
  });
  

  if (produse.length === 2) {
    let btnAfiseaza = document.createElement("button");
    btnAfiseaza.textContent = "Afișează";
    btnAfiseaza.addEventListener("click", deschideComparare);
    container.appendChild(btnAfiseaza);
    dezactiveazaButonComparare();
  } else {
    activeazaButonComparare();
  }
}

// ===== BUTOANE COMPARARE =====
function dezactiveazaButonComparare() {
  document.querySelectorAll(".btn-compara").forEach(btn => {
    btn.disabled = true;
    btn.title = "";
    btn.classList.add("disabled-compara");

    if (!btn.parentElement.classList.contains("tooltip-compara")) {
      const wrapper = document.createElement("span");
      wrapper.classList.add("tooltip-compara");

      const tooltip = document.createElement("span");
      tooltip.classList.add("tooltiptext");
      tooltip.textContent = "Stergeti un produs din lista de comparare";

      btn.parentNode.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);
      wrapper.appendChild(tooltip);
    }
  });
}

function activeazaButonComparare() {
  document.querySelectorAll(".btn-compara").forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("disabled-compara");

    const wrapper = btn.closest(".tooltip-compara");
    if (wrapper) {
      wrapper.parentNode.insertBefore(btn, wrapper);
      wrapper.remove();
    }
  });
}

// ===== FUNCtII PENTRU ADaUGARE sI DESCHIDERE COMPARARE =====
function adaugaLaComparare(id, nume) {
  let produse = getProduseComparate();

  if (produse.find(p => p.id === id)) {
    afiseazaNotificare("Produsul este deja în lista de comparare.");
    return;
  }
  if (produse.length >= 2) {
    afiseazaNotificare("Poți compara doar 2 produse o data.");
    return;
  }

  produse.push({
    id,
    nume
  });
  salvareComparare(produse);
  afiseazaContainerComparare();
}

function deschideComparare() {
  window.open("/comparare", "_blank");
}

// ===== NOTIFICARI =====
function afiseazaNotificare(mesaj) {
  const notif = document.getElementById("notificare");
  if (!notif) return;

  notif.textContent = mesaj;
  notif.style.display = "block";
  setTimeout(() => {
    notif.style.display = "none";
  }, 3000);
}

// ===== VERIFICa TIMP EXPIRARE DATE COMPARARE =====
function verificaTimpExpirare() {
  const timestamp = parseInt(localStorage.getItem(CHEIE_TIMESTAMP));
  if (timestamp && (Date.now() - timestamp) > 86400000) { // 24h
    localStorage.removeItem(CHEIE_COMPARARE);
    localStorage.removeItem(CHEIE_TIMESTAMP);
    afiseazaContainerComparare();
    afiseazaNotificare("Lista de comparare a expirat dupa 24h.");
  }
}

// ===== INITIALIZARE DOMCONTENTLOADED =====
document.addEventListener("DOMContentLoaded", () => {
  verificaTimpExpirare();
  afiseazaContainerComparare();

  // Verifica periodic daca a expirat (la fiecare 60 secunde)
  setInterval(verificaTimpExpirare, 60 * 1000);
});

let listaproduse = [{
    nume: "Ibanez AZ2204NW-MGR",
    descriere: "Chitară electrică de înaltă calitate, cu o combinație perfectă între lemn de arțar prăjit și corp din arin, oferind un sunet echilibrat și sustain excelent.",
    pret: 9444,
    scala: 648,
    tip_produs: "clasica",
    categorie: "comuna",
    materiale: ["artar", "nichel", "otel", "plastic"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez AZ47P1QM-DEB",
    descriere: "Chitară electrică cu design sofisticat, construită din arțar și tei pentru un ton vibrant și clar, ideală pentru performanțe live.",
    pret: 6000,
    scala: 500,
    tip_produs: "clasica",
    categorie: "comuna",
    materiale: ["artar", "tei", "nichel", "plastic", "mahon"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez AZ2402-GRM",
    descriere: "Chitară electrică premium, cu top din frasin și corp din mahon, oferind tonuri calde și un sustain excelent, perfectă pentru solo-uri expresive.",
    pret: 3500,
    scala: 500,
    tip_produs: "clasica",
    categorie: "comanda speciala",
    materiale: ["frasin", "plastic", "artar", "nichel", "tei", "grafit"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez AZ2204NWL-MGR",
    descriere: "Chitară electrică versatilă, cu un corp din arin și gât din arțar prăjit, care produce un sunet clar și natural, ideală pentru orice stil de muzică.",
    pret: 3200,
    scala: 620,
    tip_produs: "clasica",
    categorie: "aniversara",
    materiale: ["otel", "plastic", "artar", "arin", "nichel", "fag", "aur"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez GRGM21M-BLT",
    descriere: "Chitară electrică mică, cu un sunet puternic, perfectă pentru chitariștii tineri care doresc să învețe și să se distreze cu fiecare acord.",
    pret: 6000,
    scala: 780,
    tip_produs: "clasica",
    categorie: "comuna",
    materiale: ["cupru", "artar", "aur", "nichel", "satin"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: true
  },
  {
    nume: "Nimic",
    descriere: "Nimic",
    pret: 700,
    scala: 0,
    tip_produs: "clasica",
    categorie: "acordata",
    materiale: [],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez RG652AHM-NGB",
    descriere: "Chitară electrică cu corp din mahon și top din arțar, oferind un ton agresiv și sustain excelent pentru muzica heavy metal.",
    pret: 2500,
    scala: 800,
    tip_produs: "electrica",
    categorie: "comuna",
    materiale: ["plastic", "mahon", "artar", "nichel", "fagure", "grafit", "aluminiu"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez PS60-SSL",
    descriere: "Chitară electrică elegantă, cu un design rafinat din tei și mahon, ideală pentru chitariștii care caută sunetul perfect în orice stil.",
    pret: 8000,
    scala: 720,
    tip_produs: "electrica",
    categorie: "comuna",
    materiale: ["tei", "nichel", "mahon", "alama", "artar", "plastic"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez TOD10 Tim Henson",
    descriere: "Chitară electrică unică, cu sunet distinctiv și design personalizat, creată pentru a oferi o experiență sonoră deosebită.",
    pret: 12000,
    scala: 550,
    tip_produs: "electrica",
    categorie: "aniversara",
    materiale: ["artar", "nichel", "ulm", "plastic", "mahon"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez GRGR221PA-AQB",
    descriere: "Chitară electrică accesibilă, cu sunet clar și dinamic, ideală pentru chitariștii care încep să exploreze lumea muzicii electrice.",
    pret: 3.2, // posibilă greșeală in SQL-ul original
    scala: 520,
    tip_produs: "electrica",
    categorie: "aniversara",
    materiale: ["artar", "nichel", "plasticina", "mahon", "ulm"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: true
  },
  {
    nume: "Ibanez RG550-PN",
    descriere: "Chitară electrică de înaltă performanță, cu sunet agresiv și sustain prelungit, ideală pentru solosuri rapide și riffuri puternice.",
    pret: 7000,
    scala: 700,
    tip_produs: "electrica",
    categorie: "aniversara",
    materiale: ["mahon", "ulm", "frasin", "artar", "nichel", "plastic"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez GRX70QA-TBB GIO",
    descriere: "Chitară electrică cu un sunet clar și bine echilibrat, ideală pentru chitariștii începători care doresc să învețe rapid.",
    pret: 5000,
    scala: 285,
    tip_produs: "electrica",
    categorie: "comuna",
    materiale: ["artar", "nichel", "plastic/pvc", "mahon", "tei", "alama"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez GRG121DX-BKF",
    descriere: "Chitară electrică puternică, ideală pentru muzică rock și metal, cu un sunet puternic și sustain excelent pentru solosuri intense.",
    pret: 15000,
    scala: 385,
    tip_produs: "clasica",
    categorie: "comanda speciala",
    materiale: ["artar", "nichel", "plastic", "aur", "mahon", "diamant"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez AZ2407F-BSR",
    descriere: "Chitară electrică cu un ton clar și echilibrat, ideală pentru chitariștii care doresc un sunet curat și durabil.",
    pret: 2000,
    scala: 700,
    tip_produs: "electrica",
    categorie: "comuna",
    materiale: ["alama", "artar", "nichel", "plastic", "mahon", "lemn de trandafir"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez JEMJR-WH",
    descriere: "Chitară electrică cu un sunet clar și rapid, perfectă pentru chitariștii începători care doresc să exploreze muzica rock.",
    pret: 6000,
    scala: 510,
    tip_produs: "clasica",
    categorie: "pentru incepatori",
    materiale: ["tei", "plastic", "nichel", "grafit", "artar"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez AZ47P1QM-BIB",
    descriere: "Chitară acustică cu un ton cald și echilibrat, perfectă pentru muzica folk și acustică.",
    pret: 1800,
    scala: 370,
    tip_produs: "acustica",
    categorie: "comuna",
    materiale: ["ceramica", "nichel", "alama", "lemn de trandafir", "plastic", "cupru", "tei", "otel"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez RG550-DY",
    descriere: "Chitară electrică ediție limitată, cu un sunet deosebit și design inovator, ideală pentru chitariștii care doresc ceva cu adevărat special.",
    pret: 12000,
    scala: 470,
    tip_produs: "acustica",
    categorie: "editie limitata",
    materiale: ["ceramica", "nichel", "alama", "lemn de trandafir", "plastic", "cupru", "tei", "otel"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez AZES40-BK",
    descriere: "Chitară acustică ideală pentru începători, ușor de manevrat și cu un sunet plăcut, perfectă pentru sesiuni de practică.",
    pret: 14000,
    scala: 440,
    tip_produs: "acustica",
    categorie: "pentru incepatori",
    materiale: ["otel", "ceramica", "nichel", "grafit", "artar", "plastic", "cupru"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez GRX70QA-TKS GIO",
    descriere: "Chitară acustică accesibilă și versatilă, cu sunet echilibrat și ideală pentru diverse genuri muzicale.",
    pret: 8000,
    scala: 530,
    tip_produs: "acustica",
    categorie: "comuna",
    materiale: ["otel", "ceramica", "nichel", "grafit", "artar", "plastic", "cupru"],
    dataIntroducerii: "2025-05-15",
    deja_acordata: false
  },
  {
    nume: "Ibanez RG550-RF",
    descriere: "Chitară electrică pentru chitariștii care doresc un ton agresiv și un sustain puternic, perfectă pentru rock și metal.",
    pret: 5000,
    scala: 530,
    tip_produs: "acustica",
    categorie: "comuna",
    materiale: ["ceramica", "otel"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  },
  {
    nume: "Ibanez GRG131DX-BKF",
    descriere: "Chitară electrică perfectă pentru începători, cu sunet puternic și clar, ușor de controlat pentru sesiuni de practică.",
    pret: 7000,
    scala: 640,
    tip_produs: "clasica",
    categorie: "pentru incepatori",
    materiale: ["plastic", "tei", "nichel"],
    dataIntroducerii: "2025-04-01",
    deja_acordata: false
  }
];

window.onload = function() {
  //  Functii utilitare 
  function actualizeazaNumarProduse() {
    let produse = document.getElementsByClassName("produs");
    let count = 0;
    for (let prod of produse) {
      if (prod.style.display !== "none") {
        count++;
      }
    }
    document.getElementById("numar-produse-afisate").textContent = count;
  }

  //  Initializare Range Pret 
  let preturi = listaproduse.map(p => p.pret);
  let inputPret = document.getElementById("inp-pret");
  inputPret.min = Math.min(...preturi);
  inputPret.max = Math.max(...preturi);
  inputPret.step = 1;
  inputPret.value = inputPret.min;
  document.getElementById("infoRange").textContent = `(${inputPret.min})`;

  //  Autocompletare nume 
  let datalist = document.getElementById("nume-sugestii");
  datalist.innerHTML = "";
  let numeUnice = [...new Set(listaproduse.map(p => p.nume))];
  for (let nume of numeUnice) {
    let opt = document.createElement("option");
    opt.value = nume;
    datalist.appendChild(opt);
  }

  //  Select unic categorii 
  let categorii = [...new Set(listaproduse.map(p => p.categorie))];
  let selCategorie = document.getElementById("inp-categorie");
  selCategorie.innerHTML = `<option value="toate" selected>toate</option>`;
  for (let cat of categorii) {
    selCategorie.innerHTML += `<option value="${cat}">${cat}</option>`;
  }

  //  Checkboxes categorii multiple 
  let categorii2 = [...new Set([...categorii])];
  if (!categorii2.includes("noutati")) categorii2.push("noutati");

  let fieldset = document.querySelector("fieldset");
  fieldset.innerHTML = '<legend class="form-label">Select multiplu categorii:</legend>';

  for (let cat of categorii2) {
    let id = `categorie_chitara-${cat.replace(/\s+/g, '-').toLowerCase()}`;

    let div = document.createElement("div");
    div.className = "form-check";

    let input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.name = "categorii";
    input.value = cat;
    input.id = id;

    let label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = id;
    label.textContent = cat;

    div.appendChild(input);
    div.appendChild(label);
    fieldset.appendChild(div);
  }

  //  Radio scala 
  let scalaSelect = document.getElementById("grup-scala");
  scalaSelect.innerHTML = "";

  let praguri = [0, 350, 700, Infinity];
  let etichete = [
    "Silentios (< 350)",
    "Sonor Mediu (350 ≤ scala < 700)",
    "Sonor Ridicat (≥ 700)"
  ];

  for (let i = 0; i < praguri.length - 1; i++) {
    let id = `scala-${i}`;
    let val = `${praguri[i]}:${praguri[i + 1] === Infinity ? 1000000000 : praguri[i + 1]}`;

    scalaSelect.innerHTML += `
      <input type="radio" class="btn-check" name="gr_rad_scala" id="${id}" value="${val}" autocomplete="off">
      <label class="btn btn-outline-primary" for="${id}">${etichete[i]}</label>
    `;
  }

  scalaSelect.innerHTML += `
    <input type="radio" class="btn-check" name="gr_rad_scala" id="scala-toate" value="toate" checked>
    <label class="btn btn-outline-primary" for="scala-toate">Toate</label>
  `;

  //  Select multiplu greutate 
  let dropdownGreutate = document.getElementById("inp-greutate");
  dropdownGreutate.innerHTML = "";

  let praguriGreutate = [0, 2, 5, 10, 1000000000];
  let descrieriGreutate = [
    "Foarte Ușoară (< 2kg)",
    "Ușoară (2 ≤ greutate < 5kg)",
    "Mediu (5 ≤ greutate < 10kg)",
    "Greu (≥ 10kg)"
  ];

  for (let i = 0; i < praguriGreutate.length - 1; i++) {
    let opt = document.createElement("option");
    opt.value = `${praguriGreutate[i]}:${praguriGreutate[i + 1]}`;
    opt.textContent = descrieriGreutate[i];
    dropdownGreutate.appendChild(opt);
  }

  let optToate = document.createElement("option");
  optToate.value = "toate";
  optToate.textContent = "Toate";
  dropdownGreutate.appendChild(optToate);

  //  Datalist materiale 
  let datalistMateriale = document.getElementById("materiale-sugestii");
  datalistMateriale.innerHTML = "";

  let materialeUnice = [...new Set(listaproduse.flatMap(p => p.materiale || []))];
  materialeUnice.forEach(mat => {
    let opt = document.createElement("option");
    opt.value = mat;
    datalistMateriale.appendChild(opt);
  });

  //  Validare materiale 
  const ta = document.getElementById("inp-materiale");
  ta.addEventListener("input", () => {
    ta.classList.toggle("is-invalid", ta.value.trim().length < 10);
  });

  let btn = document.getElementById("filtrare");

  btn.onclick = function() {
    function normalize(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
    let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
    let inpMateriale = document.getElementById("inp-materiale").value.trim().toLowerCase();
    let inpPret = document.getElementById("inp-pret").value;
    let materialeCautate = normalize(inpMateriale).split(/\s*,\s*/).filter(m => m.length > 0);
    let inpNume2 = document.getElementById("inp-nume-datalist").value.trim().toLowerCase();

    let vectRadio = document.getElementsByName("gr_rad_scala");

    let inpscala = null,
      minscala = null,
      maxscala = null;
    for (let rad of vectRadio) {
      if (rad.checked) {
        inpscala = rad.value;
        if (inpscala != "toate") {
          [minscala, maxscala] = inpscala.split(":").map(Number);
        }
        break;
      }
    }

    let checkedCategories = [];
    let checkboxuri = document.querySelectorAll('input[name="categorii"]:checked');
    for (let cb of checkboxuri) {
      checkedCategories.push(cb.value.trim().toLowerCase());
    }

    let selectGreutate = document.getElementById("inp-greutate");
    let optiuniSelectate = Array.from(selectGreutate.selectedOptions).map(opt => opt.value);
    let greutateToate = optiuniSelectate.includes("toate");

    let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase();

    let produse = document.getElementsByClassName("produs");
    let produseFiltrate = [];
    for (let prod of produse) {
      prod.style.display = "none";
      let condNoutati = true;
      let checkedCategoriesNormalized = checkedCategories.map(c => c.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      if (checkedCategoriesNormalized.includes("noutati")) {
        let dataProdus = prod.getAttribute("data-introducerii");
        let dataReferinta = new Date("2025-06-15");
        let dataIntrodus = new Date(dataProdus);
        condNoutati = dataIntrodus > dataReferinta;
      }

      let nume = normalize(prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase());
      let cond1 = nume.startsWith(inpNume);
      let nume2 = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
      let cond8 = nume2.includes(inpNume2);

      let materialeProd = prod.getElementsByClassName("val-materiale")[0].innerHTML.trim().toLowerCase().split(/\s*,\s*/);
      let cond2 = materialeCautate.every(m => materialeProd.includes(m));

      let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
      let cond3 = pret >= inpPret;

      let scala = parseFloat(prod.getElementsByClassName("val-scala")[0].innerHTML.trim());
      let cond4 = (inpscala === "toate") || (minscala <= scala && scala < maxscala);

      let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();

      let cond6 = (inpCategorie === "toate" || inpCategorie === "") || (categorie === inpCategorie);

      let cond7 = (checkedCategories.length === 0) || checkedCategories.includes(categorie);

      let greutate = parseFloat(prod.getElementsByClassName("val-greutate")[0].innerHTML.trim());
      let condGreutate = false;
      if (greutateToate || optiuniSelectate.length === 0) {
        condGreutate = true;
      } else {
        for (let val of optiuniSelectate) {
          if (val === "toate") {
            condGreutate = true;
            break;
          }
          let [min, max] = val.split(":").map(Number);
          if (min <= greutate && greutate < max) {
            condGreutate = true;
            break;
          }
        }
      }

      if (cond1 && cond2 && cond3 && cond4 && cond6 && cond7 && condGreutate && cond8 && condNoutati) {
        produseFiltrate.push(prod);
      }

    }
    afiseazaPaginaFiltrata(produseFiltrate, 1);

    actualizeazaNumarProduse();

    let vreunProdusAfisat = false;
    for (let prod of produse) {
      if (prod.style.display !== "none") {
        vreunProdusAfisat = true;
        break;
      }
    }

    let mesajFiltrare = document.getElementById("mesaj-filtrare");
    mesajFiltrare.style.display = vreunProdusAfisat ? "none" : "block";
  };

  document.getElementById("inp-pret").onchange = function() {
    document.getElementById("infoRange").innerHTML = `(${this.value})`;
  };

  document.getElementById("resetare").onclick = function() {
    if (confirm("Sigur vrei să resetezi filtrele?")) {
      document.getElementById("inp-nume").value = "";
      document.getElementById("inp-materiale").value = "";
      document.getElementById("inp-nume-datalist").value = "";
      document.getElementById("inp-categorie").value = "toate";

      let rangePret = document.getElementById("inp-pret");
      rangePret.value = rangePret.min;
      document.getElementById("infoRange").innerHTML = `(${rangePret.value})`;

      let allCheckboxes = document.querySelectorAll('input[name="categorii"]');
      for (let cb of allCheckboxes) cb.checked = false;

      let scalaRadioToate = document.getElementById("scala-toate");
      if (scalaRadioToate) scalaRadioToate.checked = true;

      let greutateSelect = document.getElementById("inp-greutate");
      for (let i = 0; i < greutateSelect.options.length; i++) {
        greutateSelect.options[i].selected = false;
      }
      let toateOptiuni = Array.from(greutateSelect.options).find(opt => opt.value === "toate");
      if (toateOptiuni) toateOptiuni.selected = true;

      let toateProdusele = Array.from(document.getElementsByClassName("produs"));
      afiseazaPaginaFiltrata(toateProdusele, 1);

      actualizeazaNumarProduse();
      document.getElementById("mesaj-filtrare").style.display = "none";
    }
  };


  window.onkeydown = function(e) {
    if (e.key == "c" && e.altKey) {
      let produse = document.getElementsByClassName("produs");
      let sumaPreturi = 0;

      for (let prod of produse) {
        if (prod.style.display != "none") {
          // verific daca checkbox-ul din produs este selectat
          let checkbox = prod.querySelector(".select-cos");
          if (checkbox && checkbox.checked) {
            let pretElem = prod.getElementsByClassName("val-pret")[0];
            if (pretElem) {
              let pret = parseFloat(pretElem.innerHTML.trim());
              if (!isNaN(pret)) {
                sumaPreturi += pret;
              }
            }
          }
        }
      }

      if (!document.getElementById("suma_preturi")) {
        let pRezultat = document.createElement("p");
        pRezultat.innerHTML = "Suma: " + sumaPreturi.toFixed(2);
        pRezultat.id = "suma_preturi";

        let p = document.getElementById("p-suma");
        p.parentNode.insertBefore(pRezultat, p.nextElementSibling);

        setTimeout(function() {
          let p1 = document.getElementById("suma_preturi");
          if (p1) {
            p1.remove();
          }
        }, 2000);
      }
    }
  };


  // Sortare
  document.getElementById("sortCrescNume").onclick = function() {
    sorteaza(1);
  };

  document.getElementById("sortDescrescNume").onclick = function() {
    sorteaza(-1);
  };

  function sorteaza(semn) {
    let produse = document.getElementsByClassName("produs");
    let vProduse = Array.from(produse);
    vProduse.sort(function(a, b) {
      let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim());
      let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim());
      if (pretA !== pretB) return semn * (pretA - pretB);
      let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
      let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
      return semn * numeA.localeCompare(numeB);
    });
    for (let prod of vProduse) {
      prod.parentNode.appendChild(prod);
    }
  }

  // Paginare

  let paginaCurenta = 1;
  const produse = Array.from(document.getElementsByClassName("produs"));
  const produsePerPagina = 6;

  function afiseazaPaginaFiltrata(listaProduse, pagina) {
    paginaCurenta = pagina;
    let start = (pagina - 1) * produsePerPagina;
    let end = pagina * produsePerPagina;

    // Ascunde toate produsele
    produse.forEach(p => (p.style.display = "none"));

    // Afiseaza doar produsele din pagina curenta
    listaProduse.slice(start, end).forEach(p => (p.style.display = "block"));

    actualizeazaNumarProduse();

    // Actualizeaza butoanele paginare
    let paginiMax = Math.ceil(listaProduse.length / produsePerPagina);

    let paginatie = document.getElementById("paginare");
    paginatie.innerHTML = "";

    // Buton Precedent
    let btnPrev = document.createElement("button");
    btnPrev.textContent = "Precedent";
    btnPrev.disabled = pagina === 1;
    btnPrev.onclick = () => {
      if (paginaCurenta > 1) afiseazaPaginaFiltrata(listaProduse, paginaCurenta - 1);
    };
    paginatie.appendChild(btnPrev);

    // Butoane numerotate
    for (let i = 1; i <= paginiMax; i++) {
      let btn = document.createElement("button");
      btn.textContent = i;
      btn.disabled = i === paginaCurenta;
      btn.onclick = () => afiseazaPaginaFiltrata(listaProduse, i);
      paginatie.appendChild(btn);
    }

    // Buton Urmator
    let btnNext = document.createElement("button");
    btnNext.textContent = "Urmator";
    btnNext.disabled = pagina === paginiMax;
    btnNext.onclick = () => {
      if (paginaCurenta < paginiMax) afiseazaPaginaFiltrata(listaProduse, paginaCurenta + 1);
    };
    paginatie.appendChild(btnNext);
  }

  // La incarcare, afisam pagina 1 cu toate produsele
  afiseazaPaginaFiltrata(produse, 1);

  verificaTimpExpirare();
  afiseazaContainerComparare();

  // Presupunem ca ai deja butoane cu .btn-compara si data-id, data-nume in pagina
  document.querySelectorAll(".btn-compara").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const nume = btn.getAttribute("data-nume");
      adaugaLaComparare(id, nume);
    });
  });


};