import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart } from 'lucide-react';
import Swal from 'sweetalert2';
import Hero1 from '../assets/Hero1.png';
import Hero2 from '../assets/Hero2.png';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Show all');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const categories = [
    t('productsPage.showAll'),
    t('productsPage.hairCare'),
    t('productsPage.faceAndBody'),
    t('productsPage.beards'),
    t('productsPage.hairdressingSupplies')
  ];

  const categoryMapping = {
    [t('productsPage.showAll')]: 'Show all',
    [t('productsPage.hairCare')]: 'Hair care',
    [t('productsPage.faceAndBody')]: 'Face and body',
    [t('productsPage.beards')]: 'Beards',
    [t('productsPage.hairdressingSupplies')]: 'Hairdressing supplies'
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      console.log('Products fetched:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = categoryMapping[selectedCategory] === 'Show all'
    ? products
    : products.filter(product => product.category === categoryMapping[selectedCategory]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${product.title} added to cart!`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat py-24 overflow-hidden"
        style={{ backgroundImage: `url(${Hero1})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-2xl">{t('productsPage.title')}</h1>
          <p className="text-gray-200 text-xl max-w-3xl mx-auto leading-relaxed">
            {t('productsPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#d4af37] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#d4af37] mx-auto mb-4"></div>
            <p className="text-gray-600">{t('productsPage.loadingProducts')}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
                >
                  {/* Product Image */}
                  <div 
                    className="bg-gradient-to-b from-gray-50 to-white h-72 flex items-center justify-center overflow-hidden cursor-pointer p-8"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain drop-shadow-lg hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 text-center border-t border-gray-300">
                    <h3 className="font-normal text-gray-800 mb-3 text-base h-12 flex items-center justify-center">
                      {product.title}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mb-5">
                      €{product.price}
                    </p>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-black text-white py-3.5 rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors shadow-md"
                    >
                      {t('productDetail.addToCartButton')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <button className="bg-[#d4af37] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#c49d2e] transition-colors">
                {t('productsPage.loadMore')}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">{t('productsPage.noProducts')}</p>
          </div>
        )}
      </div>

      {/* Ready to Look Your Best Section */}
      <section className="bg-[#1a1f2e] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('productsPage.readyToLookBest')}</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {t('productsPage.readyToLookBestDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/select-location')}
              className="bg-[#d4af37] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#c49d2e] transition-colors"
            >
              {t('productsPage.bookNow')}
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#1a1f2e] transition-colors"
            >
              {t('productsPage.learnMore')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer
      <footer className="bg-[#0f1419] text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 DeLegends Barber Shop. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            Premium services | Professional care | Trusted by professionals
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Products;
