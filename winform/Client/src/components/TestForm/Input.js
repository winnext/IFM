import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';

const Input = (props) => {
  const { value, onChange, type, rest } = props;
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
      return (
        <div>
          {merged?.map((e) => {
            console.log(e);
            return (
              <div key={e} className="flex">
                <div className="field-radiobutton">
                  <RadioButton
                    className="mt-1"
                    key={e}
                    value={e}
                    onChange={onChange}
                    checked={value === e}
                  />
                  <label className="ml-2">{e}</label>
                </div>
              </div>
            );
          })}
        </div>
      );
    case 'dropdown':
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
          <label>{rest?.checkboxLabel}</label>
          <Checkbox
            className="mt-1 ml-2"
            type="checkbox"
            label={rest?.checkboxLabel}
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
      return <div></div>;
  }
};

export default Input;
