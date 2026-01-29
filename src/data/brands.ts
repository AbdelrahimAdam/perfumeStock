// src/data/brands.ts
import type { Brand } from '@/types'

export const brands: Brand[] = [
  {
    id: 'dior',
    slug: 'dior',
    name: {
      en: 'Dior',
      ar: 'ديور'
    },
    description: {
      en: 'Christian Dior revolutionized fashion in 1947 with the "New Look" and brought that same innovative spirit to fragrance. Dior perfumes are renowned for their elegance, sophistication, and timeless appeal.',
      ar: 'أحدث كريستيان ديور ثورة في عالم الأزياء في عام 1947 مع "الأناقة الجديدة" وجلب نفس الروح المبتكرة إلى عالم العطور. تشتهر عطور ديور بأناقتها وتطورها وجاذبيتها الخالدة.'
    },
    heritage: {
      en: 'Founded by Christian Dior in 1946, the House of Dior represents the pinnacle of French luxury. From the iconic "New Look" to groundbreaking fragrances like Miss Dior and Eau Sauvage, Dior has consistently defined elegance for generations.',
      ar: 'تأسست دار ديور على يد كريستيان ديور في عام 1946، وتمثل قمة الفخامة الفرنسية. من "الأناقة الجديدة" الأيقونية إلى العطور الرائدة مثل ميس ديور وإو سوفاج، حددت ديور الأناقة باستمرار لأجيال.'
    },
    logo: '/images/brands/dior.jpg',
    heroImage: '/images/products/dior/for-banner.jpg', // Your banner image
    founded: '1946',
    headquarters: 'Paris, France',
    signatureFamily: 'Fresh Aromatic',
    iconicFragrance: 'Miss Dior',
    productCount: 6
  },
  {
    id: 'chanel',
    slug: 'chanel',
    name: {
      en: 'Chanel',
      ar: 'شانيل'
    },
    description: {
      en: 'Chanel perfumes represent the essence of Parisian chic and timeless elegance. From the revolutionary Chanel No. 5 to modern classics, each fragrance tells a story of sophistication.',
      ar: 'تمثل عطور شانيل جوهر الأناقة الباريسية والفخامة الخالدة. من العطر الثوري شانيل رقم 5 إلى الكلاسيكيات الحديثة، كل عطر يحكي قصة التطور.'
    },
    heritage: {
      en: "Founded by Gabrielle 'Coco' Chanel in 1910, Chanel liberated women's fashion and fragrance. The house's iconic No. 5, created in 1921, remains the world's most famous perfume.",
      ar: "تأسست شانيل على يد جابرييل 'كوكو' شانيل في عام 1910، وأطلقت حرية أزياء وعطور النساء. لا يزال العطر الأيقوني رقم 5، الذي تم إنشاؤه في عام 1921، أشهر عطر في العالم."
    },
    logo: '/images/brands/chanel.jpg',
    heroImage: '/images/products/chanel/cocochanel.jpg',
    founded: '1910',
    headquarters: 'Paris, France',
    signatureFamily: 'Aldehydic Floral',
    iconicFragrance: 'Chanel No. 5',
    productCount: 3
  },
  {
    id: 'tom-ford',
    slug: 'tom-ford',
    name: {
      en: 'Tom Ford',
      ar: 'توم فورد'
    },
    description: {
      en: 'Tom Ford fragrances embody modern luxury with bold, sensual compositions that challenge conventions. Each scent is crafted with rare ingredients and uncompromising quality.',
      ar: 'تجسد عطور توم فورد الفخامة الحديثة بتركيبات جريئة وحسية تتحدى الأعراف. كل عطر مصنوع بمكونات نادرة وجودة لا هوادة فيها.'
    },
    heritage: {
      en: 'Launched in 2005, Tom Ford Beauty redefined luxury fragrance with provocative, gender-fluid scents. Each creation celebrates individuality and excess.',
      ar: 'أطلقت توم فورد بيوتي في عام 2005 وأعادت تعريف عطور الفخامة بعطور استفزازية وخالية من الجنس. كل إبداع يحتفل بالفردية والإفراط.'
    },
    logo: '/images/brands/tomford.png',
    heroImage: '/images/products/tom-ford/lost-cheery.jpg',
    founded: '2005',
    headquarters: 'New York, USA',
    signatureFamily: 'Oriental Woody',
    iconicFragrance: 'Black Orchid',
    productCount: 4
  },
  {
    id: 'gucci',
    slug: 'gucci',
    name: {
      en: 'Gucci',
      ar: 'غوتشي'
    },
    description: {
      en: 'Gucci fragrances capture the brand\'s bold, romantic spirit. From floral bouquets to woody compositions, each scent reflects Gucci\'s creative vision.',
      ar: 'تلتقط عطور غوتشي الروح الجريئة والرومانسية للعلامة التجارية. من الباقات الزهرية إلى التركيبات الخشبية، يعكس كل عطر الرؤية الإبداعية لغوتشي.'
    },
    heritage: {
      en: 'Founded in 1921 in Florence, Gucci represents Italian craftsmanship and luxury. The brand\'s fragrances reflect its commitment to quality and innovation.',
      ar: 'تأسست غوتشي في عام 1921 في فلورنسا، وتمثل الحرفية والفخامة الإيطالية. تعكس عطور العلامة التجارية التزامها بالجودة والابتكار.'
    },
    logo: '/images/brands/goochi.jpg',
    heroImage: '/images/products/gucci/flora.jpg',
    founded: '1921',
    headquarters: 'Florence, Italy',
    signatureFamily: 'Floral Musky',
    iconicFragrance: 'Guilty',
    productCount: 3
  },
  {
    id: 'versace',
    slug: 'versace',
    name: {
      en: 'Versace',
      ar: 'فيرساتشي'
    },
    description: {
      en: 'Versace fragrances embody Mediterranean glamour with bold, vibrant compositions. Each scent reflects the brand\'s passion for luxury and excess.',
      ar: 'تجسد عطور فيرساتشي سحر البحر الأبيض المتوسط بتركيبات جريئة ونابضة بالحياة. يعكس كل عطر شغف العلامة التجارية بالفخامة والإفراط.'
    },
    heritage: {
      en: 'Founded by Gianni Versace in 1978, the brand is synonymous with Italian luxury and bold design. Versace fragrances capture the brand\'s daring spirit.',
      ar: 'تأسست العلامة التجارية على يد جياني فيرساتشي في عام 1978، وهي مرادف للفخامة الإيطالية والتصميم الجريء. تلتقط عطور فيرساتشي الروح الجريئة للعلامة التجارية.'
    },
    logo: '/images/brands/versace.jpeg',
    heroImage: '/images/products/versace/eros.jpg',
    founded: '1978',
    headquarters: 'Milan, Italy',
    signatureFamily: 'Fresh Aquatic',
    iconicFragrance: 'Bright Crystal',
    productCount: 2
  },
  {
    id: 'yves-saint-laurent',
    slug: 'yves-saint-laurent',
    name: {
      en: 'Yves Saint Laurent',
      ar: 'ايف سان لوران'
    },
    description: {
      en: 'Yves Saint Laurent perfumes embody Parisian chic with provocative, addictive scents that challenge conventions. Each fragrance celebrates modern femininity.',
      ar: 'تجسد عطور ايف سان لوران الأناقة الباريسية بعطور مثيرة وإدمانية تتحدى الأعراف. كل عطر يحتفل بالأنوثة الحديثة.'
    },
    heritage: {
      en: 'Founded by Yves Saint Laurent in 1961, the brand revolutionized fashion with its modern, daring designs. YSL fragrances continue this legacy of innovation.',
      ar: 'تأسست العلامة التجارية على يد ايف سان لوران في عام 1961، وأحدثت ثورة في عالم الأزياء بتصميماتها الحديثة والجريئة. تواصل عطور YSL هذا الإرث من الابتكار.'
    },
    logo: '/images/brands/saintlaurent.jpg',
    heroImage: '/images/products/yves-saint-laurent/black-opioum.jpg',
    founded: '1961',
    headquarters: 'Paris, France',
    signatureFamily: 'Floral Oriental',
    iconicFragrance: 'Opium',
    productCount: 2
  }
]

// Helper functions
export const getBrandBySlug = (slug: string): Brand | undefined => {
  return brands.find(brand => brand.slug === slug)
}

export const getAllBrands = (): Brand[] => {
  return brands
}