

"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

export default function LocalBusinessForm() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      description: "",
      url: "",
      image: "",
      logo: "",
      telephone: "",
      email: "",
      address: {
        street: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
      },
      offers: [
        { name: "", description: "" },
        { name: "", description: "" },
        { name: "", description: "" },
        { name: "", description: "" },
      ],
      sameAs: ["", "", "", "", "", ""],
      areaServed: ["", "", "", ""],
      slogan: "",
      foundingDate: "",
      numberOfEmployees: "",
      currenciesAccepted: "",
      paymentAccepted: ["", ""],
      openingHours: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "",
        closes: "",
      },
    },
  });

  const { fields: offerFields } = useFieldArray({
    control,
    name: "offers",
  });

  const { fields: sameAsFields } = useFieldArray({
    control,
    name: "sameAs",
  });

  const { fields: areaServedFields } = useFieldArray({
    control,
    name: "areaServed",
  });

  const { fields: paymentAcceptedFields } = useFieldArray({
    control,
    name: "paymentAccepted",
  });

  const onSubmit = (data) => {
    console.log(data);
    // handle your submit logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="hello">
      <h2 className="text-xl font-bold">Business Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Agency Name</label>
          <input {...register("name")} className="input" />
        </div>
        <div>
          <label>Website URL</label>
          <input {...register("url")} className="input" type="url" />
        </div>
        <div>
          <label>Logo URL</label>
          <input {...register("logo")} className="input" type="url" />
        </div>
        <div>
          <label>Image URL</label>
          <input {...register("image")} className="input" type="url" />
        </div>
        <div>
          <label>Telephone</label>
          <input {...register("telephone")} className="input" type="tel" />
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} className="input" type="email" />
        </div>
        <div className="md:col-span-2">
          <label>Description</label>
          <textarea {...register("description")} className="input" />
        </div>
        <div>
          <label>Slogan</label>
          <input {...register("slogan")} className="input" />
        </div>
        <div>
          <label>Founding Date</label>
          <input {...register("foundingDate")} className="input" type="date" />
        </div>
      </div>

      <h3 className="font-semibold mt-4">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Street Address</label>
          <input {...register("address.street")} className="input" />
        </div>
        <div>
          <label>City / Locality</label>
          <input {...register("address.city")} className="input" />
        </div>
        <div>
          <label>State / Region</label>
          <input {...register("address.region")} className="input" />
        </div>
        <div>
          <label>Postal Code</label>
          <input {...register("address.postalCode")} className="input" />
        </div>
        <div>
          <label>Country</label>
          <input {...register("address.country")} className="input" />
        </div>
      </div>

      <h3 className="font-semibold mt-4">Offers</h3>
      {offerFields.map((field, idx) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Offer Name</label>
            <input {...register(`offers.${idx}.name`)} className="input" />
          </div>
          <div>
            <label>Description</label>
            <input {...register(`offers.${idx}.description`)} className="input" />
          </div>
        </div>
      ))}

      <h3 className="font-semibold mt-4">Social Links</h3>
      {sameAsFields.map((field, idx) => (
        <div key={field.id}>
          <label>Social Link {idx + 1}</label>
          <input {...register(`sameAs.${idx}`)} className="input" type="url" />
        </div>
      ))}

      <h3 className="font-semibold mt-4">Area Served</h3>
      {areaServedFields.map((field, idx) => (
        <div key={field.id}>
          <label>Area {idx + 1}</label>
          <input {...register(`areaServed.${idx}`)} className="input" />
        </div>
      ))}

      <h3 className="font-semibold mt-4">Opening Hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Opens</label>
          <input {...register("openingHours.opens")} className="input" type="time" />
        </div>
        <div>
          <label>Closes</label>
          <input {...register("openingHours.closes")} className="input" type="time" />
        </div>
      </div>
      <div>
        <label>Days</label>
        <input
          {...register("openingHours.days")}
          className="input"
          value="Monday-Friday"
          readOnly
        />
      </div>

      <h3 className="font-semibold mt-4">Employees & Payment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Number of Employees</label>
          <input {...register("numberOfEmployees")} className="input" type="number" />
        </div>
        <div>
          <label>Currencies Accepted</label>
          <input {...register("currenciesAccepted")} className="input" />
        </div>
      </div>
      {paymentAcceptedFields.map((field, idx) => (
        <div key={field.id}>
          <label>Payment Accepted {idx + 1}</label>
          <input {...register(`paymentAccepted.${idx}`)} className="input" />
        </div>
      ))}

      <button type="submit" className="btn btn-primary mt-4">
        Save
      </button>
    </form>
  );
}