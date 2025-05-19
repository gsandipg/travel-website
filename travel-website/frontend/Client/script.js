function login() {
  alert("Redirecting to Login Page...");
}

function register() {
  alert("Redirecting to Register Page...");
}

function handleSearch(event) {
  event.preventDefault();

  const destination = document.getElementById("destination").value;
  const date = document.getElementById("date").value;
  const persons = document.getElementById("persons").value;

  alert(`Searching for:
  Destination: ${destination}
  Date: ${date}
  Persons: ${persons}`);

  // window.location.href = `hotels.html?place=${destination}&date=${date}&persons=${persons}`;
}

function handleFind(event) {
  event.preventDefault();
  const city = document.getElementById("destination").value;
  const date = document.getElementById("date").value;
  const persons = document.getElementById("persons").value;

  window.location.href = `place.html?city=${encodeURIComponent(city)}&date=${date}&persons=${persons}`;
}
