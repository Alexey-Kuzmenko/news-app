// * form elements
const form = document.forms['newsControls']
const countrySelect = form.elements['country']
const categorySelect = form.elements['category']
const formInput = form.elements['search']

form.addEventListener('submit', (e) => {
    e.preventDefault()
    loadNews()
})

// * init materialize select
document.addEventListener('DOMContentLoaded', () => {
    M.AutoInit()
    loadNews()
})

// * query module
function http() {
    return {
        async get(url) {
            try {
                const response = await fetch(url)
                if (response.ok) {
                    const responseData = await response.json()
                    return responseData
                } else {
                    return Promise.reject(response.status)
                }
            } catch (error) {
                return error
            }
        },
        async post(url, body, headers) {

            let requestHeaders;

            if (headers) {
                requestHeaders = Object.entries(headers)
                    .reduce((acc, [key, value]) => {
                        acc[key] = value
                        return acc
                    }, {})
            }

            try {
                const response = await fetch(url, {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: requestHeaders
                })

                if (response.ok) {
                    const responseData = await response.json()
                    return responseData
                } else {
                    return Promise.reject(response.status)
                }
            } catch (error) {
                return error
            }
        }
    }
}

// * init query module
const httpModule = http()

// ! api service
const newsService = (function () {
    const apiKey = '128cd5fd23589a30514e522219dcdfcc'
    const apiUrl = 'http://api.mediastack.com/v1'

    return {
        topHeadLines(country = 'ua', category = 'general') {
            return httpModule.get(`${apiUrl}/news?access_key=${apiKey}&countries=${country}&categories=${category}`)
        },
        everything(query) {
            return httpModule.get(`${apiUrl}/news?access_key=${apiKey}&keywords=${query}`)
        }

    }
})()

// ! load news function
function loadNews() {
    showLoader()
    const country = countrySelect.value
    const category = categorySelect.value
    const searchQuery = formInput.value

    if (!searchQuery) {
        newsService.topHeadLines(country, category)
            .then(data => { onGetResponse(data) })
    } else {
        newsService.everything(searchQuery)
            .then(data => { onGetResponse(data) })
    }
}

function onGetResponse(response) {
    console.log(response)
    if (response) {
        removeLoader()
        checkNewsCover(response.data)
        form.reset()
    }

    if (response.data.lenght === 0) {
        return
    }

    renderNews(response.data)

}

// * function wich check response from server
function checkNewsCover(newsArr) {
    newsArr.forEach(newsItem => {
        if (newsItem.image === null) {
            newsItem.image = 'https://s3.envato.com/files/260793375/Preview.jpg'
        }
    })
}


// ! render news function
function renderNews(news) {
    let fragment = '';

    const newsContainer = document.querySelector('.grid-container')
    if (newsContainer.children.length) {
        clearContainer(newsContainer)
    }

    news.forEach(newsObj => {
        const element = newsCardTemplate(newsObj)
        fragment += element
    })

    newsContainer.insertAdjacentHTML('afterbegin', fragment)

}

function newsCardTemplate({ image, title, url, description }) {
    return `
        <div class="col s12">
            <div class="card">
                <div class="card-image">
                    <img src="${image}">
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

// * function which clear container 
function clearContainer(container) {
    container.innerHTML = ''
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