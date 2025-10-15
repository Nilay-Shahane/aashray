const axios = require("axios");


let locnDecoder = async (gmap)=>{
    let response = await axios.get(gmap,{
        maxRedirects:5
    })
    let url =response.request.res.responseUrl
    let abc = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    console.log(abc)
    return abc
}

module.exports={locnDecoder}