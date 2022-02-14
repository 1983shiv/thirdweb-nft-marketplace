import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useWeb3 } from "@3rdweb/hooks";
import { client } from "./../../lib/sanityClient";
import { ThirdwebSDK } from "@3rdweb/sdk";
import Header from "./../../components/Header";
import { CgWebsite } from "react-icons/cg";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";
import NFTCard from "./../../components/NFTCard";

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

const Collection = () => {
  const router = useRouter();
  const { provider } = useWeb3();
  const { collectionId } = router.query;
  const [collection, setCollection] = useState({});
  const [nfts, setNfts] = useState([]);
  const [listing, setListing] = useState([]);

  // Obtained from thirdweb marketplace module address
  const thirdweb_marketplace_address =
    "0x9caC978c276C45F28Ce2f107f64D31E1Fb1d3FE5";

  // Obtained from Alchemyapi login and get api key
  const rinkebyApi =
    "https://eth-rinkeby.alchemyapi.io/v2/hcCvusCahyTNn6nBkkbOS3jBzZ_FfBoP";

  const nftModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(provider.getSigner(), rinkebyApi);
    return sdk.getNFTModule(collectionId);
  }, [provider]);

  // get all the collections in the collection
  useEffect(async () => {
    if (!nftModule) return;

    const nfts = await nftModule.getAll();
    setNfts(nfts);
  }, [nftModule]);

  const marketPlaceModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(provider.getSigner(), rinkebyApi);
    return sdk.getMarketplaceModule(thirdweb_marketplace_address);
  }, [provider]);

  // get all the listing in the collection
  useEffect(() => {
    if (!marketPlaceModule) return;

    async () => {
      const listingData = await marketPlaceModule.getAll();
      setListing(listingData);
    };
  }, [marketPlaceModule]);

  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`;

    const collectionData = await sanityClient.fetch(query);

    await setCollection(collectionData[0]);
  };

  useEffect(() => {
    fetchCollectionData();
  }, [collectionId]);

  console.log("collections", nfts);

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : "https://via.placeholder.com/200"
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : "https://via.placeholder.com/200"
            }
            alt="profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{" "}
            <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {collection?.allOwners ? collection.allOwners.length : ""}
              </div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}.5K
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap ">
        {nfts.map((nftItem, id) => (
          <NFTCard
            key={id}
            nftItem={nftItem}
            title={collection?.title}
            listings={listing}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;

// query for sanity

// *[_type == "marketItems" && contractAddress == "0xcB08316B15fD524886078ED8F95BD9967172CB95"]{
//   "imageUrl": profileImage.asset->url,
//   "bannerImageUrl": bannerImage.asset->url,
//   volumeTraded,
//   createdBy,
//   contractAddress,
//   title,
//   floorPrice,
//   "creator": createdBy->setTheUsername,
//   description
// }

// Results
// {9 items
//   "bannerImageUrl":"https://cdn.sanity.io/images/uetkro65/production/f1289cf8c5bab250f93e92dc9f48142c4858e2b3-800x637.jpg"
//   "contractAddress":"0xcB08316B15fD524886078ED8F95BD9967172CB95"
//   "createdBy":{2 items
//   "_ref":"0x7289F56110c9DaFccbbd2297d8FE6DA54CE6d85f"
//   "_type":"reference"
//   }
//   "creator":NULL
//   "description":"We have more than 10,000 collections for Ninja NFTs"
//   "floorPrice":84
//   "imageUrl":"https://cdn.sanity.io/images/uetkro65/production/6a51719d49aa547e1d9ea9b1e0373dbe0ca10d52-293x293.png"
//   "title":"Bored Ninja Apt Club"
//   "volumeTraded":234
//   }
