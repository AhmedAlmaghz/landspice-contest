'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavigationHeader from '@/components/NavigationHeader';
import { Building2, Globe, Mail, Phone, ArrowRight, Loader, Search, MapPin } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  logo_url: string;
  description: string;
  city: string;
  subscription_plan: string;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, currentPage]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/v1/companies?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadge = (plan: string) => {
    const planMap: Record<string, { bg: string; text: string; label: string }> = {
      premium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⭐ بريميوم' },
      standard: { bg: 'bg-blue-100', text: 'text-blue-800', label: '📊 معياري' },
      basic: { bg: 'bg-gray-100', text: 'text-gray-800', label: '📝 أساسي' },
    };
    const config = planMap[plan?.toLowerCase()] || planMap.basic;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">جميع الشركات</h1>
            <p className="text-xl text-blue-100">اكتشف الشركات الرائدة والمنظمة للمسابقات</p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن شركة..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد شركات</h3>
            <p className="text-gray-500">حاول تغيير معايير البحث</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Header with Logo */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex items-center justify-center min-h-[150px]">
                    {company.logo_url ? (
                      <div className="relative w-24 h-24">
                        <Image
                          src={company.logo_url}
                          alt={company.name}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <Building2 className="w-16 h-16 text-white opacity-50" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    {/* Name and Plan */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{company.name}</h3>
                      {getPlanBadge(company.subscription_plan)}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {company.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <a href={`mailto:${company.email}`} className="hover:text-blue-600 truncate">
                            {company.email}
                          </a>
                        </div>
                      )}
                      {company.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <a href={`tel:${company.phone}`} className="hover:text-blue-600">
                            {company.phone}
                          </a>
                        </div>
                      )}
                      {company.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 truncate"
                          >
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <Link
                      href={`/company/${company.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      عرض التفاصيل
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  السابق
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = currentPage > 3 ? currentPage - 2 + i : i + 1;
                  return page <= totalPages ? (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : null;
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">هل تريد إنشاء مسابقة؟</h2>
          <p className="text-blue-100 mb-6">انضم إلى منصتنا وأنشئ مسابقات مذهلة لجذب المشاركين</p>
          <Link
            href="/register/company"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            سجل شركتك الآن
          </Link>
        </div>
      </section>
    </div>
  );
}
