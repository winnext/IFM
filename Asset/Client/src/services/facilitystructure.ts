import axios from "axios";

const url = process.env.REACT_APP_API_URL + "structure";

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

const findAll = async (query: PaginationParams) => {
    return axios.get(
        url +
        `?page=${query.page}&limit=${query.limit}&orderBy=${query.sortKind}&orderByColumn=${query.sortField}&class_name=${query.class_name}`
    );
};

const findOne = async (id: string) => {
    return axios.get(url + "/FacilityStructure/" + id);
};

const create = async (structure: StructureInterface) => {
    return axios.post(url, structure);
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

const service = { findAll, findOne, create, update, remove, relation, nodeInfo };

export default service;
