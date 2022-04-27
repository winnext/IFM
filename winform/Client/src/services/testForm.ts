import axios from 'axios';

const url = process.env.REACT_APP_API_URL2 + 'test/';
// const url = "http://localhost:3002/";

const findAll = async () => {
  return axios.get(url);
};

const findOne = async (id: string) => {
  return axios.get(url + id);
};

const create = async (test: any) => {
  return axios.post(url, test);
};

const update = async (id: string, test: any) => {
  return axios.patch(url + id, test);
};

const remove = async (id: string) => {
  return axios.delete(url + id);
};

// const findAll = async () => {
//   return axios.get(url);
// };

// const create = async (form:any) => {
//   return axios.post(url, form);
// };

// const remove = async (id: string) => {
//   return axios.delete(url + id);
// };

// const update = async (id: string) => {
//   return axios.patch(url + "/" + id);
// };

const service = { findAll, create, remove, update,findOne };

export default service;

// const create = async (facility: Facility) => {
//   return axios.post(url, facility);
// };

// const update = async (id: string, facility: Facility) => {
//   return axios.patch(url + '/' + id, facility);
// };

// const remove = async (id: string) => {
//   return axios.delete(url + '/' + id);
// };
