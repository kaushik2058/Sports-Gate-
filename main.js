const app = document.getElementById('app');

app.innerHTML = `
  <h1 class="text-3xl font-bold mb-4 text-center text-green-400">LiveSportGate</h1>
  <input id="search" type="text" placeholder="Search Channels..." class="w-full p-2 mb-4 rounded text-black" />
  <div id="channels" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"></div>
`;

const searchInput = document.getElementById('search');
const channelContainer = document.getElementById('channels');

let channels = [];

function loadM3U(url) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      const lines = data.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
          const name = lines[i].split(',')[1] || "Unknown";
          const logoMatch = lines[i].match(/tvg-logo="(.*?)"/);
          const logo = logoMatch ? logoMatch[1] : "";
          const stream = lines[i + 1];
          channels.push({ name, logo, stream });
        }
      }
      displayChannels(channels);
    });
}

function displayChannels(list) {
  channelContainer.innerHTML = "";
  list.forEach(ch => {
    const el = document.createElement('a');
    el.href = ch.stream;
    el.target = "_blank";
    el.className = "bg-gray-900 p-2 rounded hover:bg-gray-700 transition";
    el.innerHTML = `
      ${ch.logo ? `<img src="${ch.logo}" class="w-full h-24 object-contain mb-2">` : ""}
      <p class="text-center text-sm font-semibold">${ch.name}</p>
    `;
    channelContainer.appendChild(el);
  });
}

searchInput.addEventListener('input', e => {
  const val = e.target.value.toLowerCase();
  const filtered = channels.filter(ch => ch.name.toLowerCase().includes(val));
  displayChannels(filtered);
});

loadM3U("https://raw.githubusercontent.com/ciccioxm3/omg/refs/heads/main/247world.m3u8");
