import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Item } from '../models/Item';
import { logger } from '../utils/logger';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  // eslint-disable-next-line no-console
  console.error(' MONGO_URI is not set. Copy .env.example to .env and fill in your values.');
  process.exit(1);
}

const sampleItems = [
  { title: 'Introduction to TypeScript', description: 'A beginner-friendly guide to TypeScript fundamentals including types, interfaces, and generics.', category: 'programming', imageUrl: 'https://placehold.co/400x300?text=TypeScript' },
  { title: 'Node.js Best Practices', description: 'Essential patterns and practices for writing production-grade Node.js applications.', category: 'programming', imageUrl: 'https://placehold.co/400x300?text=Node.js' },
  { title: 'MongoDB Atlas Handbook', description: 'Learn how to set up, configure, and optimize MongoDB Atlas clusters for your applications.', category: 'database', imageUrl: 'https://placehold.co/400x300?text=MongoDB' },
  { title: 'REST API Design Guide', description: 'Comprehensive guide to designing clean, versioned, and developer-friendly REST APIs.', category: 'architecture', imageUrl: 'https://placehold.co/400x300?text=REST+API' },
  { title: 'Docker for Developers', description: 'Containerise your apps and services using Docker and Docker Compose – from dev to production.', category: 'devops', imageUrl: 'https://placehold.co/400x300?text=Docker' },
  { title: 'React Hooks Deep Dive', description: 'Master useState, useEffect, useCallback, useMemo, and custom hooks in modern React.', category: 'frontend', imageUrl: 'https://placehold.co/400x300?text=React' },
  { title: 'JWT Authentication Explained', description: 'Everything you need to know about JSON Web Tokens: structure, signing, verification, and security.', category: 'security', imageUrl: 'https://placehold.co/400x300?text=JWT' },
  { title: 'GraphQL vs REST', description: 'A practical comparison of REST and GraphQL APIs with real-world use cases and trade-offs.', category: 'architecture', imageUrl: 'https://placehold.co/400x300?text=GraphQL' },
  { title: 'Clean Code Principles', description: 'Robert C. Martin\'s timeless principles adapted for modern JavaScript and TypeScript developers.', category: 'programming', imageUrl: 'https://placehold.co/400x300?text=Clean+Code' },
  { title: 'CI/CD with GitHub Actions', description: 'Build, test, and deploy your apps automatically using GitHub Actions workflows.', category: 'devops', imageUrl: 'https://placehold.co/400x300?text=GitHub+Actions' },
  { title: 'PostgreSQL Indexing Strategies', description: 'Deep dive into B-tree, Hash, GIN, and GiST indexes and when to use each one.', category: 'database', imageUrl: 'https://placehold.co/400x300?text=PostgreSQL' },
  { title: 'Microservices Patterns', description: 'Design patterns for building scalable microservices: API Gateway, Saga, CQRS, and Event Sourcing.', category: 'architecture', imageUrl: 'https://placehold.co/400x300?text=Microservices' },
  { title: 'Wireless Networks 101', description: 'Understand Wi-Fi standards, frequencies, channels, and how to plan reliable wireless networks.', category: 'networking', imageUrl: 'https://placehold.co/400x300?text=Networking' },
  { title: 'Linux Command Line Mastery', description: 'Practical Linux shell skills every developer and DevOps engineer should know.', category: 'devops', imageUrl: 'https://placehold.co/400x300?text=Linux' },
  { title: 'Web Security Fundamentals', description: 'OWASP Top 10 vulnerabilities explained with mitigation strategies for web developers.', category: 'security', imageUrl: 'https://placehold.co/400x300?text=Security' },
];

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  logger.info('Connected to MongoDB');

  await Item.deleteMany({});
  logger.info('Cleared existing items');

  await Item.insertMany(sampleItems);
  logger.info(`Seeded ${sampleItems.length} items successfully`);

  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
};

seed().catch((err) => {
  logger.error('Seed failed:', err);
  process.exit(1);
});