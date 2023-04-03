import axios from 'axios';

/**
 * 매개변수로 받은 url의 응답의 data를 가져와 반환한다.
 * @param url
 * @returns
 */
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);
export default fetcher;
