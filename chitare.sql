DROP TYPE IF EXISTS categ_chitara;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_chitara AS ENUM('comanda speciala', 'aniversara', 'editie limitata', 'pentru incepatori', 'acordata', 'comuna');
CREATE TYPE tipuri_produse AS ENUM('clasica', 'electrica', 'acustica');


CREATE TABLE IF NOT EXISTS chitare (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate>=0),   
   tip_produs tipuri_produse DEFAULT 'clasica',
   scala INT NOT NULL CHECK (scala>=0),
   categorie categ_chitara DEFAULT 'comuna',
   materiale VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   deja_acordata BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into chitare (nume,descriere,pret, greutate, scala, tip_produs, categorie, materiale, deja_acordata, imagine) VALUES 
('Ibanez AZ2204NW-MGR', 'Chitară electrică de înaltă calitate, cu o combinație perfectă între lemn de arțar prăjit și corp din arin, oferind un sunet echilibrat și sustain excelent.', 9444 , 3.5, 648, 'clasica', 'comuna', '{"artar","nichel","otel","plastic"}', False, 'chitara1.png'),

('Ibanez AZ47P1QM-DEB', 'Chitară electrică cu design sofisticat, construită din arțar și tei pentru un ton vibrant și clar, ideală pentru performanțe live.', 6000 , 2.5, 500, 'clasica', 'comuna', '{"artar","tei","nichel","plastic","mahon"}', False, 'chitara2.png'),

('Ibanez AZ2402-GRM', 'Chitară electrică premium, cu top din frasin și corp din mahon, oferind tonuri calde și un sustain excelent, perfectă pentru solo-uri expresive.', 3500 , 3.2, 500, 'clasica', 'comanda speciala', '{"frasin","plastic","artar","nichel","tei","grafit"}', False,'chitara3.png'),

('Ibanez AZ2204NWL-MGR', 'Chitară electrică versatilă, cu un corp din arin și gât din arțar prăjit, care produce un sunet clar și natural, ideală pentru orice stil de muzică.', 3200 , 3.2, 620, 'clasica', 'aniversara', '{"otel","plastic","artar","arin","nichel","fag","aur"}', False,'chitara4.png'),

('Ibanez GRGM21M-BLT', 'Chitară electrică mică, cu un sunet puternic, perfectă pentru chitariștii tineri care doresc să învețe și să se distreze cu fiecare acord.', 6000 , 2.5, 780, 'clasica', 'comuna', '{"cupru","artar","aur","nichel", "satin"}', True,'chitara5.png'),

('Nimic', 'Nimic', 700 , 0, 0, 'clasica', 'acordata', '{}', False, 'nimic.png'),

('Ibanez RG652AHM-NGB', 'Chitară electrică cu corp din mahon și top din arțar, oferind un ton agresiv și sustain excelent pentru muzica heavy metal.', 2500 , 3.2, 800, 'electrica', 'comuna', '{"plastic","mahon","artar","nichel","fagure","grafit", "aluminiu"}', False, 'chitara6.png'),

('Ibanez PS60-SSL', 'Chitară electrică elegantă, cu un design rafinat din tei și mahon, ideală pentru chitariștii care caută sunetul perfect în orice stil.', 8000 , 3.0, 720, 'electrica', 'comuna', '{"tei","nichel","mahon","alama","artar","plastic"}', False, 'chitara7.png'),

('Ibanez TOD10 Tim Henson', 'Chitară electrică unică, cu sunet distinctiv și design personalizat, creată pentru a oferi o experiență sonoră deosebită.', 12000 , 4.0, 550, 'electrica', 'aniversara', '{"artar","nichel","ulm","plastic","mahon"}', False, 'chitara8.png'),

('Ibanez GRGR221PA-AQB', 'Chitară electrică accesibilă, cu sunet clar și dinamic, ideală pentru chitariștii care încep să exploreze lumea muzicii electrice.', 3.2 , 4.0, 520, 'electrica', 'aniversara', '{"artar","nichel","plasticina","mahon","ulm"}', True, 'chitara9.png'),

('Ibanez RG550-PN', 'Chitară electrică de înaltă performanță, cu sunet agresiv și sustain prelungit, ideală pentru solosuri rapide și riffuri puternice.', 7000 , 4.5, 700, 'electrica', 'aniversara', '{"mahon","ulm", "frasin","artar","nichel","plastic"}', False, 'chitara10.png'),

('Ibanez GRX70QA-TBB GIO', 'Chitară electrică cu un sunet clar și bine echilibrat, ideală pentru chitariștii începători care doresc să învețe rapid.', 5000 , 4.0, 285, 'electrica', 'comuna', '{"artar","nichel","plastic/pvc","mahon","tei","alama"}', False, 'chitara11.png'),

('Ibanez GRG121DX-BKF', 'Chitară electrică puternică, ideală pentru muzică rock și metal, cu un sunet puternic și sustain excelent pentru solosuri intense.', 15000 , 3.5, 385, 'clasica', 'comanda speciala', '{"artar","nichel","plastic", "aur","mahon","diamant"}', False, 'chitara12.png'),

('Ibanez AZ2407F-BSR', 'Chitară electrică cu un ton clar și echilibrat, ideală pentru chitariștii care doresc un sunet curat și durabil.', 2000 , 3.5, 700, 'electrica', 'comuna', '{"alama", "artar","nichel","plastic","mahon","lemn de trandafir"}', False, 'chitara13.png'),

('Ibanez JEMJR-WH', 'Chitară electrică cu un sunet clar și rapid, perfectă pentru chitariștii începători care doresc să exploreze muzica rock.', 6000, 2.9, 510,'clasica', 'pentru incepatori', '{"tei", "plastic", "nichel", "grafit", "artar"}', False, 'chitara14.png'),

('Ibanez AZ47P1QM-BIB', 'Chitară acustică cu un ton cald și echilibrat, perfectă pentru muzica folk și acustică.', 1800 , 2.5, 370, 'acustica', 'comuna', '{"ceramica","nichel","alama", "lemn de trandafir","plastic","cupru","tei", "otel"}', False, 'chitara15.png'),

('Ibanez RG550-DY', 'Chitară electrică ediție limitată, cu un sunet deosebit și design inovator, ideală pentru chitariștii care doresc ceva cu adevărat special.', 12000 , 2.0, 470, 'acustica', 'editie limitata', '{"ceramica","nichel","alama", "lemn de trandafir","plastic","cupru","tei", "otel"}', False, 'chitara16.png'),

('Ibanez AZES40-BK', 'Chitară acustică ideală pentru începători, ușor de manevrat și cu un sunet plăcut, perfectă pentru sesiuni de practică.', 14000 , 2.5, 440, 'acustica', 'pentru incepatori', '{"otel", "ceramica", "nichel", "grafit", "artar","plastic","cupru"}', False, 'chitara17.png'),

('Ibanez GRX70QA-TKS GIO', 'Chitară acustică accesibilă și versatilă, cu sunet echilibrat și ideală pentru diverse genuri muzicale.', 8000, 3.1, 530, 'acustica','comuna','{"otel", "ceramica", "nichel", "grafit", "artar","plastic","cupru"}', False, 'chitara18.png'),

('Ibanez RG550-RF', 'Chitară electrică pentru chitariștii care doresc un ton agresiv și un sustain puternic, perfectă pentru rock și metal.', 5000, 4.1,530,'acustica', 'comuna', '{"ceramica", "otel"}', False, 'chitara19.png'),

('Ibanez GRG131DX-BKF', 'Chitară electrică perfectă pentru începători, cu sunet puternic și clar, ușor de controlat pentru sesiuni de practică.', 7000, 4.1,640,'clasica', 'pentru incepatori', '{"plastic", "tei","nichel"}', False, 'chitara20.png');