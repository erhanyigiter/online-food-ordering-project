import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { initiatePayment } from './../../redux/slices/paymentSlice';
import { toast } from 'react-toastify';

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { loading, error, paymentStatus } = useSelector((state) => state.payment);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      console.log('[error]', stripeError);
      toast.error(`Ödeme hatası: ${stripeError.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      dispatch(initiatePayment({ stripe, elements, amount: totalAmount }));
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
    hidePostalCode: true, // Posta kodunu gizlemek için bu özelliği ekleyin
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={cardElementOptions} />
      <p className="mt-4 font-bold text-lg">Toplam Tutar: {totalAmount.toFixed(2)} TL</p>
      {loading && <p>Yükleniyor...</p>}
      {error && typeof error === 'string' && <p className="text-red-500 mt-2">{error}</p>}
      {paymentStatus && <p className="text-green-500 mt-2">Ödeme Başarılı! {paymentStatus.chargeId}</p>}
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded mt-5" disabled={!stripe || loading}>
        Ödemeyi Tamamla
      </button>
    </form>
  );
};

export default CheckoutForm;
