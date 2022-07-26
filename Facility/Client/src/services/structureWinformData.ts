import axios from "axios";

const url = process.env.REACT_APP_API_URL + "structureWinformDataOperation/";

interface FormInterface {
    
}


const findForm = async (key: string) => {
    return axios.get(url + key);
};

const createFormData = async (key: string, formData: FormInterface) => {
    console.log(formData);
    
    return axios.post(url + key, formData);
};

const removeForm = async (key: string, referenceKey: string) => {
    return axios.delete(url + key + "/" + referenceKey);
};

const service = { findForm, createFormData, removeForm };

export default service;
