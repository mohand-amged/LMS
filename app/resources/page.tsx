'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Upload, File, Image as ImageIcon, Video, Music2, Archive, X, Search } from 'lucide-react';
import Link from 'next/link';
import { Resource, ResourceType, UserRole } from '../types';
import { isPrivilegedTeacher } from '../utils/permissions';

interface LocalResource extends Resource {
  fileName?: string;
}

const typeIcon = (type: ResourceType) => {
  switch (type) {
    case ResourceType.DOCUMENT:
      return <File className="h-4 w-4" />;
    case ResourceType.VIDEO:
      return <Video className="h-4 w-4" />;
    case ResourceType.AUDIO:
      return <Music2 className="h-4 w-4" />;
    case ResourceType.IMAGE:
      return <ImageIcon className="h-4 w-4" />;
    case ResourceType.ARCHIVE:
      return <Archive className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

export default function ResourcesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [filtered, setFiltered] = useState<LocalResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'ALL'>('ALL');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // Mock resources
  useEffect(() => {
    if (user) {
      const mock: LocalResource[] = [
        { id: '1', title: 'Syllabus.pdf', type: ResourceType.DOCUMENT, url: '/files/syllabus.pdf', size: 120000, mimeType: 'application/pdf', createdAt: new Date('2024-01-01'), courseId: '1', fileName: 'Syllabus.pdf' },
        { id: '2', title: 'Algebra Intro.mp4', type: ResourceType.VIDEO, url: 'https://example.com/video', size: 1200_000, mimeType: 'video/mp4', createdAt: new Date('2024-01-05'), courseId: '1', fileName: 'algebra.mp4' },
        { id: '3', title: 'Reading List.png', type: ResourceType.IMAGE, url: '/files/reading-list.png', size: 80_000, mimeType: 'image/png', createdAt: new Date('2024-01-07'), courseId: '2', fileName: 'reading-list.png' },
      ];
      setResources(mock);
    }
  }, [user]);

  // Filtering
  useEffect(() => {
    let list = resources;
    if (searchTerm) {
      list = list.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (typeFilter !== 'ALL') {
      list = list.filter(r => r.type === typeFilter);
    }
    setFiltered(list);
  }, [resources, searchTerm, typeFilter]);

  const handleChooseFiles = () => fileInputRef.current?.click();

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    // Simulate upload and store metadata locally for now
    const newItems: LocalResource[] = Array.from(files).map((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      const mime = f.type;
      let type: ResourceType = ResourceType.OTHER;
      if (mime.startsWith('image/')) type = ResourceType.IMAGE;
      else if (mime.startsWith('video/')) type = ResourceType.VIDEO;
      else if (mime.startsWith('audio/')) type = ResourceType.AUDIO;
      else if (mime === 'application/pdf' || (ext && ['pdf','doc','docx','txt','md'].includes(ext))) type = ResourceType.DOCUMENT;
      else if (ext && ['zip','rar','7z','tar','gz'].includes(ext)) type = ResourceType.ARCHIVE;

      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        title: f.name,
        type,
        url: URL.createObjectURL(f),
        size: f.size,
        mimeType: f.type,
        createdAt: new Date(),
        courseId: '1',
        fileName: f.name,
      };
    });

    setResources((prev) => [...newItems, ...prev]);
    e.target.value = '';
  };

  const handleRemove = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{loading ? 'Loading...' : 'Unauthorized'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Resources</span>
            </div>
            <div className="flex items-center space-x-2">
              {isPrivilegedTeacher(user) && (
                <>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFilesSelected} />
                  <Button onClick={handleChooseFiles}>
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search files..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as ResourceType | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Types</option>
                    <option value={ResourceType.DOCUMENT}>Document</option>
                    <option value={ResourceType.IMAGE}>Image</option>
                    <option value={ResourceType.VIDEO}>Video</option>
                    <option value={ResourceType.AUDIO}>Audio</option>
                    <option value={ResourceType.ARCHIVE}>Archive</option>
                    <option value={ResourceType.OTHER}>Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <Card key={r.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {typeIcon(r.type)}
                      <CardTitle className="text-base truncate max-w-[16rem]" title={r.title}>{r.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{(r.size || 0) > 0 ? `${Math.round((r.size||0)/1024)} KB` : '—'}</Badge>
                  </div>
                  <CardDescription className="text-xs mt-1">{r.mimeType}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Added {r.createdAt.toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Link href={r.url} target="_blank">
                        <Button size="sm" variant="outline">Open</Button>
                      </Link>
                      {isPrivilegedTeacher(user) && (
                        <Button size="sm" variant="outline" onClick={()=>handleRemove(r.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No resources found.</div>
          )}
        </div>
      </main>
    </div>
  );
}

