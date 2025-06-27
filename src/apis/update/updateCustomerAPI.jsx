import api from "../../utils/interceptors"; 

export default async function updateCustomerAPI(type, payload, customerAccessToken) {
  const customer = {};
  const id = payload.userId;
  switch(type){
    case 'email':
        customer.email = payload.email;
        break;
    case 'phone':
        customer.phone = payload.phone;
        break;
    case 'fullName':
        customer.firstName = payload.firstName;
        customer.lastName = payload.lastName;
        break;
    case 'password':
        customer.password = payload.password;
  }

  console.log(customer);

  if (!customerAccessToken) {
    throw new Error("No access token found. Please log in again.");
  }

  const mutation = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  
  `;


  const variables = {
    customerAccessToken,
    customer
  }


  try {
    const response = await api.post("", {
      query: mutation,
      variables,
    });

    console.log("Update response:", response.data);

    if (response.data.errors) {
      throw new Error("Update failed: " + response.data.errors.map(error => error.message).join(", "));
    }

    const customerUserErrors = response.data.data?.customerUpdate?.customerUserErrors;
    if (customerUserErrors && customerUserErrors.length > 0) {
      throw new Error("Update user error(s): " + customerUserErrors.map(error => error.message).join(", "));
    }

    return response.data.data;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

