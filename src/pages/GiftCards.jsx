import { useState } from 'react';
import { Gift, X as CloseIcon, CreditCard, Mail, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const GiftCards = () => {
	const navigate = useNavigate();
	const { t } = useLanguage();
	const [selectedCard, setSelectedCard] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showRedeemModal, setShowRedeemModal] = useState(false);
	const [cardType, setCardType] = useState('virtual');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [recipientName, setRecipientName] = useState('');
	const [personalMessage, setPersonalMessage] = useState('');
	const [loading, setLoading] = useState(false);

	// Redeem form state
	const [redeemCode, setRedeemCode] = useState('');
	const [redeemName, setRedeemName] = useState('');
	const [redeemEmail, setRedeemEmail] = useState('');
	const [redeemBarber, setRedeemBarber] = useState('');
	const [redeemLocation, setRedeemLocation] = useState('');

	// Gift card themes with translation keys
	const giftCardThemes = [
		{
			id: 1,
			nameKey: 'giftCards.thankYou',
			amount: 25,
			descKey: 'giftCards.thankYouDesc',
			gradient: 'linear-gradient(135deg, #8B0000 0%, #4a0000 100%)',
			type: 'virtual',
			popular: false
		},
		{
			id: 2,
			nameKey: 'giftCards.birthday',
			amount: 50,
			descKey: 'giftCards.birthdayDesc',
			gradient: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)',
			type: 'physical',
			popular: true
		},
		{
			id: 3,
			nameKey: 'giftCards.christmas',
			amount: 75,
			descKey: 'giftCards.christmasDesc',
			gradient: 'linear-gradient(135deg, #0a3d0a 0%, #041e04 100%)',
			type: 'virtual',
			popular: false
		},
		{
			id: 4,
			nameKey: 'giftCards.valentines',
			amount: 100,
			descKey: 'giftCards.valentinesDesc',
			gradient: 'linear-gradient(135deg, #4b0033 0%, #2d001e 100%)',
			type: 'physical',
			popular: true
		},
		{
			id: 5,
			nameKey: 'giftCards.anniversary',
			amount: 150,
			descKey: 'giftCards.anniversaryDesc',
			gradient: 'linear-gradient(135deg, #1a334d 0%, #0a1a29 100%)',
			type: 'virtual',
			popular: false
		},
		{
			id: 6,
			nameKey: 'giftCards.corporate',
			amount: 200,
			descKey: 'giftCards.corporateDesc',
			gradient: 'linear-gradient(135deg, #3d2b1f 0%, #251910 100%)',
			type: 'physical',
			popular: false
		}
	];

	const handleCardClick = (card) => {
		setSelectedCard(card);
		setCardType(card.type);
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

	const handleCloseRedeemModal = () => {
		setShowRedeemModal(false);
		setRedeemCode('');
		setRedeemName('');
		setRedeemEmail('');
		setRedeemBarber('');
		setRedeemLocation('');
	};

	const handlePurchase = async () => {
		if (!recipientEmail || !recipientName) {
			alert(t('giftCards.fillAllFields'));
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(recipientEmail)) {
			alert(t('giftCards.validEmailRequired'));
			return;
		}

		setLoading(true);

		try {
			const giftCardData = {
				amount: selectedCard?.amount,
				theme: selectedCard?.name,
				cardType,
				purchaserName: 'Customer',
				purchaserEmail: recipientEmail,
				recipientName,
				recipientEmail,
				personalMessage
			};

			console.log('Gift card purchase data:', giftCardData);
			
			alert(`✅ Gift card for €${selectedCard?.amount} will be sent to ${recipientEmail}!\n\nNote: Payment integration pending. In production, this will process via Stripe.`);
			handleCloseModal();
		} catch (error) {
			console.error('Purchase error:', error);
			alert('Failed to purchase gift card. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleRedeem = async () => {
		if (!redeemCode || !redeemName || !redeemEmail || !redeemBarber || !redeemLocation) {
			alert(t('giftCards.fillAllFields'));
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(redeemEmail)) {
			alert(t('giftCards.validEmailRequired'));
			return;
		}

		setLoading(true);

		try {
			const redeemData = {
				code: redeemCode,
				customerName: redeemName,
				customerEmail: redeemEmail,
				barberName: redeemBarber,
				location: redeemLocation
			};

			console.log('Gift card redeem data:', redeemData);
			
			alert(`✅ ${t('giftCards.redeemSuccess')}`);
			handleCloseRedeemModal();
		} catch (error) {
			console.error('Redeem error:', error);
			alert(t('giftCards.redeemFailed'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-900">
			{/* Hero Section */}
			<section className="relative py-20 overflow-hidden">
				<div className="absolute inset-0 bg-linear-to-r from-[#d4af37]/10 to-transparent"></div>
				<div className="container mx-auto px-4 text-center relative z-10">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-[#d4af37] to-[#f4d03f] rounded-full mb-6 shadow-lg">
						<Gift className="w-10 h-10 text-black" />
					</div>
					<h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-[#ffd700] to-[#b8860b] bg-clip-text text-transparent">
						{t('giftCards.title')}
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
						{t('giftCards.subtitle')}
					</p>
				</div>
			</section>

			{/* Gift Cards Grid */}
			<section className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{giftCardThemes.map((card) => (
						<div
							key={card.id}
							onClick={() => handleCardClick(card)}
							className="group relative bg-gray-800/50 rounded-2xl overflow-hidden border-2 border-[#d4af37] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#d4af37]/40"
						>
							{/* Type Badge */}
							<div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${
								card.type === 'virtual' 
									? 'bg-blue-600 text-white' 
									: 'bg-purple-600 text-white'
							}`}>
								{t(`giftCards.${card.type}`).toUpperCase()}
							</div>

							{/* Popular Badge */}
							{card.popular && (
								<div className="absolute top-4 left-4 z-10 px-3 py-1 bg-linear-to-r from-[#ffd700] to-[#b8860b] text-black rounded-full text-xs font-bold">
									{t('giftCards.popular')}
								</div>
							)}

							{/* Card Visual */}
							<div 
								className="h-48 relative overflow-hidden"
								style={{ background: card.gradient }}
							>
								<div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70"></div>
								<div className="absolute bottom-4 left-4 right-4 z-10">
									<div className="flex items-center gap-2 mb-2">
										<Gift className="w-5 h-5 text-[#d4af37]" />
										<span className="text-white font-bold text-sm">De Legends</span>
									</div>
								</div>
							</div>

							{/* Card Content */}
							<div className="p-6">
								<h3 className="text-2xl font-bold mb-2 bg-linear-to-r from-[#ffd700] to-[#b8860b] bg-clip-text text-transparent">
									{t(card.nameKey)}
								</h3>
								<p className="text-gray-400 text-sm mb-4 min-h-[60px]">
									{t(card.descKey)}
								</p>
								<div className="text-4xl font-bold text-[#ffd700] mb-4 text-shadow">
									€{card.amount}
								</div>
								<button className="w-full bg-black border-2 border-[#d4af37] text-[#ffd700] py-3 rounded-full font-semibold uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-lg">
									{t('giftCards.viewDetails')}
								</button>
							</div>

							{/* Decorative Border */}
							<div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b]"></div>
						</div>
					))}
				</div>
			</section>

			{/* Redeem Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto bg-linear-to-br from-gray-900 to-black border-2 border-[#d4af37] rounded-3xl p-8 md:p-12 shadow-2xl">
					<h2 className="text-4xl font-bold text-center mb-4 bg-linear-to-r from-[#ffd700] to-[#b8860b] bg-clip-text text-transparent">
						{t('giftCards.redeemTitle')}
					</h2>
					<p className="text-center text-gray-400 mb-8">
						{t('giftCards.redeemSubtitle')}
					</p>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-[#d4af37]/30 flex flex-col items-center justify-center">
							<Gift className="w-16 h-16 text-[#d4af37] mb-4" />
							<h3 className="text-xl font-bold text-white mb-2">{t('giftCards.birthdayGiftCard')}</h3>
							<p className="text-gray-400 text-center text-sm">
								{t('giftCards.celebrateSpecialDay')}
							</p>
						</div>

						<div className="space-y-4">
							<button
								onClick={() => setShowRedeemModal(true)}
								className="w-full bg-linear-to-r from-[#d4af37] to-[#f4d03f] text-black py-4 rounded-full font-bold text-lg uppercase tracking-wider hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300"
							>
								{t('giftCards.redeemNow')}
							</button>
							<p className="text-xs text-gray-500 text-center">
								{t('giftCards.validityInfo')}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-[#ffd700] to-[#b8860b] bg-clip-text text-transparent">
						{t('giftCards.howItWorksTitle')}
					</h2>
					<p className="text-gray-400 max-w-3xl mx-auto">
						{t('giftCards.howItWorksSubtitle')}
					</p>
				</div>
				
				<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{[
						{
							step: '1',
							titleKey: 'giftCards.step1Title',
							descKey: 'giftCards.step1Desc'
						},
						{
							step: '2',
							titleKey: 'giftCards.step2Title',
							descKey: 'giftCards.step2Desc'
						},
						{
							step: '3',
							titleKey: 'giftCards.step3Title',
							descKey: 'giftCards.step3Desc'
						}
					].map((item) => (
						<div key={item.step} className="bg-gray-800/30 border border-[#d4af37]/30 rounded-2xl p-8 text-center hover:border-[#d4af37] transition-all duration-300">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-[#d4af37] to-[#f4d03f] rounded-full mb-4">
								<span className="text-black font-bold text-2xl">{item.step}</span>
							</div>
							<h3 className="font-bold text-xl text-white mb-3">{t(item.titleKey)}</h3>
							<p className="text-gray-400">{t(item.descKey)}</p>
						</div>
					))}
				</div>
			</section>

			{/* Bottom CTA */}
			<section className="bg-linear-to-r from-gray-900 to-black border-t border-[#d4af37]/30 py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold mb-4 text-white">{t('giftCards.ctaTitle')}</h2>
					<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
						{t('giftCards.ctaSubtitle')}
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button 
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							className="bg-linear-to-r from-[#d4af37] to-[#f4d03f] text-black px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all"
						>
							{t('giftCards.chooseGiftCard')}
						</button>
						<button 
							onClick={() => navigate('/about')}
							className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all"
						>
							{t('common.learnMore')}
						</button>
					</div>
				</div>
			</section>

			{/* Purchase Modal */}
			{showModal && selectedCard && (
				<div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
					<div className="bg-linear-to-br from-gray-900 to-black border-2 border-[#d4af37] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="bg-linear-to-r from-gray-900 to-black border-b border-[#d4af37] p-6">
							<div className="flex items-center justify-between">
								<h2 className="text-3xl font-bold bg-linear-to-r from-[#ffd700] to-[#b8860b] bg-clip-text text-transparent">
									{t(selectedCard.nameKey)} {t('nav.giftCards')}
								</h2>
								<button
									onClick={handleCloseModal}
									className="text-[#d4af37] hover:text-[#ffd700] transition-colors"
								>
									<CloseIcon className="w-6 h-6" />
								</button>
							</div>
						</div>

						{/* Modal Body */}
						<div className="p-8">
							{/* Card Preview */}
							<div 
								className="h-48 rounded-2xl mb-6 border-2 border-[#d4af37] overflow-hidden"
								style={{ background: selectedCard.gradient }}
							>
								<div className="h-full flex items-end p-6 bg-linear-to-t from-black/70 to-transparent">
									<div>
										<div className="text-5xl font-bold text-white mb-2">€{selectedCard.amount}</div>
										<div className="text-gray-300">{t('giftCards.giftCardValue')}</div>
									</div>
								</div>
							</div>

							{/* Card Type Selection */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-300 mb-3">
									{t('giftCards.deliveryMethod')}
								</label>
								<div className="grid grid-cols-2 gap-4">
									<button
										onClick={() => setCardType('virtual')}
										className={`p-4 border-2 rounded-xl transition-all ${
											cardType === 'virtual'
												? 'border-[#d4af37] bg-[#d4af37]/10'
												: 'border-gray-700 hover:border-gray-600'
										}`}
									>
										<Mail className={`w-6 h-6 mx-auto mb-2 ${
											cardType === 'virtual' ? 'text-[#d4af37]' : 'text-gray-500'
										}`} />
										<div className="font-semibold text-sm text-white">{t('giftCards.virtual')}</div>
										<div className="text-xs text-gray-400 mt-1">{t('giftCards.instantEmail')}</div>
									</button>
									<button
										onClick={() => setCardType('physical')}
										className={`p-4 border-2 rounded-xl transition-all ${
											cardType === 'physical'
												? 'border-[#d4af37] bg-[#d4af37]/10'
												: 'border-gray-700 hover:border-gray-600'
										}`}
									>
										<CreditCard className={`w-6 h-6 mx-auto mb-2 ${
											cardType === 'physical' ? 'text-[#d4af37]' : 'text-gray-500'
										}`} />
										<div className="font-semibold text-sm text-white">{t('giftCards.physical')}</div>
										<div className="text-xs text-gray-400 mt-1">{t('giftCards.days35')}</div>
									</button>
								</div>
							</div>

							{/* Form Fields */}
							<div className="space-y-4 mb-6">
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										{t('giftCards.recipientEmail')} *
									</label>
									<input
										type="email"
										required
										value={recipientEmail}
										onChange={(e) => setRecipientEmail(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
										placeholder="recipient@example.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										{t('giftCards.recipientName')} *
									</label>
									<input
										type="text"
										required
										value={recipientName}
										onChange={(e) => setRecipientName(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
										placeholder="John Doe"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										{t('giftCards.personalMessage')}
									</label>
									<textarea
										rows="3"
										value={personalMessage}
										onChange={(e) => setPersonalMessage(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
										placeholder={t('giftCards.personalMessagePlaceholder')}
									/>
								</div>
							</div>

							{/* Price Summary */}
							<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
								<div className="flex items-center justify-between mb-2 text-gray-300">
									<span>{t('giftCards.giftCardAmount')}</span>
									<span className="font-semibold text-white">€{selectedCard.amount}</span>
								</div>
								{cardType === 'physical' && (
									<div className="flex items-center justify-between mb-2 text-gray-300">
										<span>{t('giftCards.shipping')}</span>
										<span className="font-semibold text-white">€5</span>
									</div>
								)}
								<div className="border-t border-gray-700 pt-2 mt-2">
									<div className="flex items-center justify-between">
										<span className="font-bold text-white">{t('giftCards.total')}</span>
										<span className="font-bold text-2xl text-[#ffd700]">
											€{cardType === 'physical' ? selectedCard.amount + 5 : selectedCard.amount}
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<button
									onClick={handleCloseModal}
									className="flex-1 px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all"
								>
									{t('giftCards.cancel')}
								</button>
								<button
									onClick={handlePurchase}
									disabled={loading}
									className={`flex-1 px-6 py-3 bg-linear-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-semibold hover:shadow-lg transition-all ${
										loading ? 'opacity-50 cursor-not-allowed' : ''
									}`}
								>
									{loading ? t('giftCards.processing') : t('giftCards.purchase')}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Redeem Modal */}
			{showRedeemModal && (
				<div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
					<div className="bg-linear-to-br from-gray-900 to-black border-2 border-[#d4af37] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="bg-linear-to-r from-gray-900 to-black border-b border-[#d4af37] p-6">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold bg-linear-to-r from-[#ffd700] to-[#b8860b] bg-clip-text text-transparent">
									{t('giftCards.redeemGiftCard')}
								</h2>
								<button
									onClick={handleCloseRedeemModal}
									className="text-[#d4af37] hover:text-[#ffd700] transition-colors"
								>
									<CloseIcon className="w-6 h-6" />
								</button>
							</div>
						</div>

						{/* Modal Body */}
						<div className="p-8">
							<div className="space-y-4 mb-6">
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										{t('giftCards.giftCardCode')} *
									</label>
									<input
										type="text"
										required
										maxLength="12"
										value={redeemCode}
										onChange={(e) => setRedeemCode(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-center text-xl tracking-wider font-mono"
										placeholder={t('giftCards.giftCardCodePlaceholder')}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('giftCards.yourName')} *
										</label>
										<input
											type="text"
											required
											value={redeemName}
											onChange={(e) => setRedeemName(e.target.value)}
											className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
											placeholder="John Doe"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('giftCards.yourEmail')} *
										</label>
										<input
											type="email"
											required
											value={redeemEmail}
											onChange={(e) => setRedeemEmail(e.target.value)}
											className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
											placeholder="you@example.com"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										{t('giftCards.barberName')} *
									</label>
									<input
										type="text"
										required
										value={redeemBarber}
										onChange={(e) => setRedeemBarber(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
										placeholder={t('giftCards.selectBarber')}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										{t('giftCards.salonLocation')} *
									</label>
									<input
										type="text"
										required
										value={redeemLocation}
										onChange={(e) => setRedeemLocation(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
										placeholder={t('giftCards.locationPlaceholder')}
									/>
								</div>
							</div>

							{/* Info Box */}
							<div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4 mb-6">
								<div className="flex items-start gap-3">
									<Check className="w-5 h-5 text-[#d4af37] mt-0.5 shrink-0" />
									<div className="text-sm text-gray-300">
										<p className="font-semibold text-white mb-1">{t('giftCards.valid12Months')}</p>
										<p>{t('giftCards.redeemAllLocations')}</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<button
									onClick={handleCloseRedeemModal}
									className="flex-1 px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all"
								>
									{t('giftCards.cancel')}
								</button>
								<button
									onClick={handleRedeem}
									disabled={loading}
									className={`flex-1 px-6 py-3 bg-linear-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-semibold hover:shadow-lg transition-all ${
										loading ? 'opacity-50 cursor-not-allowed' : ''
									}`}
								>
									{loading ? t('giftCards.validating') : t('giftCards.validateRedeem')}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default GiftCards;
