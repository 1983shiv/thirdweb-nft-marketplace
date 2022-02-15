import Header from "../../components/Header";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import NFTImage from "../../components/nft/NFTImage";
import GeneralDetails from "../../components/nft/GeneralDetails";
import ItemActivity from "../../components/nft/ItemActivity";
import Purchase from "../../components/nft/Purchase";

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

const Nft = () => {
  // Obtained from thirdweb marketplace module address
  const thirdweb_marketplace_address =
    "0x9caC978c276C45F28Ce2f107f64D31E1Fb1d3FE5";

  // Obtained from Alchemyapi login and get api key
  const rinkebyApi =
    "https://eth-rinkeby.alchemyapi.io/v2/hcCvusCahyTNn6nBkkbOS3jBzZ_FfBoP";

  const { provider } = useWeb3();
  const [selectedNft, setSelectedNft] = useState();
  const [listings, setListings] = useState([]);
  const router = useRouter();

  const { nftId } = router.query;

  const nftModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(provider.getSigner(), rinkebyApi);
    return sdk.getNFTModule("0xcB08316B15fD524886078ED8F95BD9967172CB95");
  }, [provider]);

  // get all the NFTs in the collection
  useEffect(() => {
    if (!nftModule) return console.log("nftModule is not defined");
    if (!nftModule) return;

    (async () => {
      const nfts = await nftModule.getAll();
      setSelectedNft(nfts.find((nft) => nft.id === nftId));
    })();
  }, [nftModule]);

  const marketPlaceModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(provider.getSigner(), rinkebyApi);
    return sdk.getMarketplaceModule(thirdweb_marketplace_address);
  }, [provider]);

  useEffect(() => {
    if (!marketPlaceModule) return;

    (async () => {
      setListings(await marketPlaceModule.getAllListings());
    })();
  }, [marketPlaceModule]);

  return (
    <>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              {/* <NFTImage selectedNft={selectedNft} /> */}
            </div>
            {/* <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase
                selectedNft={selectedNft}
                listings={listings}
                isListed={router.query.isListed}
                marketPlaceModule={marketPlaceModule}
              />
            </div> */}
          </div>
          {/* <ItemActivity /> */}
        </div>
      </div>
    </>
  );
};

export default Nft;
