import axios from "axios";

const url = "http://localhost:3005/" + "createdata/";
const url2 = "http://localhost:3005/" + "getdata/";
// const url = "http://localhost:3002/";


const findAll = async () => {
  return axios.get(url);
};

const getData = async (id: string) => {
  return axios.get(url2 + id);
};

const create = async (form: any) => {
  return axios.post(url, form);
};

const update = async (id: string) => {
  return axios.patch(url + "/" + id);
};

const remove = async (id: string) => {
  return axios.delete(url + id);
};




const service = { findAll, getData, create, remove, update };

export default service;

