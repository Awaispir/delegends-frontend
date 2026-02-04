import { getAllBlogs } from '../data/blogsData';
import BlogCard from '../components/BlogCard';
import BrandsMarquee from '../components/BrandsMarquee';
import BookSection from '../components/Booksection';

const Blogs = () => {
  const blogs = getAllBlogs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Blogs
          </h1>
          <p className="text-base md:text-lg text-gray-300">
            Premium barbering services for the modern gentleman
          </p>
        </div>
      </section>

      {/* Blogs Grid Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-10">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-3 rounded-md transition-colors duration-300">
              Load More
            </button>
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <BrandsMarquee />

      {/* Book Section CTA */}
      <BookSection />
    </div>
  );
};

export default Blogs;
