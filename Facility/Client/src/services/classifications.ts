import axios from "axios";

const url = process.env.REACT_APP_API_URL + "classification";

interface PaginationParams {
  page?: number;
  limit?: number;
  sortField?: string;
  sortKind?: string;
}

interface ClassificationInterface {
  _id?: string;
  name: string;
  code: string;
  detail: {
    root:Node
  };
  __v?: number;
}

interface Node {
  key: string;
  label: string;
  name: string;
  code: string;
  selectable: boolean;
  parent?: string;
  children: Node[];
}

const findAll = async (query: PaginationParams) => {
  return axios.get(
    url +
      `?page=${query.page}&limit=${query.limit}&orderBy=${query.sortKind}&orderByColumn=${query.sortField}`
  );
};

const findOne = async (id: string) => {
  return axios.get(url + "/" + id);
};

const create = async (classification: ClassificationInterface) => {
  return axios.post(url, classification);
};

const update = async (id: string, classification: ClassificationInterface) => {
  return axios.patch(url + "/" + id, classification);
};

const remove = async (id: string) => {
  return axios.delete(url + '/' + id);
};

const service = { findAll, findOne, create, update, remove };

export default service;
