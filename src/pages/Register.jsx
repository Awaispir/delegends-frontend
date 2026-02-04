import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const result = await register(formData);
    if (result.success) {
      setSuccess(true);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: t('auth.registerSuccess'),
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } else {
      setError(result.message);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: result.message || t('auth.registerFailed'),
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{t('auth.backToHome')}</span>
        </button>
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-[#d4af37]">
            DeLegends
          </h1>
          <p className="text-gray-400 text-sm">{t('auth.whereLegendsMade')}</p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{t('auth.createAccount')}</h2>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.fullName')}</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder=""
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.emailAddress')}</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.phoneNumber')}</label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.password')}</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#d4af37] text-gray-900 py-3 rounded-lg hover:bg-[#c49d2e] transition font-bold shadow-lg text-lg"
              disabled={success}
            >
              {success ? t('auth.registering') : t('auth.registerButton')}
            </button>
          </form>
        </div>

        {/* Already have account section */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-4">
            {t('auth.alreadyHaveAccount')}
          </p>
          <Link
            to="/auth/login"
            className="block w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold shadow-lg border border-gray-600"
          >
            {t('auth.loginButton')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
