const express=require("express");
const app =express();
const lport=3000;
const path=require("path");
const bodyParser=require("body-parser");


//
const fetch = require('node-fetch');
  
//ejs layout npm
const ejsMate=require("ejs-mate");
const { get } = require("http");
app.engine('ejs',ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+'/public'));



/*VARIABLES DECELARTION START */

    

/*VARIABLES DECELARTION END */
 



app.post("/search", async (req,res)=>{
    
    
    let city1=req.body.city;
    let temp1,country1,status1,humidity1,pressure1,wind1,cloud1;
let templ=[];
    let statusl=[];
    let timel=[];
    let time0l=[];



   await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city1}&appid=9cfbcc0671fdbffd8f2280c82cfce2be`)
    .then(res => res.text())
    .then(text =>{
        const objdata0=JSON.parse(text);
        const arrdata1=[objdata0];
         temp1 =Math.round((arrdata1[0].main.temp)-273.15);
         
         country1 =arrdata1[0].sys.country;
         status1 = arrdata1[0].weather[0].main;
         humidity1=arrdata1[0].main.humidity;
         pressure1=arrdata1[0].main.pressure;
         wind1=arrdata1[0].wind.speed;
         
         cloud1=arrdata1[0].clouds.all;
         

        })



       await  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city1}&appid=9cfbcc0671fdbffd8f2280c82cfce2be`)
         .then(res => res.text())
         .then(text =>{
             const objdata2=JSON.parse(text);
             const arrdata_daily1=[objdata2]; 
             for (let i = 0; i <=3; i++) {
                 templ[i]=Math.round((arrdata_daily1[0].list[i].main.temp)-273.15);
                 statusl[i]=arrdata_daily1[0].list[i].weather[0].main;
                 timel[i]=(arrdata_daily1[0].list[i].dt_txt).slice(11,13);
                 time0l[i]=convert_time(timel[i]);
                 
             }
     
         })
        

         res.render("search",{temp1,city1,country1,status1,statusl,time0l,cloud1,humidity1,wind1,templ});
         console.log(temp1,city1,country1,status1);
})

app.get("/",async (req,res)=>{
    let temp,city,country,status,humidity,pressure,wind,clouds;
let temp0=[];
    let status0=[];
    let time=[];
    let time0=[];
     /*FETCH CITY*/
     let currentcity;
     await fetch("https://ipinfo.io/json")
     .then(res => res.json())
    .then(json => { 
        currentcity=json.city;
        
    });
    console.log(currentcity)
     

   await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${currentcity}&appid=9cfbcc0671fdbffd8f2280c82cfce2be`)
    .then(res => res.text())
    .then(text =>{
        const objdata=JSON.parse(text);
        const arrdata=[objdata];
         temp =Math.round((arrdata[0].main.temp)-273.15);
         city=arrdata[0].name;
         country =arrdata[0].sys.country;
         status = arrdata[0].weather[0].main;
         humidity=arrdata[0].main.humidity;
         pressure=arrdata[0].main.pressure;
         wind=arrdata[0].wind.speed;
         
         clouds=arrdata[0].clouds.all;

         
         
         
        
    })
     
      

  await  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${currentcity}&appid=9cfbcc0671fdbffd8f2280c82cfce2be`)
    .then(res => res.text())
    .then(text =>{
        const objdata1=JSON.parse(text);
        const arrdata_daily=[objdata1]; 
        for (let i = 0; i <=3; i++) {
            temp0[i]=Math.round((arrdata_daily[0].list[i].main.temp)-273.15);
            status0[i]=arrdata_daily[0].list[i].weather[0].main;
            time[i]=(arrdata_daily[0].list[i].dt_txt).slice(11,13);
            time0[i]=convert_time(time[i]);
            
        }

    })
   


    
     
         res.render("home",{temp,city,country,status,temp0,status0,time0,clouds,humidity,wind});
         console.log(temp+"  "+city+"  "+country+"  "+status)
         
        
});

app.use((req,res)=>{
    res.render('404');
});



app.listen(lport,()=>{
    console.log("App listening on "+lport);
})




                                    //functions

function convert_time(time){
    if(time<12 && time!=00){
        time=time+"AM";
    }
    else if(time==12){
     time=time+"PM";
    }
    else if(time==00){
        time=12+"AM";
    }
   
    else{
        time=(time-12)+"PM";
    }
    return time;
}

