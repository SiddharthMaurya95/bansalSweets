import OrderSuccessPage from './[id]/page';

export default function DefaultOrderSuccessPage() {
  return <OrderSuccessPage params={Promise.resolve({ id: 'BF2026100100123' })} />;
}
