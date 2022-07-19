import axios from "axios";

const url = process.env.REACT_APP_API_URL + "type/properties/";

const findAll = async () => {
  return axios.get(url);
};

const getProperties = async (id: string) => {
  return axios.get(url + id);
};

const getPropertiesWithName = async (name: string) => {
  return axios.get(url + "active/" + "name/" + name);
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




const service = { findAll, getProperties, getPropertiesWithName, create, remove, update };

export default service;


