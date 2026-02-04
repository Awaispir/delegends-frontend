import { X, User } from 'lucide-react';
import { useEffect } from 'react';

const BarberProfileModal = ({ member, isOpen, onClose }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-100 rounded-full p-1.5 hover:bg-gray-200 transition z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image */}
          <div className="md:w-2/5 bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full">
              {member.profileImage ? (
                <img 
                  src={member.profileImage} 
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ minHeight: '280px', maxHeight: '320px' }}
                />
              ) : (
                <div className="w-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center" style={{ minHeight: '280px' }}>
                  <User className="w-24 h-24 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="md:w-3/5 p-6 md:p-8 bg-white">
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {member.name}
              </h2>
              <p className="text-sm text-gray-900 font-semibold uppercase tracking-wide">
                PROFESSIONAL BARBER
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 leading-relaxed text-sm">
                Lorem Ipsum is Simply Dummy Text Of The Printing And Typesetting Industry. 
                Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberProfileModal;
