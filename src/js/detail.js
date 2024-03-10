const urlParams = new URLSearchParams(window.location.search);
const workoutParam = urlParams.get("name");

function updateUI(data) {
  const workout = data.find((workout) => workout.slug == workoutParam);
  document.title = workout.name + " | FitFlow";

  const categories = workout.categories
    .map(
      (category) =>
        ` <div class="bg-neutral text-primary text-sm md:text-lg py-2 px-5 mb-0 rounded-md">${
          category[0].toUpperCase() + category.substring(1)
        }</div>`
    )
    .join("");

  $("#workout_image").attr("src", workout.image);
  $("#workout_name").text(workout.name);
  $("#categories").html(categories);
  $("#description").html(workout.description);
  $("#duration").text(workout.duration + " min");
  $("#set").text(workout.set);

  const equipment = workout.equipment ?? "No equipment needed";
  $("#equipment").text(equipment);
}

var url =
  "https://indexeddb-e5d4a-default-rtdb.asia-southeast1.firebasedatabase.app/workouts.json";
var networkDataReceived = false;

fetch(url)
  .then(function (res) {
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      throw new Error("Offline network error!");
    }
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log("From web", data);
    const dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  })
  .catch(function (err) {
    console.log(err)
    if (!caches.match(window.location.href)) {
      window.location.href = "/offline.html";
    }
    else {
      if ("indexedDB" in window) {
        readAllData("workouts").then(function (data) {
          if (!networkDataReceived) {
            console.log("From cache", data);
            updateUI(data);
          }
        });
      }
    }
  });

