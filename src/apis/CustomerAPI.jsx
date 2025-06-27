import api from "../utils/interceptors";
export async function SendRecoveryEmailAPI(email) {
  const query = `mutation recoverCustomerAccount($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

  try {
    const response = await api.post("", {
      query,
      variables: { email },
    });

    console.log("logging response: ", response);
    const userErrors = response?.data?.data?.customerRecover?.customerUserErrors?.map((el) => el.message).join(". ");
    
    if (response?.data?.errors) {
      throw new Error(
        "Could not send recovery email: " + response.data.errors[0].message
      );
    } else if (userErrors !== "") {
      throw new Error(userErrors);
    } else {
      return true;
    }
  } catch (error) {
    console.error("Account recovery error:", error.message);
    throw error;
  }
}

/* 
{
    "data": {
        "customerRecover": null
    },
    "errors": [
        {
            "message": "Resetting password limit exceeded. Please try again later.",
            "path": [
                "customerRecover"
            ],
            "locations": []
        }
    ]
}
*/

/* 
{
    "data": {
        "customerRecover": {
            "customerUserErrors": [
                {
                    "code": "UNIDENTIFIED_CUSTOMER",
                    "field": [
                        "email"
                    ],
                    "message": "Could not find customer"
                }
            ]
        }
    }
}
*/
