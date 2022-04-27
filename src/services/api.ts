import axios from 'axios'

const api = axios.create({
    baseURL: 'http://11.2.0.36:3333',

})

export {api} ;