import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setEmail, setFullName, setPhone } from "../../store";
import updateCustomerAPI from "../../apis/update/updateCustomerAPI";
import { toast } from "sonner";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import editPenIcon from "../../assets/icons/edit_pen_icon.svg";

export default function PersonalInfoCard({ title, value, type }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const customerAccessToken = useSelector((state) => state.user.accessToken);
  const inputRef = useRef(null);
  const userId = useSelector((state) => state.user.id);
  const dispatch = useDispatch();

  const handleUpdate = async () => {
    setIsLoading(true);
    const newValue = inputRef.current.value;
    console.log("Updating with value:", newValue);

    const fieldMapping = {
      name: {
        apiField: "fullName",
        payload: () => {
          const value = newValue.split(" ");
          const firstName = value[0];
          const lastName = value[value.length - 1];
          return { firstName, lastName };
        },
        successMessage: "Name Updated Successfully!",
        action: setFullName,
      },
      email: {
        apiField: "email",
        payload: () => ({ email: newValue }),
        successMessage: "Email Updated Successfully!",
        action: setEmail,
      },
      phone: {
        apiField: "phone",
        payload: () => ({ phone: newValue }),
        successMessage: "Phone Updated Successfully!",
        action: setPhone,
      },
      password: {
        apiField: "password",
        payload: () => ({ password: newValue }),
        successMessage: "Password Updated Successfully!",
      },
    };

    const { apiField, payload, successMessage, action } =
      fieldMapping[type] || {};

    if (apiField) {
      try {
        await updateCustomerAPI(
          apiField,
          { ...payload(), userId },
          customerAccessToken
        );
        if (action) dispatch(action(payload()));
        toast.success(successMessage);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setIsEditing(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="border-r-2 border-gray-300 pr-4 flex justify-between items-center">
      <div>
        <h2 className="text-[#807D7E]">{title}</h2>
        {isEditing && !isLoading ? (
          <input
            ref={inputRef}
            type={type === "password" ? "password" : "text"}
            defaultValue={value}
            className="xl:text-lg text-sm font-bold focus:outline-none"
          />
        ) : isLoading ? (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
            <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
            <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
          </div>
        ) : (
          <h1 className="lg:text-lg text-sm font-bold">{value}</h1>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="border-2 dark:bg-white border-[#B5B5B5] p-2 hover:border-black"
        >
          {isEditing ? (
            <IoMdCheckmark
              size={24}
              className="text-green-500"
              onClick={handleUpdate}
            />
          ) : (
            <img title="image" src={editPenIcon} alt="Edit" />
          )}
        </button>

        {isEditing && (
          <button
            className="border-2 dark:bg-white border-[#B5B5B5] p-2 hover:border-black"
            onClick={() => setIsEditing(false)}
          >
            <RxCross2 size={24} className="text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}
