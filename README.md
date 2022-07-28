# News App

## About

This project is a part of the JavaScript course. I was made this project to demonstrate my skills and knowledge of async JavaScript. But I have some problems with deploying this project. I use a free news API and basic plan, so I can't deploy my project on GitHub pages and make HTTPS queries (only through HTTP).

**So if you want to check my project, clone this repository and open `index.htm` in your browser or VScode with Live Server extension.**

## Versions

The first version of the News App you can find in master branch. Second version locate on develop branch. Both versions of an app made with Materialize framework: https://materializecss.com/

**Difference between versions:**

- Various methods of work with AJAX

  - In **`master`** to send requests, I use AJAX technology with **`XMLHttpRequest()`**
  - In the second version, I use **`async/await`** construction with **`fetch()`**

- I use a different API.
  - In the first example used **News API:** https://newsapi.org/
  - In the second example **Mediastack API:** https://mediastack.com/

## Examples

**First version:**

```JS
function http() {
    return {
        get(url, callBack) {
            try {
                const request = new XMLHttpRequest()

                request.open('GET', url)

                request.addEventListener('load', () => {
                    if (Math.floor(request.status / 100) !== 2) {
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
```

**`http()`** **is a function which executes a request to API**

The app looks like this:

![image](https://drive.google.com/uc?export=view&id=1vpS96NECZncUgD4Ft-PLm-yD_tOR6Z_c)

Error message:

![image](https://drive.google.com/uc?export=view&id=1MvpMtbNAMWsUZB_Cc_OG4qHHCkQcqbA-)

**Second version:**

```JS
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
```

**`http()`** **is a function which executes a request to API**

The app looks like this:

![image](https://drive.google.com/uc?export=view&id=1jSE9-Bc2Ce1ux4L9fGcSxnobv4DZj3DY)

Error message:

![image](https://drive.google.com/uc?export=view&id=1UDXLPvGnQqjWQ5RGNhnDEobQO_Xb5jCj)
