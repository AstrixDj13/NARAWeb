import api from "../utils/interceptors";
export async function getAllOrders (customerAccessToken){
    const query = `{
  customer(customerAccessToken: "${customerAccessToken}") {
    orders(first: 100) {
      edges {
        node {
          financialStatus
          customerUrl
          fulfillmentStatus
          orderNumber
          name
          id
          statusUrl
          lineItems(first: 100) {
            edges {
              node {
                quantity
                title
                variant {
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                  }
                }
              }
            }
          }
          processedAt
        }
      }
      totalCount
    }
  }
}
`




try {
    const response = await api.post("", {
      query
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors
        .map((error) => error.message)
        .join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    // for invalid access token
    if(response?.data?.customer === null){
      throw new Error ("Unidentified user!");
    }

    // when no orders
    const orders = response.data.data.customer.orders.edges;
    if (orders.length==0) {
      return [];
    }

    const lineItems = extractLineItems(orders);
    
    return lineItems;
    
  } catch (error) {
    console.error("could not get order details: ", error.message);
    throw error;
  }

}


function extractLineItems(orders) {
  const extractedItems = [];

  orders.forEach(orderObj => {
      const { node: order } = orderObj;
      const { orderNumber, fulfillmentStatus, processedAt, financialStatus, statusUrl } = order;

      // Convert processedAt to IST and extract date only
      const processedDate = new Date(processedAt);
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istDate = new Date(processedDate.getTime() + istOffset);

      const processedDateOnly = istDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Calculate expected delivery date (7 days after the processing date)
      const expectedDeliveryDate = new Date(istDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const expectedDateOfDelivery = expectedDeliveryDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Loop through lineItems and extract necessary fields
      order.lineItems.edges.forEach(item => {
          const { title: name, variant } = item.node;
          const { selectedOptions, image } = variant;
          const sizeOption = selectedOptions.find(option => option.name === "Size");
          const size = sizeOption ? sizeOption.value : null;
          const { quantity } = item.node;

          // Push the required details into extractedItems array
          extractedItems.push({
              name,
              size,
              quantity,
              imageUrl: image.url,
              orderId: orderNumber,
              fulfillmentStatus,
              financialStatus,
              customerUrl:statusUrl,
              processingDate: processedDateOnly,
              expectedDateOfDelivery
          });
      });
  });

  return extractedItems;
}