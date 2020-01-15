// get post function
function http() {
  return {
    get(url, callback) {
      try {
        let xml = new XMLHttpRequest();
        xml.open("GET" , url);
      
        xml.addEventListener('load', (e) => {
          if(Math.floor(xml.status / 100) !== 2) {
            callback(`Error!!! Status code: ${xml.status}`, xml)
            return;
          }
      
          let response = JSON.parse(xml.response);
          callback (null, response);
      })
      
        xml.addEventListener('error', (e) => {
          console.log(`Error: ${xml.statusText}`);
      })
      
        xml.send(); 
      } 
      catch (error) {
        callback(error);
      }
    },
    post(url, body, callback) {
      try {
        let xml = new XMLHttpRequest();
        xml.open("POST" , url);
      
        xml.addEventListener('load', (e) => {
          if(Math.floor(xml.status / 100) !== 2) {
            callback(`Error!!! Status code: ${xml.status}`, xml)
            return;
          }
      
          let response = JSON.parse(xml.response);
          callback (null, response);
      })
      
        xml.addEventListener('error', (e) => {
          console.log(`Error: ${xml.statusText}`);
      })
      
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.send(JSON.stringify(body)); 
      } 
      catch (error) {
        callback(error);
      }
    }
  }
};

// themes arr
let themes = {
  default: {
    "--main-bg-color" : "#fff",
    "--main-color": "rgb(194, 31, 31)",
    "--main-color-lighter": "rgb(194, 65, 65)",
    "--main-shadow-color": "rgba(39, 39, 39, 0.568)",
    "--header-text-color": "#fff"
  },
  dark: {
    "--main-bg-color" : "rgba(39, 39, 39, 1)",
    "--main-color": "rgb(140, 24, 24)",
    "--main-color-lighter": "rgb(182, 45, 45)",
    "--main-shadow-color": "rgba(212, 212, 212, 0.897)",
    "--header-text-color": "#fff"
  }
};

const myHttp = http();

  const newsService = (function() {
  const apiKey = "b1599beedfec43baaa1bed635b5ecd91";
  const url = "https://newsapi.org/v2";

  return {
    topHeadlines(country = ru, callback) {
      myHttp.get(`${url}/top-headlines?country=${country}&apiKey=${apiKey}`, callback);
    },
    everything(query, callback) {
      myHttp.get(`${url}/everything?q=${query}&apiKey=${apiKey}`, callback);
    }
  }
})();

//Elements
let ddSelect = document.querySelector('.header-dropdown__label');
let ddList = document.querySelector('.header-dropdown__list');
let ddItems = document.querySelectorAll('.header-dropdown__item');
let form = document.forms['form'];
let countrySelect = form.elements['country'];
let inputSearch = form.elements['search'];
let errWindow =document.querySelector('.error');

//Events
document.addEventListener('DOMContentLoaded', function() {
  loadNews();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
});

ddSelect.addEventListener('click', (e) => {
  ddList.classList.toggle('header-dropdown__list_active');
});

ddItems.forEach(item => {
  item.addEventListener('click', (e) => {
    let selectedTheme = themes[item.id];
    Object.entries(selectedTheme).forEach(([key,val]) => {
      document.documentElement.style.setProperty(key,val);
    })
    ddList.classList.toggle('header-dropdown__list_active');
  })
})



// Functions
function loadNews() {
  const country = countrySelect.value;
  const searchText = inputSearch.value;

  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse);
  }
  else {
    newsService.everything(searchText, onGetResponse);
  }
};

function onGetResponse(err, res) {
  renderNews(res.articles);
};

function renderNews(news) {
  let newsContainer = document.querySelector('.news-container .row');
  let fragment = "";
  news.forEach((item) => {
    let element = newsTemplate(item);
    fragment += element;
  })
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
};

function newsTemplate({urlToImage, title, url, description}) {
  return `
  <div class="col-6">
   <div class="news-card">
    <div class="news-card__image">
     <img src="${(urlToImage) || "http://gradportraits.com/wp-content/themes/belief/images/no.image.570x380.png"}">
     <div class="news-card__title">${(title) || ("")}</div>
    </div>
    <div class="news-card__content">
     <p>${(description) || ("")}</p>
    </div>
    <div class="news-card__button">
     <button class="main-form__button">
      <a target="_blank" href="${url}">Read more</a>
     </button>
    </div>
   </div>
  </div>
  `
};



