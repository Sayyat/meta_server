import 'bootstrap/dist/css/bootstrap.min.css';
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

import "regenerator-runtime/runtime";

function MyApp({ Component, pageProps }) {
  const supportedChainIds = [1, 56, 80001, 4, 5];

  const connectors = {
    injected: {},
  };

  return (
      <ThirdwebWeb3Provider
          supportedChainIds={supportedChainIds}
          connectors={connectors}
      >
        <Component {...pageProps} />
      </ThirdwebWeb3Provider>
  );
}

export default MyApp;