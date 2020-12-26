
function makeStorable(data){
    let dataHolder = [];
    let editable = data.productLinks;
    data.productLinks.split(',').forEach(element =>{
        let splitedData = element.split('(c)'); //Spliting the cost then selecting price
        let wesiteLocation = splitedData[0].split('(s)')
        wesiteLocation.forEach(ele =>{ 
                splitedData.push(ele);
            });
        splitedData.shift(0);
        dataHolder.push({
            cost:parseInt(splitedData[0]),
            website:splitedData[1],
            link:splitedData[2],
            default:editable    
        });
    });
    return dataHolder;
}

const products = require('../models/productSchema')

function readable(data){
    let productLinker =makeStorable(data);
    return new Object({
        image_url:data.imageUrls.split(','),
        name:data.name.trim(),
        shortDescription:data.shortDescription,
        searchKeyWord:data.searchKeyWord.trim().toLowerCase().split(','),
        description:data.description,
        productLinks:productLinker,
        date:Date.now(),
        lowestCost: Math.min.apply(null,productLinker.map(item => {   
            return item.cost;
        }))
    });
}


// CodeForClient
function filter(data){
    let final = {};
    final.lowestCost = {$gte:0}
    if(data.min != "" && data.min){
        final.lowestCost = {$gte:parseInt(data.min)};
    }
    if(data.max != "" && data.max){
        if(Object.keys(final.lowestCost).length >0) {
            final.lowestCost['$lte'] = parseInt(data.max);
        } else {
            final.lowestCost = {$lte:parseInt(data.min)};
        }
    }
    return  final;
}

async function recommended(query,searchKeyWord = "",till =0,limit = 8){
    let obj = Object.assign({}, query);
    if(searchKeyWord !== "")obj.searchKeyWord = { "$in" :searchKeyWord};
    obj.name =  {$ne: obj.name};
    let result =  await products.find(obj).skip(parseInt(till)).sort({"date":-1}).limit(parseInt(limit));
    return result
}


async function manageResult(query,url,till = 0){
    var result = [];
    var req = {query:url};
    if(req.query.search && req.query.search != "") {
        query.name = req.query.search;
        await products.findOne(query).then(async data =>{
            if(data != null){        
                result.push(data);
                await recommended(query,data.searchKeyWord,till).then(products => {
                    products.forEach(product =>{
                        result.push(product);
                    })
                });
            }else{
                await recommended(query,query.name,till).then(product => result.push(product));
                result = result[0];
            }
        });
    } else {
        result = await products.find(query).skip(parseInt(till)).sort({"date":-1}).limit(20);
    }
    return result;
}

function dateInyyyymmdd(){
    const today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    return yyyy+'-'+mm+'-'+dd;
}

function getSitemapXml(datas){
    let jsonxml = require('jsontoxml');
    jsonData = [];
    datas.forEach(data =>{
       jsonData.push({url:[{
                    name:"loc",
                    text:`http://127.0.0.1/shop/${data.name}`
                },
                {
                    name: "lastmod",
                    text: dateInyyyymmdd()
                },
                {
                    name: "changefreq",
                    text: "monthly"
                },
                {
                    name: "priority",
                    text: 0.7
                }
            ]
        })
    })

    return `<?xml version="1.0" encoding="UTF-8"?>`+jsonxml(
        [{
            name:"urlset",
            attrs:{
                xmlns:"http://www.sitemaps.org/schemas/sitemap/0.9"
            },
            children:jsonData
        }]
    )

}

module.exports = {
    makeStorable:makeStorable,
    readable:readable,
    filter:filter,
    recommended:recommended,
    manageResult:manageResult,
    dateInyyyymmdd:dateInyyyymmdd,
    getSitemapXml:getSitemapXml

}
