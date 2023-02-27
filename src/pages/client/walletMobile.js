import detectEthereumProvider from '@metamask/detect-provider';
import {useEffect} from "react";

export default function WalletMobile() {

    useEffect( () => {

    }, [])

    function connectWallet(){

    }

    return (
        <>
            <button
                className="px-4 py-2 rounded-md bg-purple-600 cursor-pointer hover:bg-purple-500 text-xl font-semibold duration-100 text-white"
                onClick={() => connectWallet("injected")}
            >
                Connect Wallet
            </button>
        </>
    )
}

