import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./App.css";
const baseUrl = "http://localhost:7001";

const App = () => {
  const validationSchema = Yup.object().shape({
    pdflink: Yup.string().required("PDF link is required"),
    videos: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Title is required"),
        url: Yup.string().required("Video url is required"),
      })
    ),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {
      videos: [{ title: "", url: "" }],
    },
  };

  const { register, control, handleSubmit, reset, formState } =
    useForm(formOptions);
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: "videos",
    control,
  });

  const addFields = () => {
    append({ title: "", url: "" });
  };

  const removeVideo = (i) => {
    remove(i);
  };

  async function onSubmit(data) {
    try {
      const response = await fetch(baseUrl + "/api/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      if (response && response.message) {
        alert(response.message);
      } else {
        alert("Error saving data!");
      }
    } catch (error) {
      alert("Error saving data!");
    }
  }

  const onDownloadTemplate = async () => {
    try {
      await fetch(baseUrl + "/api/template")
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", "template.html"); //or any other extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } catch (error) {
      alert("Error downloading template!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card m-3">
        <h5 className="card-header">Page Generator Form</h5>
        <div className="card-body border-bottom">
          <div className="form-row">
            <div className="form-group">
              <label>Enter PDF link</label>
              <input
                type="text"
                {...register("pdflink")}
                className={`form-control ${errors.pdflink ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.pdflink?.message}</div>
            </div>
          </div>
        </div>
        {fields.map((item, i) => (
          <div key={i} className="list-group list-group-flush">
            <div className="list-group-item">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Video {i + 1}</h5>
                {fields.length > 1 && (
                  <button
                    onClick={() => removeVideo(i)}
                    type="button"
                    className="btn btn-danger action-btn-circle"
                  >
                    D
                  </button>
                )}
              </div>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>Title</label>
                  <input
                    name={`videos[${i}]title`}
                    {...register(`videos.${i}.title`)}
                    type="text"
                    className={`form-control ${
                      errors.videos?.[i]?.title ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.videos?.[i]?.title?.message}
                  </div>
                </div>
                <div className="form-group col-6">
                  <label>Url</label>
                  <input
                    name={`videos[${i}]url`}
                    {...register(`videos.${i}.url`)}
                    type="text"
                    className={`form-control ${
                      errors.videos?.[i]?.url ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.videos?.[i]?.url?.message}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addFields}
          className="btn btn-primary action-btn-circle add-video-btn"
        >
          +
        </button>
        <div className="card-footer text-center border-top-0">
          <button type="submit" className="btn btn-primary mr-1">
            Submit
          </button>
          <button
            onClick={() => reset()}
            type="button"
            className="btn btn-secondary mr-1"
          >
            Reset
          </button>
          <button
            onClick={onDownloadTemplate}
            type="button"
            className="btn btn-secondary mr-1"
          >
            Download Template
          </button>
        </div>
      </div>
    </form>
  );
};

export default App;
