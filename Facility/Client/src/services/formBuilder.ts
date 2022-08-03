import axios, { AxiosRequestConfig } from "axios";

const url = process.env.REACT_APP_API_URL2 + "type/properties/";


const getActivePropertiesWithKey = async (key: string) => {
  return axios.get(url + "active/" + "nodes/" + key);
};

let conf: AxiosRequestConfig = {};

    conf.validateStatus = (status: number) => {
        
        return (status >= 200 && status < 300) || status == 404
    }


const getPassivePropertiesWithKey = async (key: string) => {
  return axios.get(url + "passive/" + "nodes/" + key,conf);
};


const service = { getActivePropertiesWithKey, getPassivePropertiesWithKey };

export default service;


