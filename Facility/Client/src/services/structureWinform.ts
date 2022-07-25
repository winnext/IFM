import axios from "axios";

const url = process.env.REACT_APP_API_URL + "structureWinformRelation/";

interface FormInterface {
    formKey: string;
}


const findForm = async (key: string) => {
    return axios.get(url + key);
};

const createForm = async (key: string, form: FormInterface) => {

    return axios.post(url + key, form);
};

const removeForm = async (key: string, referenceKey: string) => {
    return axios.delete(url + key + "/" + referenceKey);
};

const service = { findForm, createForm, removeForm };

export default service;
