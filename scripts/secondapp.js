// * form elements
const form = document.forms['newsControls']
const countrySelect = form.elements['country']
const categorySelect = form.elements['category']
const formInput = form.elements['search']

// * init materialize select
document.addEventListener('DOMContentLoaded', () => {
    M.AutoInit()
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
        topHeadLines(country = 'ua') {
            return httpModule.get(`${apiUrl}/news?access_key=${apiKey}&countries=${country}`)
        },
        everything(query) {
            return httpModule.get(`${apiUrl}/news?access_key=${apiKey}&keywords=${query}`)
        }

    }
})()

// ! testing api servise
newsService.topHeadLines().then(response => console.log(response))