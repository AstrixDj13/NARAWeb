
import { configureStore, createSlice } from "@reduxjs/toolkit";

const userInitialState = {
  accessToken: null,
  isAuthenticated: null,
  id: null,
  fullName: null,
  email: null,
  phone: null,
  addresses: [],
  defaultAddressId:null,
  areAddressesLoading: false,
  defaultAddress: null,
}

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState ,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id; 
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
    },
    setFullName(state, action){
        state.fullName = action.payload.firstName+ " " + action.payload.lastName;
    },
    setEmail(state, action){
        state.email = action.payload.email;
    },
    setPhone(state, action){
        state.phone = action.payload.phone;
    },
    setAddresses(state, action){
        state.addresses = action.payload;
        state.areAddressesLoading = false;
    },
    setAreAddressesLoading(state, action){
      state.areAddressesLoading = action.payload;
    },
    setAuthStatus(state, action){
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setDefaultAddressId(state, action){
      state.defaultAddressId = action.payload;
    },
    setDefaultAddress(state, action){
      state.defaultAddress = action.payload;
    },
    logoutUser(){
      return userInitialState;
    }
  },
});


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    id: null,
    checkoutUrl: null,
    totalQuantity: 0,
    productsInCart: null
  },
  reducers: {
    deleteCart(state){
      state.id = null;
      state.totalQuantity = 0;
      state.checkoutUrl = null;
      state.productsInCart = null;
    },
    setActiveCartId(state, action){
      state.id = action.payload;
    },
    setTotalQuantityInCart(state, action){
      state.totalQuantity = action.payload;
    },
    setProductsinCart(state, action){
      state.productsInCart = action.payload;
    },
    setCheckoutUrl(state, action){
      state.checkoutUrl = action.payload;
    }
  }

})


const activeProductSlice = createSlice({
  name: "activeProduct",
  initialState: {
    currentVariant: null,
    outOfStock: false,
  },
  reducers:{
    setCurrentVariant(state, action){
      state.currentVariant = action.payload;
    },
    setOutOfStock(state, action){
      state.outOfStock = action.payload
    }
  }

})


const appSlice = createSlice({
  name: "app",
  initialState: {
    theme: "light",

  },
  reducers: {
    setAppTheme(state, action){
      state.theme = action.payload;
    }
  }
})

const store = configureStore({
  reducer: {
    user: userSlice.reducer, 
    activeProduct: activeProductSlice.reducer,
    cart: cartSlice.reducer,
    app: appSlice.reducer
   
  },
});



export const { setUser, setFullName, setEmail, setPhone, setAddresses, setAuthStatus, setDefaultAddressId, setDefaultAddress, setAreAddressesLoading, logoutUser } = userSlice.actions;
export const {setCurrentVariant, setOutOfStock} = activeProductSlice.actions;
export const {setActiveCartId, setCheckoutUrl,setTotalQuantityInCart, setProductsinCart, deleteCart} = cartSlice.actions;
export const {setAppTheme} = appSlice.actions;

export default store;
