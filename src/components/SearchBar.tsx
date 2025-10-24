'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Building2, Trophy, Users, Loader } from 'lucide-react';

interface SearchResult {
  id: number;
  type: 'company' | 'contest' | 'participant';
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // البحث عن البيانات
  useEffect(() => {
    const searchData = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const [companiesRes, contestsRes, participantsRes] = await Promise.all([
          fetch(`/api/v1/companies?search=${encodeURIComponent(query)}`),
          fetch(`/api/v1/contests?search=${encodeURIComponent(query)}`),
          fetch(`/api/v1/participants?search=${encodeURIComponent(query)}`),
        ]);

        const allResults: SearchResult[] = [];

        // معالجة نتائج الشركات
        if (companiesRes.ok) {
          const data = await companiesRes.json();
          const companies = Array.isArray(data) ? data : data.data || [];
          companies.slice(0, 3).forEach((company: any) => {
            allResults.push({
              id: company.id,
              type: 'company',
              title: company.name,
              subtitle: company.email,
              href: `/${company.id}`,
              icon: <Building2 className="w-4 h-4" />,
            });
          });
        }

        // معالجة نتائج المسابقات
        if (contestsRes.ok) {
          const data = await contestsRes.json();
          const contests = Array.isArray(data) ? data : data.data || [];
          contests.slice(0, 3).forEach((contest: any) => {
            allResults.push({
              id: contest.id,
              type: 'contest',
              title: contest.title,
              subtitle: contest.description?.substring(0, 50),
              href: `/contest/${contest.id}`,
              icon: <Trophy className="w-4 h-4" />,
            });
          });
        }

        // معالجة نتائج المشاركين
        if (participantsRes.ok) {
          const data = await participantsRes.json();
          const participants = Array.isArray(data) ? data : data.data || [];
          participants.slice(0, 3).forEach((participant: any) => {
            allResults.push({
              id: participant.id,
              type: 'participant',
              title: participant.name,
              subtitle: `${participant.city} - ${participant.email}`,
              href: `/participant/${participant.id}`,
              icon: <Users className="w-4 h-4" />,
            });
          });
        }

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchData, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // إغلاق البحث عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* شريط البحث */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="ابحث عن شركة أو مسابقة أو مشارك..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* نتائج البحث */}
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="ml-2 text-gray-600">جاري البحث...</span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="divide-y">
              {/* الشركات */}
              {results.filter(r => r.type === 'company').length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700">
                    🏢 الشركات
                  </div>
                  {results
                    .filter(r => r.type === 'company')
                    .map(result => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.href}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                      >
                        <div className="text-purple-600 mt-1">{result.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              )}

              {/* المسابقات */}
              {results.filter(r => r.type === 'contest').length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700">
                    🏆 المسابقات
                  </div>
                  {results
                    .filter(r => r.type === 'contest')
                    .map(result => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.href}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-blue-600 mt-1">{result.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              )}

              {/* المشاركون */}
              {results.filter(r => r.type === 'participant').length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700">
                    👥 المشاركون
                  </div>
                  {results
                    .filter(r => r.type === 'participant')
                    .map(result => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.href}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 transition-colors"
                      >
                        <div className="text-green-600 mt-1">{result.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>لم يتم العثور على نتائج لـ "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
