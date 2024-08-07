//import React from 'react';

//const ShopContext = React.createContext();

//export default ShopContext;
import {Children, createContext, useState} from 'react';

const ShopContext = createContext(null);

export const ShopContextProvoder = ({children}) => {
  const [shopId, setShopId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [userId, setUserId] = useState('');
  return (
    <CategoryContext.Provider
      value={{shopId, setShopId, vendorId, setVendorId, userId, setUserId}}>
      {children}
    </CategoryContext.Provider>
  );
};

export default ShopContext;
