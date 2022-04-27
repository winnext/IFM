import React, { useEffect } from 'react';
// eslint-disable-next-line import/named
import { useForm, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import TestFormService from '../../services/testForm';

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
  items?: any[];
  __v: number;
}

type Inputs = {
  name: string;
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
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (submitted) {
      handleSubmit(onSubmit)();
    }
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (test._id === '') {
      TestFormService.create(data)
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
      TestFormService.update(test._id, { name:data.name,items:test.items,"__v":0 })
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
      </form>
    </div>
  );
};

export default DefineFacility;
