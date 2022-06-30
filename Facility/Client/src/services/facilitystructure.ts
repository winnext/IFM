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
    parent_id?: string;
    name: string;
    tag: string[];
    formType:string;
    description: string;
    labels: string[];

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

const create = async (classification: StructureInterface) => {
    return axios.post(url, classification);
};

const update = async (id: string, classification: StructureInterface) => {
    return axios.patch(url + "/" + id, classification);
};

const remove = async (id: string) => {
    return axios.delete(url + '/' + id);
};

const relation = async (id1: string, id2: string) => {
    return axios.post(`${url}/relation/${id1}/${id2}`);
};

const nodeInfo = async (key: string) => {
    return axios.get(`${url}/nodeinfo/${key}`);
};

const service = { findAll, findOne, create, update, remove, relation, nodeInfo };

export default service;
