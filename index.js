let input = document.querySelector("#input")
let btn = document.querySelector("#btn")
let numarr = []
let mainarr = []
let newarr =[]
let chart = document.querySelector("#linechart_material")
btn.addEventListener("click", async () => {
    chart.style.display = "grid"
    const dadada =await input.value
    const datad = dadada.toLowerCase()
    let linkapi = `https://api.coingecko.com/api/v3/coins/${datad}/market_chart?vs_currency=inr&days=30&interval=daily`
    const ingo = await fetch(linkapi)
    const convert = await ingo.json()
    let no
    for (let i = 0; i < 30; i++) {
        no= i
        let to = Math.round(convert.prices[i][1])
        numarr.push(no)
        mainarr.push(to)
    }
    for(let j=0;j<30;j++){
        arrne = [numarr[j],mainarr[j]]
        newarr.push(arrne)
    }
    console.log(newarr)
    google.charts.load('current',  {packages:['corechart', 'line']});
    google.charts.setOnLoadCallback(drawChart);

    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Day');
    data.addColumn('number', 'price in last 30 days');
   
    data.addRows(newarr);

    var options = {
      chart: {
        title: 'crypto price chart',
        subtitle: 'up and down of crypto'
      },
      width: 800,
      height: 500
    };

    var chart = new google.charts.Line(document.getElementById('linechart_material'));

    chart.draw(data, google.charts.Line.convertOptions(options));
  }
})
let linkapi = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false"

//data to show the list
async function preload() {
    const data = await fetch(linkapi)
    const convert = await data.json()
    for (let i = 0; i < 75; i++) {
        const current_price = convert[i]['current_price']
        const price_change_percentage_24h = convert[i]['price_change_percentage_24h']
        const market_cap = convert[i]['market_cap']
        const name = convert[i]['name']
        const ath = convert[i]['ath']
        const image = convert[i]['image']
        /*opend.push(opened)
        low.push(low_at)
        high.push(high_at)*/
        const div = document.getElementsByClassName("preload")[0]
        let htmlcon = document.createElement("div")
        htmlcon.setAttribute("class", "danger")
        let intohtml = `<div class="sfori" >
        <img class="dataimg" src="${image}" alt="">
        </div>
        <p>name- <br>${name}</p>
        <p>market cap- <br>${market_cap}</p>
        <p>price change- <br> ${price_change_percentage_24h}</p>
        <p>current price rs- <br> ${current_price}</p>
        <p>ath- <br> ${ath}</p>
        `
        htmlcon.innerHTML = intohtml
        div.appendChild(htmlcon)
    }
}
preload()
