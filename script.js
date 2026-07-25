let geld = 0;

const geldAnzeige = document.getElementById("money");
const donerButton = document.getElementById("donerButton");

donerButton.addEventListener("click", () => {
    geld++;
    geldAnzeige.textContent = geld + " €";
});
