import { useLanguage } from '../context/LanguageContext';

const ServiceCard = ({ service }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group h-full flex flex-col">
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image}
          alt={t(service.nameKey)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Service Details */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Service Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {t(service.nameKey)}
        </h3>
        
        {/* Price */}
        <p className="text-yellow-600 font-bold text-xl mb-3">
          {service.price}
        </p>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-auto">
          {t(service.descriptionKey)}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
