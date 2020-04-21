import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '30s',
  max: 200
};

export default function() {
  http.get('http://test.k6.io');
  sleep(1);
}
