import React, {useState} from 'react';
import ShopContext from './ShopContext';

const ShopContextProvider = ({children}) => {
  const [shopId, setShopId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [userId, setUserId] = useState('');
  return (
    <ShopContext.Provider
      value={{shopId, setShopId, vendorId, setVendorId, userId, setUserId}}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
