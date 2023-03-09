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
        if (!address) return
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
            <div className="container">
                <button
                    onClick={() => connectWallet("injected")}
                >
                    Подключить кошелек
                </button>
            </div>
        </>
    )
}

