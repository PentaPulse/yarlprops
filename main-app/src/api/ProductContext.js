import * as React from "react";

const ProductContext = React.createContext();

export const ProductProvider =({children})=>{
    const [product,setProduct] =React.useState(null)
    const [loading, setLoading] = React.useState(true);

    return(
        <ProductContext.Provider value={{product}}>
            {!loading ? "":children}
        </ProductContext.Provider>
    )
}

export const useProduct = ()=> React.useContext(ProductContext)