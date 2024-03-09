function clearCards() {
  $('.workouts').empty()
}

function createCard(data) {
  $('.workouts').append(`
    <a href="/detail.html?name=${data.slug}">
      <div class="flex flex-col w-full gap-5">
        <figure><img class="rounded-box w-full h-[250px] object-cover" src="${data.image}" alt="${data.name}" /></figure>
        <p class="font-bold text-xl text-white">${data.name}</p>
      </div>
    </a>
  `)
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://indexeddb-e5d4a-default-rtdb.asia-southeast1.firebasedatabase.app/workouts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    dataArray.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('workouts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
