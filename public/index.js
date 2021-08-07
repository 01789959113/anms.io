console.log("this is");

// setting sticky navbar
let navbar = document.getElementById("navbar");

window.onscroll = function () {
    myFunction();
};

function myFunction() {
    if (window.scrollY > 0) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}

// navbar color
let navbar_toggler = document.querySelector(".navbar-toggler");
navbar_toggler.addEventListener("click", () => {
    navbar.style.backgroundColor = "#212529";
    console.log("added color");
});
