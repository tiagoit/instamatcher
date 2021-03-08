let tags = [
  { name: "main", borderWidth: '5px', borderColor: '#f44336' },
  { name: "nav", borderWidth: '5px', borderColor: '#e91e63' },
  { name: "aside", borderWidth: '5px', borderColor: '#9c27b0' },
  { name: "footer", borderWidth: '5px', borderColor: '#673ab7' },
  { name: "article", borderWidth: '5px', borderColor: '#03a9f4' },
  { name: "section", borderWidth: '5px', borderColor: '#4caf50' }
];

// Add colored borders and titles to each semantic element
tags.forEach((tag) => {
  let tags = document.getElementsByTagName(tag.name);
  for (let i = 0; i < tags.length; i++) {
    tags[i].style.border = tag.borderWidth + ' solid ' + tag.borderColor;
    tags[i].title = tag.name;
  }
});

// #cddc39
// #ffc107
// #ff9800

// add a floating box with the element / color map.
let box = document.createElement("div")
// box.innerHTML = "Some arb ddtext";
box.style.display = "block";
box.style.width = "90px";
box.style.position = "fixed";
box.style.top = "16px";
box.style.right = "16px";
box.style.textAlign = "right";
box.style.padding = "16px";
box.style.backgroundColor = "rgba(0,0,0,0.7)";
box.style.borderRadius = "4px";
box.style.color = "#fff";
box.style.zIndex = "999999";

tags.forEach((tag) => {
  let colorSpan = document.createElement("span");
  colorSpan.style.height = "12px";
  colorSpan.style.width = "12px";
  colorSpan.style.display = "inline-block";
  colorSpan.style.marginLeft = "8px";
  colorSpan.style.backgroundColor = tag.borderColor;

  let div = document.createElement("div");
  div.innerHTML = tag.name;
  div.appendChild(colorSpan);

  box.appendChild(div);
});

document.body.appendChild(box);