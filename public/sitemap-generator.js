import { writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from './src/firebase/config.js'

// Configuration
const BASE_URL = process.env.VITE_APP_URL || 'https://luxury-perfume-store.com'
const OUTPUT_DIR = './public'
const OUTPUT_FILE = 'sitemap.xml'

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Priority mapping
const PRIORITY = {
  home: '1.0',
  category: '0.9',
  product: '0.8',
  static: '0.7'
}

// Frequency mapping
const FREQUENCY = {
  home: 'daily',
  category: 'weekly',
  product: 'monthly',
  static: 'monthly'
}

async function generateSitemap() {
  console.log('🔍 Generating sitemap...')
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`

  // Static pages
  const staticPages = [
    { loc: '/', priority: PRIORITY.home, changefreq: FREQUENCY.home },
    { loc: '/contact', priority: PRIORITY.static, changefreq: FREQUENCY.static },
    { loc: '/cart', priority: PRIORITY.static, changefreq: FREQUENCY.static }
  ]

  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  })

  try {
    // Get categories
    const categories = [
      'mens', 'womens', 'unisex', 'arabic-oud', 
      'french', 'niche', 'best-sellers', 'new-arrivals'
    ]

    categories.forEach(category => {
      xml += `
  <url>
    <loc>${BASE_URL}/category/${category}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${FREQUENCY.category}</changefreq>
    <priority>${PRIORITY.category}</priority>
  </url>`
    })

    // Get products from Firebase
    console.log('📦 Fetching products from Firestore...')
    
    const productsQuery = query(
      collection(db, 'products'),
      orderBy('updatedAt', 'desc')
    )
    
    const productsSnapshot = await getDocs(productsQuery)
    
    console.log(`✅ Found ${productsSnapshot.size} products`)
    
    productsSnapshot.forEach(doc => {
      const product = doc.data()
      const lastmod = product.updatedAt 
        ? new Date(product.updatedAt.toDate()).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      
      xml += `
  <url>
    <loc>${BASE_URL}/product/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${FREQUENCY.product}</changefreq>
    <priority>${PRIORITY.product}</priority>
  </url>`
    })

  } catch (error) {
    console.error('❌ Error fetching data:', error)
    // Continue with static pages only
  }

  xml += '\n</urlset>'

  // Write to file
  writeFileSync(`${OUTPUT_DIR}/${OUTPUT_FILE}`, xml)
  
  console.log(`✅ Sitemap generated: ${OUTPUT_DIR}/${OUTPUT_FILE}`)
  console.log(`🌐 Total URLs: ${xml.split('<url>').length - 1}`)
  
  // Generate robots.txt if not exists
  if (!existsSync(`${OUTPUT_DIR}/robots.txt`)) {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/*
Disallow: /cart

Sitemap: ${BASE_URL}/sitemap.xml

# Security
User-agent: *
Disallow: /.env
Disallow: /.git/
Disallow: /wp-admin/

# Development
User-agent: *
Disallow: /staging/
Disallow: /test/`

    writeFileSync(`${OUTPUT_DIR}/robots.txt`, robotsTxt)
    console.log('✅ robots.txt generated')
  }
}

// Run the generator
generateSitemap().catch(console.error)