import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, ArrowLeft, Package, Tag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getOne(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${quantity} x ${product.title} added to cart!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('productDetail.productNotFound')}</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#d4af37] text-white px-6 py-3 rounded-lg hover:bg-[#c49d2e] transition-colors"
          >
            {t('productDetail.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Section */}
      <section className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-700 hover:text-[#d4af37] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{t('productDetail.backToProducts')}</span>
          </button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 p-12">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-[500px] object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block bg-[#d4af37]/10 text-[#d4af37] px-4 py-2 rounded-full text-sm font-semibold border border-[#d4af37]/20">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{product.title}</h1>

            {/* Price and Stock */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <span className="text-5xl font-bold text-gray-900">€{product.price}</span>
              {product.stock > 0 ? (
                <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full font-semibold flex items-center border border-green-200">
                  <Check className="w-4 h-4 mr-2" />
                  {t('productDetail.inStock')}
                </span>
              ) : (
                <span className="bg-red-50 text-red-700 px-4 py-2 rounded-full font-semibold border border-red-200">
                  {t('productDetail.outOfStock')}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('productDetail.description')}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Tag className="w-5 h-5 mr-2 text-[#d4af37]" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{t('productDetail.category')}</p>
                    <p className="font-semibold text-gray-900">{product.category}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Package className="w-5 h-5 mr-2 text-[#d4af37]" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{t('productDetail.stock')}</p>
                    <p className="font-semibold text-gray-900">
                      {product.stock > 0 ? `${product.stock} ${t('productDetail.units')}` : t('productDetail.outOfStock')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 py-4">
              <label className="text-gray-700 font-semibold">{t('productDetail.quantity')}:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center shadow-lg uppercase tracking-wide ${
                  addedToCart 
                    ? 'bg-green-500 text-white' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
                onClick={handleAddToCart}
                disabled={product?.stock === 0}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {addedToCart ? t('productDetail.addedToCart') : `${t('productDetail.addToCartButton')} - €${product?.price}`}
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-semibold text-base hover:bg-gray-200 transition-colors border border-gray-300"
              >
                {t('productDetail.continueShopping')}
              </button>
            </div>

            {/* Features */}
            <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 p-6 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">{t('productDetail.whyChooseProduct')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-700">
                  <Check className="w-5 h-5 mr-2 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <span>{t('productDetail.premiumQuality')}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <Check className="w-5 h-5 mr-2 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <span>{t('productDetail.trustedByBarbers')}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <Check className="w-5 h-5 mr-2 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <span>{t('productDetail.perfectGrooming')}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <Check className="w-5 h-5 mr-2 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <span>{t('productDetail.fastShipping')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{t('productDetail.fastDelivery')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t('productDetail.fastDeliveryDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{t('productDetail.qualityGuaranteed')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t('productDetail.qualityGuaranteedDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{t('productDetail.easyReturns')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t('productDetail.easyReturnsDesc')}</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-[#1a1f2e] text-white py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('productDetail.readyToLookBest')}</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {t('productDetail.readyToLookBestDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/select-location')}
              className="bg-[#d4af37] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#c49d2e] transition-colors"
            >
              {t('productDetail.bookNow')}
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#1a1f2e] transition-colors"
            >
              {t('productDetail.learnMore')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
