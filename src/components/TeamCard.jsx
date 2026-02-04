import { User } from 'lucide-react';

const TeamCard = ({ member, onViewProfile }) => {
  return (
    <div className="bg-white  overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-8">
      {/* Circular Profile Image */}
      <div className="w-60 h-60 mb-6 rounded-full overflow-hidden  shadow-lg">
        {member.profileImage ? (
          <img 
            src={member.profileImage} 
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <User className="w-16 h-16 text-white" />
          </div>
        )}
      </div>
      
      {/* Name */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        {member.name}
      </h3>
      
      {/* Role */}
      <p className="text-gray-600 font-semibold mb-4 text-center">
        Professional Barber
      </p>
      
      {/* Description */}
      <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
        Lorem Ipsum is Simply Dummy Text Of The Printing And Typesetting Industry. 
        Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s
      </p>
      
      {/* View Profile Button */}
      <button 
        onClick={() => onViewProfile(member)}
        className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold"
      >
        View Profile
      </button>
    </div>
  );
};

export default TeamCard;
