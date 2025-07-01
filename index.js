const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");
const pg = require("pg");

const Client = pg.Client;

client = new Client({
    database: "proiect_loudmusic",
    user: "loudmusic",
    password: "loudmusic",
    host: "localhost",
    port: 5432
})

client.connect()
client.query("select * from chitare", function (err, rezultat) {
    console.log(err)
    console.log(rezultat)
})
client.query("select * from unnest(enum_range(null::categ_chitara))", function (err, rezultat) {
    console.log(err)
    console.log(rezultat)
})

app = express();

v = [10, 27, 23, 44, 15]

nrImpar = v.find(function (elem) { return elem % 100 == 1 })
console.log(nrImpar)

console.log("Folderul proiectului: ", __dirname)
console.log("Calea fisierului index.js: ", __filename)
console.log("Folderul curent de lucru: ", process.cwd())

app.set("view engine", "ejs");

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
    optiuniMeniu:null
}

client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rezultat ){
    console.log(err)    
    console.log("Tipuri produse:", rezultat)
    obGlobal.optiuniMeniu=rezultat.rows
})

vect_foldere = ["temp", "backup", "temp1"]
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder)
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}


function compileazaScss(caleScss, caleCss) {
    console.log("cale:", caleCss);
    if (!caleCss) {
        let numeFisExt = path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0]
        caleCss = numeFis + ".css";
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss)

    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true });
    }

    let numeFisCss = path.basename(caleCss);

    // Salvare backup cu timestamp
    if (fs.existsSync(caleCss)) {
        let timestamp = Date.now(); // obține timpul în milisecunde
        let numeFis = path.parse(numeFisCss).name;
        let extFis = path.parse(numeFisCss).ext;
        let numeBackup = `${numeFis}_${timestamp}${extFis}`;

        fs.copyFileSync(
            caleCss,
            path.join(caleBackup, numeBackup)
        );
    }

    let rez = sass.compile(caleScss, { "sourceMap": true });
    fs.writeFileSync(caleCss, rez.css);
}

//compileazaScss("a.scss");

//la pornirea serverului
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    console.log(eveniment, numeFis);
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
})





function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    console.log(continut)
    obGlobal.obErori = JSON.parse(continut)
    console.log(obGlobal.obErori)

    obGlobal.obErori.eroare_default.imagine = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori)

}

initErori()


function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;

    let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu = path.join(__dirname, obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini) {
        [numeFis, ext] = imag.fisier.split(".");
        let caleFisAbs = path.join(caleAbs, imag.fisier);
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu = path.join("/", obGlobal.obImagini.cale_galerie, "mediu", numeFis + ".webp")
        imag.fisier = path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier)

    }
    console.log(obGlobal.obImagini)
}
initImagini();






function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find(function (elem) {
        return elem.identificator == identificator
    });
    if (eroare) {
        if (eroare.status)
            res.status(identificator)
        var titluCustom = titlu || eroare.titlu;
        var textCustom = text || eroare.text;
        var imagineCustom = imagine || eroare.imagine;


    }
    else {
        var err = obGlobal.obErori.eroare_default
        var titluCustom = titlu || err.titlu;
        var textCustom = text || err.text;
        var imagineCustom = imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
    })

}



app.use("/resurse", express.static(path.join(__dirname, "resurse")))
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")))


app.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"))
})

app.get(["/", "/index", "/home"], function (req, res) {
    let d = new Date();
    let sfert_ora = Math.floor(d.getMinutes() / 15) + 1;

    // Filtrare imagini după sfertul curent (pentru secțiunea principală)
    let imaginiFiltrate = obGlobal.obImagini.imagini.filter(imag => imag.sfert_ora == sfert_ora.toString());

    // Toate imaginile
    const toateImaginile = obGlobal.obImagini.imagini;

    // Selectăm doar cele cu indici impari
    const imaginiImpare = toateImaginile.filter((_, i) => i % 2 === 1);

    // Generează un număr par între 6 și 14 (inclusiv)
    const nrPoze = Math.floor(Math.random() * 5) * 2 + 6;

    // Selectează primele imagini distincte cu indici impari
    const imaginiGalerie = imaginiImpare.slice(0, nrPoze);

    res.render("pagini/index", {
        ip: req.ip,
        imagini: imaginiFiltrate,
        galerie: imaginiGalerie,
        nrPoze: nrPoze
    });
});


// app.get("/despre", function(req, res){
//     res.render("pagini/despre");
// })

app.get("/index/a", function (req, res) {
    res.render("pagini/index");
})


app.get("/cerere", function (req, res) {
    res.send("<p style='color:blue'>Buna ziua</p>")
})

app.get("/comparare", function(req, res){
    res.render("pagini/comparare");
});


app.get("/fisier", function (req, res, next) {
    res.sendfile(path.join(__dirname, "package.json"));
})


app.get("/abc", function (req, res, next) {
    res.write("Data curenta: ")
    next()
})

app.get("/abc", function (req, res, next) {
    res.write((new Date()) + "")
    res.end()
    next()
})


app.get("/abc", function (req, res, next) {
    console.log("------------")
})

app.get("/produse", function(req, res){
    console.log(req.query)
    var conditieQuery=""; // TO DO where din parametri
    if (req.query.tip){
        conditieQuery=` where tip_produs='${req.query.tip}'`

    }

    queryOptiuni="select * from unnest(enum_range(null::categ_chitara))"
    client.query(queryOptiuni, function(err, rezOptiuni){
        console.log(rezOptiuni)


        queryProduse="select * from chitare" +conditieQuery
        client.query(queryProduse, function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows})
            }
        })
    });
})

app.get("/produs/:id", function(req, res) {
    const idProdus = req.params.id;

    client.query(`SELECT * FROM chitare WHERE id = $1`, [idProdus], function(err, rez) {
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
        } else {
            if (rez.rowCount == 0) {
                afisareEroare(res, 404);
            } else {
                const produsCurent = rez.rows[0];

                // Caută produse similare din aceeași categorie, fără produsul curent
                client.query(
                    `SELECT * FROM chitare WHERE categorie = $1 AND id <> $2 LIMIT 4`, 
                    [produsCurent.categorie, idProdus], 
                    function(errSimilare, rezSimilare) {
                        if (errSimilare) {
                            console.log(errSimilare);
                            afisareEroare(res, 2);
                        } else {
                            res.render("pagini/produs", { 
                                prod: produsCurent,
                                produseSimilare: rezSimilare.rows 
                            });
                        }
                    }
                );
            }
        }
    });
});

app.get("/galerie", function (req, res) {
    const toateImaginile = obGlobal.obImagini.imagini;
    const imaginiImpare = toateImaginile.filter((_, i) => i % 2 === 1);

    // Generăm un număr aleator PAR între 6 și 14
    const nrPoze = Math.floor(Math.random() * 5) * 2 + 6;

    // Selectăm primele imagini distincte cu indici impari
    const imaginiSelectate = imaginiImpare.slice(0, nrPoze);

    res.render("pagini/galerie", {
        imagini: imaginiSelectate,
        nrPoze: nrPoze
    });
});


app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function (req, res, next) {
    afisareEroare(res, 403);
})


app.get("/*.ejs", function (req, res, next) {
    afisareEroare(res, 400);
})


app.get("/*", function (req, res, next) {
    try {
        res.render("pagini" + req.url, function (err, rezultatRandare) {
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404);
                }
                else {
                    afisareEroare(res);
                }
            }
            else {
                console.log(rezultatRandare);
                res.send(rezultatRandare)
            }
        });
    }
    catch (errRandare) {
        if (errRandare.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404);
        }
        else {
            afisareEroare(res);
        }
    }
})

const MINUTE_IN_MILLISECONDS = 60 * 1000;
const T = 60; // în minute — șterge fișierele mai vechi de 60 minute (1 oră)

function stergeFisiereVechiRecursiv(caleFolder) {
  fs.readdir(caleFolder, { withFileTypes: true }, (err, intrari) => {
    if (err) {
      console.error("Eroare la citirea folderului:", caleFolder, err);
      return;
    }

    const acum = Date.now();

    intrari.forEach((intrare) => {
      const caleCompleta = path.join(caleFolder, intrare.name);

      if (intrare.isDirectory()) {
        stergeFisiereVechiRecursiv(caleCompleta);

        fs.readdir(caleCompleta, (errSub, continutSub) => {
          if (!errSub && continutSub.length === 0) {
            fs.rmdir(caleCompleta, (errRm) => {
              if (errRm) {
                console.error("Eroare la ștergerea folderului gol:", caleCompleta, errRm);
              } else {
                console.log(`Folderul gol '${caleCompleta}' a fost șters.`);
              }
            });
          }
        });
      } else {
        fs.stat(caleCompleta, (errStat, stats) => {
          if (errStat) {
            console.error("Eroare la stat fisier:", caleCompleta, errStat);
            return;
          }

          const timpModificare = stats.mtime.getTime();
          if (acum - timpModificare > T * MINUTE_IN_MILLISECONDS) {
            fs.unlink(caleCompleta, (errDel) => {
              if (errDel) {
                console.error("Eroare la ștergerea fișierului:", caleCompleta, errDel);
              } else {
                console.log(`Fișierul '${caleCompleta}' a fost șters (mai vechi de ${T} minute).`);
              }
            });
          }
        });
      }
    });
  });
}

function stergeFisiereBackupVechi() {
  const folderBackup = obGlobal.folderBackup;
  stergeFisiereVechiRecursiv(folderBackup);
}

stergeFisiereBackupVechi();
setInterval(stergeFisiereBackupVechi, 5 * MINUTE_IN_MILLISECONDS);


app.listen(8080);
console.log("Serverul a pornit")


