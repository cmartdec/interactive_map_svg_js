
const svg = document.getElementById("allSvg");

const floodButton = document.getElementById("flood_button");
let disaster_creation_listening = false;

floodButton.addEventListener("click", () => {
    console.log("select country")
    disaster_creation_listening = true;
})

createCircle(200, 200)

function createCircle(x, y) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 2);
    circle.setAttribute("fill", "red");
    svg.appendChild(circle)
}

let countryStack = []
document.querySelectorAll(".allPaths").forEach(e => {
    e.setAttribute('class', `allPaths ${e.id}`);
    e.addEventListener("click",function(){
        const classes=e.className.baseVal.replace(/ /g, '.')         
        document.querySelectorAll(`.${classes}`).forEach(country =>{
            if(disaster_creation_listening) {
                createDisaster(country);
            }
            clearCountries(); // solve big countries coloring problem (usa, russia)
            country.style.fill = "pink"
            countryStack[0] = country
        })
        //console.log(e.id) // this is to get country name
        const infoBoxCountryText = document.getElementById("info_box_country_text")
        if(infoBoxCountryText) {
            infoBoxCountryText.textContent = e.id
        } else {
            console.error("element was not found")
        }
    })
})

function createDisaster(country) {
    console.log("flooding on ", country)
    const pathData = country.getAttribute("d")
    const match = pathData.match(/M([0-9.-]+) ([0-9.-]+)/);
    if (match) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        createCircle(x, y)
    }
    disaster_creation_listening = false;
}


function clearCountries() {
    if (countryStack[0]) {
      countryStack[0].style.fill = "#ececec"
    }
}


    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    const zoomSpeed = 0.1;
    const maxScale = 5; 
    const minScale = 1;

    function applyTransform() {
        svg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    svg.addEventListener("wheel", (event) => {
        event.preventDefault();

        const zoomIn = event.deltaY < 0;
        const zoomOut = event.deltaY > 0;

        if (zoomIn && scale < maxScale) {
            scale += zoomSpeed;
        } else if (zoomOut && scale > minScale) {
            scale -= zoomSpeed;
        }

        applyTransform();
    });

    let isPanning = false;
    let startX, startY;

    svg.addEventListener("mousedown", (event) => {
        isPanning = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
    });

    svg.addEventListener("mousemove", (event) => {
        if (!isPanning) return;
        translateX = event.clientX - startX;
        translateY = event.clientY - startY;
        applyTransform();
    });

    svg.addEventListener("mouseup", () => {
        isPanning = false;
    });

    svg.addEventListener("mouseleave", () => {
        isPanning = false;
    });
