"use client"

import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, BookOpen, FileText, Clock, Check, X, Upload, ImageIcon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

interface Blog {
  _id: Id<"blogs">;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
  readTime?: number;
  // French fields
  title_fr?: string;
  excerpt_fr?: string;
  content_fr?: string;
  category_fr?: string;
  tags_fr?: string[];
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function BlogsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [activeLang, setActiveLang] = useState<'en' | 'fr'>('en');

  // Convex queries/mutations
  const blogs = useQuery(api.blogs.getAllBlogs) as Blog[] | undefined;
  const stats = useQuery(api.blogs.getBlogStats);
  const createBlog = useMutation(api.blogs.createBlog);
  const updateBlog = useMutation(api.blogs.updateBlog);
  const deleteBlog = useMutation(api.blogs.deleteBlog);

  // Form state
  const [formData, setFormData] = useState({
    // English
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    // French
    title_fr: '',
    excerpt_fr: '',
    content_fr: '',
    category_fr: '',
    tags_fr: '',
    // Shared
    coverImage: '',
    author: 'Nice Quad Team',
    status: 'draft' as 'draft' | 'published',
    readTime: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload image to ImageKit
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Failed to upload image');
    }

    const result = await response.json();
    return result.url;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert('File too large. Max 10MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg' as const
      };
      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);

      const imageUrl = await uploadImage(compressedFile);
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
    } catch (error: any) {
      console.error('Image upload error:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      title_fr: '',
      excerpt_fr: '',
      content_fr: '',
      category_fr: '',
      tags_fr: '',
      coverImage: '',
      author: 'Nice Quad Team',
      status: 'draft',
      readTime: 5,
    });
    setEditingBlog(null);
    setIsCreateModalOpen(false);
    setImagePreview(null);
    setActiveLang('en');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.join(', '),
      title_fr: blog.title_fr || '',
      excerpt_fr: blog.excerpt_fr || '',
      content_fr: blog.content_fr || '',
      category_fr: blog.category_fr || '',
      tags_fr: blog.tags_fr?.join(', ') || '',
      coverImage: blog.coverImage,
      author: blog.author,
      status: blog.status,
      readTime: blog.readTime || 5,
    });
    setEditingBlog(blog);
    setIsCreateModalOpen(true);
    setImagePreview(blog.coverImage);
    setActiveLang('en');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: formData.status,
        readTime: formData.readTime,
        // French fields
        title_fr: formData.title_fr || undefined,
        excerpt_fr: formData.excerpt_fr || undefined,
        content_fr: formData.content_fr || undefined,
        category_fr: formData.category_fr || undefined,
        tags_fr: formData.tags_fr ? formData.tags_fr.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      };

      if (editingBlog) {
        await updateBlog({ id: editingBlog._id, ...blogData });
      } else {
        await createBlog(blogData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"blogs">) => {
    if (confirm('Are you sure you want to delete this article?')) {
      await deleteBlog({ id });
    }
  };

  const toggleStatus = async (blog: Blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    await updateBlog({ id: blog._id, status: newStatus });
  };

  // Filter blogs
  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = searchQuery === '' ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-1">Manage blog articles</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add New Article
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              <p className="text-sm text-gray-600">Total Articles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.published || 0}</p>
              <p className="text-sm text-gray-600">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.drafts || 0}</p>
              <p className="text-sm text-gray-600">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
          className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Blog List */}
      {!blogs ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? 'No matching articles found' : 'Start by adding a new article'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 transition-colors"
            >
              <Plus size={18} />
              Add Article
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Article</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 hidden md:table-cell">Category</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 hidden md:table-cell">Languages</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 hidden sm:table-cell">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {blog.coverImage && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{blog.title}</h4>
                          <p className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-[300px]">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {blog.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">EN</span>
                        {blog.title_fr && (
                          <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">FR</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStatus(blog)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {blog.status === 'published' ? (
                          <>
                            <Eye size={14} />
                            <span className="hidden sm:inline">Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} />
                            <span className="hidden sm:inline">Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 hidden sm:table-cell">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => resetForm()}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBlog ? 'Edit Article' : 'Add New Article'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Language Tabs */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeLang === 'en'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Globe size={14} />
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang('fr')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeLang === 'fr'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Globe size={14} />
                    Français
                  </button>
                </div>

                {/* Slug (shared) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    placeholder="article-url-slug"
                    dir="ltr"
                  />
                </div>

                {/* English Content */}
                {activeLang === 'en' && (
                  <div className="space-y-5 p-4 border-2 border-blue-100 rounded-xl bg-blue-50/30">
                    <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">
                      <Globe size={14} />
                      English Content
                    </div>

                    {/* Title EN */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title (EN) *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            title: e.target.value,
                            slug: formData.slug || generateSlug(e.target.value)
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Article title in English"
                        required
                      />
                    </div>

                    {/* Excerpt EN */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Excerpt (EN) *
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                        rows={2}
                        placeholder="Short summary in English"
                        required
                      />
                    </div>

                    {/* Content EN */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Content (EN) * <span className="text-xs text-gray-400 font-normal">(supports HTML)</span>
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm bg-white"
                        rows={8}
                        placeholder="<p>Article content in English...</p>"
                        required
                        dir="ltr"
                      />
                    </div>

                    {/* Category EN */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category (EN) *
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="e.g. Adventure Guide"
                        required
                      />
                    </div>

                    {/* Tags EN */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tags (EN) <span className="text-xs text-gray-400 font-normal">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="quad, desert, adventure"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}

                {/* French Content */}
                {activeLang === 'fr' && (
                  <div className="space-y-5 p-4 border-2 border-purple-100 rounded-xl bg-purple-50/30">
                    <div className="flex items-center gap-2 text-purple-700 text-sm font-semibold">
                      <Globe size={14} />
                      Contenu Français
                    </div>

                    {/* Title FR */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Titre (FR)
                      </label>
                      <input
                        type="text"
                        value={formData.title_fr}
                        onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        placeholder="Titre de l'article en français"
                      />
                    </div>

                    {/* Excerpt FR */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Résumé (FR)
                      </label>
                      <textarea
                        value={formData.excerpt_fr}
                        onChange={(e) => setFormData({ ...formData, excerpt_fr: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                        rows={2}
                        placeholder="Court résumé en français"
                      />
                    </div>

                    {/* Content FR */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contenu (FR) <span className="text-xs text-gray-400 font-normal">(supporte HTML)</span>
                      </label>
                      <textarea
                        value={formData.content_fr}
                        onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm bg-white"
                        rows={8}
                        placeholder="<p>Contenu de l'article en français...</p>"
                        dir="ltr"
                      />
                    </div>

                    {/* Category FR */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Catégorie (FR)
                      </label>
                      <input
                        type="text"
                        value={formData.category_fr}
                        onChange={(e) => setFormData({ ...formData, category_fr: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        placeholder="ex: Guide d'aventure"
                      />
                    </div>

                    {/* Tags FR */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tags (FR) <span className="text-xs text-gray-400 font-normal">(séparés par des virgules)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.tags_fr}
                        onChange={(e) => setFormData({ ...formData, tags_fr: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        placeholder="quad, désert, aventure"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}

                {/* Cover Image Upload (shared) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Image * <span className="text-xs text-gray-400 font-normal">(shared for both languages)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-orange-500 transition-colors">
                    {(imagePreview || formData.coverImage) ? (
                      <div className="space-y-3">
                        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview || formData.coverImage}
                            alt="Cover preview"
                            fill
                            className="object-cover"
                          />
                          {isUploadingImage && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 truncate max-w-[200px]" dir="ltr">
                            {formData.coverImage ? formData.coverImage.split('/').pop() : 'Uploaded'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, coverImage: '' });
                              setImagePreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {isUploadingImage ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Upload size={16} />
                              Choose Image
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shared fields: Author, Read Time, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nice Quad Team"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Read Time (min)
                    </label>
                    <input
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingBlog ? 'Update Article' : 'Add Article'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
