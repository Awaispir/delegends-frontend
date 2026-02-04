import { useParams, useNavigate } from 'react-router-dom';
import { getBlogBySlug } from '../data/blogsData';
import BrandsMarquee from '../components/BrandsMarquee';
import BookSection from '../components/Booksection';
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
          <button 
            onClick={() => navigate('/blogs')}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-md"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const contentParagraphs = blog.content.split('\n\n');
  
  // Create content sections for alternating layout
  // We'll pair images with text blocks
  const contentSections = [];
  const images = blog.detailImages || [];
  
  // First section: Featured image + first 2 paragraphs
  contentSections.push({
    image: blog.image,
    text: contentParagraphs.slice(0, 2).join('\n\n'),
    position: 'left' // image on left
  });
  
  // Second section: first detail image + next 2 paragraphs
  if (images[0] && contentParagraphs[2]) {
    contentSections.push({
      image: images[0],
      text: contentParagraphs.slice(2, 4).join('\n\n'),
      position: 'right' // image on right
    });
  }
  
  // Third section: second detail image + remaining paragraphs
  if (images[1] && contentParagraphs[4]) {
    contentSections.push({
      image: images[1],
      text: contentParagraphs.slice(4).join('\n\n'),
      position: 'left' // image on left
    });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Blogs Details
          </h1>
          <p className="text-base md:text-lg text-gray-300">
            Premium barbering services for the modern gentleman
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <article className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Blog Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {/* Author and Meta Info */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            {/* Author Avatar */}
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {blog.authorInitials}
            </div>
            
            {/* Meta */}
            <div>
              <p className="text-gray-900 font-semibold text-sm">{blog.author}</p>
              <p className="text-gray-500 text-xs">{blog.date}</p>
            </div>
          </div>

          {/* Alternating Image-Text Sections */}
          <div className="space-y-12">
            {contentSections.map((section, index) => (
              <div key={index}>
                {section.position === 'left' ? (
                  /* Image LEFT, Text RIGHT */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Image Column - 40% */}
                    <div className="md:col-span-5">
                      <img 
                        src={section.image} 
                        alt={`${blog.title} - Section ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Text Column - 60% */}
                    <div className="md:col-span-7">
                      <div className="text-gray-700 leading-relaxed text-sm space-y-4">
                        {section.text.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Image RIGHT, Text LEFT */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Text Column - 60% */}
                    <div className="md:col-span-7">
                      <div className="text-gray-700 leading-relaxed text-sm space-y-4">
                        {section.text.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Image Column - 40% */}
                    <div className="md:col-span-5">
                      <img 
                        src={section.image} 
                        alt={`${blog.title} - Section ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Takeaways Box */}
          <div className="mt-12 p-5 bg-gray-50 rounded-md border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Key Takeaways
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
              <li>Regular maintenance keeps your hair healthy and styled</li>
              <li>Choose products suited to your specific hair type</li>
              <li>Professional barbers provide expert guidance</li>
              <li>Consistency is key to achieving great results</li>
            </ul>
          </div>

          {/* Social Share - Bottom */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm">Share:</span>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Facebook size={18} className="text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Twitter size={18} className="text-blue-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Linkedin size={18} className="text-blue-700" />
              </button>
            </div>
          </div>

          {/* Back to Blogs Button */}
          <div className="mt-8">
            <button 
              onClick={() => navigate('/blogs')}
              className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-2 text-sm"
            >
              ← Back to All Blogs
            </button>
          </div>
        </div>
      </article>

      {/* Brands Marquee */}
      <BrandsMarquee />

      {/* Book Section CTA */}
      <BookSection />
    </div>
  );
};

export default BlogDetails;
