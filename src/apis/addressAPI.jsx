import api from "../utils/interceptors"; 



export async function addAddressAPI(address) {
  const customerAccessToken = localStorage.getItem("accessToken");
  const mutation = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerUserErrors {
          code
          field
          message
        }
        customerAddress {
          id
          address1
          address2
          city
          name
          formatted(withName: false) 
          country
          firstName
          lastName
          phone
          province
          zip
        }
      }
    }
  `;

  const variables = {
    customerAccessToken,
    address,
  };

  try {
    const response = await api.post("", {
      query: mutation,
      variables,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors.map(error => error.message).join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const { customerUserErrors, customerAddress } = response.data.data.customerAddressCreate;
    if (customerUserErrors.length > 0) {
      const errors = customerUserErrors.map(error => `${error.field}: ${error.message}`).join(", ");
      throw new Error(`Customer address creation error(s): ${errors}`);
    }

    return customerAddress;
  } catch (error) {
    console.error("Could not add address:", error.message);
    throw error;
  }
}


export async function getAddressesAPI() {
  const customerAccessToken = localStorage.getItem("accessToken");
  console.log("Getting address for the access token", customerAccessToken)
    const query = `
      query getCustomerAddresses($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          addresses(first: 50) {
            edges {
              node {
                id
                firstName
                lastName
                address1
                address2
                city
                province
                country
                zip
                phone
                formatted(withName: false)
                name
                
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
        const errorMessages = response.data.errors.map(error => error.message).join(", ");
        throw new Error(`GraphQL error(s): ${errorMessages}`);
      }
  
      const addresses = response.data.data?.customer?.addresses?.edges?.map(edge => edge.node) || [];
      console.log(response.data.data?.customer)
      return addresses;
    } catch (error) {
      console.error("Could not fetch addresses:", error.message);
      throw error;
    }
  }

  

  export async function updateAddressAPI( addressId, address, customerAccessToken) {
    
    const query = `
      mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerUserErrors {
            code
            field
            message
          }
          customerAddress {
            id
            firstName
            lastName
            name
            formatted(withName: false)
            address1
            address2
            city
            province
            country
            zip
            phone
            
          }
        }
      }
    `;
  
    const variables = { customerAccessToken, id: addressId, address };
  
    try {
      const response = await api.post("", { query, variables });
  
      if (response.data.errors) {
        const errorMessages = response.data.errors.map(error => error.message).join(", ");
        throw new Error(`GraphQL error(s): ${errorMessages}`);
      }
  
      return response.data.data.customerAddressUpdate.customerAddress;
    } catch (error) {
      console.error("Could not update address:", error.message);
      throw error;
    }
  }
  

  export async function getShippingProfiles(){

  }

  export async function deleteAddressAPI(customerAccessToken, addressId) {
    const query = `mutation customerAddressDelete($addressId: ID!, $customerAccessToken: String!) {
    customerAddressDelete(id: $addressId, customerAccessToken: $customerAccessToken) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
      }
    }
  }`;
  
    const variables = {
      customerAccessToken,
      addressId
    };
  
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
      
      const customerAddressDelete = response?.data?.data?.customerAddressDelete;
      const deletedCustomerAddressId = customerAddressDelete?.deletedCustomerAddressId;
      const customerUserErrors = customerAddressDelete?.customerUserErrors[0]?.message;
    
  
      if (!deletedCustomerAddressId) {
      
        throw new Error( customerUserErrors );
        
      }
  
      return deletedCustomerAddressId;
    } catch (error) {
      console.error("Could not delete the address:", error.message);
      throw error;
    }
  }

//   export async function getDefaultAddressAPI (customerAccessToken){
//     const query = `{
//     customer(customerAccessToken: ${customerAccessToken}) {
//       defaultAddress {
//         address1
//         address2
//         city
//         country
//         firstName
//         lastName
//         phone
//         province
//         zip
//       }
//     }
// }`

// try {
//   const response = await api.post("", {
//     query
//   });

//   if (response.data.errors) {
//     const errorMessages = response.data.errors
//       .map((error) => error.message)
//       .join(", ");
//     throw new Error(`GraphQL error(s): ${errorMessages}`);
//   }
  

//   const defaultAddress = "";

//   // see what it returns when there is no default address!


//   if (!deletedCustomerAddressId) {
  
//     throw new Error( customerUserErrors );
    
//   }

//   return deletedCustomerAddressId;
// } catch (error) {
//   console.error("Could not delete the address:", error.message);
//   throw error;
// }



//   }