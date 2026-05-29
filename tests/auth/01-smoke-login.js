import { login } from '../../helpers/auth.js';

export const options = {
  vus: 1,
  iterations: 1
};

export default function () {
  login();
}