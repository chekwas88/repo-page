const hamburgerDiv = document.getElementById('burgerdiv');
const hamburger = document.getElementById('hamburger');
const navBar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    navBar.classList.toggle('nav-show');
});
