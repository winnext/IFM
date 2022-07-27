import axios, { AxiosRequestConfig } from "axios";

const url = process.env.REACT_APP_API_URL + "structureWinformDataOperation/";

interface FormInterface {
    
}

const createFormData = async (key: string, formData: FormInterface) => {

    return axios.post(url + key, formData);
};

let conf: AxiosRequestConfig = {};

    conf.validateStatus = (status: number) => {
        
        return (status >= 200 && status < 300) || status == 404
    }

const getFormData = async (key: string) => {

    return axios.get(url + key, conf);
};

const updateFormData = async (key: string, formData: FormInterface) => {

    return axios.patch(url + key, formData);
};

const service = { createFormData, getFormData, updateFormData};

export default service;
