const API = "https://restcountries.com/v3.1/all?fields=name,flags,currencies,maps,cca3";
let countries = [];

function getCurrency(c) {
  if (!c) return "N/A";
  return Object.values(c).map(x => x.name).join(", ");
}

function getTime() {
  const d = new Date();
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${h}:${m}`;
}

function makeCard(c) {
  return `
  <div class="country-card">
    <img class="country-flag" src="${c.flags.png}">
    <div class="country-info">
      <div>
        <div class="country-name">${c.name.common}</div>
        <div class="country-meta">
          Currency: ${getCurrency(c.currencies)}<br>
          Current date and time: ${getTime()}
        </div>
      </div>
      <div class="card-actions">
        ${c.maps.googleMaps ? `<button class="btn" onclick="window.open('${c.maps.googleMaps}')">Show Map</button>` : ""}
        ${c.cca3 ? `<a class="btn" href="detail.html?country=${c.cca3}">Detail</a>` : ""}
      </div>
    </div>
  </div>
  `;
}

function showCountries(list) {
  const box = document.getElementById("country-list");
  if (list.length === 0) {
    box.innerHTML = `<div class="no-results">No countries found.</div>`;
    return;
  }
  box.innerHTML = list.map(makeCard).join("");
}

function filterCountries() {
  const text = document.getElementById("searchInput").value.toLowerCase();
  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(text)
  );
  showCountries(filtered);
}

async function loadCountries() {
  const res = await fetch(API);
  const data = await res.json();
  countries = data.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
  showCountries(countries.slice(0,4));
}

loadCountries();