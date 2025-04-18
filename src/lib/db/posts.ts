import { BlogPost, BlogPostsResponse } from '@/types/blog';

// Initial posts data
const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with LED Lighting',
    content: '<h2>Introduction to LED Lighting</h2><p>LED lighting has revolutionized the way we illuminate our spaces. With superior energy efficiency and longevity, LEDs are the future of lighting technology.</p><p>Key benefits include:</p><ul><li>Energy savings up to 75%</li><li>Lifespan of 25,000+ hours</li><li>Reduced maintenance costs</li></ul>',
    author: 'John Doe',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['LED', 'Basics', 'Energy Efficiency'],
  },
  {
    id: '2',
    title: 'Smart LED Solutions for Home',
    content: '<h2>Transform Your Home with Smart LEDs</h2><p>Smart LED solutions offer unprecedented control over your home lighting. From voice commands to automated schedules, discover how to create the perfect ambiance.</p>',
    author: 'Jane Smith',
    createdAt: '2025-04-02T14:30:00Z',
    updatedAt: '2025-04-02T14:30:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Smart Home', 'Automation', 'LED'],
  },
  {
    id: '3',
    title: 'Commercial LED Applications',
    content: '<h2>LED Solutions for Business</h2><p>Discover how commercial spaces can benefit from LED technology. From office buildings to retail stores, learn about the best practices for implementation.</p>',
    author: 'Mike Johnson',
    createdAt: '2025-04-03T09:15:00Z',
    updatedAt: '2025-04-03T09:15:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Commercial', 'Business', 'LED'],
  },
  {
    id: '4',
    title: 'LED Color Temperature Guide',
    content: '<h2>Understanding Color Temperature</h2><p>Learn about Kelvin ratings and how they affect the mood and functionality of your space. From warm white to daylight, find the perfect temperature for each room.</p>',
    author: 'Sarah Johnson',
    createdAt: '2025-04-04T11:20:00Z',
    updatedAt: '2025-04-04T11:20:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Color Temperature', 'Design', 'LED'],
  },
  {
    id: '5',
    title: 'Energy Savings with LED',
    content: '<h2>Calculate Your Savings</h2><p>Discover how switching to LED can dramatically reduce your energy bills. Includes calculators and real-world case studies.</p>',
    author: 'David Wilson',
    createdAt: '2025-04-05T13:45:00Z',
    updatedAt: '2025-04-05T13:45:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Energy Efficiency', 'Cost Savings', 'LED'],
  },
  {
    id: '6',
    title: 'LED Installation Tips',
    content: '<h2>DIY LED Installation Guide</h2><p>Step-by-step guide to installing LED lighting in your home. From simple bulb replacement to complete fixture installation.</p>',
    author: 'Tom Anderson',
    createdAt: '2025-04-06T15:30:00Z',
    updatedAt: '2025-04-06T15:30:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['DIY', 'Installation', 'LED'],
  },
  {
    id: '7',
    title: 'LED vs Traditional Lighting',
    content: '<h2>Comparative Analysis</h2><p>A detailed comparison of LED lighting versus traditional options. Understand the pros and cons of each technology.</p>',
    author: 'Emily Brown',
    createdAt: '2025-04-07T16:20:00Z',
    updatedAt: '2025-04-07T16:20:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Comparison', 'Traditional', 'LED'],
  },
  {
    id: '8',
    title: 'Outdoor LED Lighting',
    content: '<h2>Illuminate Your Exterior</h2><p>From security lights to landscape lighting, discover how LED can transform your outdoor spaces while saving energy.</p>',
    author: 'Robert Martinez',
    createdAt: '2025-04-08T17:10:00Z',
    updatedAt: '2025-04-08T17:10:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Outdoor', 'Landscape', 'LED'],
  },
  {
    id: '9',
    title: 'LED for Retail Spaces',
    content: '<h2>Retail Lighting Solutions</h2><p>Learn how proper LED lighting can increase sales and create an inviting shopping environment.</p>',
    author: 'Lisa Wong',
    createdAt: '2025-04-09T18:05:00Z',
    updatedAt: '2025-04-09T18:05:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Retail', 'Commercial', 'LED'],
  },
  {
    id: '10',
    title: 'LED Maintenance Guide',
    content: '<h2>Keeping Your LEDs Running</h2><p>Best practices for maintaining LED lighting systems and troubleshooting common issues.</p>',
    author: 'Chris Taylor',
    createdAt: '2025-04-10T19:00:00Z',
    updatedAt: '2025-04-10T19:00:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Maintenance', 'Tips', 'LED'],
  },
  {
    id: '11',
    title: 'Smart LED Controls',
    content: '<h2>Advanced Control Systems</h2><p>Explore the latest in LED control technology, from smartphone apps to voice commands.</p>',
    author: 'Alex Rivera',
    createdAt: '2025-04-11T20:15:00Z',
    updatedAt: '2025-04-11T20:15:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Smart Controls', 'Automation', 'LED'],
  },
  {
    id: '12',
    title: 'LED for Office Spaces',
    content: '<h2>Productive Lighting Solutions</h2><p>Design optimal office lighting that increases productivity and employee well-being.</p>',
    author: 'Jennifer Lee',
    createdAt: '2025-04-12T21:30:00Z',
    updatedAt: '2025-04-12T21:30:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Office', 'Commercial', 'LED'],
  },
  {
    id: '13',
    title: 'LED Emergency Lighting',
    content: '<h2>Safety First</h2><p>Understanding emergency lighting requirements and how LED solutions can enhance safety.</p>',
    author: 'Mark Thompson',
    createdAt: '2025-04-13T22:45:00Z',
    updatedAt: '2025-04-13T22:45:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Emergency', 'Safety', 'LED'],
  },
  {
    id: '14',
    title: 'LED Dimming Solutions',
    content: '<h2>Perfect Light Control</h2><p>Everything you need to know about LED dimming technologies and compatibility.</p>',
    author: 'Rachel Green',
    createdAt: '2025-04-14T23:50:00Z',
    updatedAt: '2025-04-14T23:50:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Dimming', 'Control', 'LED'],
  },
  {
    id: '15',
    title: 'Industrial LED Applications',
    content: '<h2>Heavy-Duty Lighting</h2><p>Industrial-grade LED solutions for warehouses, factories, and other demanding environments.</p>',
    author: 'Steve Miller',
    createdAt: '2025-04-15T01:00:00Z',
    updatedAt: '2025-04-15T01:00:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Industrial', 'Heavy-Duty', 'LED'],
  },
  {
    id: '16',
    title: 'LED and IoT Integration',
    content: '<h2>Connected Lighting</h2><p>How LED lighting systems integrate with the Internet of Things for smarter buildings.</p>',
    author: 'Patricia Chen',
    createdAt: '2025-04-16T02:15:00Z',
    updatedAt: '2025-04-16T02:15:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['IoT', 'Smart Building', 'LED'],
  },
  {
    id: '17',
    title: 'LED for Healthcare',
    content: '<h2>Medical Facility Lighting</h2><p>Specialized LED solutions for hospitals, clinics, and other healthcare facilities.</p>',
    author: 'Dr. James Wilson',
    createdAt: '2025-04-17T03:30:00Z',
    updatedAt: '2025-04-17T03:30:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Healthcare', 'Medical', 'LED'],
  },
  {
    id: '18',
    title: 'LED Display Technology',
    content: '<h2>Digital Displays</h2><p>Understanding LED display technology for advertising and information systems.</p>',
    author: 'Kevin Park',
    createdAt: '2025-04-18T04:45:00Z',
    updatedAt: '2025-04-18T04:45:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Display', 'Digital', 'LED'],
  },
  {
    id: '19',
    title: 'Sustainable LED Practices',
    content: '<h2>Environmental Impact</h2><p>How LED lighting contributes to environmental sustainability and green building practices.</p>',
    author: 'Emma Davis',
    createdAt: '2025-04-19T05:50:00Z',
    updatedAt: '2025-04-19T05:50:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Sustainability', 'Green', 'LED'],
  },
  {
    id: '20',
    title: 'LED Art Installations',
    content: '<h2>Creative Lighting</h2><p>Exploring the use of LED technology in art and creative installations.</p>',
    author: 'Maya Rodriguez',
    createdAt: '2025-04-20T06:55:00Z',
    updatedAt: '2025-04-20T06:55:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Art', 'Creative', 'LED'],
  },
  {
    id: '21',
    title: 'LED Sports Lighting',
    content: '<h2>Athletic Facility Solutions</h2><p>Professional LED lighting solutions for sports venues and recreational facilities.</p>',
    author: 'Brian Johnson',
    createdAt: '2025-04-21T07:00:00Z',
    updatedAt: '2025-04-21T07:00:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Sports', 'Recreation', 'LED'],
  },
  {
    id: '22',
    title: 'LED Security Lighting',
    content: '<h2>Safety and Security</h2><p>Implementing effective security lighting using LED technology.</p>',
    author: 'Sandra White',
    createdAt: '2025-04-22T08:05:00Z',
    updatedAt: '2025-04-22T08:05:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Security', 'Safety', 'LED'],
  },
  {
    id: '23',
    title: 'LED Retrofit Guide',
    content: '<h2>Upgrading to LED</h2><p>Complete guide to retrofitting existing lighting systems with LED technology.</p>',
    author: 'Paul Anderson',
    createdAt: '2025-04-23T09:10:00Z',
    updatedAt: '2025-04-23T09:10:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Retrofit', 'Upgrade', 'LED'],
  },
  {
    id: '24',
    title: 'LED Certification Standards',
    content: '<h2>Quality Assurance</h2><p>Understanding LED certification standards and quality metrics.</p>',
    author: 'Linda Martinez',
    createdAt: '2025-04-24T10:15:00Z',
    updatedAt: '2025-04-24T10:15:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Certification', 'Standards', 'LED'],
  },
  {
    id: '25',
    title: 'LED for Photography',
    content: '<h2>Professional Lighting</h2><p>Using LED lighting in photography and video production.</p>',
    author: 'Michael Scott',
    createdAt: '2025-04-25T11:20:00Z',
    updatedAt: '2025-04-25T11:20:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Photography', 'Video', 'LED'],
  },
  {
    id: '26',
    title: 'LED Market Trends',
    content: '<h2>Industry Analysis</h2><p>Current trends and future predictions for the LED lighting industry.</p>',
    author: 'Andrew Kim',
    createdAt: '2025-04-26T12:25:00Z',
    updatedAt: '2025-04-26T12:25:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Market', 'Trends', 'LED'],
  },
  {
    id: '27',
    title: 'LED for Horticulture',
    content: '<h2>Growing with LED</h2><p>LED lighting solutions for indoor farming and horticulture applications.</p>',
    author: 'Sarah Green',
    createdAt: '2025-04-27T13:30:00Z',
    updatedAt: '2025-04-27T13:30:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Horticulture', 'Farming', 'LED'],
  },
  {
    id: '28',
    title: 'LED Cost Analysis',
    content: '<h2>Financial Planning</h2><p>Detailed cost analysis and ROI calculations for LED lighting projects.</p>',
    author: 'Robert Fisher',
    createdAt: '2025-04-28T14:35:00Z',
    updatedAt: '2025-04-28T14:35:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Cost', 'ROI', 'LED'],
  },
  {
    id: '29',
    title: 'LED Warranty Guide',
    content: '<h2>Understanding Coverage</h2><p>What to look for in LED warranties and how to protect your investment.</p>',
    author: 'Diana Lee',
    createdAt: '2025-04-29T15:40:00Z',
    updatedAt: '2025-04-29T15:40:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Warranty', 'Protection', 'LED'],
  },
  {
    id: '30',
    title: 'Future of LED Technology',
    content: '<h2>Innovation Ahead</h2><p>Exploring upcoming LED technologies and innovations in the lighting industry.</p>',
    author: 'Thomas Wright',
    createdAt: '2025-04-30T16:45:00Z',
    updatedAt: '2025-04-30T16:45:00Z',
    imageUrl: 'https://dummyimage.com/640x480/',
    tags: ['Innovation', 'Future', 'LED'],
  },
];

// Create a singleton store
class PostStore {
  private static instance: PostStore;
  private posts: BlogPost[] = [...initialPosts];

  private constructor() {}

  static getInstance(): PostStore {
    if (!PostStore.instance) {
      PostStore.instance = new PostStore();
    }
    return PostStore.instance;
  }

  getPosts(): BlogPost[] {
    return this.posts;
  }

  getPost(id: string): BlogPost | undefined {
    return this.posts.find(post => post.id === id);
  }

  addPost(post: BlogPost): void {
    this.posts.unshift(post);
  }

  updatePost(id: string, updatedPost: Partial<BlogPost>): void {
    const index = this.posts.findIndex(post => post.id === id);
    if (index !== -1) {
      this.posts[index] = { ...this.posts[index], ...updatedPost };
    }
  }

  deletePost(id: string): void {
    this.posts = this.posts.filter(post => post.id !== id);
  }
}

// Export singleton instance methods
export const posts = PostStore.getInstance().getPosts();
export const getPost = (id: string) => PostStore.getInstance().getPost(id);
export const addPost = (post: BlogPost) => PostStore.getInstance().addPost(post);
export const updatePost = (id: string, post: Partial<BlogPost>) => PostStore.getInstance().updatePost(id, post);
export const deletePost = (id: string) => PostStore.getInstance().deletePost(id);

interface FilterOptions {
  search?: string;
  tag?: string;
  author?: string;
  page?: number;
  pageSize?: number;
}

export function filterPosts(options: FilterOptions): BlogPostsResponse {
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !options.search || 
      post.title.toLowerCase().includes(options.search.toLowerCase()) ||
      post.content.toLowerCase().includes(options.search.toLowerCase());

    const matchesTag = !options.tag || 
      post.tags.some(tag => tag.toLowerCase() === options.tag?.toLowerCase());

    const matchesAuthor = !options.author || 
      post.author.toLowerCase() === options.author.toLowerCase();

    return matchesSearch && matchesTag && matchesAuthor;
  });

  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    posts: filteredPosts.slice(start, end),
    total: filteredPosts.length,
    page,
    pageSize,
    hasMore: end < filteredPosts.length,
  };
}
