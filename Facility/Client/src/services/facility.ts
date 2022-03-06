import axios from 'axios';

const url = process.env.REACT_APP_API_URL + 'facility';

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface Facility {
  facility_name: string;
  brand_name: string;
  type_of_facility: string;
  classification_of_facility: object;
  country: string;
  city: string;
  address: string;
  label: string[];
}

const findAll = async (query: PaginationParams) => {
  return axios.get(url + `?page=${query.page}&limit=${query.limit}`);
};

const findOne = async (id: string) => {
  return axios.get(url + '/' + id);
};

const create = async (facility: Facility) => {
  return axios.post(url, facility);
};

const remove = async (id: string) => {
  return axios.delete(url + '/' + id);
};

const test = async () => {
  for (let i = 1; i < 31; i++) {
    await axios
      .post(url, {
        facility_name: 'facility' + i,
        brand_name: 'facility' + i,
        type_of_facility: 'facility' + i,
        classification_of_facility: {},
        label: ['facility'],
        country: 'facility' + i,
        city: 'facility',
        address: 'facility' + i,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const service = { findAll, findOne, create, remove, test };

export default service;
