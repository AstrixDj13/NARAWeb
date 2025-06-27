import React from "react";
import api from "../utils/interceptors"; 

async function SignupApi(userData) {
  const { name, phone, email, password } = userData;
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          firstName
          lastName
          email
          phone
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    input: {
      firstName,
      lastName,
      email,
      password,
      phone: phone.replace(/\s/g, ""),
    },
  };

  try {
    console.log("Signup request variables:", variables);
    const response = await api.post("", {
      query: mutation,
      variables,
    });

    console.log("Signup response:", response.data);

    if (response.data.errors) {
      throw new Error("Signup failed: " + response.data.errors.map(error => error.message).join(", "));
    }

    const customerErrors = response.data.data?.customerCreate?.customerUserErrors;
    if (customerErrors && customerErrors.length > 0) {
      throw new Error("Signup user error(s): " + customerErrors.map(error => error.message).join(", "));
    }

    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export default SignupApi;
