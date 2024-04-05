import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import axios from "axios";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from "../../../PaymentForm";

function Cart() {
  const [cartItems, setCartItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stripePromise = loadStripe('pk_test_51OdpXTJDcbtZGU8vTc9VrQgJQ7zkGZPTgN2XvNbrgsvNyfNPlG8W0DpyeeFCvt7xXmPYE4FZEXcqztdF8srGQCgh00zMvHcFIL');

  useEffect(() => {
    getAll();
  }, []);
  
const calculateCartTotal = () => {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) return 0;
  return cartItems.reduce((total, item) => {
    const itemPrice = parseFloat(item.price);
    const itemQuantity = parseInt(item.count);
    if (isNaN(itemPrice) || isNaN(itemQuantity)) {
      console.error('Invalid price or count for item:', item);
      return total;
    }
    return total + itemPrice ;
  }, 0);
};

const cartTotal = calculateCartTotal();
// console.log("Cart Total: ", cartTotal);


  function getAll() {
    axios
      .get("http://localhost:9995/cart")
      .then((response) => {
        setCartItems(response.data.cartData);
      })
      .catch((error) => {
        setError("Error fetching cart items. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }
 
  function deletecart(itemId) {
    axios
      .delete(`http://localhost:9995/cart`, { data: { _id: itemId } })
      .then((response) => {
        setCartItems(response.data.cartData);
      })
      .catch((error) => {
        console.error("Error deleting item from the cart:", error);
        setError("Error removing item from the cart. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  
  


  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2>Shopping Cart</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div>
            {cartItems?.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div key={item.id} className="card mb-3">
                    <div className="row g-0">
                      <div className="col-md-4">
                       
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">
                            {item.product.productName}
                          </h5>
                          <p className="card-text">Quantity: {item.count}</p>
                          <p className="card-text">Price: {item.count* item.product.price}</p>                         
                         
                          <button className="btn btn-danger" onClick={() => deletecart(item.id)}>
                            Remove
                          </button>
                                                    
                         
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
               <div className="fw-bold">Total: ${calculateCartTotal().toFixed(2)}</div>
                <div className="text-center">
                 
                   <h1>Stripe Payment Integration</h1>
                   <Elements stripe={stripePromise}>
                     <PaymentForm />        
                   </Elements>
                             
                </div>                
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;


