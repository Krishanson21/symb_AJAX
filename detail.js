const API = "https://restcountries.com/v3.1/alpha/";

function getCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("country");
}

function getNative(name) {
  if (!name.nativeName) return "N/A";
  return Object.values(name.nativeName)[0].common;
}

function getCurrency(c) {
  if (!c) return "N/A";
  return Object.values(c).map(x => x.name).join(", ");
}

function getLanguages(l) {
  if (!l) return "N/A";
  return Object.values(l).join(" and ");
}

function getCapital(c) {
  return c ? c.join(", ") : "N/A";
}

function getCodeNum(idd) {
  if (!idd) return "N/A";
  return (idd.root || "") + (idd.suffixes ? idd.suffixes[0] : "");
}

async function showDetail(c) {
  if (!c) {
    document.getElementById("detail-content").innerHTML = "Country not found.";
    return;
  }

  const box = document.getElementById("detail-content");
  const borders = c.borders || [];

  box.innerHTML = `
    <h1 class="detail-title">${c.name.common}</h1>
    <div class="detail-top">
      <img class="detail-flag" src="${c.flags.png}">
      <div class="detail-info-table">
        <p><strong>Native Name:</strong> ${getNative(c.name)}</p>
        <p><strong>Capital:</strong> ${getCapital(c.capital)}</p>
        <p><strong>Population:</strong> ${c.population}</p>
        <p><strong>Region:</strong> ${c.region}</p>
        <p><strong>Sub-region:</strong> ${c.subregion}</p>
        <p><strong>Area:</strong> ${c.area} Km²</p>
        <p><strong>Country Code:</strong> ${getCodeNum(c.idd)}</p>
        <p><strong>Languages:</strong> ${getLanguages(c.languages)}</p>
        <p><strong>Currencies:</strong> ${getCurrency(c.currencies)}</p>
        <p><strong>Timezones:</strong> ${c.timezones.join(", ")}</p>
      </div>
    </div>

    <div class="neighbours-section">
      <h2 class="neighbours-title">Neighbour Countries</h2>
      <div class="neighbours-grid" id="neighbours"></div>
    </div>
  `;

  const grid = document.getElementById("neighbours");

  for (let b of borders) {
    const res = await fetch(API + b + "?fields=name,flags,cca3");
    const data = await res.json();
    const n = Array.isArray(data) ? data[0] : data;

    if (n && n.flags) {
      const img = document.createElement("img");
      img.src = n.flags.png;
      img.className = "neighbour-flag";
      img.onclick = () => {
        window.location.href = `detail.html?country=${n.cca3}`;
      };
      grid.appendChild(img);
    }
  }
}

async function load() {
  const code = getCode();

  if (!code) {
    document.getElementById("detail-content").innerHTML = "No country selected.";
    return;
  }

  const res = await fetch(API + code + "?fields=name,flags,capital,population,region,subregion,area,idd,languages,currencies,timezones,borders,cca3");
  const data = await res.json();
  const country = Array.isArray(data) ? data[0] : data;

  showDetail(country);
}

load();