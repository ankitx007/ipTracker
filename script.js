document.addEventListener("DOMContentLoaded", function () {
  var search = document.querySelector("#Search");
  var inputBox = document.querySelector("#ipInputBox");
  const loader = document.getElementById("loader");
  const items = document.querySelectorAll(".item");
  const vls = document.querySelectorAll(".vl");
  let map;
  navigator.geolocation.watchPosition(success, error);

  async function initMap(lat, lng) {
    // The location of Uluru
    const position = { lat: lat, lng: lng };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
      zoom: 19,
      center: position,
      mapId: "DEMO_MAP_ID",
    });

    // The marker, positioned at Uluru
    const marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: "Uluru",
    });
  }

  function success(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    initMap(lat, lng);
  }

  function error(pos) {
    alert("Please allow location sharing.");
  }

  search.addEventListener("click", function () {
    var ipAddress = inputBox.value;
    // var map = L.map("map").setView([51.505, -0.09], 13);
    // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   maxZoom: 19,
    //   attribution:
    //     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    // }).addTo(map);

    if (ipAddress.trim() !== "") {
      var apiUrl = "https://geo.ipify.org/api/v2/country,city";
      apiUrl +=
        "?apiKey=at_xR1sJp92nxxeRvcAsjxClw6V1QnEy&ipAddress=" + ipAddress;

      loader.style.display = "block";
      items.forEach(function (item) {
        item.style.display = "none";
      });

      vls.forEach(function (vl) {
        vl.style.display = "none";
      });

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          var ip = document.querySelector("#ip");
          var location = document.querySelector("#location");
          var timezone = document.querySelector("#timezone");
          var isp = document.querySelector("#isp");
          var lat = data.location.lat;
          var lng = data.location.lng;

          console.log(data);

          loader.style.display = "none";
          items.forEach(function (item) {
            item.style.display = "block";
          });

          vls.forEach(function (vl) {
            vl.style.display = "block";
          });

          initMap(lat, lng);

          ip.textContent = data.ip;
          location.textContent =
            data.location.city + "," + data.location.country;
          timezone.textContent = "UTC " + data.location.timezone;
          isp.textContent = data.isp;
        })
        .catch((error) => {
          console.log("Error in getting details: ", error);

          loader.style.display = "none";
          item.style.display = "block";
          vl.style.display = "block";
        });
    }
  });
});
