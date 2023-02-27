import {useWeb3} from "@3rdweb/hooks"
import {useEffect} from "react";
import {useRouter} from "next/router";

export default function Wallet() {
    const {connectWallet, address, error, chainId, balance} = useWeb3();

    const router = useRouter();
    const {i} = router.query;
    console.log(i)

    error ? console.log(error) : null;

    useEffect(() => {
        if(!address) return
        fetch(`../api/authorize/wallet/${i}`, {
            method: "post",
            body: JSON.stringify({address, balance, chainId})
        }).then(response => {
            console.log("responce", response)
            window.close();
        })
    }, [i, address, balance, chainId])

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

