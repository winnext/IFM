import axios from "axios";

const url = process.env.REACT_APP_API_URL + "structure";
const url2 = process.env.REACT_APP_API_URL + "structureAssetRelation/";
const url3 = process.env.REACT_APP_API_URL + "structureWinformRelation/";

interface PaginationParams {
    page?: number;
    limit?: number;
    sortField?: string;
    sortKind?: string;
    class_name?: string;
}

interface StructureInterface {
    key: string;
    parentId?: string;
    name: string;
    tag: string[];
    description?: string;
    labels?: string[];
    formTypeId?: string;
}

interface AssetInterface {
    assetKey: string;
}

interface FormInterface {
    formKey: string;
}

const findAll = async (query: PaginationParams) => {
    return axios.get(
        url +
        `?page=${query.page}&limit=${query.limit}&orderBy=${query.sortKind}&orderByColumn=${query.sortField}&class_name=${query.class_name}`
    );
};

const findOne = async (id: string) => {
    return axios.get(url + "/FacilityStructure/" + id);
};

const findAssets = async (key: string) => {
    return axios.get(url2 + key);
};

const create = async (structure: StructureInterface) => {
    return axios.post(url, structure);
};

const createAsset = async (key:string, asset: AssetInterface) => {
    
    return axios.post(url2 + key, asset);
};

const createForm = async (key:string, form: FormInterface) => {

    return axios.post(url3 + key, form);
};

const update = async (id: string, structure: StructureInterface) => {
    return axios.patch(url + "/" + id, structure);
};

const remove = async (id: string) => {
    return axios.delete(url + '/' + id);
};

const relation = async (id1: string, id2: string) => {
    return axios.post(`${url}/relation/${id1}/${id2}`);
};

const nodeInfo = async (key: string) => {
    return axios.get(`${url}/${key}`);
};

const service = { findAll, findOne, findAssets, create, createAsset, createForm, update, remove, relation, nodeInfo };

export default service;
