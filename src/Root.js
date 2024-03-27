import { CookiesProvider } from "react-cookie";
import App from "./App";

export default function Root(){
    return(
        <CookiesProvider defaultSetOptions={{path:'/'}}>
            <App/>
        </CookiesProvider>
    )
}