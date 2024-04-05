import { useNavigate } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
      <img
        src="https://img.icons8.com/dotty/80/purchase-order.png"
        alt="purchase-order"
        style={{ width: '100px', height: '100px' }}       
      />
      <p>Thank you! Your order is confirmed.</p>
      <button className='btn btn-info'
        onClick={() => navigate('/')}
        style={{ marginTop: '20px' }}
      >
        Continue Shopping
      </button>
    </div>
  )
}

export default Checkout;




