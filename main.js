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

function createListItem(item) {
  const li = document.createElement("li");
  const title = document.createElement("a");
  title.href = item.url;
  title.textContent = item.url;
  li.appendChild(title);
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download";
  downloadBtn.addEventListener("click", () => {
    window.location.href = getDocumentLink(item.url, item.type);
  });
  li.appendChild(downloadBtn);
  return li;
}

function addItem() {
  const newItemUrl = newItemInput.value;
  let newItemType = "web page";
  if (itemTypeSelect && itemTypeSelect.value !== "web page") {
    newItemType = itemTypeSelect.value;
  }
  fetch("https://elronbandel.pythonanywhere.com/links", {
    method: "POST",
    body: JSON.stringify({url: newItemUrl, type: newItemType}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    readingList.innerHTML = "";
    for (const item of data) {
      const li = createListItem(item);
      readingList.appendChild(li);
    }
  });
  newItemInput.value = "";
}

fetch("https://elronbandel.pythonanywhere.com/links")
  .then(response => response.json())
  .then(data => {
    for (const item of data) {
      const li = createListItem(item);
      readingList.appendChild(li);
    }
  });
