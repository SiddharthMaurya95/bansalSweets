import OrderSuccessPage from '../order-success/[id]/page';

export default function OrderConfirmationIndexPage() {
  return <OrderSuccessPage params={Promise.resolve({ id: 'BF2026100100123' })} />;
}
