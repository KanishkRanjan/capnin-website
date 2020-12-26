
const xhttp = new XMLHttpRequest();
const filterForm = document.querySelector(".filterOption");
const cards = document.querySelectorAll(".card");

function show(name){
    document.location = `/shop/${name}`;
}

filterForm.addEventListener("submit", e =>{
    e.preventDefault();
    let data = Object.fromEntries(new FormData(filterForm));
    let formData = search;
    data = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText !== ""){
                let response = JSON.parse(this.response);
                document.querySelector(".products").innerHTML = "";
                response.products.forEach(product => {  
                    let add = "" ;
                    let maxCost = Math.max(...product.productLinks.map(obj => obj.cost),0);     
                    if (maxCost != product.lowestCost ) add = `<p class="highestCost"> Rs.  ${maxCost} </p>`
                    document.querySelector(".products").innerHTML += 
                        `<div class="card">
                            <img src="${product.image_url}" alt="${ product.shortDescription } ">
                            <div class="detail"> 
                            <p class="title">${ product.name } </p>
                            <p class="information">
                                ${ product.shortDescription } 
                            </p>
                            <div class="costShower">
                                <p class="cost" style="font-size: 14px;font-weight: 500;">Rs. ${product.lowestCost }</p>${add}
                            </div>
                        </div>`;
                });  
            }
        }
    }
    if(formData !== ""){
        formData+="&"+data
    } else {
        formData+=data
    }
    console.log(formData);
    xhttp.open("POST", `/shop?${formData}`, true);
    xhttp.send();
});
