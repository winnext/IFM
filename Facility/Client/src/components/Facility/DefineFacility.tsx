import React, { useEffect, useState } from "react";
// eslint-disable-next-line import/named
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Chips } from "primereact/chips";
// import { TreeSelect } from 'primereact/treeselect';
import { Dropdown } from "primereact/dropdown";
import FacilityService from "../../services/facility";
import Addresses from "../Address/Addresses";

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
  country: string;
  city: string;
  address: Address[];
  label: string[];
  __v: number;
}

type Inputs = {
  facility_name: string;
  brand_name: string;
  type_of_facility: { name: string };
  address?: Address[];
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

  const [addresses,setAddresses] = useState<Address[]>(facility.address);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (facility._id === "") {
      FacilityService.create({
        ...data,
        address: addresses,
        type_of_facility: data.type_of_facility.name,
        classification_of_facility: {},
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
        .catch((err) => console.log(err));
    } else {
      FacilityService.update(facility._id, {
        ...data,
        address:addresses,
        type_of_facility: data.type_of_facility.name,
        classification_of_facility: {},
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
        .catch((err) => console.log(err.response));
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
            defaultValue={{ name: facility.type_of_facility }}
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
