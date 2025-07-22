import { api } from "./axios-config";
import { URLs } from "./constants";

export const AccountCreation = {
  register: async (payload) => {
    const response = await api.post(`${URLs.users.register}`, payload);
    return response;
  },
};
export const AccountLogin = {
  login: async (payload) => {
    const response = await api.post(`${URLs.users.login}`, payload);
    return response;
  },
};
export const SecurityFeatures = {
  EmailChecker: async (payload) => {
    const response = await api.post(`${URLs.features.EmailChecker}`, payload);
    return response;
  },
  suggestPassword: async (payload) => {
    const response = await api.post(
      `${URLs.features.passwordGenerator}`,
      payload
    );
    return response;
  },
  getPasswords: async (payload) => {
    const response = await api.get(
      `${URLs.features.getPasswords}?email=${payload.email}`
    );
    return response;
  },
  checkURL: async (payload) => {
    const response = await api.post(`${URLs.features.urlcheck}`, payload);
    return response;
  },
};

