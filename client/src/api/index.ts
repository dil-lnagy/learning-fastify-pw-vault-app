import axios from "axios";

const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const vaultBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/vaults`;

export function registerUser(payload: {
  email: string;
  hashedPassword: string;
}) {
  return axios
    .post<{ salt: string; vault: string }>(userBase, payload, {
      withCredentials: true, // withCredentials: true => is used to send cookies along with the request
    })
    .then((res) => res.data);
}

export function loginUser(payload: { email: string; hashedPassword: string }) {
  return axios
    .post<{ salt: string; vault: string }>(`${userBase}/login`, payload, {
      withCredentials: true, // withCredentials: true => is used to send cookies along with the request
    })
    .then((res) => res.data);
}

export function saveVault({ encryptedVault }: { encryptedVault: string }) {
  return axios
    .put(vaultBase, { encryptedVault }, { withCredentials: true })
    .then((res) => res.data);
}
