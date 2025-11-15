'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';

interface UploadedImage {
  id: number;
  name: string;
  originalName: string;
  data: string;
  file: File;
}

export default function ArticleCreator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    topics: '',
    meta: '',
    target: 'beginner',
    language: 'en',
    published: false,
    content: '',
  });
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [coverImage, setCoverImage] = useState<{ data: string; name: string } | null>(null);
  const [imageCounter, setImageCounter] = useState(0);
  const [activeTab, setActiveTab] = useState<'markdown' | 'rendered'>('markdown');
  const [renderedHtml, setRenderedHtml] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title });
    setSlug(generateSlug(title));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: UploadedImage = {
          id: imageCounter + 1,
          name: file.name.replace(/\s+/g, '-').toLowerCase(),
          originalName: file.name,
          data: event.target?.result as string,
          file: file,
        };
        setUploadedImages((prev) => [...prev, newImage]);
        setImageCounter((prev) => prev + 1);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Convert to WebP
      const webpData = await convertToWebP(file);
      setCoverImage({
        data: webpData,
        name: 'cover.webp',
      });
      setMessage({ type: 'success', text: 'Cover image uploaded and converted to WebP!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to convert cover image to WebP' });
    }

    e.target.value = '';
  };

  const convertToWebP = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          // Convert to WebP with quality 0.9
          const webpData = canvas.toDataURL('image/webp', 0.9);
          resolve(webpData);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: number) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const updateImageName = (id: number, newName: string) => {
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, name: newName.replace(/\s+/g, '-').toLowerCase() } : img
      )
    );
  };

  const insertImageAtCursor = (imageName: string) => {
    if (!contentRef.current) return;

    const textarea = contentRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);

    const imageMarkdown = `\n![Alt text](${imageName})\n`;
    const newContent = textBefore + imageMarkdown + textAfter;

    setFormData({ ...formData, content: newContent });

    setTimeout(() => {
      const newCursorPos = cursorPos + imageMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);

    setMessage({ type: 'success', text: `Image "${imageName}" inserted at cursor position!` });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const renderMarkdown = () => {
    let html = marked(formData.content) as string;
    
    // Replace image references with actual base64 data
    uploadedImages.forEach((img) => {
      const regex = new RegExp(`src=["']${img.name}["']`, 'g');
      html = html.replace(regex, `src="${img.data}"`);
    });

    setRenderedHtml(html);
  };

  useEffect(() => {
    if (activeTab === 'rendered') {
      renderMarkdown();
    }
  }, [activeTab, formData.content, uploadedImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare images data
      const imagesData = uploadedImages.map((img) => ({
        name: img.name,
        data: img.data,
      }));

      // Add cover image if exists
      if (coverImage) {
        imagesData.push(coverImage);
      }

      const response = await fetch('/api/articles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          slug,
          images: imagesData,
          hasCover: !!coverImage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        let successMsg = '✅ Article created successfully!';
        if (data.imagesCount > 0) {
          const coverMsg = coverImage ? ' (including cover.webp)' : '';
          successMsg += ` ${data.imagesCount} file(s) uploaded${coverMsg}.`;
        }
        successMsg += '\n\n📁 Files saved to: public/content/articles/' + slug;
        successMsg += '\n\n⚠️ Important: The article won\'t appear on the site until you run "npm run build" or restart the dev server.';
        
        setMessage({ 
          type: 'success', 
          text: successMsg
        });
        
        // Don't redirect, show success message instead
        // The article won't be visible until contentlayer rebuilds
        // setTimeout(() => {
        //   router.push(`/learn/${formData.target.toLowerCase()}/${slug}`);
        // }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create article' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while creating the article' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Create New Article</h1>
        <p className="text-gray-600 mb-6">Create beautiful articles for your website</p>

        {message.text && (
          <div
            className={`p-4 rounded-md mb-6 ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border-2 border-green-200' : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="font-semibold mb-2">{message.text}</div>
            {message.type === 'success' && slug && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => {
                    setFormData({
                      title: '',
                      author: '',
                      date: new Date().toISOString().split('T')[0],
                      topics: '',
                      meta: '',
                      target: 'beginner',
                      language: 'en',
                      published: false,
                      content: '',
                    });
                    setSlug('');
                    setUploadedImages([]);
                    setCoverImage(null);
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium"
                >
                  ✅ Create Another Article
                </button>
                <a
                  href={`/learn/${formData.target.toLowerCase()}/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium inline-block"
                >
                  🔗 Try to View Article (may need build)
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter article title"
            />
          </div>

          {/* Slug (auto-generated, editable) */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL path) *
            </label>
            <input
              type="text"
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="article-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL will be: /learn/{formData.target}/{slug}
            </p>
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Author name"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Topics */}
          <div>
            <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-2">
              Topics (comma-separated)
            </label>
            <input
              type="text"
              id="topics"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="AI, Machine Learning, Deep Learning"
            />
          </div>

          {/* Target */}
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
              Target Category *
            </label>
            <select
              id="target"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Newbie">Newbie</option>
              <option value="Midway">Midway</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="it">Italian</option>
            </select>
          </div>

          {/* Meta Description */}
          <div>
            <label htmlFor="meta" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              id="meta"
              value={formData.meta}
              onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description for SEO (max 160 characters)"
              maxLength={160}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image (WebP)
            </label>
            <div className="p-5 bg-gray-50 border-2 border-gray-200 rounded-md">
              <div className="mb-3">
                <label
                  htmlFor="coverUpload"
                  className="inline-block px-4 py-2 bg-purple-500 text-white rounded-md cursor-pointer hover:bg-purple-600 transition font-medium"
                >
                  🖼️ Upload Cover Image
                </label>
                <input
                  type="file"
                  id="coverUpload"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload any image format - will be automatically converted to WebP
                </p>
              </div>

              {coverImage ? (
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md">
                  <img
                    src={coverImage.data}
                    alt="Cover"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">cover.webp</p>
                    <p className="text-sm text-green-600">✓ Ready to upload</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No cover image uploaded</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Article Content (Markdown) *
            </label>
            <textarea
              ref={contentRef}
              id="content"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your article content in Markdown format..."
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Article Images</label>
            <div className="p-5 bg-gray-50 border-2 border-gray-200 rounded-md">
              <div className="mb-4">
                <label
                  htmlFor="imageUpload"
                  className="inline-block px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition font-medium"
                >
                  📷 Add Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload images and insert them at cursor position in the content above
                </p>
              </div>

              <div className="space-y-2">
                {uploadedImages.length === 0 ? (
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                ) : (
                  uploadedImages.map((img) => (
                    <div
                      key={img.id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md"
                    >
                      <img
                        src={img.data}
                        alt={img.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <input
                        type="text"
                        value={img.name}
                        onChange={(e) => updateImageName(img.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="image-name.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => insertImageAtCursor(img.name)}
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition font-medium"
                      >
                        Insert
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
              Publish immediately
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Article'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>

          {/* Upload info */}
          {(uploadedImages.length > 0 || coverImage) && (
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
              {coverImage && (
                <div className="mb-1">
                  <strong>�️ Cover:</strong> cover.webp
                </div>
              )}
              {uploadedImages.length > 0 && (
                <div>
                  <strong>�📷 {uploadedImages.length} article image(s)</strong> will be uploaded to the article folder
                </div>
              )}
            </div>
          )}
        </form>

        {/* Preview Section */}
        {formData.content && (
          <div className="mt-8">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-4 py-2 rounded-t-md font-medium transition ${
                  activeTab === 'markdown'
                    ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📝 Markdown
              </button>
              <button
                onClick={() => setActiveTab('rendered')}
                className={`px-4 py-2 rounded-t-md font-medium transition ${
                  activeTab === 'rendered'
                    ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                👁️ Rendered
              </button>
            </div>

            <div className="border-2 border-gray-200 rounded-md p-6 bg-gray-50">
              {activeTab === 'markdown' ? (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">📄 Markdown Preview</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                    {formData.content}
                  </pre>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">👁️ Rendered Preview</h3>
                  <div
                    className="prose prose-lg max-w-none bg-white p-6 rounded-md"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
