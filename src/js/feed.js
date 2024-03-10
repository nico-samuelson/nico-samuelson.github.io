var url =
  "https://indexeddb-e5d4a-default-rtdb.asia-southeast1.firebasedatabase.app/workouts.json";
var networkDataReceived = false;
let workouts = [];

function clearCards() {
  $(".workouts").empty();
}

function createCard(data, delay) {
  $(".workouts").append(`
    <a href="/detail.html?name=${data.slug}" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay="${delay}">
      <div class="flex flex-col w-full gap-5 workout">
        <figure><img class="rounded-box w-full h-[250px] object-cover" src="${data.image}" alt="${data.name}" /></figure>
        <p class="font-bold text-xl text-white">${data.name}</p>
      </div>
    </a>
  `);
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i], (i % 3) * 100);
  }
}

function search(text) {
  const filtered = workouts.filter((workout) => {
    return workout.name.toLowerCase().includes(text);
  });
  updateUI(filtered);
}

function filterByCategories(category) {
  if (category == "all") {
    updateUI(workouts);
    return;
  }

  const filtered = workouts.filter((workout) => {
    return workout.categories.includes(category);
  });
  updateUI(filtered);
}

$(document).ready(function () {
  AOS.init();

  // filter by categories
  $('input[name="categories"]').click(function () {
    // remove was checked from other radios
    $('input[name="categories"]').data("waschecked", false);
    $('input[name="categories"]').next().removeClass("bg-primary text-white");
    $('input[name="categories"]').next().addClass("bg-neutral text-primary");

    var $radio = $(this);

    // if this was previously checked
    if ($radio.data("waschecked") == true) {
      $radio.prop("checked", false);
      $radio.data("waschecked", false);
      $radio.next().removeClass("bg-primary text-white");
      $radio.next().addClass("bg-neutral text-primary");
    } else {
      $radio.data("waschecked", true);
      $radio.next().removeClass("bg-neutral text-primary");
      $radio.next().addClass("bg-primary text-white");
      filterByCategories($radio.val());
    }
  });

  // search
  $("#search_workout").on("change", function () {
    var value = $(this).val().toLowerCase();
    search(value);
  });
});

fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log("From web", data);
    if (workouts.length > 0) {
      workouts = [];
    }
    for (var key in data) {
      workouts.push(data[key]);
      writeData('workouts', data[key])
    }
    workouts.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    updateUI(workouts);
  });

if ("indexedDB" in window) {
  readAllData("workouts").then(function (data) {
    if (!networkDataReceived) {
      console.log("From cache", data);
      workouts = [];
      workouts = data.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      updateUI(workouts);
    }
  });
}
