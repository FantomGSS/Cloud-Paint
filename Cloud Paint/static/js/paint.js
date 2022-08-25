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
        })
    }
});

function dropdownStroke() {
    document.getElementById("strokeDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.drop-button')) {
        document.getElementById("strokeDropdown").classList.remove("show");
    }
}
