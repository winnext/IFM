import axios from "axios";

const url = process.env.REACT_APP_API_URL + "structureWinformDataOperation/";

interface FormInterface {
    
}

const createFormData = async (key: string, formData: FormInterface) => {

    return axios.post(url + key, formData);
};

const getFormData = async (key: string) => {

    return axios.get(url + key);
};


const service = { createFormData, getFormData};

export default service;
