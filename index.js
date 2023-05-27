const coinsContainer = document.getElementById('coins');
const paginationContainer = document.getElementById('pagination');
const coinChartContainer = document.getElementById('chartModal');
const coinChart = document.getElementById('coinChart').getContext('2d');
const coinsPerPage = 10;
let currentPage = 1;
let selectedCoin = null;
let chart = null;

// Fetch data from CoinGecko API
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=30')
  .then(response => response.json())
  .then(data => {
    renderCoins(data);
    renderPagination(data);
  })
  .catch(error => console.log(error));

function openChartModal() {
  coinChartContainer.style.display = 'block';
  document.getElementById('modalCoinName').innerText = selectedCoin.name;
}


function renderChart() {
  if (selectedCoin) {
    // Fetch historical price data for selected coin (last 30 days)
    fetch(`https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart?vs_currency=usd&days=30`)
      .then(response => response.json())
      .then(data => {
        const coinPriceData = data.prices.map(price => price[1]);

        if (chart) {
          // Update existing chart
          chart.data.labels = Array.from({ length: coinPriceData.length }, (_, i) => i + 1);
          chart.data.datasets[0].data = coinPriceData;
          chart.update();
        } else {
          // Create new chart
          chart = new Chart(coinChart, {
            type: 'line',
            data: {
              labels: Array.from({ length: coinPriceData.length }, (_, i) => i + 1),
              datasets: [
                {
                  label: 'Price (USD)',
                  data: coinPriceData,
                  backgroundColor: 'rgba(90, 83, 110, 0.5)',
                  borderColor: 'rgba(90, 83, 110, 1)',
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false
                }
              }
            }
          });
        }
      })
      .catch(error => console.log(error));
  } else {
    coinChartContainer.style.display = 'none';
  }
}
function renderCoins(data) {
  coinsContainer.innerHTML = '';

  const startIndex = (currentPage - 1) * coinsPerPage;
  const endIndex = startIndex + coinsPerPage;

  data.slice(startIndex, endIndex).forEach(coin => {
    const coinRow = document.createElement('tr');

    const coinLogoCell = document.createElement('td');
    const coinImage = document.createElement('img');
    coinImage.className = 'coin-image';
    coinImage.src = coin.image;
    coinLogoCell.appendChild(coinImage);
    coinRow.appendChild(coinLogoCell);

    const coinNameCell = document.createElement('td');
    coinNameCell.innerText = coin.name;
    coinNameCell.addEventListener('click', () => {
      selectedCoin = coin;
      openChartModal();
      renderChart();
    });
    coinRow.appendChild(coinNameCell);

    const coinPriceCell = document.createElement('td');
    coinPriceCell.innerText = coin.current_price;
    coinRow.appendChild(coinPriceCell);

    const coinHighCell = document.createElement('td');
    coinHighCell.innerText = coin.high_24h;
    coinRow.appendChild(coinHighCell);

    const coinLowCell = document.createElement('td');
    coinLowCell.innerText = coin.low_24h;
    coinRow.appendChild(coinLowCell);

    coinsContainer.appendChild(coinRow);
  });
  renderPaginationButtons(totalPages);
}

function renderPagination(data) {
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(data.length / coinsPerPage);

  for (let i = 1; i <= totalPages; i++) {


    function renderPaginationButtons(totalPages) {
      paginationContainer.innerHTML = '';

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.className = `pagination-button ${currentPage === i ? 'active' : ''}`;
        button.addEventListener('click', () => {
          currentPage = i;
          renderCoins(data);
        });

        paginationContainer.appendChild(button);
      }
    }
    document.getElementById('closeModal').addEventListener('click', () => {
      coinChartContainer.style.display = 'none';
      selectedCoin = null;
    });
  }
}