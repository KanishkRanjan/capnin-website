const seletivelyImage = document.querySelector(".seletivelyImage");

let onImage = 0;

function showInLarge(id){
    try{
        let element = document.getElementById(id);
        let selectImage = document.querySelector(".selectImage");
        if(element.children[0].src !== selectImage.children[0].src && id >= 0){
            selectImage.children[0].src = element.children[0].src ;
        }
        onImage = parseInt(id);
    } catch{
        onImage = 0    
    }
}


function show(name){
    document.location = `/shop/${name}`;
}

window.addEventListener('load', function(){

    document.querySelector('.custom-select-wrapper').addEventListener('click', function() {
        this.querySelector('.custom-select').classList.toggle('open');
    })

    document.querySelector(".selectImage").addEventListener('touchend', function(event){
            let centerOfScroller = document.querySelector(".selectImage").offsetWidth/2
            if(event.changedTouches[0].clientX > centerOfScroller){
                onImage+= 1
                showInLarge(onImage)
                
            } else{
                onImage-= 1
                showInLarge(onImage)
            }
        }, false)
    for (const option of document.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function() {
            if (!this.classList.contains('selected')) {
                this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                this.classList.add('selected');
                let productCost = this.getAttribute("product-cost");
                document.querySelector('.currentPrice').textContent ="Rs. "+productCost;
                this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
            if( parseInt(lowestCost) !=  parseInt(productCost)){
                    document.querySelector('.currentPrice').style.color = "#990000";
                    document.querySelector('.alert-information').innerHTML = `Buy at lowest cost from ${cheaperWebsite}`;
                }
                else{ 
                    document.querySelector('.currentPrice').style.color = "#000" ;
                    document.querySelector('.alert-information').innerHTML = ""
                }
            }
        })
    }


    document.querySelector("#buynow").addEventListener("click",()=>{

        window.open(document.querySelector(".selected").getAttribute("url-to-product"), '_blank');
    });

});