// Get references to the elements
const dayElement = document.getElementById("day");
const dateElement = document.getElementById("date");

// Function to get and display the current day and date
function updateDateAndDay() {
  const now = new Date();

  // Array for day names
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Array for month names
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Get current day and date
  const dayName = days[now.getDay()];
  const date = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // Update HTML content
  dayElement.textContent = dayName;
  dateElement.textContent = date;
}

// Call the function to set the date and day initially
updateDateAndDay();
