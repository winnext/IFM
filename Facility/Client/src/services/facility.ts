import axios from 'axios';

const url = process.env.REACT_APP_API_URL + 'facility';

interface PaginationParams {
  page?: number;
  limit?: number;
}

const findAll = async (query: PaginationParams) => {
  return axios.get(url + `?page=${query.page}&limit=${query.limit}`);
};

const findOne = async (id: string) => {
  return axios.post(url, { id });
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

const service = { findAll, findOne, test };

export default service;
