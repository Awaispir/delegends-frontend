import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import BrandsMarquee from '../components/BrandsMarquee';
import BookSection from '../components/Booksection';
import { Search, MapPin, Calendar, X, Mail, Phone, User, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Career = () => {
  const { t } = useLanguage();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch jobs from backend
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Fallback to empty array if API fails
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation);
    const matchesType = selectedType === 'all' || job.jobType === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleViewJob = (job) => {
    setSelectedJob(job);
  };

  const handleApplyClick = () => {
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/jobs/apply`, {
        jobId: selectedJob._id,
        ...applicationData
      });
      
      setSubmitSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setShowApplicationModal(false);
        setSubmitSuccess(false);
        setApplicationData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('career.title')}</h1>
          <p className="text-xl text-gray-300">{t('career.subtitle')}</p>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 text-white rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-6">{t('career.findJobs')}</h3>
              
              {/* Search by Keyword */}
              <div className="mb-6">
                <label className="block text-sm mb-2 text-gray-300">{t('career.searchByKeywords')}</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('career.jobTitleKeywords')}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm mb-2 text-gray-300">{t('career.locationBranch')}</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">{t('career.allLocations')}</option>
                  <option value="OLDTOWN">{t('career.oldtownBranch')}</option>
                  <option value="BIG VILNIUS">{t('career.bigVilniusBranch')}</option>
                </select>
              </div>

              {/* Search Button */}
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 mb-6">
                {t('career.search')}
              </button>

              {/* Position Type Checkboxes */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-300">{t('career.positionType')}</h4>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedType === 'full-time' || selectedType === 'all'}
                      onChange={(e) => setSelectedType(e.target.checked ? 'full-time' : 'all')}
                      className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                    />
                    <span className="ml-3 text-sm">{t('career.fullTime')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedType === 'part-time' || selectedType === 'all'}
                      onChange={(e) => setSelectedType(e.target.checked ? 'part-time' : 'all')}
                      className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                    />
                    <span className="ml-3 text-sm">{t('career.partTime')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Job Listings */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-yellow-400 text-gray-900 px-6 py-4 rounded-t-lg flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{t('career.openPositions')}: {String(filteredJobs.length).padStart(2, '0')}</h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">{t('career.sortBy')}</span>
                <select className="bg-transparent font-semibold focus:outline-none">
                  <option>{t('career.newestFirst')}</option>
                  <option>{t('career.oldestFirst')}</option>
                </select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="bg-white rounded-b-lg">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('career.loadingJobs')}</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">{t('career.noPositions')}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleViewJob(job)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ml-4"
                        >
                          View Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredJobs.length > 0 && (
                <div className="flex items-center justify-center gap-2 p-6 border-t">
                  <button className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                    1
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    3
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brands Marquee Section */}
      <BrandsMarquee />

      {/* Ready to Book Section - Reusing existing component */}
      <BookSection />
      
      {/* Job Detail Modal */}
      {selectedJob && !showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-linear-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedJob.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    selectedJob.jobType === 'full-time' ? 'bg-green-100 text-green-800' : 
                    selectedJob.jobType === 'part-time' ? 'bg-blue-100 text-blue-800' : 
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedJob.jobType === 'full-time' ? t('career.fullTime') : selectedJob.jobType === 'part-time' ? t('career.partTime') : 'Contract'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-white hover:text-yellow-400 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">{t('career.jobRequirements')}</h3>
                <p className="text-gray-700">{selectedJob.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2">{t('career.jobRequirements')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2">{t('career.benefits')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedJob.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {selectedJob.address}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Position Type: {selectedJob.jobType === 'full-time' ? t('career.fullTime') : t('career.partTime')}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  {t('career.close')}
                </button>
                <button
                  onClick={handleApplyClick}
                  className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold"
                >
                  {t('career.applyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Application Form Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold">Apply for {selectedJob.title}</h2>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setApplicationData({ name: '', email: '', phone: '', message: '' });
                }}
                className="text-white hover:text-yellow-400 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('career.applicationSuccess')}</h3>
                <p className="text-gray-600">{t('career.applicationSuccessMessage')}</p>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    {t('career.yourFullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.name}
                    onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder={t('career.yourFullName')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    {t('career.yourEmail')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder={t('career.yourEmail')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {t('career.yourPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="+370 xxx xxxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {t('career.coverLetter')}
                  </label>
                  <textarea
                    value={applicationData.message}
                    onChange={(e) => setApplicationData({ ...applicationData, message: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder={t('career.tellUsWhy')}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    disabled={submitting}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
                  >
                    {t('career.close')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold disabled:opacity-50"
                  >
                    {submitting ? t('career.submitting') : t('career.submitApplication')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Career;
