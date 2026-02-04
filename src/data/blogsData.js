import massage1 from "../assets/massage1.png";
import massage2 from "../assets/massage2.png";
import massage3 from "../assets/massage3.png";
import candle from "../assets/candle.png";
import beard from "../assets/beard.png";
export const blogsData = [
  {
    id: 1,
    slug: 'hair-care-tips-for-men',
    title: 'Hair Care Tips For Men: A Comprehensive Guide To Healthy And Stylish Hair',
    excerpt: 'We will cover everything you need to know about hair care for men, from the basics of washing and conditioning to more advanced techniques like styling and coloring.',
    content: `We will cover everything at LEGENDS BARBERSHOP about hair care for men, from the basics of washing and conditioning to more advanced techniques like styling and coloring.

Understanding your hair type is the first step to proper hair care. Whether you have straight, wavy, curly, or coily hair, each type requires different care and products. Knowing your hair type helps you choose the right shampoo, conditioner, and styling products.

For men with straight hair, focus on adding volume and texture. Use lightweight products that won't weigh your hair down. Regular trims every 4-6 weeks help maintain shape and prevent split ends.

If you have wavy or curly hair, moisture is key. Use hydrating shampoos and conditioners, and consider leave-in treatments. Avoid over-washing, which can strip natural oils and cause frizz.

Styling tips for every hair type: Start with damp hair for best results. Use a heat protectant if blow-drying. Apply products evenly from roots to tips. Don't overuse products - a little goes a long way.

Regular visits to LEGENDS BARBERSHOP ensure your hair stays healthy and styled perfectly. Our expert barbers understand men's hair and can recommend the best products and techniques for your specific hair type and style goals.`,
    author: 'Expert Team',
    authorInitials: 'E U',
    date: 'January 15, 2024',
    category: 'Hair Care',
    image: massage1,
    detailImages: [
      candle,
      beard
    ],
    featured: true
  },
  {
    id: 2,
    slug: 'hair-care-tips-for-men-healthy-and-stylish',
    title: 'Hair Care Tips For Men: A Comprehensive Guide To Healthy And Stylish Hair',
    excerpt: 'We will cover everything you need to know about hair care for men, from the basics of washing and conditioning to more advanced techniques like styling and coloring.',
    content: `Professional hair care goes beyond just washing and conditioning. It's about understanding what your hair needs and providing it with the right nutrients and care.

Daily maintenance is crucial. Use a quality shampoo suited to your hair type. Don't wash too frequently - 2-3 times a week is often sufficient for most men. Over-washing strips natural oils that keep hair healthy.

Conditioning is not optional. It restores moisture, adds shine, and makes hair more manageable. Focus conditioner on mid-lengths to ends, avoiding the scalp to prevent greasiness.

Scalp health matters. A healthy scalp promotes healthy hair growth. Massage your scalp regularly to stimulate blood flow. Keep it clean and moisturized.

Product selection tips: Choose sulfate-free shampoos for gentler cleansing. Look for ingredients like argan oil, keratin, and biotin. Avoid products with harsh chemicals or excessive alcohol content.

At LEGENDS BARBERSHOP, we stock professional-grade products specifically formulated for men's hair. Our barbers can guide you in building the perfect hair care routine.`,
    author: 'Expert Team',
    authorInitials: 'E U',
    date: 'January 12, 2024',
    category: 'Hair Care',
    image: massage2,
    detailImages: [
      '/api/placeholder/400/300',
      '/api/placeholder/400/300'
    ],
    featured: true
  },
  {
    id: 3,
    slug: 'hair-care-tips-comprehensive-guide',
    title: 'Hair Care Tips For Men: A Comprehensive Guide To Healthy And Stylish Hair',
    excerpt: 'We will cover everything you need to know about hair care for men, from the basics of washing and conditioning to more advanced techniques like styling and coloring.',
    content: `Achieving and maintaining stylish hair requires commitment and the right approach. This comprehensive guide covers everything you need to know.

Washing techniques matter. Use lukewarm water, not hot. Hot water can damage hair and irritate the scalp. Massage shampoo gently into the scalp with your fingertips, not nails.

Drying properly prevents damage. Pat hair dry with a towel - don't rub vigorously. If using a blow dryer, keep it on medium heat and maintain distance from hair. Always move the dryer to prevent heat concentration.

Styling essentials: Invest in quality tools like combs and brushes. Use products appropriate for your desired style - pomade for sleek looks, clay for texture, gel for hold.

Common mistakes to avoid: Using too much product, neglecting regular trims, skipping heat protection, and using the wrong tools for your hair type.

Professional grooming at LEGENDS BARBERSHOP ensures your hair always looks its best. Book your appointment today and experience the difference expert care makes.`,
    author: 'Expert Team',
    authorInitials: 'E U',
    date: 'January 10, 2024',
    category: 'Styling',
    image: massage3,
    detailImages: [
      '/api/placeholder/400/300',
      '/api/placeholder/400/300'
    ],
    featured: false
  }
];

// Get all blogs
export const getAllBlogs = () => blogsData;

// Get blog by slug
export const getBlogBySlug = (slug) => {
  return blogsData.find(blog => blog.slug === slug);
};

// Get featured blogs
export const getFeaturedBlogs = () => {
  return blogsData.filter(blog => blog.featured);
};
