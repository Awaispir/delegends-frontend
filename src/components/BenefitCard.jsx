const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="bg-yellow-400 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-4">
        
        <div className="flex-shrink-0 text-gray-900 text-2xl">
          {icon}
        </div>
        
        {/* Content */}
        <div>
          <h3 className="text-gray-900 font-bold text-lg mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-800 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitCard;
