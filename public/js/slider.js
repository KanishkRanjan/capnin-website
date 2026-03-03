const cardsContainer = document.querySelector('.cards');

document.querySelector(".moveLeft").addEventListener("click", () => {
    // Assuming a card width + gap is roughly 300px, scroll by that amount
    cardsContainer.scrollBy({
        left: -330, // Adjust this amount based on card width
        behavior: 'smooth'
    });
});

document.querySelector(".moveRight").addEventListener("click", () => {
    cardsContainer.scrollBy({
        left: 330, // Adjust this amount based on card width
        behavior: 'smooth'
    });
});

function show(name){
    document.location = `/shop/${name}`;
}

// Hero Slider functionality
const heroSlides = [
    {
        title: "CloudeyStyles.",
        subtitle: "Discover our wide ranging and timeless of lifestyle products. Pick your favourite stuff that matches your personal taste, style and suits your style.",
        image: "hero_bg_rounded.png"
    },
    {
        title: "Modern Tailoring.",
        subtitle: "Experience the perfect fit. Our tailored suits and blazers are designed to provide both comfort and a sharp, sophisticated silhouette for any occasion.",
        image: "hero_bg_rounded_2.png"
    },
    {
        title: "Luxe Footwear.",
        subtitle: "Step into elegance with our premium collection of leather shoes and accessories, meticulously crafted for the modern individual.",
        image: "hero_bg_rounded_3.png"
    }
];

let currentHeroSlide = 0;
const heroTitle = document.querySelector('.showcase h1');
const heroSubtitle = document.querySelector('.showcase span');
const showcase = document.querySelector('.showcase');
const heroBtns = document.querySelectorAll('.showcase-controls .ctrl-btn');

const heroContent = document.querySelector('.showcase-content');

function updateHeroSlide() {
    // 1. Fade out / Reset animation state
    showcase.style.transition = "background-image 0.4s ease-in-out";
    heroContent.classList.remove('fade-in-anim');
    
    // Force a reflow so the browser registers the removal before we add it back
    void heroContent.offsetWidth; 

    // 2. Update content
    const slide = heroSlides[currentHeroSlide];
    heroTitle.textContent = slide.title;
    heroSubtitle.textContent = slide.subtitle;
    showcase.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%), url("../assert/${slide.image}")`;
    showcase.style.backgroundSize = "cover";
    showcase.style.backgroundPosition = "center";

    // 3. Trigger fade in
    heroContent.classList.add('fade-in-anim');
}

if(heroBtns.length === 2) {
    heroBtns[0].addEventListener('click', () => {
        currentHeroSlide = (currentHeroSlide === 0) ? heroSlides.length - 1 : currentHeroSlide - 1;
        updateHeroSlide();
    });

    heroBtns[1].addEventListener('click', () => {
        currentHeroSlide = (currentHeroSlide === heroSlides.length - 1) ? 0 : currentHeroSlide + 1;
        updateHeroSlide();
    });
}

