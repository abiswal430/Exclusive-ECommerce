import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data));
  }, []);

  return (
    <div className="p-10">
      <img src={product.image} className="h-60" />
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}