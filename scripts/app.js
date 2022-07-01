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

// ! news service
const newsService = (function () {
    const apiKey = '36d4a1e3f8fe4330990d73cec7c3e3d3'
    const apiUrl = 'https://newsapi.org/v2'

    return {
        topHeadLines(country = 'ua', category = 'general', callBack) {
            httpModule.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, callBack)
        },
        everything(query, callBack) {
            httpModule.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, callBack)
        }
    }

})()

// * form elements
const form = document.forms['newsControls']
const countrySelect = form.elements['country']
const categorySelect = form.elements['category']
const formInput = form.elements['search']

form.addEventListener('submit', (e) => {
    e.preventDefault()
    loadNews()
})

// * init select
document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit()
    loadNews()
})

// ! load news function
function loadNews() {
    showLoader()
    const country = countrySelect.value
    const searchText = formInput.value
    const category = categorySelect.value

    if (!searchText) {
        newsService.topHeadLines(country, category, onGetResponse)
    } else {
        newsService.everything(searchText, onGetResponse)
    }
}

// * function on get response from server 
function onGetResponse(err, response) {
    if (response) {
        removeLoader()
        checkNewsCover(response.articles)
        form.reset()

    }
    if (err) {
        showAlert(err, 'error-msg')
        return
    }
    if (response.articles.lenght === 0) {
        return
    }

    renderNews(response.articles)
}

// * function wich check response from server
function checkNewsCover(newsArr) {
    newsArr.forEach(newsItem => {
        if (newsItem.urlToImage === null) {
            newsItem.urlToImage = 'https://s3.envato.com/files/260793375/Preview.jpg'
        }
    })
}

// * render news function 
function renderNews(news) {
    const newsContainer = document.querySelector('.grid-container')
    if (newsContainer.children.length) {
        clearContainer(newsContainer)
    }
    let fragment = ''

    news.forEach(newsItem => {
        const element = newsCardTemplate(newsItem)
        fragment += element
    })

    newsContainer.insertAdjacentHTML('afterbegin', fragment)

}

// * news card template
function newsCardTemplate({ urlToImage, title, url, description }) {
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

// * function clear news container
function clearContainer(container) {
    container.innerHTML = ''
}

// * show alerts function
function showAlert(message, type = 'success') {
    M.toast({ html: `Error status code: ${message}`, classes: type })
}

// * show preloader function
function showLoader() {
    document.body.insertAdjacentHTML('afterbegin',
        `<div class="progress">
            <div class="indeterminate"></div>
        </div>`
    )
}

// * remove preloader function
function removeLoader() {
    const loader = document.querySelector('.progress')
    if (loader) {
        loader.remove()
    }
}
