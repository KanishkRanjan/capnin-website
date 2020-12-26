const cardContainer = document.querySelector('.cards');
var scrolled = 0;
const sliderWidth = document.querySelector(".cards").offsetWidth
console.log()
document.querySelector(".moveLeft").addEventListener("click",()=>{
    let scrolledWidth = document.querySelector(".cards").offsetWidth-(document.querySelector(".cards").offsetWidth-~~(document.querySelector(".cards").offsetWidth/280)*280) 
    if (scrolled >= 0){
        document.querySelector(".cards").scrollTo({
        top:0,
        left:scrolled-scrolledWidth,
        behavior: 'smooth'
        });
        scrolled-=scrolledWidth;
    } else {
        scrolled = 0;
    }
})

document.querySelector(".moveRight").addEventListener("click",()=>{
    let scrolledWidth = document.querySelector(".cards").offsetWidth-(document.querySelector(".cards").offsetWidth-~~(document.querySelector(".cards").offsetWidth/280)*280) 
    if(scrolled <= (~~(document.querySelectorAll('.card').length)*280) ){
        document.querySelector(".cards").scrollTo({
            top:0,
            left:scrolled+scrolledWidth,
            behavior: 'smooth'
            });
        scrolled+=scrolledWidth;
    }
});

function show(name){
    document.location = `/shop/${name}`;
}
