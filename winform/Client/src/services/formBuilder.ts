import axios from "axios";

const url = process.env.REACT_APP_API_URL2 + "type/properties/";
// const url = "http://localhost:3002/";


const findAll = async () => {
  return axios.get(url);
};

// const findOne = async () => {
//   return axios.get(url + id);
// };

const create = async (form:any) => {
  return axios.post(url, form);
};

const update = async (id: string) => {
  return axios.patch(url + "/" + id);
};

const remove = async (id: string) => {
  return axios.delete(url + id);
};




const service = { findAll, create, remove,update};

export default service;


