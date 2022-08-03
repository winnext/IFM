import axios from "axios";

const url = process.env.REACT_APP_API_URL + "structureAssetRelation/";

interface AssetInterface {
    assetKey: string;
}

const findAsset = async (key: string) => {
    return axios.get(url + key);
};

const createAsset = async (key: string, asset: AssetInterface) => {
    return axios.post(url + key, asset);
};

const removeAsset = async (key: string, referenceKey: string) => {
    return axios.delete(url + key + "/" + referenceKey);
};

const service = { findAsset, createAsset, removeAsset };

export default service;
