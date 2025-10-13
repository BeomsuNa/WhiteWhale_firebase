import React, { useEffect, useRef, useState } from 'react';
import { ProductCard, UploadProduct } from '@/lib/product';
import { Link } from 'react-router-dom';
import { usePreFetchProduct } from '@/hooks/PreFetch';

interface MainProductCardProps {
  product: UploadProduct;
}

const MainProductCard: React.FC<MainProductCardProps> = ({ product }) => {
  if (!product) {
    alert('정보를 받아오지 못했음');
    return <div>Loading....</div>;
  }

  return (
    <article
      className="max-w-64 max-h-64 rounded-xl  border-white m-3 hover:bg-[#4B4E54] hover:border-black hover:border-2 transition-colors duration-200 group"
      id="cardBorderSection"
    >
      <Link to={`/buy/${product.id}`} state={{ product }}>
        <figure
          className="w-full h-44 flex justify-center items-center "
          id="MainProductCardImgSection"
        >
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-44  border border-black border-0.5 transition duration-300 group-hover:opacity-50"
          />

          <figcaption className="sr-only">{product.productName}</figcaption>
        </figure>
        <div className="w-full  group-hover:border-black group-hover:border-1" />
        <div
          className="flex flex-col mt-3 h-1/3 items-start"
          id="MainCardGuideLine"
        >
          <div
            id="mainCardTitle"
            className="text-white font-bold group-hover:text-black "
          >
            {product.productName}
          </div>
          <div className="w-full border-t border-white my-2 group-hover:border-black group-hover:border-1" />
          <div
            id="mainCardPrice"
            className="text-white font-bold group-hover:text-black "
          >
            {product.productPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            원
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MainProductCard;
