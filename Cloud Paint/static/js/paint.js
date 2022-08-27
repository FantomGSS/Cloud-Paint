let sectionNamesWithTargetButtons = ["Tools", "Shapes"];

document.addEventListener("DOMContentLoaded", function () {
    let sections = document.getElementsByClassName("section");
    let iconButtons = [];

    for (let k = 0; k < sections.length; k++) {
        let sectionName = sections[k].querySelector(".section-name").textContent.trim();

        if(sectionNamesWithTargetButtons.includes(sectionName)) {
            iconButtons = iconButtons.concat([...sections[k].querySelectorAll(".icon-button")]);
        }
    }

    for (let i = 0; i < iconButtons.length; i++) {
        iconButtons[i].addEventListener("click", () => {
            let clickedButton = iconButtons[i];

            clickedButton.classList.add("target");

            for (let j = 0; j < iconButtons.length; j++) {
                if (clickedButton !== iconButtons[j]) {
                    iconButtons[j].classList.remove("target");
                }
            }
        });
    }

    let availableColors = document.getElementsByClassName("available-color-content");
    [...availableColors].forEach(availableColor => {
        availableColor.addEventListener("click", () => {
            document.getElementsByClassName("current-color-content")[0].style.backgroundColor = availableColor.style.backgroundColor;
        });
    });
});

function dropdownStroke() {
    document.getElementById("strokeDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.drop-button')) {
        document.getElementById("strokeDropdown").classList.remove("show");
    }
}

function choosePicture(path) {
    let canvas = document.getElementById('canvas');

    let picture = new Image();
    picture.src = path;
    picture.onload = function() {
        scaleToFit(canvas, picture);
    }
}

function scaleToFit(canvas, image) {
    let scale = Math.min(canvas.width / image.width, canvas.height / image.height);
    let x = (canvas.width / 2) - (image.width / 2) * scale;
    let y = (canvas.height / 2) - (image.height / 2) * scale;

    let context = canvas.getContext('2d');
    context.drawImage(image, x, y, image.width * scale, image.height * scale);
}

function newCanvas() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function savePicture(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'picture.png');

    let canvas = document.getElementById('canvas');
    let dataURL = canvas.toDataURL('image/png');

    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}
