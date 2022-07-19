import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/named
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import TestFormService from '../../services/testForm';
import FormBuilderService from '../../services/formProperties';
import { Dropdown } from 'primereact/dropdown';

interface Params {
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  hideDialog: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toast: React.MutableRefObject<any>;
  loadLazyData: () => void;
  test: Test;
  facility: {
    _id: string;
    name: string;
    items: any[];
    __v: number;
  };
}

interface Test {
  _id: string;
  name: string;
  type: string;
  items?: any[];
  __v: number;
}

type Inputs = {
  name: string;
  type: { name: string; _id: string; items: any[] };
};

const DefineFacility = ({
  submitted,
  setSubmitted,
  hideDialog,
  toast,
  loadLazyData,
  test,
}: Params) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [types, setTypes] = useState<
    { name: string; _id: string; items: any[] }[]
  >([]);

  useEffect(() => {
    if (submitted) {
      handleSubmit(onSubmit)();
    }
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  useEffect(() => {
    FormBuilderService.findAll()
      .then((res) => {
        setTypes(res.data[0]);
        setValue("type",res.data[0].find((t: any) => t._id === test.type))
        console.log(test)
        console.log(res.data[0])
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (test._id === '') {
      TestFormService.create({
        ...data,
        type: data.type._id,
        items: data.type.items,
      })
        .then((res) => {
          loadLazyData();
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Facility Created',
            life: 2000,
          });
          hideDialog();
        })
        .catch((err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: err.response ? err.response.data.message : err.message,
            life: 4000,
          });
          hideDialog();
        });
    } else {
      var items = []
      if(test.type !== data.type._id){
        items = data.type.items.map(item=>{
          item.value = item.defaultValue;
          delete item.defaultValue

          return item
        })
        console.log(items)
      }
      TestFormService.update(test._id, {
        name: data.name,
        type: data.type._id,
        items: test.type === data.type._id ? test.items : items,
        __v: 0,
      })
        .then((res) => {
          loadLazyData();
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Facility Updated',
            life: 2000,
          });
          hideDialog();
        })
        .catch((err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: err.response ? err.response.data.message : err.message,
            life: 4000,
          });
          hideDialog();
        });
    }
  };

  return (
    <div className="container">
      <form>
        <div className="field">
          <label>Name</label>
          <InputText
            defaultValue={test.name}
            {...register('name', { required: true })}
          />
          {errors.name && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
        <div className="field">
          <label>Type</label>
          <Controller
            name="type"
            rules={{ required: 'Type is required.' }}
            control={control}
            render={({ field }) => (
              <Dropdown
                filter
                optionLabel="name"
                value={field.value}
                options={types}
                className={errors.type && 'p-invalid'}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Select a Type"
                showClear
              />
            )}
          />
          {errors.type && (
            <small className="p-error block">This field is required.</small>
          )}
        </div>
      </form>
    </div>
  );
};

export default DefineFacility;
