import React from "react";
import { addAddressAPI, updateAddressAPI } from "../../apis/addressAPI";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAddresses } from "../../store";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";

const indianStatesAndUTs = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export default function AddressForm({ closeForm, isEditing, address }) {
  const currentAddresses = useSelector((state) => state.user.addresses);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customerAccessToken = useSelector(state=>state.user.accessToken);
  const addresses = useSelector(state=>state.user.addresses);

  const handleClose = (e) => {
    e.preventDefault();
    closeForm();
  };

  const addAddress = async (data) => {
    try {
      setIsSubmitting(true);
      const customerAddress = await addAddressAPI(data);
      
      toast.success("New Address Added Successfully!");
      dispatch(setAddresses([...currentAddresses, customerAddress]));
      closeForm();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = data[key].trim();
      }
    }
    const isValid = Object.values(data).every((value) => value !== "");
    if (!isValid) {
      console.error("All fields are required.");
      alert("All fields are required!");
      return;
    }

    

    if(isEditing && customerAccessToken){
      editAddress({ ...data, country: "India" }, address.id, customerAccessToken )
    }else{
      addAddress({ ...data, country: "India" });
    }
  };


  const editAddress = async (address, addressId, customerAccessToken) => {
    try {
      setIsSubmitting(true);
      const editedAddress = await updateAddressAPI(addressId, address, customerAccessToken);
      const newAddress = addresses.filter(el=>el.id!==addressId);
      toast.success("Address was edited successfully!");
      dispatch(setAddresses([...newAddress, editedAddress]));
      closeForm();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <form
        className="flex flex-col w-96 gap-4 border-2 shadow-lg p-4 dark:bg-black bg-[#fff] h-[80%] overflow-y-scroll"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Add Address</h1>
          <button
            onClick={handleClose}
            className="border-2 w-8 text-2xl font-bold"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            defaultValue={address?.firstName}
            placeholder="John"
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={address?.lastName}
            required
            placeholder="Doe"
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            required
            defaultValue={address?.phone}
            placeholder="+911234567890"
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address1">Address Line 1</label>
          <input
            type="text"
            id="address1"
            name="address1"
            defaultValue={address?.address1}
            required
            placeholder="1/4 Pragatinagar Flats, opp. Jain Derasar"
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address2">Address Line 2</label>
          <input
            type="text"
            id="address2"
            name="address2"
            defaultValue={address?.address2}
            required
            placeholder="near Jain Derasar, Vijaynagar Road"
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="province">State</label>
          <select
            id="province"
            name="province"
            required
            defaultValue={address?.province}
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent dark:bg-black"
          >
            <option value="" disabled >
              Select your state
            </option>
            {indianStatesAndUTs.map((state) => (
              <option className="dark:bg-black" key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="zip">Zip</label>
          <input
            type="text"
            id="zip"
            name="zip"
            defaultValue={address?.zip}
            required
            placeholder="845101"
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            required
            defaultValue={address?.city}
            placeholder="Ludhiana"
            className="border-b-2 focus:outline-none focus:border-b-black bg-transparent"
          />
        </div>
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          className="border-2 p-2 hover:bg-green-800 hover:text-white"
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
}
