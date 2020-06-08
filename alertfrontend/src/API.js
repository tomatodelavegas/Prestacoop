import axios from 'axios';
import backendConf from './config';

const backendurl = `http://${backendConf.PCOP_BACKEND_HOST_NAME}:${backendConf.PCOP_BACKEND_PORT}`;
console.log(`Backend endpoint: ${backendurl}`);

export default axios.create({
    baseURL: `${backendurl}`
});