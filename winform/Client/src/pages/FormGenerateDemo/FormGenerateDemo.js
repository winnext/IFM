import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import './FormGenerateDemo.css';

const Error = ({ children }) => <p style={{ color: 'red' }}>{children}</p>;
const Input = ({ value, onChange, type, ...rest }) => {
  const options2 = rest?.options?.map((item) => {
    return Object.values(item);
  });
  var merged = [].concat.apply([], options2);
  switch (type) {
    case 'text':
      return (
        <InputText
          className="mt-1"
          placeholder={rest?.placeholder}
          onChange={onChange}
          value={value}
          style={{ width: '100%' }}
        />
      );
    case 'textarea':
      return (
        <InputTextarea
          className="mt-1"
          placeholder={rest?.placeholder}
          onChange={onChange}
          value={value}
          style={{ width: '100%' }}
        />
      );
    case 'radio':
    case 'gender':
      return merged?.map((e, index) => {
        console.log(e,index);
        return (
          <span key={e} className={index === 0 ? "mt-3" : "mt-3 ml-3" }>
            <RadioButton
              className="mt-2"
              key={e}
              value={e}
              onChange={onChange}
              checked={value === e}
            />
            <label className="ml-2">{e}</label>
          </span>
        );
      });
    case 'dropdown':
    case 'cities':
      return (
        <div>
          <Dropdown
            className="mt-1"
            options={merged}
            onChange={onChange}
            value={value}
            placeholder={rest?.placeholder}
            style={{ width: '100%' }}
          />
        </div>
      );

    case 'checkbox':
      return (
        <div>
          <label>{rest?.label2}</label>
          <Checkbox
            className="mt-1 ml-2"
            type="checkbox"
            label={rest?.label2}
            onChange={(e) => onChange(e.target.checked)}
            checked={value}
          />
        </div>
      );

    case 'date':
      return (
        <div>
          <Calendar
            className="mt-1"
            label={rest?.checkboxLabel}
            onChange={onChange}
            value={value}
            placeholder={rest?.placeholder}
            showIcon
            style={{ width: '100%' }}
          />
        </div>
      );

    default:
      return null;
  }
};

const FormGenerateDemo = (props) => {
  console.log(props);

  const [items, setItems] = useState([]);
  const toast = React.useRef(null);

  useEffect(() => {
    const activeData = props.items.filter((item) => {
      return item.isActive === true;
    });
    setItems(activeData);
  }, []);

  const {
    handleSubmit,
    control,
    // watch,
    unregister,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
  };

  return (
    <div>
      {items && (
        <form onSubmit={handleSubmit(onSubmit)} className="wrapper">
          {items &&
            Object.keys(items).map((e) => {
              const { rules, defaultValue, label } = items[e];
              return (
                <section key={e}>
                  <label className="mb-4">{label}</label>
                  <Controller
                    name={label.replaceAll(' ', '')}
                    control={control}
                    rules={rules}
                    defaultValue={defaultValue}
                    render={({ field }) => (
                      <div>
                        <Input
                          value={field.value || ''}
                          onChange={field.onChange}
                          {...items[e]}
                        />
                      </div>
                    )}
                  />
                  {errors[label] && <Error>This field is required</Error>}
                </section>
              );
            })}
        </form>
      )}
    </div>
  );
};

export default FormGenerateDemo;
