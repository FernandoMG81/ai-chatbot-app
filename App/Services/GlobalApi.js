import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api//bardapi'

const getBardApi = (useMsg) => axios.get(BASE_URL + '?ques=' + useMsg)

export default {
  getBardApi
}
