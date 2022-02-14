import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Collection = () => {
  const router = useRouter();
  console.log(router.query.collectionId);
  console.log(router.query);
  return (
    <div>
      <Link href="/">{router.query.collectionId}</Link>
    </div>
  );
};

export default Collection;
