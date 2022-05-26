import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import FormTypeService from "../../services/formType";
import FormBuilderService from "../../services/formBuilder";
import "./FormGenerate.css";

const Error = ({ children }) => <p style={{ color: "red" }}>{children}</p>;
const Input = ({ value, onChange, type, ...rest }) => {
  const options2 = rest?.options?.map((item) => {
    return Object.values(item);
  });
  var merged = [].concat.apply([], options2);
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

  const [items, setItems] = useState([]);
  const toast = React.useRef(null);

  const params = useLocation();
  console.log(params);

  const history = useNavigate();

  useEffect(() => {
    if (params.state) {
      localStorage.setItem("nodeId", params.state.data._id.low);
      localStorage.setItem("typeId", params.state.data.typeId);
      localStorage.setItem("rootId", params.state.data.rootId);
    }
    FormTypeService.nodeInfo(localStorage.getItem("typeId"))
      .then((res) => {
        console.log(res.data);
        FormBuilderService.getProperties(res.data.identity.low)
          .then((res) => {
            console.log(res.data);

            const convertedData = res.data.map(function (item) {
              return {
                ...item,
                rules: { required: item.rules[0] },
                options: item.options.map(function (option) {
                  return { optionsName: option };
                }),
              };
            });
            setItems(convertedData);
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response ? err.response.data.message : err.message,
              life: 2000,
            });
          });
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response ? err.response.data.message : err.message,
          life: 2000,
        });
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

  const onSubmit = (data) => {
    console.log(data);
    history(`/facilitystructure/${params.state.rootId}`);
  };

  const backPage = () => {
    history(`/facilitystructure/${params.state.rootId}`);
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
                    name={label.replaceAll(" ", "")}
                    control={control}
                    rules={rules}
                    defaultValue={defaultValue}
                    render={({ field }) => (
                      <div>
                        <Input
                          value={field.value || ""}
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
          <div>
            {items && (
              <>
                <Button className="ml-3" type="submit">
                  Submit
                </Button>
                <Button className="ml-4" onClick={() => backPage()}>
                  Back
                </Button>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Dynamic;
