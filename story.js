const scenes = document.querySelectorAll(".scene");

const continueButtons =
    document.querySelectorAll(".continue");

let currentScene = 0;


continueButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        scenes[currentScene].classList.remove("active");

        currentScene++;

        if (currentScene < scenes.length) {

            scenes[currentScene].classList.add("active");

        }

    });

});



/* FINAL ENTER NOVA BUTTON */

const enterNova =
    document.getElementById("enterNova");

enterNova.addEventListener("click", function() {

    window.location.href = "nova.html";

});