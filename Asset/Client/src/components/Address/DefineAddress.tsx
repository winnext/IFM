import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

interface Address {
  title: string;
  country: string;
  city: string;
  address: string;
}

interface Params {
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  hideDialog: () => void;
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  address: Address;
  indexAddress: number;
}

type Inputs = {
  title: string;
  country: {name:string};
  city: {name:string};
  address: string;
};

const countries = [
  { name: "Turkey", cities: [{ name: "Istanbul" }, { name: "Ankara" }] },
  { name: "England", cities: [{ name: "London" }, { name: "Birmingham" }] },
  { name: "Germany", cities: [{ name: "Berlin" }, { name: "Hamburg" }] },
];

const DefineAddress = ({
  submitted,
  setSubmitted,
  hideDialog,
  setAddresses,
  address,
  indexAddress
}: Params) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  
  const [cities,setCities] = useState(countries.find(country => country.name === address.country)?.cities);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (indexAddress === -1) {
      setAddresses((prev) => [...prev, {...data,country:data.country.name,city:data.city.name}]);
    } else {
      setAddresses((prev) => {
        const newAddresses = [...prev];
        newAddresses[indexAddress] = {...data,country:data.country.name,city:data.city.name};
        return newAddresses;
      });
    }
    hideDialog();
  };

  React.useEffect(() => {
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
          <label>Title</label>
          <InputText
            defaultValue={address.title}
            className={errors.title && "p-invalid"}
            {...register("title", { required: true })}
          />
          {errors.title && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Country</label>
          <Controller
            name="country"
            rules={{ required: "Country is required." }}
            control={control}
            defaultValue={address.country !== '' ? countries.find(item=>item.name===address.country):undefined}
            render={({ field }) => (
              <Dropdown
                optionLabel="name"
                value={field.value}
                options={countries}
                className={errors.country && "p-invalid"}
                onChange={(e) => {
                  field.onChange(e.value);
                  setCities(e.value.cities);
                }}
                placeholder="Select Country"
                filter
                showClear
              />
            )}
          />
          {errors.country && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>City</label>
          <Controller
            name="city"
            rules={{ required: "City is required." }}
            control={control}
            defaultValue={address.city !== '' ? {name:address.city}:undefined}
            render={({ field }) => (
              <Dropdown
                optionLabel="name"
                value={field.value}
                options={cities}
                className={errors.city && "p-invalid"}
                onChange={(e) => {
                  field.onChange(e.value);
                }}
                placeholder="Select City"
                filter
                showClear
              />
            )}
          />
          {errors.country && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Address</label>
          <InputTextarea
            rows={5}
            cols={30}
            defaultValue={address.address}
            className={errors.address && "p-invalid"}
            {...register("address", { required: true })}
          />
          {errors.address && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
      </form>
    </div>
  );
};

export default DefineAddress;
