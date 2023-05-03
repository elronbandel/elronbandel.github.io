function getDotepubLink(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL");
  }

  const encodedUrl = encodeURIComponent(url);
  const dotepubLink = `https://dotepub.com/converter/?url=${encodedUrl}&fmt=epub&imm=1&lang=en`;

  return dotepubLink;
}

function getArxivId(arxivLink) {
  if (!arxivLink || typeof arxivLink !== "string") {
    throw new Error("Invalid arXiv link");
  }

  const match = arxivLink.match(/^https?:\/\/arxiv\.org\/(abs|pdf)\/([\d\.]+)$/);
  if (!match) {
    throw new Error("Invalid arXiv link");
  }

  const arxivId = match[2];

  return arxivId;
}

function getDocumentLink(url, type) {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL");
  }

  if (!type || typeof type !== "string" || !["web", "arxiv"].includes(type)) {
    throw new Error("Invalid document type");
  }

  if (type === "web") {
    const dotepubLink = getDotepubLink(url);
    return dotepubLink;
  } else if (type === "arxiv") {
    const arxivVanityLink = `https://www.arxiv-vanity.com/papers/${getArxivId(url)}/`;
    const dotepubLink = getDotepubLink(arxivVanityLink);
    return dotepubLink;
  }
}


// Get the input box, the reading list element, and the item type select element from the HTML
const newItemInput = document.getElementById("reading-list-item");
const readingList = document.getElementById("reading-list");
const itemTypeSelect = document.getElementById("item-type");

// Define a function to add a new reading list item to the list
function addItem() {
  // Get the value of the input box
  const newItemUrl = newItemInput.value;
  
  // Set the default item type as "web page"
  let newItemType = "web page";
  
  // Check if the user has selected a different item type
  if (itemTypeSelect && itemTypeSelect.value !== "web page") {
    newItemType = itemTypeSelect.value;
  }

  // Send a POST request to the Flask API to add the new item
  fetch("https://elronbandel.pythonanywhere.com/links", {
    method: "POST",
    body: JSON.stringify({url: newItemUrl, type: newItemType}),
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
      li.textContent =  getDocumentLink(item.url, item.type);
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
      li.textContent = getDocumentLink(item.url, item.type);
      readingList.appendChild(li);
    }
  });
