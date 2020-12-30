const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("weather.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
	const c1 = (orgVal.main.temp-273.1);
	const val = c1.toPrecision(3);

	const c2 = (orgVal.main.temp_min-273.1);
	const min = c2.toPrecision(4);

	const c3 = (orgVal.main.temp_max-273.1);
	const max = c3.toPrecision(4);

	let temperature = tempVal.replace("{%tempval%}", val);
	temperature = temperature.replace("{%tempmin%}", min);
	temperature = temperature.replace("{%tempmax%}", max);
	temperature = temperature.replace("{%location%}", orgVal.name);
	temperature = temperature.replace("{%country%}", orgVal.sys.country);
	temperature = temperature.replace("{%WeatherStatus%}", orgVal.weather[0].main);
	return temperature;
}
const server = http.createServer((req, res) => {
	if(req.url == "/"){
		 requests("http://api.openweathermap.org/data/2.5/weather?q=Jaunpur&appid=2a03b5a01c604feb06be79f682a94393")
		 .on("data", (chunk) =>{
		 	const objdata = JSON.parse(chunk)
		 	const arrData = [objdata];
		 	//console.log(arrData[0].main.temp);
		 	const realTimeData = arrData.map((val) =>
		 		//console.log(val.main);
		 		replaceVal(homeFile, val)).join("");
		 	res.write(realTimeData);
		 	//console.log(realTimeData);
		 })
		 .on("end", (err) =>{
		 	if(err) return console.log("Connection closed due to error", err);
		 	res.end();

		 	//console.log("end");
		 });

	}
});

server.listen (8000, "127.0.0.1");``