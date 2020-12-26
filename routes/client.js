const express = require('express')
const router = express.Router()
const products = require('../models/productSchema')

const { filter ,recommended,manageResult,getSitemapXml}= require("./util")


router.get("/", async(req,res)=>{
    const result = await products.find().sort({"date":-1}).limit(20);
    res.render('client/index.ejs',{products:result,metaTags:true,productInformation:{searchKeyWord:["kanishk","kumar","ranjan"],shortDescription:"This is a deal to be to save your alot money by comparing all the website at once the by on this"}})
});


router.get('/shop/:name' , async(req,res)=>{
    let result = await products.findOne({name:req.params.name});
    req.query.name = req.params.name;
    req.query.date = {"$gte":parseInt(result.date)}
    let recommend  = await recommended(req.query,result.searchKeyWord);
    if(recommend.length == 0 ) recommend = await recommended(req.query,"",0,8);
    delete req.query.date;
    if(recommend.length < 8) await recommended(req.query,"",recommend.length+1,(8-recommend.length)).then(result => result.forEach( product => recommend.push(product)));
    res.render("client/product.ejs",{recommended:recommend,productInformation:result,metaTags:true})
});

router.get('/shop' , async(req,res)=>{
    let query = filter(req.query);
    let result = await manageResult(query,req.query);
    res.render('client/shop.ejs',{products:result,search:req.query.search && req.query.search != ""?req.query.search:""});
});

router.post('/shop' , async(req,res)=>{
    let query = filter(req.query);
    if(req.query.search != "") query.searchKeyWord = { "$in" :req.query.search}
    let result = await manageResult(query,req.query,req.query.till);
    res.send({products:result,search:req.query.search && req.query.search != ""?req.query.search:""});
});


router.get('/product.xml' , async(req,res)=>{
    const productArray = await products.find().select('name -_id');
    console.log(getSitemapXml(productArray))
    res.set('Content-Type', 'text/xml')
    res.send(getSitemapXml(productArray))
})

module.exports = router;
