import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import FormBuilderService from "../../services/formType";
import "./FormGenerate.css";

const Error = ({ children }) => <p style={{ color: "red" }}>{children}</p>;
const Input = ({ value, onChange, type, ...rest }) => {
  // console.log(value);
  // console.log(onChange);
  // console.log(rest);
  const options2 = rest?.options?.map((item) => {
    return Object.values(item);
  });
  var merged = [].concat.apply([], options2);
  console.log(merged);
  switch (type) {
    case "text":
      return (
        <InputText
          className="mt-1"
          placeholder={rest?.placeholder}
          onChange={onChange}
          value={value}
          style={{ width: "100%" }}
        />
      );
    case "textarea":
      return (
        <InputTextarea
          className="mt-1"
          placeholder={rest?.placeholder}
          onChange={onChange}
          value={value}
          style={{ width: "100%" }}
        />
      );
    case "radio":
      return merged?.map((e) => {
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
      });
    case "dropdown":
      return (
        <div>
          <Dropdown
            className="mt-1"
            options={merged}
            onChange={onChange}
            value={value}
            placeholder={rest?.placeholder}
            style={{ width: "100%" }}
          />
        </div>
      );

    case "checkbox":
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

    case "date":
      return (
        <div>
          <Calendar
            className="mt-1"
            label={rest?.checkboxLabel}
            onChange={onChange}
            value={value}
            placeholder={rest?.placeholder}
            showIcon
            style={{ width: "100%" }}
          />
        </div>
      );

    default:
      return null;
  }
};

const Dynamic = () => {
  const [formData, setFormData] = useState([]);
  const [selectedForm, setSelectedForm] = useState(undefined);

  const getForms = () => {
    FormBuilderService.findAll().then((res) => {
      setFormData(res.data);
    });
  };

  useEffect(() => {
    getForms();
  }, []);

  const {
    handleSubmit,
    control,
    // watch,
    unregister,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div>
      <Dropdown
        optionLabel="name"
        value={selectedForm}
        options={formData}
        onChange={(e) => {
          const temp = selectedForm ? selectedForm.items : [];
          for (let item of temp) {
            unregister(item.label);
          }
          reset();
          setSelectedForm(e.value);
        }}
        placeholder="Select Type"
      />
      {selectedForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="wrapper">
          {selectedForm &&
            Object.keys(selectedForm.items).map((e) => {
              const { rules, defaultValue, label } = selectedForm.items[e];
              return (
                <section key={e}>
                  <label className="mb-4">{label}</label>
                  <Controller
                    name={label.replaceAll(" ", "")}
                    control={control}
                    rules={rules}
                    defaultValue={defaultValue}
                    render={({ field }) => (
                      <div>
                        <Input
                          value={field.value || ""}
                          onChange={field.onChange}
                          {...selectedForm.items[e]}
                        />
                      </div>
                    )}
                  />
                  {errors[label] && <Error>This field is required</Error>}
                </section>
              );
            })}
          <div>{selectedForm && <Button type="submit">Submit</Button>}</div>
        </form>
      )}
    </div>
  );
};

export default Dynamic;
