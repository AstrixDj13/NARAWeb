import React from "react";
import api from "../utils/interceptors"; // Assuming this imports the API client
import axios from "axios";
async function LoginApi(userData) {
  const { email, password } = userData; // Destructure user data

  const mutation = `
  mutation customerAccessTokenCreate($input:CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
    }
    customerUserErrors {
      message
    }
  }
}
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  try {
    const response = await api.post("", {
      query: mutation,
      variables,
    });

    if (response.data.errors) {
      // Handle API errors (specific details based on your API)
      throw new Error("Login failed: " + response.data.errors[0].message);
    } else if (
      response.data.data.customerAccessTokenCreate.customerUserErrors[0]
    ) {
      throw new Error(
        "Login failed: " +
          response.data.data.customerAccessTokenCreate.customerUserErrors[0]
            .message
      );
    } else {
      const accessToken =
        response.data.data.customerAccessTokenCreate.customerAccessToken
          .accessToken;

      localStorage.setItem("accessToken", accessToken);
      // return response.data.data; 
      return accessToken;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export default LoginApi;

