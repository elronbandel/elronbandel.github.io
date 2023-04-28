// Get the input box and the reading list element from the HTML
const newItemInput = document.getElementById("reading-list-item");
const readingList = document.getElementById("reading-list");

// Define a function to add a new reading list item to the list
function addItem() {
  // Get the value of the input box
  const newItem = newItemInput.value;

  // Send a POST request to the Flask API to add the new item
  fetch("https://elronbandel.pythonanywhere.com/links", {
    method: "POST",
    body: JSON.stringify({item: newItem}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    // Update the reading list on the front-end with the new item
    readingList.innerHTML = "";
    for (const item of data) {
      const li = document.createElement("li");
      li.textContent = item;
      readingList.appendChild(li);
    }
  });

  // Clear the input box after adding the new item
  newItemInput.value = "";
}

// When the page loads, send a GET request to the Flask API to get the current reading list items
fetch("https://elronbandel.pythonanywhere.com/links")
  .then(response => response.json())
  .then(data => {
    // Update the reading list on the front-end with the current items
    for (const item of data) {
      const li = document.createElement("li");
      li.textContent = item;
      readingList.appendChild(li);
    }
  });
