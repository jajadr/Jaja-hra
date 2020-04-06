//objekt hra
let hra = {
  element: document.getElementById ('hra'),
  sirka: 900,
  vyska: 700,
  dalsiNakup: 150,
  skore:0,
  skoreElement: document.getElementById('pocet'),
  hudba: document.getElementById('hudba'),
  zvukBoom: document.getElementById('zvuk-boom'),
  zvukMlask: document.getElementById('zvuk-mlask'),
  uvod: document.getElementById('uvod'),
  tlacitkoStart: document.getElementById('start'),
  konec: document.getElementById('konec'),
  tlacitkoZnovu: document.getElementById('znovu'),
  vysledek: document.getElementById('vysledek'),
  cas: 0,
  casElement: document.getElementById('cas'),
  casovac: null
}
// objekt panda
let panda = {
  element:document.getElementById('panda'),
  x:0,
  y:480,
  sirka:230,
  vyska:100,
  rychlost:10
}

// objekt bag
let bag = {
  element:document.getElementById('bag'),
  x:0,
  y:10,
  sirka: 130,
  vyska: 104,
  rychlost: 2
}

//seznam 
let nakup = [];
//funkce pro umisteni objektu a jeho souradnice

window.addEventListener('load', uvodHry);

function uvodHry() {
  
  prepniObrazovku('uvod');
  hra.tlacitkoStart.addEventListener('click', startHry);

  hra.tlacitkoZnovu.addEventListener('click', startHry);
}

function startHry() {
  hra.skore = 0;
  hra.skoreElement.textContent='0';
  //nastaveni objektu do hlvni polohy
  panda.x = Math.floor(hra.sirka / 2 - panda.sirka / 2);
  umistiObjekt(bag);
  umistiObjekt(panda);
  
  hra.hudba.play();

  hra.cas=90;
  zobrazCas();
  
  document.addEventListener ('keydown', priStiskuKlavesy);
  hra.casovac = setInterval(aktualizujHru, 20);
  //casovac
  
 
  
  
  prepniObrazovku('hra');
} 

function aktualizujHru () {
  
  posunBag();

  posunNakup();

  otestujNakup();

  cekejNaDalsiNakup();

  aktualizujCas();

  if (hra.cas <= 0) {
    konecHry();
  }
}
  

function priStiskuKlavesy(udalost) {
  if (udalost.key === 'ArrowRight') {
    panda.x = panda.x + panda.rychlost;

    if (panda.x > hra.sirka - panda.sirka) {
      panda.x = hra.sirka - panda.sirka;
    }
  }
  
  if (udalost.key === 'ArrowLeft') {
    panda.x = panda.x - panda.rychlost;
    
    if (panda.x < 0) {
      panda.x = 0;
    }
  }
 
 umistiObjekt(panda);
}



function umistiObjekt (herniObjekt) { 
  herniObjekt.element.style.left = herniObjekt.x + 'px';
  herniObjekt.element.style.top = herniObjekt.y + 'px';
}

function posunBag () {
  bag.x = bag.x + bag.rychlost;
  //otoceni tasky na pravo
  if (bag.x > hra.sirka - bag.sirka) {
    bag.x = hra.sirka - bag.sirka;
    bag.rychlost = - bag.rychlost;
    bag.element.style.transform = 'scaleX(-1)';
  }
  
  if (bag.x < 0) {
    bag.x = 0;
    bag.rychlost = -bag.rychlost;
    bag.element.style.transform = 'scaleX(1)';
  }

  umistiObjekt(bag);
}

function pridejNakup() {
  
  let obrazek = document.createElement('img');
  obrazek.src = 'obrazky/ovoce' + nahodneCislo (1, 3) + '.png';
  hra.element.appendChild(obrazek);

  //objekt noveho zbozi
  let novyNakup = {
    element: obrazek,
    x: Math.floor(bag.x + bag.sirka / 2 - 20),
    y: Math.floor(bag.y + bag.vyska / 2),
    sirka: 39,
    vyska: 44,
    rychlost: nahodneCislo (1, 3)
  };
  nakup.push(novyNakup);
  
  umistiObjekt(novyNakup);

}

function posunNakup() {
  for (let i = 0;  i < nakup.length; i++) { 
    nakup[i].y = nakup[i].y + nakup[i].rychlost;

    umistiObjekt(nakup[i]);
  }
}

function otestujNakup () {
  for (let i = nakup.length - 1; i >= 0; i --) {
    
    if (protnutiObdelniku(panda, nakup[i])) {
      
      odstranNakup(i);

      zvetsiSkore();

      hra.cas = hra.cas + 3;
      zobrazCas();

      hra.zvukMlask.play();
    

    } else if (nakup[i].y + nakup[i].vyska > hra.vyska) {

      odstranNakup(i);
      
      hra.cas = hra.cas - 10;
      zobrazCas();

      hra.zvukBoom.play();
    } 
  }    
}

function odstranNakup(index) {
  nakup[index].element.remove();

  nakup.splice(index, 1);
}

function nahodneCislo(dolniLimit, horniLimit) {
  return dolniLimit + Math.floor(Math.random() * (horniLimit - dolniLimit + 1));
}

function cekejNaDalsiNakup () {
  if (hra.dalsiNakup === 0) { 
    
    pridejNakup ();

    hra.dalsiNakup = nahodneCislo (50, 250);
  } else {

    hra.dalsiNakup--;
  }  
}
 
function protnutiObdelniku(a, b) {
  if ( a.x + a.sirka < b.x
        || b.x + b.sirka < a.x
        || a.y + a.vyska < b.y
        || b.y + b.vyska < a.y) {
    return false;
  } else {

    return true;
  }
}
function zvetsiSkore() {
  hra.skore++;
  hra.skoreElement.textContent = hra.skore;
}
//prepinani obrazovky
function prepniObrazovku(obrazovka) {
  
  hra.uvod.style = 'none';
  hra.element.style = 'none';
  hra.konec.style = 'none';

  if (obrazovka === 'uvod') {
    
    hra.uvod.style.display = 'flex';

  } else if (obrazovka === 'hra') {
    hra.element.style.display = 'block';  

  } else if (obrazovka === 'konec') {
    hra.konec.style.display='flex';
  }
}

function konecHry() {

  clearInterval(hra.casovac);

  document.removeEventListener('keydown', priStiskuKlavesy);

  odeberNakup();

  prepniObrazovku('konec');

  if (hra.skore === 0) {

    hra.vysledek.textContent = 'Žádné jídlo? Pandě kručí v bříšku. Zkus to znovu.';

  } else if (hra.skore === 1) {

    hra.vysledek.textContent = 'Jen jeden kousek? To pandičce nestačí. Zkus ulovit víc!';

  } else if (hra.skore < 5) {

    hra.vysledek.textContent = 'Výborně! Chytil jsi  ' + hra.skore +  'kousků jídla. Panda má plné bříško, ale chtělo by to ještě něco do zásoby. Zkusíš to znovu?' ;

  } else {

    hra.vysledek.textContent = 'Výborně, chytil jsi ' + hra.skore + 'dárků. Pandička je spokojená, může si klidně nacpat bříško.';

  }
}

function zobrazCas() {
  if (hra.cas < 0) {
    hra.cas = 0;
  }

  let minuty = Math.floor(hra.cas / 60);
  let vteriny = Math.round(hra.cas - minuty * 60);

  let naformatovanyCas = ('00' + minuty).slice(-2) + ':' +
  ('00' + vteriny).slice(-2)

  hra.casElement.textContent = naformatovanyCas;
}

function aktualizujCas() {
  hra.cas = hra.cas - 0.02;

  zobrazCas();
}

function odeberNakup() {
  for (let i = 0; i < nakup.length; i++) {
    nakup[i].element.remove();
  }
  nakup=[];
}
