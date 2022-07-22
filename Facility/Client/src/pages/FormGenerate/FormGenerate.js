import React, { useState, useEffect, useLayoutEffect } from "react";
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
import { TabView, TabPanel } from "primereact/tabview";

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
    case "gender":
      return merged?.map((e, index) => {
        console.log(e, index);
        return (
          <span key={e} className={index === 0 ? "mt-3" : "mt-3 ml-3"}>
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
    case "dropdown":
    case "cities":
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

    case "date":
      console.log(value);
      const date1 = new Date(value);
      return (
        <div>
          <Calendar
            className="mt-1"
            dateFormat="dd/mm/yy"
            onChange={onChange}
            value={date1}
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

const FormGenerate = () => {
  const [items, setItems] = useState([]);
  const [hasForm, setHasForm] = useState(true);
  const toast = React.useRef(null);

  const location = useLocation();
  const params = useParams();
  const searchParameters = new URLSearchParams(location.search);
  const nodeId = params.id;
  const formType = searchParameters.get("typeId");

  console.log(nodeId, formType);

  const history = useNavigate();

  useEffect(() => {
    if (formType === "undefined" || formType === null || formType === "") {
      return setHasForm(false);
    }
    FormBuilderService.getPropertiesWithName(formType)
      .then((responsegetProperties) => {
        console.log(responsegetProperties.data);

        const convertedData = responsegetProperties.data.map(function (item) {
          // console.log(formData[`'${item.label}'`]);
          return {
            ...item,
            // defaultValue:
            //   responsegetData.data.length > 0
            //     ? responsegetData.data[0].data[item.label]
            //       ? responsegetData.data[0].data[item.label]
            //       : item.defaultValue
            //     : item.defaultValue,
            rules: { required: item.rules[0] },
            options: item.options.map(function (option) {
              return { optionsName: option };
            }),
          };
        });
        setItems(convertedData);
      })
      .catch((err) => {
        return setHasForm(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.responsegetProperties
            ? err.responsegetProperties.data.message
            : err.message,
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
    // console.log(data);
    const formData = {
      nodeId: nodeId,
      data: data,
    };
    console.log(formData);
    // console.log(formData);

    // deneme
    //   .create(formData)
    //   .then((res) => {
    //     toast.current.show({
    //       severity: "success",
    //       summary: "Successful",
    //       detail: "Form Data Created",
    //       life: 3000,
    //     });
    //     history(`/facilitystructure`);
    //   })
    //   .catch((err) => {
    //     toast.current.show({
    //       severity: "error",
    //       summary: "Error",
    //       detail: err.response ? err.response.data.message : err.message,
    //       life: 2000,
    //     });
    //   });
  };

  const backPage = () => {
    history(`/facilitystructure`);
  };

  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView>
          <TabPanel header="Type Form">
            <TabView>
              <TabPanel header="Active Data">
                <div>
                  <Toast ref={toast} position="top-right" />

                  {hasForm ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="wrapper">
                      {items &&
                        Object.keys(items).map((e) => {
                          console.log(items[e]);
                          const { rules, defaultValue, label } = items[e];
                          return (
                            <section key={e}>
                              <label className="mb-4">{label}</label>
                              <Controller
                                // name={label.replaceAll(" ", "")}
                                name={label}
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
                              {errors[label] && (
                                <Error>This field is required</Error>
                              )}
                            </section>
                          );
                        })}
                      <div>
                        {items.length > 0 && (
                          <>
                            <div className="mt-4">
                              <Button className="ml-3" type="submit">
                                Submit
                              </Button>
                              <Button
                                className="ml-4"
                                onClick={() => backPage()}
                              >
                                Back
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </form>
                  ) : (
                    <div>
                      <h4>There is no form for this structure.</h4>
                      <Button className="" onClick={() => backPage()}>
                        Back
                      </Button>
                    </div>
                  )}
                </div>
              </TabPanel>
              <TabPanel header="Passive Data"></TabPanel>
            </TabView>
          </TabPanel>
          <TabPanel header="Extra Form">
            <TabView>
              <TabPanel header="Active Data"></TabPanel>
              <TabPanel header="Passive Data"></TabPanel>
            </TabView>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default FormGenerate;
