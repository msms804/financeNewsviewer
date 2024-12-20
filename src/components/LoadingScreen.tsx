import { CSSProperties, useState } from "react";
import { PuffLoader } from "react-spinners";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#0bb1b1",
};
export const LoadingScreen = () => {
    const [loading] = useState(true);
    const [color] = useState("#0bb1b1");
    return (
        <div>
            {/* <img src="/LoadingScreen.gif" alt="LoadingScreen" /> */}
            <PuffLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}
