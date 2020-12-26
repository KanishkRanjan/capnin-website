console.log("hi")
const el = document.querySelector(".cards");
const card = document.querySelector(".card");
let elwidth = el.offsetWidth;

let toScroll = window.innerWidth;
let cardWidth = card.offsetWidth;

function moveRight(){
    el.scrollLeft += el.offsetWidth;
}

function moveLeft(){
    el.scrollLeft -= el.offsetWidth;
}
