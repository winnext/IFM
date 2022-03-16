import React, { useEffect, useState } from "react";
// eslint-disable-next-line import/named
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Chips } from "primereact/chips";
// import { TreeSelect } from 'primereact/treeselect';
import { Dropdown } from "primereact/dropdown";
import FacilityService from "../../services/facility";
import Addresses from "../Address/Addresses";
import { TreeSelect } from "primereact/treeselect";
import { useAppSelector } from "../../app/hook";

interface Node {
  key: string;
  name: string;
  code: string;
  selectable?: boolean | undefined;
  children: Node[];
}

const copyNode = (node: Node): Node => {
  return {
    key: node.key,
    name: node.name,
    code: node.code,
    selectable: node.selectable,
    children: [],
  };
};

interface Params {
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  hideDialog: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toast: React.MutableRefObject<any>;
  loadLazyData: () => void;
  facility: Facility;
}

interface Address {
  title: string;
  country: string;
  city: string;
  address: string;
}
interface Facility {
  _id: string;
  facility_name: string;
  brand_name: string;
  type_of_facility: string;
  classification_of_facility: Node;
  address: Address[];
  label: string[];
  __v: number;
}

type Inputs = {
  facility_name: string;
  brand_name: string;
  type_of_facility: { name: string };
  address?: Address[];
  classification_of_facility: string;
  label: string[];
};

const typesOfFacility = [
  { name: "Mall" },
  { name: "Campus" },
  { name: "University" },
];

const DefineFacility = ({
  submitted,
  setSubmitted,
  hideDialog,
  toast,
  loadLazyData,
  facility,
}: Params) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [addresses, setAddresses] = useState<Address[]>(facility.address);
  const tree = useAppSelector((state) => state.tree);

  const findNode = (search: string, data: Node[]): Node | undefined => {
    for(let node of data){
      if(node.key === search){
        return node;
      }
      const found = findNode(search, node.children);
      if(found){
        return found;
      }
    }
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    var node = findNode(
      data.classification_of_facility,
      tree.classificationsOfFacility
    );
    console.log({node})
    // var list: Node[] = [];

    // if (node) {
    //   list.push(node);
    // }

    // while (node && node.parentKey !== "") {
    //   node = findNode(node.parentKey, tree.classificationsOfFacility);
    //   if (node) {
    //     list.unshift(node);
    //   }
    // }

    // var result:Node = copyNode(list[0]);
    // var temp:Node = result
    
    // for (let i = 0; i < list.length - 1; i++) {
    //   temp.children.push(copyNode(list[i + 1]));
    //   temp = temp.children[0];
    // }

    // console.log({classification:temp,tree:result})

    if (facility._id === "") {
      FacilityService.create({
        ...data,
        address: addresses,
        type_of_facility: data.type_of_facility.name,
        classification_of_facility: {node},
      })
        .then((res) => {
          loadLazyData();
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Facility Created",
            life: 3000,
          });
          hideDialog();
        })
        .catch((err) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.response ? err.response.data.message : err.message,
            life: 2000,
          });
          hideDialog();
        });
    } else {
      FacilityService.update(facility._id, {
        ...data,
        address: addresses,
        type_of_facility: data.type_of_facility.name,
        classification_of_facility: {node},
      })
        .then((res) => {
          loadLazyData();
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Facility Updated",
            life: 3000,
          });
          hideDialog();
        })
        .catch((err) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.response ? err.response.data.message : err.message,
            life: 2000,
          });
          hideDialog();
        });
    }
  };

  useEffect(() => {
    if (submitted) {
      handleSubmit(onSubmit)();
    }
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  return (
    <div className="container">
      <form>
        <div className="field">
          <label>Facility Name</label>
          <InputText
            defaultValue={facility.facility_name}
            className={errors.facility_name && "p-invalid"}
            {...register("facility_name", { required: true })}
          />
          {errors.facility_name && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Brand Name</label>
          <InputText
            defaultValue={facility.brand_name}
            className={errors.brand_name && "p-invalid"}
            {...register("brand_name", { required: true })}
          />
          {errors.brand_name && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Type Of Facility</label>
          <Controller
            name="type_of_facility"
            rules={{ required: "Type Of Facility is required." }}
            control={control}
            defaultValue={
              facility.type_of_facility !== ""
                ? { name: facility.type_of_facility }
                : undefined
            }
            render={({ field }) => (
              <Dropdown
                filter
                optionLabel="name"
                value={field.value}
                options={typesOfFacility}
                className={errors.type_of_facility && "p-invalid"}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Select a Type of Facility"
              />
            )}
          />
          {errors.type_of_facility && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <h5 style={{ marginBottom: "0.5em" }}>Classification of Facility</h5>
          <Controller
            name="classification_of_facility"
            rules={{ required: "Classification of Facility is required." }}
            control={control}
            render={({ field }) => (
              <TreeSelect
                value={field.value}
                options={tree.classificationsOfFacility}
                className={errors.classification_of_facility && "p-invalid"}
                onChange={(e) => field.onChange(e.value)}
                filter
                filterBy="name,code"
                placeholder="Select Classification of Facility"
              ></TreeSelect>
            )}
          />
          {errors.classification_of_facility && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Hashtag</label>
          <Controller
            name="label"
            control={control}
            defaultValue={facility.label}
            render={({ field }) => (
              <Chips
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
              />
            )}
          />
        </div>
        <Addresses addresses={addresses} setAddresses={setAddresses} />
      </form>
    </div>
  );
};

export default DefineFacility;
