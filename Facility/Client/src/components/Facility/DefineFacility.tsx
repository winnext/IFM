import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/named
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Chips } from 'primereact/chips';
// import { TreeSelect } from 'primereact/treeselect';
import { Dropdown } from 'primereact/dropdown';
import FacilityService from '../../services/facility';

interface Params {
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  hideDialog: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toast: React.MutableRefObject<any>;
  loadLazyData: () => void;
  facility: Facility;
}
interface Facility {
  _id: string;
  facility_name: string;
  brand_name: string;
  type_of_facility: string;
  country: string;
  city: string;
  address: string;
  label: string[];
  __v: number;
}

type Inputs = {
  facility_name: string;
  brand_name: string;
  type_of_facility: { name: string };
  country: { name: string };
  city: { name: string };
  address: string;
  label: string[];
};

const typesOfFacility = [
  { name: 'Mall' },
  { name: 'Campus' },
  { name: 'University' },
];

const countries = [
  { name: 'Turkey', cities: [{ name: 'Istanbul' }, { name: 'Ankara' }] },
  { name: 'England', cities: [{ name: 'London' }, { name: 'Birmingham' }] },
  { name: 'Germany', cities: [{ name: 'Berlin' }, { name: 'Hamburg' }] },
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
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (facility._id === '') {
      FacilityService.create({
        ...data,
        type_of_facility: data.type_of_facility.name,
        country: data.country.name,
        city: data.city.name,
        classification_of_facility: {},
      })
        .then((res) => {
          console.log(res);
          loadLazyData();
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Facility Created',
            life: 3000,
          });
          hideDialog();
        })
        .catch((err) => console.log(err));
    } else {
      FacilityService.update(facility._id, {
        ...data,
        type_of_facility: data.type_of_facility.name,
        country: data.country.name,
        city: data.city.name,
        classification_of_facility: 'string',
      })
        .then((res) => {
          console.log(res);
          loadLazyData();
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Facility Updated',
            life: 3000,
          });
          hideDialog();
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (submitted) {
      handleSubmit(onSubmit)();
    }
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const [cities, setCities] = useState<{ name: string }[]>([]);

  return (
    <div className="container">
      <form>
        <div className="field">
          <label>Facility Name</label>
          <InputText
            defaultValue={facility.facility_name}
            className={errors.facility_name && 'p-invalid'}
            {...register('facility_name', { required: true })}
          />
          {errors.facility_name && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Brand Name</label>
          <InputText
            defaultValue={facility.brand_name}
            className={errors.brand_name && 'p-invalid'}
            {...register('brand_name', { required: true })}
          />
          {errors.brand_name && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Type Of Facility</label>
          <Controller
            name="type_of_facility"
            rules={{ required: 'Type Of Facility is required.' }}
            control={control}
            defaultValue={{ name: facility.type_of_facility }}
            render={({ field }) => (
              <Dropdown
                filter
                optionLabel="name"
                value={field.value}
                options={typesOfFacility}
                className={errors.type_of_facility && 'p-invalid'}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Select a Type of Facility"
              />
            )}
          />
          {errors.type_of_facility && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        {/* <div className="field">
            <h5 style={{ marginBottom: '0.5em' }}>
              Classification of Facility
            </h5>
            <Controller
              name="classificationOfFacility"
              rules={{ required: 'Classification of Facility is required.' }}
              control={control}
              render={({ field }) => (
                <TreeSelect
                  value={field.value}
                  options={tree.classificationsOfFacility}
                  className={errors.classificationOfFacility && 'p-invalid'}
                  onChange={(e) => field.onChange(e.value)}
                  filter
                  placeholder="Select Classification of Facility"
                ></TreeSelect>
              )}
            />
            {errors.classificationOfFacility && (
              <small className="p-error block">This field is required.</small>
            )}
          </div> */}
        <div className="field">
          <label>Country</label>
          <Controller
            name="country"
            rules={{ required: 'Country is required.' }}
            control={control}
            render={({ field }) => (
              <Dropdown
                optionLabel="name"
                value={field.value}
                options={countries}
                className={errors.country && 'p-invalid'}
                onChange={(e) => {
                  setCities(e.value.cities);
                  field.onChange(e.value);
                }}
                placeholder="Select Country"
                filter
              />
            )}
          />
          {errors.country && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        {cities.length > 0 && (
          <div className="field">
            <label>City</label>
            <Controller
              name="city"
              rules={{ required: 'City is required.' }}
              control={control}
              render={({ field }) => (
                <Dropdown
                  optionLabel="name"
                  value={field.value}
                  options={cities}
                  className={errors.city && 'p-invalid'}
                  onChange={(e) => field.onChange(e.value)}
                  placeholder="Select a City"
                  filter
                />
              )}
            />
            {errors.city && (
              <small className="p-error block">This field is required.</small>
            )}
          </div>
        )}
        {watch('city') && (
          <div className="field">
            <label>Address</label>
            <InputTextarea
              className={errors.address && 'p-invalid'}
              defaultValue={facility.address}
              {...register('address', { required: true })}
              rows={5}
              cols={30}
            />
            {errors.address && (
              <small className="p-error block">This field is required.</small>
            )}
          </div>
        )}
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
      </form>
    </div>
  );
};

export default DefineFacility;
