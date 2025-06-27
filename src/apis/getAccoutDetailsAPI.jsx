import api from "../utils/interceptors";

export default async function getAccountDetailsAPI() {
  const customerAccessToken = localStorage.getItem("accessToken");
  const query = `
    query getCustomerDetails($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        defaultAddress{
        id
        firstName
        lastName
        province
        formatted(withName: false)
        name
        city
        zip
        address1
        address2
        }
        orders(first: 3) {
          edges {
            node {
              orderNumber
            }
          }
        }
      }
    }
  `;

  const variables = { customerAccessToken };

  try {
    const response = await api.post("", {
      query,
      variables,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors
        .map((error) => error.message)
        .join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const customerData = response.data.data?.customer;
    if (!customerData) {
      throw new Error("No customer data found");
    }

    return customerData;
  } catch (error) {
    console.error("Could not fetch account details:", error.message);
    throw error;
  }
}

export async function updateCustomerDefaultAddress(addressId, customerAccessToken) {

  const query = `
   mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
      customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
        customer{
          defaultAddress{
            id
          }
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = { addressId, customerAccessToken };

  try {
    const response = await api.post("", {
      query,
      variables,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors
        .map((error) => error.message)
        .join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const returnedData = response.data.data?.customerDefaultAddressUpdate;
    const customerUserErrors = returnedData?.customerUserErrors;

    const defaultAddressId = returnedData?.customer?.defaultAddress?.id.split("?")[0];

    if (!defaultAddressId) {
      throw new Error(customerUserErrors.map(el=>el.message).join(". "));
    }
    return defaultAddressId;
  } catch (error) {
    console.error("Could not update default address:", error.message);
    throw error;
  }
}