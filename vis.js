const svg = document.getElementById("creative");

//10 random circles
for (let i = 0; i < 10; i++) {
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 40 * i + 20);
  circle.setAttribute("cy", Math.random() * 150 + 20);
  circle.setAttribute("r", 15);
  circle.setAttribute("fill", i % 2 === 0 ? "tomato" : "gold");
  svg.appendChild(circle);
}
