import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from 'react-router-dom';
import TestFormService from '../../services/testForm';
import Input from '../../components/TestForm/Input';
import './EditForm.css';

const Error = ({ children }: any) => <p style={{ color: 'red' }}>{children}</p>;

const EditForm = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = React.useState<any>({
    name: '',
    items: [],
  });

  React.useEffect(() => {
    var temp = search.split('?id=')[1];
    if (!temp) {
      navigate('/test-form');
      return;
    }

    TestFormService.findOne(temp)
      .then((res) => {
        setForm(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const {
    handleSubmit,
    control,
    // watch,
    unregister,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    for (let index = 0; index < form.items.length; index++) {
      form.items[index].value = data[Object.keys(data)[index]];
    }
    const id = form._id;
    delete form._id;
    TestFormService.update(id, form)
      .then((res) => {
        navigate('/test-form');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="wrapper">
        {form.items.map((item: any) => (
          <section key={item.id}>
            <label className="mb-4">{item.label}</label>
            <Controller
              name={item.label.replaceAll(' ', '')}
              control={control}
              rules={item.rules}
              defaultValue={item.value}
              render={({ field }) => (
                <div>
                  <Input
                    value={field.value || ''}
                    onChange={field.onChange}
                    type={item.type}
                    rest={item}
                  />
                </div>
              )}
            />
            {errors[item.label] && <Error>This field is required</Error>}
          </section>
        ))}
        <Button>Save</Button>
      </form>
    </div>
  );
};

export default EditForm;
