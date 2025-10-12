import { initializeDatabase } from './database';

// Initialize database on server start
if (typeof window === 'undefined') {
  try {
    initializeDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

export {};
