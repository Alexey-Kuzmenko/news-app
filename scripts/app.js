// * query function
function http() {
    return {
        get(url, callBack) {
            try {
                const request = new XMLHttpRequest()

                request.open('GET', url)

                request.addEventListener('load', () => {
                    if (Math.floor(request.status / 100) !== 2) {
                        // ? err maybe unnecessary variable
                        const err = request.status
                        callBack(err, request)
                        return
                    }
                    const response = JSON.parse(request.responseText)
                    callBack(null, response)
                })

                request.send()

            } catch (error) {
                callBack(error, request)
            }
        },
        post(url, body, headers, callBack) {
            try {
                const request = new XMLHttpRequest()

                request.open('POST', url)

                request.addEventListener('load', () => {
                    if (Math.floor(request.status / 100) !== 2) {
                        callBack(err, request)
                        return
                    }
                    const response = JSON.parse(request.responseText)
                    callBack(null, response)
                })

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        request.setRequestHeader(key, value)
                    })
                }

                request.send(JSON.stringify(body))

            } catch (error) {
                callBack(error)
            }
        }
    }
}

const httpModule = http()

// * news service
const newsService = (function () {
    const apiKey = '36d4a1e3f8fe4330990d73cec7c3e3d3'
    const apiUrl = 'https://newsapi.org/v2'

    return {
        topHeadLines(country = 'ua', callBack) {
            httpModule.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`, callBack)
        },
        everything(query, callBack) {
            httpModule.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, callBack)
        }
    }

})()

// * init select
document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit()
    loadNews()
})

// ! load news function
function loadNews() {
    newsService.topHeadLines('ua', onGetResponse)
}

// * function on get response from server 
function onGetResponse(err, response) {
    renderNews(response.articles)
}

function renderNews(news) {
    const newsContainer = document.querySelector('.grid-container')
    let fragment = ''

    news.forEach(newsItem => {
        const element = newsCardTemplate(newsItem)
        fragment += element
    })

    newsContainer.insertAdjacentHTML('afterbegin', fragment)
    console.log(fragment);

}

// *     news card template
function newsCardTemplate({ urlToImage, title, url, description }) {
    // console.log(newsItem);

    return `
        <div class="col s12">
            <div class="card">
                <div class="card-image">
                    <img src="${urlToImage}">
                    <span class="card-title">${title || ''}</span>
                </div>
                <div class="card-content">
                    <p>${description || ''}</p>
                </div>
                <div class="card-action">
                    <a href="${url}" >Read More</a>
                </div>
            </div>
        </div>
    `

}