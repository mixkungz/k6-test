import http from 'k6/http';
import {check, group, sleep} from 'k6';

export let options = {
  stages: [
    { duration: "1m", target: 100 },
    { duration: "30s", target: 100 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  }
};

const BASE_URL = 'https://test-api.k6.io'; 
const USERNAME = 'TestUser';
const PASSWORD = 'SuperCroc2020';

export default () => {
  let loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
    username: USERNAME,
    password: PASSWORD
  });  

  check(loginRes, { 'logged in successfully': (resp) => resp.json('access') !== '' });

  let authHeaders = { headers: {
    Authorization: `Bearer ${loginRes.json('access')}`
  }};

  let myObjects = http.get(`${BASE_URL}/my/crocodiles/`, authHeaders).json();
  check(myObjects, { 'retrieved crocodiles': (obj) => obj.length > 0 });

  sleep(1);
}
