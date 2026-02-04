import { useState } from 'react';
import { Gift, X as CloseIcon, CreditCard, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { giftCardsAPI } from '../utils/api'; // For future Stripe integration

const GiftCards = () => {
	const navigate = useNavigate();
	const [selectedCard, setSelectedCard] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [cardType, setCardType] = useState('virtual');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [recipientName, setRecipientName] = useState('');
	const [personalMessage, setPersonalMessage] = useState('');
	const [loading, setLoading] = useState(false);

	// Fixed denomination amounts in EUR
	const giftCardAmounts = [
		{ id: 1, amount: 25, popular: false },
		{ id: 2, amount: 50, popular: true },
		{ id: 3, amount: 75, popular: false },
		{ id: 4, amount: 100, popular: true },
		{ id: 5, amount: 150, popular: false },
		{ id: 6, amount: 200, popular: false },
	];

	const handleCardClick = (card) => {
		setSelectedCard(card);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedCard(null);
		setCardType('virtual');
		setRecipientEmail('');
		setRecipientName('');
		setPersonalMessage('');
	};

	const handlePurchase = async () => {
		if (!recipientEmail || !recipientName) {
			alert('Please fill in all required fields');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(recipientEmail)) {
			alert('Please enter a valid email address');
			return;
		}

		setLoading(true);

		try {
			const giftCardData = {
				amount: selectedCard?.amount,
				cardType,
				purchaserName: 'Customer',
				purchaserEmail: recipientEmail,
				recipientName,
				recipientEmail,
				personalMessage
			};

			console.log('Gift card purchase data:', giftCardData);
			// TODO: Uncomment when Stripe is configured
			// await giftCardsAPI.purchase(giftCardData);
			
			alert(`✅ Gift card for €${selectedCard?.amount} will be sent to ${recipientEmail}!\n\nNote: Payment integration pending. In production, this will process via Stripe.`);
			handleCloseModal();
		} catch (error) {
			console.error('Purchase error:', error);
			alert('Failed to purchase gift card. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section - Matching Services/Products pattern */}
			<section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
				<div className="container mx-auto px-4 text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4">
						<Gift className="w-8 h-8 text-gray-900" />
					</div>
					<h1 className="text-5xl font-bold mb-4">Gift Cards</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Give the gift of grooming excellence. Choose from our premium gift card denominations.
					</p>
				</div>
			</section>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-16">
				{/* Gift Cards Grid Section */}
				<section className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
							Available Denominations
						</h2>
						<p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Select the perfect amount for your gift. All gift cards are valid for 12 months at any De Legends location.
						</p>
					</div>
					
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{giftCardAmounts.map((card) => (
							<div
								key={card.id}
								onClick={() => handleCardClick(card)}
								className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
							>
								{/* Popular Badge */}
								{card.popular && (
									<div className="bg-yellow-400 text-gray-900 px-4 py-1 text-center text-xs font-bold">
										POPULAR CHOICE
									</div>
								)}

								{/* Card Visual */}
								<div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden min-h-[200px] flex flex-col justify-between">
									{/* Logo */}
									<div className="flex items-center gap-2 mb-6">
										<Gift className="w-5 h-5 text-yellow-400" />
										<span className="text-white font-bold text-sm">De Legends</span>
									</div>

									{/* Amount */}
									<div>
										<div className="text-5xl font-bold text-white mb-2">
											€{card.amount}
										</div>
										<div className="text-gray-400 text-sm">Gift Card</div>
									</div>

									{/* Decorative elements */}
									<div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
									<div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 opacity-10 rounded-full -ml-12 -mb-12"></div>
								</div>

								{/* Card Info */}
								<div className="p-6 border-t border-gray-200">
									<div className="space-y-3 mb-4">
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
											{card.amount >= 100 ? 'Multiple services' : 'Single service'}
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
											Valid for 12 months
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
											All locations
										</div>
									</div>

									<button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
										Select Amount
									</button>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* How It Works Section */}
				<section className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
							How Gift Cards Work
						</h2>
						<p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Simple, secure, and convenient - the perfect gift in just three steps
						</p>
					</div>
					
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="bg-white rounded-xl p-8 shadow-lg text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4">
								<span className="text-gray-900 font-bold text-2xl">1</span>
							</div>
							<h3 className="font-bold text-xl text-gray-900 mb-3">Choose Amount</h3>
							<p className="text-gray-600">
								Select from our fixed denominations ranging from €25 to €200
							</p>
						</div>
						
						<div className="bg-white rounded-xl p-8 shadow-lg text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4">
								<span className="text-gray-900 font-bold text-2xl">2</span>
							</div>
							<h3 className="font-bold text-xl text-gray-900 mb-3">Select Delivery</h3>
							<p className="text-gray-600">
								Choose virtual delivery via email or physical card by mail
							</p>
						</div>
						
						<div className="bg-white rounded-xl p-8 shadow-lg text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4">
								<span className="text-gray-900 font-bold text-2xl">3</span>
							</div>
							<h3 className="font-bold text-xl text-gray-900 mb-3">Redeem</h3>
							<p className="text-gray-600">
								Recipient can use the card at any De Legends location
							</p>
						</div>
					</div>
				</section>
			</div>

			{/* Bottom CTA Section - Matching Products page pattern */}
			<section className="bg-[#1a1f2e] text-white py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold mb-4">Ready to Gift Excellence?</h2>
					<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
						Purchase a gift card today and share the De Legends experience with someone special.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button 
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							className="bg-[#d4af37] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#c49d2e] transition-colors"
						>
							Choose Gift Card
						</button>
						<button 
							onClick={() => navigate('/about')}
							className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#1a1f2e] transition-colors"
						>
							Learn More
						</button>
					</div>
				</div>
			</section>

			{/* Purchase Modal */}
			{showModal && selectedCard && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								€{selectedCard.amount} Gift Card
							</h2>
							<button
								onClick={handleCloseModal}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<CloseIcon className="w-6 h-6" />
							</button>
						</div>

						{/* Card Type Selection */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-3">
								Delivery Method
							</label>
							<div className="grid grid-cols-2 gap-4">
								<button
									onClick={() => setCardType('virtual')}
									className={`p-4 border-2 rounded-lg transition-all ${
										cardType === 'virtual'
											? 'border-yellow-400 bg-yellow-50'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									<Mail className={`w-6 h-6 mx-auto mb-2 ${
										cardType === 'virtual' ? 'text-yellow-600' : 'text-gray-400'
									}`} />
									<div className="font-semibold text-sm">Virtual</div>
									<div className="text-xs text-gray-500 mt-1">Instant email</div>
								</button>
								<button
									onClick={() => setCardType('physical')}
									className={`p-4 border-2 rounded-lg transition-all ${
										cardType === 'physical'
											? 'border-yellow-400 bg-yellow-50'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									<CreditCard className={`w-6 h-6 mx-auto mb-2 ${
										cardType === 'physical' ? 'text-yellow-600' : 'text-gray-400'
									}`} />
									<div className="font-semibold text-sm">Physical</div>
									<div className="text-xs text-gray-500 mt-1">3-5 days</div>
								</button>
							</div>
						</div>

						{/* Form Fields */}
						<div className="space-y-4 mb-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Recipient Email *
								</label>
								<input
									type="email"
									required
									value={recipientEmail}
									onChange={(e) => setRecipientEmail(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
									placeholder="recipient@example.com"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Recipient Name *
								</label>
								<input
									type="text"
									required
									value={recipientName}
									onChange={(e) => setRecipientName(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
									placeholder="John Doe"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Personal Message (Optional)
								</label>
								<textarea
									rows="3"
									value={personalMessage}
									onChange={(e) => setPersonalMessage(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
									placeholder="Write a personal message..."
								/>
							</div>
						</div>

						{/* Price Summary */}
						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<div className="flex items-center justify-between mb-2">
								<span className="text-gray-600">Gift Card Amount</span>
								<span className="font-semibold">€{selectedCard.amount}</span>
							</div>
							{cardType === 'physical' && (
								<div className="flex items-center justify-between mb-2">
									<span className="text-gray-600">Shipping</span>
									<span className="font-semibold">€5</span>
								</div>
							)}
							<div className="border-t border-gray-200 pt-2 mt-2">
								<div className="flex items-center justify-between">
									<span className="font-bold text-gray-900">Total</span>
									<span className="font-bold text-xl text-gray-900">
										€{cardType === 'physical' ? selectedCard.amount + 5 : selectedCard.amount}
									</span>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<button
								onClick={handleCloseModal}
								className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handlePurchase}
								disabled={loading}
								className={`flex-1 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors ${
									loading ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							>
								{loading ? 'Processing...' : 'Purchase'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default GiftCards;
